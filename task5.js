// выполнил Вдовиченко Егор Дмитриевич
const fs = require('fs');
const fsp = require('fs').promises;
const path = require('path');
const { Transform } = require('stream');

async function createTestSource(sourceDir) {
    await fsp.rm(sourceDir, { recursive: true, force: true });
    await fsp.mkdir(sourceDir, { recursive: true });

    const subDirs = ['sub1', 'sub2', 'sub3'];
    for (const sub of subDirs) {
        await fsp.mkdir(path.join(sourceDir, sub), { recursive: true });
    }

    const filesToCreate = [
        { dir: '', name: 'app.js', ext: '.js', size: 1024, text: true },
        { dir: '', name: 'index.js', ext: '.js', size: 2048, text: true },
        { dir: '', name: 'data.json', ext: '.json', size: 4096, text: true },
        { dir: '', name: 'config.json', ext: '.json', size: 1024, text: true },
        { dir: '', name: 'readme.txt', ext: '.txt', size: 512, text: true },
        { dir: '', name: 'notes.txt', ext: '.txt', size: 1024, text: true },
        { dir: '', name: 'large.txt', ext: '.txt', size: 1100 * 1024, text: true },
        { dir: '', name: 'image1.jpg', ext: '.jpg', size: 2048, text: false },
        { dir: '', name: 'image2.png', ext: '.png', size: 4096, text: false },
        { dir: '', name: 'anim.gif', ext: '.gif', size: 1024, text: false },

        { dir: 'sub1', name: 'server.js', ext: '.js', size: 3000, text: true },
        { dir: 'sub1', name: 'users.json', ext: '.json', size: 2500, text: true },
        { dir: 'sub1', name: 'info.txt', ext: '.txt', size: 800, text: true },
        { dir: 'sub1', name: 'photo.jpg', ext: '.jpg', size: 5000, text: false },

        { dir: 'sub2', name: 'helper.js', ext: '.js', size: 1500, text: true },
        { dir: 'sub2', name: 'settings.json', ext: '.json', size: 1200, text: true },
        { dir: 'sub2', name: 'manual.txt', ext: '.txt', size: 600, text: true },

        { dir: 'sub3', name: 'test.js', ext: '.js', size: 900, text: true },
        { dir: 'sub3', name: 'logo.png', ext: '.png', size: 3500, text: false },
        { dir: 'sub3', name: 'archive.dat', ext: '.dat', size: 1200 * 1024, text: false }
    ];

    const manifest = [];
    for (const f of filesToCreate) {
        const targetFolder = path.join(sourceDir, f.dir);
        const filePath = path.join(targetFolder, f.name);

        if (f.text) {
            const line = 'Пример   текстовой   строки   с   лишними    пробелами.  \n';
            const repeats = Math.max(1, Math.floor(f.size / line.length));
            await fsp.writeFile(filePath, line.repeat(repeats), 'utf8');
        } else {
            const buf = Buffer.alloc(f.size, 0xAA);
            await fsp.writeFile(filePath, buf);
        }

        const stat = await fsp.stat(filePath);
        manifest.push({
            name: f.name,
            relPath: path.relative(sourceDir, filePath).replace(/\\/g, '/'),
            size: stat.size,
            ext: f.ext
        });
    }

    const manifestPath = path.join(sourceDir, 'manifest.json');
    await fsp.writeFile(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');
}

async function getAllFiles(dirPath) {
    const list = [];
    async function walk(curr) {
        const entries = await fsp.readdir(curr, { withFileTypes: true });
        for (const entry of entries) {
            const p = path.join(curr, entry.name);
            if (entry.isDirectory()) {
                await walk(p);
            } else {
                const stat = await fsp.stat(p);
                list.push({
                    fullPath: p,
                    relPath: path.relative(dirPath, p).replace(/\\/g, '/'),
                    name: entry.name,
                    size: stat.size,
                    ext: path.extname(entry.name).toLowerCase(),
                    mtime: stat.mtime
                });
            }
        }
    }
    await walk(dirPath);
    return list;
}

function createCompressTransform() {
    return new Transform({
        transform(chunk, encoding, callback) {
            const str = chunk.toString('utf8');
            const compressed = str.replace(/[ \t]+/g, ' ');
            callback(null, Buffer.from(compressed, 'utf8'));
        }
    });
}

async function copyFileCustom(src, dest, ext, size) {
    await fsp.mkdir(path.dirname(dest), { recursive: true });

    const streamExtensions = ['.txt', '.js', '.json'];
    const isStream = streamExtensions.includes(ext);

    if (isStream) {
        return new Promise((resolve, reject) => {
            const readStream = fs.createReadStream(src, { highWaterMark: size > 1024 * 1024 ? 512 * 1024 : 64 * 1024 });
            const writeStream = fs.createWriteStream(dest);
            const compressStream = createCompressTransform();

            readStream
                .pipe(compressStream)
                .pipe(writeStream)
                .on('finish', () => resolve('stream'))
                .on('error', reject);
        });
    } else {
        await fsp.copyFile(src, dest);
        return 'normal';
    }
}

async function runTask5() {
    const variant = 3;
    const sourceDir = path.join('.', `source_${variant}`);
    const backupDir = path.join('.', `backup_${variant}`);
    const reportPath = path.join('.', `sync_report_${variant}.txt`);

    const startTime = Date.now();

    try {
        await createTestSource(sourceDir);
        await fsp.rm(backupDir, { recursive: true, force: true });
        await fsp.mkdir(backupDir, { recursive: true });

        const sourceFiles = await getAllFiles(sourceDir);

        console.log(`📂 Исходная директория: ${sourceDir}`);
        console.log(`📂 Директория назначения: ${backupDir}`);
        console.log(`📋 Обнаружено файлов: ${sourceFiles.length}`);

        const extGroups = {};
        for (const f of sourceFiles) {
            if (!extGroups[f.ext]) extGroups[f.ext] = { count: 0, size: 0, stream: ['.txt', '.js', '.json'].includes(f.ext) };
            extGroups[f.ext].count++;
            extGroups[f.ext].size += f.size;
        }

        for (const [ext, data] of Object.entries(extGroups)) {
            const kb = (data.size / 1024).toFixed(1);
            const typeText = data.stream ? 'потоковое копирование (со сжатием)' : 'обычное копирование';
            console.log(`├── 📄 ${ext}: ${data.count} файлов (${kb} КБ) - ${typeText}`);
        }

        let copiedCount = 0;
        let streamCount = 0;
        let normalCount = 0;
        let totalCopiedBytes = 0;

        for (const f of sourceFiles) {
            const destPath = path.join(backupDir, f.relPath);
            const method = await copyFileCustom(f.fullPath, destPath, f.ext, f.size);
            if (method === 'stream') streamCount++;
            else normalCount++;
            copiedCount++;
            totalCopiedBytes += f.size;
        }

        console.log(`\n⏳ Прогресс копирования: ${copiedCount}/${sourceFiles.length} файлов`);
        console.log('✅ Копирование завершено!');

        const duration = ((Date.now() - startTime) / 1000).toFixed(2);
        const totalMb = (totalCopiedBytes / (1024 * 1024)).toFixed(2);

        console.log('\n📊 Статистика:');
        console.log(`- Скопировано файлов: ${copiedCount}`);
        console.log(`- Потоковое копирование: ${streamCount} файлов`);
        console.log(`- Обычное копирование: ${normalCount} файлов`);
        console.log(`- Общий размер: ${totalMb} МБ`);
        console.log(`- Время выполнения: ${duration} сек`);

        const backupFiles = await getAllFiles(backupDir);
        const backupMap = new Map(backupFiles.map(b => [b.relPath, b]));

        let matched = 0;
        let modified = 0;
        let added = 0;
        let deleted = 0;

        for (const sf of sourceFiles) {
            const bf = backupMap.get(sf.relPath);
            if (!bf) {
                deleted++;
            } else if (bf.size !== sf.size) {
                modified++;
            } else {
                matched++;
            }
        }

        const sourceMap = new Map(sourceFiles.map(s => [s.relPath, s]));
        for (const bf of backupFiles) {
            if (!sourceMap.has(bf.relPath)) {
                added++;
            }
        }

        console.log('\n🔄 Сравнение директорий:');
        console.log(`- Совпадают: ${matched} файлов`);
        console.log(`- Изменены (сжаты): ${modified} файла`);
        console.log(`- Добавлены: ${added} файл`);
        console.log(`- Удалены: ${deleted} файлов`);

        const reportLines = [
            `Отчет синхронизации source_${variant} и backup_${variant}:`,
            `Дата: ${new Date().toISOString()}`,
            `Всего файлов в источнике: ${sourceFiles.length}`,
            `Всего файлов в бэкапе: ${backupFiles.length}`,
            `Совпадают: ${matched}`,
            `Изменены (сжаты пробелы): ${modified}`,
            `Добавлены: ${added}`,
            `Удалены: ${deleted}`,
            `Время выполнения: ${duration} сек`
        ].join('\n') + '\n';

        await fsp.writeFile(reportPath, reportLines, 'utf8');
        console.log(`\n📄 Отчет сохранен: ${path.basename(reportPath)}`);

    } catch (err) {
        console.error('Ошибка копирования и синхронизации:', err.message);
    }
}

runTask5();
