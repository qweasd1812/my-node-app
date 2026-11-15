// выполнил Вдовиченко Егор Дмитриевич
class MockMongoClient {
    constructor(uri) {
        this.uri = uri;
    }
    async connect() {
        if (this.uri.includes('invalid-host')) {
            throw new Error('MongoServerSelectionError: connect ECONNREFUSED 127.0.0.1:27018');
        }
        console.log('[HEARTBEAT] Соединение с топологией MongoDB стабильно');
        return {
            db: (name) => ({
                admin: () => ({
                    serverStatus: async () => ({ version: '7.0.4', ok: 1, connections: { current: 5 } })
                })
            }),
            close: async () => console.log('[CLIENT] Соединение с MongoDB закрыто')
        };
    }
}

async function main() {
    console.log(`=== Подключение к MongoDB (группа ${''}) ===\n`);

    const uri = 'mongodb://localhost:27017/university_db';
    console.log(`URI подключения: ${uri}`);

    const client = new MockMongoClient(uri);
    try {
        const conn = await client.connect();
        console.log('[SUCCESS] Успешное подключение к MongoDB!');
        const admin = conn.db('university_db').admin();
        const status = await admin.serverStatus();
        console.log(`Версия сервера:  ${status.version}`);
        console.log(`Активных сокетов: ${status.connections.current}`);
        await conn.close();
    } catch (err) {
        console.error('[ERROR] Ошибка подключения:', err.message);
    }
}

main();
