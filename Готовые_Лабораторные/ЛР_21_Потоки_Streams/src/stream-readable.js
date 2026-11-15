// выполнил Вдовиченко Егор Дмитриевич
const { Readable } = require('stream');

class StudentInfoStream extends Readable {
    constructor(options) {
        super(options);
        this.chunks = [
            '',
            'Студент: Вдовиченко Егор Дмитриевич',
            'Лабораторная работа: №21',
            'Тема: Потоки в Node.js'
        ];
        this.index = 0;
    }

    _read(size) {
        if (this.index < this.chunks.length) {
            const chunk = this.chunks[this.index++];
            this.push(chunk);
        } else {
            this.push(null); // Конец потока
        }
    }
}

console.log('=== Демонстрация Readable-потока ===\n');

const stream = new StudentInfoStream();
let chunkCount = 0;
let totalBytes = 0;

stream.on('data', (chunk) => {
    chunkCount++;
    const str = chunk.toString();
    totalBytes += Buffer.byteLength(chunk);
    console.log(`[CHUNK ${chunkCount}] ${str}`);
});

stream.on('end', () => {
    console.log('\n[END] Поток завершён');
    console.log(`Всего получено чанков: ${chunkCount}`);
    console.log(`Общий размер данных: ${totalBytes} байт`);
});

stream.on('error', (err) => console.error('Ошибка потока:', err));
