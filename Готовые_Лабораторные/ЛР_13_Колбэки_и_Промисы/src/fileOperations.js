// выполнил Вдовиченко Егор Дмитриевич
const fs = require('fs');
const path = require('path');

const testDir = path.join(__dirname, 'test-data-cb');
if (!fs.existsSync(testDir)) fs.mkdirSync(testDir, { recursive: true });

const filePath = path.join(testDir, 'test_cb.txt');
const copyPath = path.join(testDir, 'copy_cb.txt');

console.log('=== Задание 1: Колбэки (Callback Hell) ===');
console.time('Callback Operations');

fs.writeFile(filePath, 'Данные колбэка для группы ', (err) => {
    if (err) return console.error('Ошибка записи:', err);
    console.log('[CALLBACK 1] Файл успешно записан');

    fs.readFile(filePath, 'utf-8', (err, data) => {
        if (err) return console.error('Ошибка чтения:', err);
        console.log(`[CALLBACK 2] Файл прочитан: "${data}"`);

        fs.copyFile(filePath, copyPath, (err) => {
            if (err) return console.error('Ошибка копирования:', err);
            console.log('[CALLBACK 3] Файл успешно скопирован');
            console.timeEnd('Callback Operations');
        });
    });
});
