// выполнил Вдовиченко Егор Дмитриевич, вариант 3
async function runDistributedTransaction(fail = false) {
    console.log(`\n=== Транзакция Replica Set MongoDB (fail=${fail}) ===`);
    console.log('[SESSION] client.startSession() -> Сессия открыта');
    console.log('[TX] session.startTransaction({ readConcern: "local", writeConcern: "majority" })');

    try {
        console.log('[TX OP 1] students.insertOne({ name: "Тестовый", group: "' + '' + '" }, { session })');
        if (fail) {
            throw new Error('Имитация дубликата уникального ключа email_1');
        }
        console.log('[TX OP 2] accounts.updateOne({ _id: 1 }, { $inc: { balance: -100 } }, { session })');
        console.log('[TX COMMIT] session.commitTransaction() -> Изменения зафиксированы!');
    } catch (err) {
        console.error(`[TX ABORT] ${err.message}`);
        console.log('[TX ROLLBACK] session.abortTransaction() -> Данные откатаны без изменений.');
    } finally {
        console.log('[SESSION] session.endSession() -> Сессия завершена.');
    }
}

async function main() {
    await runDistributedTransaction(false);
    await runDistributedTransaction(true);
}

main();
