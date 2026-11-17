// выполнил Вдовиченко Егор Дмитриевич, вариант 3
const { Writable } = require('stream');

class ConsoleSlowWritable extends Writable {
    constructor(options) {
        super({ ...options, highWaterMark: 16 });
        this.items = [];
    }

    _write(chunk, encoding, callback) {
        const text = chunk.toString();
        console.log(`[WRITE] ${text}`);
        // Имитация небольшой асинхронной задержки обработки
        setTimeout(() => {
            this.items.push(text);
            callback();
        }, 50);
    }
}

console.log('=== Демонстрация Writable-потока ===\n');

const writable = new ConsoleSlowWritable();

const messages = [
    '',
    'Студент: Вдовиченко Егор Дмитриевич',
    'Лабораторная работа: №21',
    'Тема: Потоки в Node.js'
];

let i = 0;
function writeData() {
    let ok = true;
    while (i < messages.length && ok) {
        const msg = messages[i];
        ok = writable.write(msg);
        console.log(`write() вернул: ${ok}${ok ? '' : '  ← буфер переполнен!'}`);
        i++;
    }

    if (i < messages.length) {
        writable.once('drain', () => {
            console.log('\n[DRAIN] Буфер освобождён, продолжаем запись');
            writeData();
        });
    } else {
        writable.end();
    }
}

writable.on('finish', () => {
    console.log('\n[FINISH] Все данные записаны');
    console.log(`Всего записано: ${messages.length} чанка`);
});

writeData();
