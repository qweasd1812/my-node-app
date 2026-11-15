// выполнил Вдовиченко Егор Дмитриевич, вариант 3
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const dataFile = path.join(__dirname, 'data_3.txt');
const writeStream = fs.createWriteStream(dataFile, 'utf-8');

for (let i = 1; i <= 20; i++) {
    const rand = Math.floor(Math.random() * 1000) + 1;
    writeStream.write(`${i}, ${rand}, Вариант 3\n`);
}
writeStream.end();

writeStream.on('finish', () => {
    console.log(`[TASK 4] data_3.txt сгенерирован.`);

    let even = 0;
    let odd = 0;
    const rl = readline.createInterface({ input: fs.createReadStream(dataFile) });
    rl.on('line', (line) => {
        const parts = line.split(',');
        if (parts.length >= 2) {
            const num = parseInt(parts[1].trim(), 10);
            if (num % 2 === 0) even++; else odd++;
        }
    });
    rl.on('close', () => {
        console.log(`[TASK 4] Подсчет четных/нечетных: Четных = ${even}, Нечетных = ${odd}`);
    });
});
