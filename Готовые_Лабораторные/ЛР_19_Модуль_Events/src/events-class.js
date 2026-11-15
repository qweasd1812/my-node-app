// выполнил Вдовиченко Егор Дмитриевич
const EventEmitter = require('events');

class DatabaseConnection extends EventEmitter {
    constructor(dbName) {
        super();
        this.dbName = dbName;
        this.connected = false;
    }

    connect() {
        this.emit('connecting', `Подключение к БД ${this.dbName}...`);
        this.connected = true;
        this.emit('connect', 'Соединение установлено');
    }

    query(sql) {
        if (!this.connected) {
            return this.emit('error', new Error('Нет активного подключения к БД'));
        }
        this.emit('query', sql, { rows: 50, status: 'OK' });
    }

    close() {
        this.connected = false;
        this.emit('close', 'Соединение закрыто');
    }
}

console.log(`=== DatabaseConnection (группа ${''}) ===`);
const db = new DatabaseConnection('university_db');

db.on('connecting', (msg) => console.log(`[EVENT] ${msg}`));
db.on('connect', (msg) => console.log(`[EVENT] ${msg}`));
db.on('query', (sql, res) => {
    console.log(`[EVENT] Выполнение запроса: ${sql}`);
    console.log(`[EVENT] Результат: ${res.rows} записей`);
});
db.on('close', (msg) => console.log(`[EVENT] ${msg}`));
db.on('error', (err) => console.log(`[EVENT] Ошибка: ${err.message}`));

db.connect();
db.query('SELECT * FROM students WHERE variant = 3');
db.close();

console.log('\n=== Демонстрация ошибки ===');
db.query('SELECT * FROM audit_log');
