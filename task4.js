// выполнил Вдовиченко Егор Дмитриевич
const fs = require('fs');
const readline = require('readline');
const path = require('path');

async function generateDataFile(filePath, variant, totalLines = 100000) {
    if (fs.existsSync(filePath)) {
        return;
    }

    const writeStream = fs.createWriteStream(filePath, { encoding: 'utf8' });

    return new Promise((resolve, reject) => {
        let i = 1;
        function write() {
            let ok = true;
            while (i <= totalLines && ok) {
                const randomNum = Math.floor(Math.random() * 1000) + 1;
                const line = `${i}, ${randomNum}, Вариант ${variant}\n`;
                if (i === totalLines) {
                    writeStream.write(line, resolve);
                } else {
                    ok = writeStream.write(line);
                }
                i++;
            }
            if (i <= totalLines) {
                writeStream.once('drain', write);
            }
        }
        writeStream.on('error', reject);
        write();
    });
}

async function processDataFile(inputPath, outputPath, variant) {
    const startTime = Date.now();
    const stats = await fs.promises.stat(inputPath);
    const sizeMb = (stats.size / (1024 * 1024)).toFixed(2);

    console.log(`📊 Обработка файла: ${path.basename(inputPath)}`);
    console.log(`Размер файла: ${sizeMb} МБ\n`);

    const readStream = fs.createReadStream(inputPath, {
        highWaterMark: 64 * 1024,
        encoding: 'utf8'
    });

    const rl = readline.createInterface({
        input: readStream,
        crlfDelay: Infinity
    });

    let totalLines = 0;
    let sum = 0;
    let min = Infinity;
    let max = -Infinity;
    let evenCount = 0;
    let oddCount = 0;

    const progressStep = 10000;

    for await (const line of rl) {
        if (!line.trim()) continue;
        totalLines++;

        const parts = line.split(',');
        if (parts.length >= 2) {
            const num = parseInt(parts[1].trim(), 10);
            if (!isNaN(num)) {
                sum += num;
                if (num < min) min = num;
                if (num > max) max = num;
                if (num % 2 === 0) evenCount++;
                else oddCount++;
            }
        }

        if (totalLines % progressStep === 0) {
            const percent = Math.min(100, Math.floor((totalLines / 100000) * 100));
            console.log(`⏳ Прогресс: ${percent}% (${totalLines.toLocaleString('ru-RU')} строк обработано)`);
        }
    }

    const average = totalLines > 0 ? (sum / totalLines).toFixed(2) : 0;
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);

    const resultText = [
        'Результаты обработки:',
        `- Всего строк: ${totalLines.toLocaleString('ru-RU')}`,
        `- Сумма чисел: ${sum.toLocaleString('ru-RU')}`,
        `- Среднее значение: ${average}`,
        `- Максимальное число: ${max}`,
        `- Минимальное число: ${min}`,
        `- Четных чисел: ${evenCount.toLocaleString('ru-RU')}`,
        `- Нечетных чисел: ${oddCount.toLocaleString('ru-RU')}`,
        `- Время выполнения: ${duration} сек`
    ].join('\n') + '\n';

    await fs.promises.writeFile(outputPath, resultText, 'utf8');

    console.log('\n✅ Обработка завершена!');
    console.log('📊 Результаты:');
    console.log(`- Всего строк: ${totalLines.toLocaleString('ru-RU')}`);
    console.log(`- Сумма чисел: ${sum.toLocaleString('ru-RU')}`);
    console.log(`- Среднее значение: ${average}`);
    console.log(`- Максимальное число: ${max}`);
    console.log(`- Минимальное число: ${min}`);
    console.log(`- Четных чисел: ${evenCount.toLocaleString('ru-RU')}`);
    console.log(`- Нечетных чисел: ${oddCount.toLocaleString('ru-RU')}`);
    console.log(`\n📄 Результаты сохранены в: ${path.basename(outputPath)}`);
    console.log(`⏱ Время выполнения: ${duration} сек`);
}

async function runTask4() {
    const variant = 3;
    const dataFileName = `data_${variant}.txt`;
    const processedFileName = `processed_${variant}.txt`;

    try {
        await generateDataFile(dataFileName, variant, 100000);
        await processDataFile(dataFileName, processedFileName, variant);
    } catch (err) {
        console.error('Ошибка обработки данных:', err.message);
    }
}

runTask4();
