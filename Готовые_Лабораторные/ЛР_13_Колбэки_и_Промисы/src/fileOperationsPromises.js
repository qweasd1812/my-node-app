// выполнил Вдовиченко Егор Дмитриевич
const fs = require('fs').promises;
const path = require('path');

const testDir = path.join(__dirname, 'test-data-prom');

async function main() {
    console.log('=== Задание 2: Промисы и async/await ===');
    console.time('Promise Operations');

    if (!fs.existsSync) await fs.mkdir(testDir, { recursive: true });
    const filePath = path.join(testDir, 'test_prom.txt');
    const copyPath = path.join(testDir, 'copy_prom.txt');

    await fs.writeFile(filePath, 'Данные промисов для группы ', 'utf-8');
    console.log('[PROMISE 1] Файл записан через async/await');

    const content = await fs.readFile(filePath, 'utf-8');
    console.log(`[PROMISE 2] Файл прочитан: "${content}"`);

    await fs.copyFile(filePath, copyPath);
    console.log('[PROMISE 3] Файл скопирован через fs.promises.copyFile');

    console.timeEnd('Promise Operations');
}

main().catch(console.error);
