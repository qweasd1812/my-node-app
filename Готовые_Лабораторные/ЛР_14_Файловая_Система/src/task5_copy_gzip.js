// выполнил Вдовиченко Егор Дмитриевич, вариант 3
const fs = require('fs');
const zlib = require('zlib');
const path = require('path');

const sourceDir = path.join(__dirname, 'source_3');
const backupDir = path.join(__dirname, 'backup_3');

if (!fs.existsSync(sourceDir)) fs.mkdirSync(sourceDir, { recursive: true });
if (!fs.existsSync(backupDir)) fs.mkdirSync(backupDir, { recursive: true });

const srcFile = path.join(sourceDir, 'sample.txt');
fs.writeFileSync(srcFile, 'Исходные данные для копирования и сжатия (Вариант 3)\n');

// Копирование со сжатием Gzip
const destGz = path.join(backupDir, 'sample.txt.gz');
fs.createReadStream(srcFile)
    .pipe(zlib.createGzip())
    .pipe(fs.createWriteStream(destGz))
    .on('finish', () => {
        console.log(`[TASK 5] Файл успешно скопирован и сжат gzip в: ${destGz}`);
    });
