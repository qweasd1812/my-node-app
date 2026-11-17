// выполнил Вдовиченко Егор Дмитриевич, вариант 3
const { Readable, Transform, Writable, pipeline } = require('stream');
const util = require('util');
const pipelineAsync = util.promisify(pipeline);

console.log('=== Лабораторная работа 10: Работа с потоками в Node.js ===');
console.log(`Студент: Вдовиченко Егор Дмитриевич, Вариант: 3`);

const sourceData = [
    'Лабораторная работа 10: Потоки данных (Streams)\n',
    'Студент: Вдовиченко Егор Дмитриевич\n',
    'Вариант: 3\n',
    'Демонстрация потокового конвейера Readable -> Transform -> Writable\n'
];

let byteCount = 0;
let chunkCount = 0;

// Transform поток: подсчет байт и перевод в верхний регистр
const uppercaseTransform = new Transform({
    transform(chunk, encoding, callback) {
        chunkCount++;
        byteCount += chunk.length;
        this.push(chunk.toString().toUpperCase());
        callback();
    }
});

async function run() {
    console.log('\n[PIPELINE] Запуск потокового конвейера...\n');
    await pipelineAsync(
        Readable.from(sourceData),
        uppercaseTransform,
        process.stdout
    );
    console.log('\n------------------------------------------------');
    console.log(`[METRICS] Чанков обработано: ${chunkCount}`);
    console.log(`[METRICS] Всего обработано байт: ${byteCount}`);
    console.log('[SUCCESS] Потоковый конвейер завершил работу без ошибок!');
}

run().catch(console.error);
