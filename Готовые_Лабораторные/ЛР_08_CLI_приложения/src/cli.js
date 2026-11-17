// выполнил Вдовиченко Егор Дмитриевич, вариант 3
const { Command } = require('commander');
const program = new Command();

program
    .name('lr08-cli')
    .description('Лабораторная работа 8: Разработка CLI-приложения на Node.js')
    .version('1.0.0');

program
    .command('greet')
    .description('Приветствие пользователя с выводом студенческих данных')
    .option('-n, --name <name>', 'имя пользователя', 'Вдовиченко Егор Дмитриевич')
    .action((options) => {
        console.log(`Привет, ${options.name}!`);
        console.log(`Студент: Вдовиченко Егор Дмитриевич`);
        console.log(`Вариант: 3`);
    });

program
    .command('build')
    .description('Сборка проекта с поддержкой флагов окружения')
    .option('-e, --env <environment>', 'среда исполнения (dev, prod)', 'dev')
    .option('--dry-run', 'симуляция сборки без изменения файлов')
    .action((options) => {
        console.log(`[INIT] Запуск сборки проекта...`);
        if (options.dryRun) {
            console.log('[DRY-RUN] Режим сухой проверки: файлы не затронуты.');
            return;
        }
        console.log(`[BUILD] Сборка успешно завершена для среды: ${options.env} (Вариант 3)`);
    });

program.parse(process.argv);
