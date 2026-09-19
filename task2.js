// выполнил Вдовиченко Егор Дмитриевич
const fs = require('fs').promises;
const path = require('path');

async function buildTree(dirPath, prefix = '') {
    const entries = await fs.readdir(dirPath, { withFileTypes: true });
    entries.sort((a, b) => {
        if (a.isDirectory() === b.isDirectory()) return a.name.localeCompare(b.name);
        return a.isDirectory() ? -1 : 1;
    });

    let treeStr = '';
    for (let i = 0; i < entries.length; i++) {
        const entry = entries[i];
        const isLast = i === entries.length - 1;
        const pointer = isLast ? '└── ' : '├── ';
        treeStr += `${prefix}${pointer}${entry.name}${entry.isDirectory() ? '/' : ''}\n`;

        if (entry.isDirectory()) {
            const nextPrefix = prefix + (isLast ? '    ' : '│   ');
            treeStr += await buildTree(path.join(dirPath, entry.name), nextPrefix);
        }
    }
    return treeStr;
}

async function runTask2() {
    const variant = 3;
    const baseDir = path.join('.', `project_${variant}`);

    try {
        await fs.rm(baseDir, { recursive: true, force: true });

        const folders = [
            baseDir,
            path.join(baseDir, 'src'),
            path.join(baseDir, 'src', 'modules'),
            path.join(baseDir, 'src', 'components'),
            path.join(baseDir, 'src', 'components', '1'),
            path.join(baseDir, 'src', 'components', '2'),
            path.join(baseDir, 'src', 'components', '3'),
            path.join(baseDir, 'src', 'utils'),
            path.join(baseDir, 'data'),
            path.join(baseDir, 'data', 'input'),
            path.join(baseDir, 'data', 'output'),
            path.join(baseDir, 'temp')
        ];

        for (const folder of folders) {
            await fs.mkdir(folder, { recursive: true });
            const infoPath = path.join(folder, 'info.txt');
            const relPath = path.relative(baseDir, folder) || 'root';
            await fs.writeFile(infoPath, `Назначение папки: ${relPath}\n`, 'utf8');
        }

        console.log(`=== Созданная структура (${baseDir}/) ===`);
        console.log(`${path.basename(baseDir)}/`);
        const treeInitial = await buildTree(baseDir);
        process.stdout.write(treeInitial);

        const tempSrc = path.join(baseDir, 'temp');
        const tempDest = path.join(baseDir, 'data', 'temp');
        await fs.rename(tempSrc, tempDest);
        console.log('\nПапка temp перемещена в data/temp');

        const outputSrc = path.join(baseDir, 'data', 'output');
        const resultsDest = path.join(baseDir, 'data', 'results');
        await fs.rename(outputSrc, resultsDest);
        console.log('Папка data/output переименована в data/results');

        await fs.rm(tempDest, { recursive: true, force: true });
        console.log('Папка temp удалена со всем содержимым');

        console.log(`\n=== Обновленная структура (${baseDir}/) ===`);
        console.log(`${path.basename(baseDir)}/`);
        const treeUpdated = await buildTree(baseDir);
        process.stdout.write(treeUpdated);

    } catch (err) {
        console.error('Ошибка при работе с каталогами:', err.message);
    }
}

runTask2();
