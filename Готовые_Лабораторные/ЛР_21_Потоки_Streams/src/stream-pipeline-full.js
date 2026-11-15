// выполнил Вдовиченко Егор Дмитриевич, вариант 3
const fs = require('fs');
const path = require('path');
const { Readable, Transform, pipeline } = require('stream');
const util = require('util');
const pipelineAsync = util.promisify(pipeline);

const outputFile = path.join(__dirname, 'students.csv');
const logFile = path.join(__dirname, 'errors.log');

async function processData() {
    console.log(`=== Конвейер обработки данных (группа ${''}) ===\n`);

    const rawRecords = [
        { id: 1, name: 'Иванов Иван', variant: 1, score: 4.2 },
        { id: 2, name: 'Вдовиченко Егор Дмитриевич', variant: 3, score: 5.0 },
        { id: 3, name: 'Петров Петр', variant: 2, score: 3.9 },
        { id: 4, name: 'Смирнов Алексей', variant: 3, score: 4.8 }
    ];

    let processed = 0;
    const total = rawRecords.length;

    const source = Readable.from(rawRecords);

    const progressStream = new Transform({
        objectMode: true,
        transform(record, encoding, cb) {
            processed++;
            const pct = Math.round((processed / total) * 100);
            process.stderr.write(`\r[PROGRESS] Обработка записей: ${pct}% (${processed}/${total})`);
            this.push(`${record.id},${record.name},${record.variant},${record.score}\n`);
            cb();
        }
    });

    const header = 'id,name,variant,score\n';
    fs.writeFileSync(outputFile, header, 'utf-8');
    const destination = fs.createWriteStream(outputFile, { flags: 'a' });

    await pipelineAsync(source, progressStream, destination);

    console.log('\n\n[SUCCESS] Конвейер успешно завершен!');
    console.log(`Результаты сохранены в: ${outputFile}`);
    console.log('\nСодержимое students.csv:');
    console.log(fs.readFileSync(outputFile, 'utf-8'));
}

processData().catch(err => {
    fs.appendFileSync(logFile, `[${new Date().toISOString()}] ${err.message}\n`);
});
