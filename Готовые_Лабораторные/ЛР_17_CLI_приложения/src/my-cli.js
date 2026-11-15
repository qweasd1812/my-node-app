// выполнил Вдовиченко Егор Дмитриевич, вариант 3
const args = process.argv.slice(2);

function showHelp() {
    console.log("Использование: my-cli <команда> [аргументы]");
    console.log("Доступные команды:");
    console.log("  greet <имя>    - поприветствовать пользователя");
    console.log("  info           - вывести информацию о группе");
}

if (args.length === 0 || args[0] === '--help' || args[0] === '-h') {
    showHelp();
    process.exit(0);
}

const command = args[0];

switch (command) {
    case 'greet':
        const name = args[1] || 'Гость';
        console.log(`Привет, ${name}! Добро пожаловать в CLI-приложение группы .`);
        process.exit(0);
        break;
    case 'info':
        console.log("Студент: Вдовиченко Егор Дмитриевич");
        console.log("Лабораторная работа: №17 (Вариант 3)");
        console.log("Дата: " + new Date().toISOString().split('T')[0]);
        process.exit(0);
        break;
    default:
        console.error(`Ошибка: неизвестная команда "${command}"`);
        console.error("Для справки используйте: my-cli --help");
        process.exit(1);
}
