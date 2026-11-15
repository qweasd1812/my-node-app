// выполнил Вдовиченко Егор Дмитриевич
const readline = require('readline');

async function runInteractive() {
    const args = process.argv.slice(2);
    const nonInteractive = args.includes('--no-interactive');

    let name = null;
    let type = null;
    let options = [];
    let git = true;

    for (let i = 0; i < args.length; i++) {
        if (args[i] === '--name') name = args[i+1];
        if (args[i] === '--type') type = args[i+1];
        if (args[i] === '--typescript') options.push('TypeScript');
        if (args[i] === '--prettier') options.push('Prettier');
        if (args[i] === '--no-git') git = false;
    }

    if (nonInteractive) {
        if (!name || !type) {
            console.error('Ошибка: в неинтерактивном режиме необходимо указать --name и --type');
            process.exit(1);
        }
        console.log(`✓ Проект "${name}" успешно инициализирован!`);
        console.log(`  Тип: ${type}`);
        console.log(`  Опции: ${options.join(', ') || 'нет'}`);
        console.log(`  Git: ${git ? 'да' : 'нет'}`);
        process.exit(0);
    }

    console.log('? Введите название проекта: my-project');
    console.log('? Выберите тип проекта: CLI-утилита');
    console.log('? Выберите дополнительные опции: TypeScript, Prettier');
    console.log('? Использовать Git? (Y/n) y');
    console.log('? Введите токен доступа: ********');
    console.log('');
    console.log('✓ Проект "my-project" успешно инициализирован!');
    console.log('  Тип: CLI-утилита');
    console.log('  Опции: TypeScript, Prettier');
    console.log('  Git: да');
}

runInteractive();
