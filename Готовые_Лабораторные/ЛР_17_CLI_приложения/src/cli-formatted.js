// выполнил Вдовиченко Егор Дмитриевич, вариант 3
function colorText(color, text) {
    const colors = {
        green: '\x1b[32m',
        yellow: '\x1b[33m',
        red: '\x1b[31m',
        cyan: '\x1b[36m',
        reset: '\x1b[0m'
    };
    if (!process.stdout.isTTY) return text;
    return `${colors[color] || ''}${text}${colors.reset}`;
}

async function main() {
    const isQuiet = process.argv.includes('-q') || process.argv.includes('--quiet');
    
    // Separation of streams
    process.stderr.write(colorText('cyan', '[INFO] Запуск сборки проекта (группа ' + '' + ')...\n'));

    // Spinner simulation
    const spinnerFrames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
    for (let i = 0; i < 5; i++) {
        process.stderr.write(`\r${colorText('cyan', spinnerFrames[i % spinnerFrames.length])} Обработка компонентов...`);
        await new Promise(r => setTimeout(r, 60));
    }
    process.stderr.write(`\r${colorText('green', '✔')} Сборка завершена успешно!          \n`);

    // Progress bar simulation
    const total = 5;
    for (let i = 1; i <= total; i++) {
        const percent = Math.round((i / total) * 100);
        const bar = '='.repeat(i * 4) + ' '.repeat((total - i) * 4);
        process.stderr.write(`\r[${bar}] ${percent}% | Файл ${i}/${total}`);
        await new Promise(r => setTimeout(r, 60));
    }
    process.stderr.write('\n');

    // Silence is Golden principle: stdout receives only pure results
    if (!isQuiet) {
        process.stdout.write(JSON.stringify({ status: 'success',  filesCompiled: total }, null, 2) + '\n');
    }
}

main();
