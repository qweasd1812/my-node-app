// выполнил Вдовиченко Егор Дмитриевич
const fs = require('fs');
const util = require('util');
const path = require('path');

const writeFileAsync = util.promisify(fs.writeFile);
const readFileAsync = util.promisify(fs.readFile);

async function runHybrid() {
    console.log('=== Задание 3 & 4: Смешанный подход и Benchmark ===');
    const p = path.join(__dirname, 'hybrid_test.txt');

    console.time('util.promisify');
    await writeFileAsync(p, 'Гибридный подход promisify ()', 'utf-8');
    const res = await readFileAsync(p, 'utf-8');
    console.log(`[HYBRID] Прочитано: "${res}"`);
    console.timeEnd('util.promisify');

    console.log('\n[BENCHMARK] Сравнение: Async/Await чище и безопаснее цепочек колбэков');
}

runHybrid().catch(console.error);
