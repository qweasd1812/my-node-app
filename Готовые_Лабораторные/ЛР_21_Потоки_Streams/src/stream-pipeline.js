// выполнил Вдовиченко Егор Дмитриевич
const { Readable, Transform, Writable, pipeline } = require('stream');
const util = require('util');
const pipelinePromise = util.promisify(pipeline);

async function runPipeline() {
    console.log('=== Демонстрация pipeline() ===\n');

    const source = Readable.from([
        'студент: Вдовиченко Егор Дмитриевич\n',
        'группа: \n',
        'вариант: 3\n'
    ]);

    const upperTransform = new Transform({
        transform(chunk, encoding, callback) {
            this.push(chunk.toString().toUpperCase());
            callback();
        }
    });

    const destination = new Writable({
        write(chunk, encoding, callback) {
            process.stdout.write('[PIPELINE RESULT] ' + chunk.toString());
            callback();
        }
    });

    try {
        await pipelinePromise(source, upperTransform, destination);
        console.log('\n[SUCCESS] Конвейер успешно завершил обработку всех данных!');
    } catch (err) {
        console.error('[ERROR] Сбой в конвейере:', err);
    }
}

runPipeline();
