// выполнил Вдовиченко Егор Дмитриевич
const { Command } = require('commander');
const program = new Command();

program
    .name('my-cli')
    .description('CLI-приложение для лабораторной работы №17')
    .version('1.0.0', '-V, --version', 'вывести номер версии')
    .option('-v, --verbose', 'подробный вывод');

program
    .command('generate')
    .description('сгенерировать отчёт')
    .option('-t, --type <type>', 'тип отчёта (html, pdf, json, csv)', 'html')
    .option('-o, --output <path>', 'путь для сохранения', './output.html')
    .option('-f, --force', 'перезаписать существующий файл')
    .option('--dry-run', 'показать что будет сделано без выполнения')
    .action((options) => {
        const allowedTypes = ['html', 'pdf', 'json', 'csv'];
        if (!allowedTypes.includes(options.type)) {
            console.error(`Ошибка: недопустимый тип отчёта "${options.type}".`);
            console.error(`Допустимые значения: ${allowedTypes.join(', ')}`);
            process.exit(1);
        }

        if (options.dryRun) {
            console.log(`[DRY-RUN] Будет сгенерирован отчёт типа: ${options.type}`);
            console.log(`[DRY-RUN] Файл будет сохранён в: ${options.output}`);
            console.log('[DRY-RUN] Действия не выполнены (режим проверки)');
            return;
        }

        if (program.opts().verbose) {
            console.log('[VERBOSE] Запуск генерации отчёта...');
            console.log(`[VERBOSE] Тип отчёта: ${options.type}`);
            console.log(`[VERBOSE] Путь сохранения: ${options.output}`);
        }

        console.log(`Отчёт успешно сгенерирован: ${options.output}`);
    });

program
    .command('convert')
    .description('конвертировать файл')
    .option('-s, --source <path>', 'исходный файл')
    .action((options) => {
        console.log('Конвертация выполнена');
    });

program.parse(process.argv);
