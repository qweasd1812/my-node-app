// выполнил Вдовиченко Егор Дмитриевич
const fs = require('fs').promises;
const path = require('path');

function formatBytes(bytes) {
    if (bytes < 1024) return `${bytes} байт`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} КБ`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} МБ`;
}

async function scanDirectory(dirPath, maxFileSizeBytes = 10 * 1024 * 1024) {
    let totalFolders = 0;
    let filesList = [];

    async function walk(currentPath) {
        let entries = [];
        try {
            entries = await fs.readdir(currentPath, { withFileTypes: true });
        } catch (err) {
            return;
        }

        for (const entry of entries) {
            const fullPath = path.join(currentPath, entry.name);
            if (entry.isDirectory()) {
                totalFolders++;
                await walk(fullPath);
            } else if (entry.isFile()) {
                try {
                    const stats = await fs.stat(fullPath);
                    if (stats.size <= maxFileSizeBytes) {
                        filesList.push({
                            path: fullPath.replace(/\\/g, '/'),
                            name: entry.name,
                            size: stats.size,
                            ext: path.extname(entry.name) || '[no extension]'
                        });
                    }
                } catch (err) {
                }
            }
        }
    }

    await walk(dirPath);
    return { totalFolders, filesList };
}

async function runTask3() {
    const variant = 3;
    const targetDir = process.argv[2] || '.';

    try {
        const { totalFolders, filesList } = await scanDirectory(targetDir, 10 * 1024 * 1024);

        const totalFiles = filesList.length;
        const totalSize = filesList.reduce((acc, f) => acc + f.size, 0);

        const groupedByExt = {};
        for (const f of filesList) {
            if (!groupedByExt[f.ext]) {
                groupedByExt[f.ext] = { count: 0, size: 0 };
            }
            groupedByExt[f.ext].count++;
            groupedByExt[f.ext].size += f.size;
        }

        const sortedBySizeDesc = [...filesList].sort((a, b) => b.size - a.size);
        const top5Largest = sortedBySizeDesc.slice(0, 5);

        const sortedBySizeAsc = [...filesList].sort((a, b) => a.size - b.size);
        const top5Smallest = sortedBySizeAsc.slice(0, 5);

        const reportData = {
            targetDirectory: targetDir,
            totalFolders,
            totalFiles,
            totalSizeBytes: totalSize,
            totalSizeFormatted: formatBytes(totalSize),
            extensions: groupedByExt,
            top5Largest,
            top5Smallest
        };

        const reportFileName = `report_${variant}.json`;
        await fs.writeFile(reportFileName, JSON.stringify(reportData, null, 2), 'utf8');

        console.log(`📊 Анализ директории: ${targetDir}`);
        console.log(`📁 Общее количество папок: ${totalFolders}`);
        console.log(`📄 Общее количество файлов: ${totalFiles}`);
        console.log(`💾 Общий размер: ${formatBytes(totalSize)} (${totalSize.toLocaleString('ru-RU')} байт)`);
        console.log('\n📂 Расширения файлов:');
        for (const [ext, data] of Object.entries(groupedByExt)) {
            console.log(`   ${ext}: ${data.count} файлов (${formatBytes(data.size)})`);
        }

        console.log('\n🏆 Топ-5 самых больших файлов:');
        top5Largest.forEach((f, idx) => {
            console.log(`   ${idx + 1}. ${f.name} (${formatBytes(f.size)}) - ${f.path}`);
        });

        console.log('\n🔍 Топ-5 самых маленьких файлов:');
        top5Smallest.forEach((f, idx) => {
            console.log(`   ${idx + 1}. ${f.name} (${formatBytes(f.size)}) - ${f.path}`);
        });

        console.log(`\n📄 Отчет сохранен: ${reportFileName}`);

    } catch (err) {
        console.error('Ошибка анализа директории:', err.message);
    }
}

runTask3();
