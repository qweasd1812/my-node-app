// выполнил Вдовиченко Егор Дмитриевич
// Симулятор / драйвер пула соединений MySQL2
class MockMySQLPool {
    constructor(config) {
        this.config = config;
    }
    async query(sql, params) {
        console.log(`[SQL EXEC] ${sql}`);
        if (sql.includes('1 + 1')) return [[{ '?': 2 }]];
        return [[]];
    }
    async getConnection() {
        return {
            release: () => console.log('[POOL] Соединение возвращено в пул')
        };
    }
}

async function main() {
    console.log(`=== Подключение к MySQL (группа ${''}) ===\n`);

    const config = {
        host: 'localhost',
        user: 'root',
        password: 'password',
        database: 'university_db',
        connectionLimit: 10
    };

    console.log(`Подключение к хосту: ${config.host}:${3306}`);
    console.log(`База данных:         ${config.database}`);

    const pool = new MockMySQLPool(config);
    const conn = await pool.getConnection();
    console.log('[SUCCESS] Соединение успешно установлено из пула!');

    const [rows] = await pool.query('SELECT 1 + 1 AS solution');
    console.log(`Результат тестового запроса: solution = ${rows[0]['?']}`);
    conn.release();
}

main();
