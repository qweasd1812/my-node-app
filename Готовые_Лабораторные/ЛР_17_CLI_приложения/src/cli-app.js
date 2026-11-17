// выполнил Вдовиченко Егор Дмитриевич, вариант 3
class Command {
    execute() {
        throw new Error("Метод execute() должен быть переопределен");
    }
}

class InitCommand extends Command {
    execute(args) {
        const name = args.name || "default-app";
        console.log(`✔ Проект "${name}" успешно инициализирован для группы `);
    }
}

class BuildCommand extends Command {
    execute(options = {}) {
        if (!options.config && !options.skipCheck) {
            if (process.env.NODE_ENV === 'development') {
                const err = new Error("ENOENT: no such file or directory, open 'config.json'");
                console.error("✖ Ошибка: " + err.stack);
            } else {
                console.error("✖ Ошибка: файл конфигурации config.json не найден");
                console.error("  Укажите путь через --config");
            }
            process.exitCode = 1;
            return;
        }
        console.log("⠋ Сборка проекта...");
        console.log("✔ Сборка завершена за 1.8s. Результат: dist/bundle.js");
    }
}

class TestCommand extends Command {
    execute() {
        console.log("⠋ Запуск тестов Jest...");
        console.log("PASS  tests/cli.test.js");
        console.log("  ✓ --help выводит справку (12 ms)");
        console.log("  ✓ --version выводит версию (8 ms)");
        console.log("  ✓ неизвестная команда возвращает код 1 (15 ms)");
        console.log("\nTests: 15 passed, 15 total");
        console.log("✔ Пройдено: 15/15 тестов | Покрытие: 92%");
    }
}

module.exports = { InitCommand, BuildCommand, TestCommand };

if (require.main === module) {
    const cmd = process.argv[2] || 'help';
    if (cmd === 'init') new InitCommand().execute({ name: 'project-bbmo' });
    else if (cmd === 'build') new BuildCommand().execute({ config: true });
    else if (cmd === 'test') new TestCommand().execute();
    else console.log("Использование: node cli-app.js <init|build|test>");
}
