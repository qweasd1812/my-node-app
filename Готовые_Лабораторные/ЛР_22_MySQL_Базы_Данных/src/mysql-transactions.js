// выполнил Вдовиченко Егор Дмитриевич
async function demonstrateTransaction(shouldFail = false) {
    console.log(`\n=== Транзакция MySQL (shouldFail=${shouldFail}) ===`);
    console.log('[TX BEGIN] START TRANSACTION;');
    try {
        console.log('[TX STEP 1] INSERT INTO students (name, score) VALUES ('Тест 1', 4.5);');
        if (shouldFail) {
            throw new Error('Имитация ошибки валидации данных или сбоя внешнего ключа');
        }
        console.log('[TX STEP 2] INSERT INTO student_logs (action) VALUES ('Добавление студента');');
        console.log('[TX COMMIT] COMMIT; Транзакция успешно зафиксирована.');
    } catch (err) {
        console.error(`[TX ERROR] ${err.message}`);
        console.log('[TX ROLLBACK] ROLLBACK; Все изменения успешно откатаны.');
    }
}

async function main() {
    await demonstrateTransaction(false);
    await demonstrateTransaction(true);
}

main();
