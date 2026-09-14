const http = require('http');
const EventEmitter = require('events');

// 3.1. Создайте класс AppServer, который наследуется от EventEmitter
class AppServer extends EventEmitter {
    constructor() {
        super();
        this.server = null;
    }

    // 3.2. Метод start(port) — запускает HTTP-сервер и генерирует событие 'server:started' с портом
    start(port) {
        this.server = http.createServer((req, res) => {
            // При входящем запросе генерируйте событие 'request:received' с объектом запроса (req.url и req.method)
            this.emit('request:received', { url: req.url, method: req.method });

            // 3.4. Сервер должен отвечать на все запросы текстом: "Hello from Event-Driven Server!"
            res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
            res.end('Hello from Event-Driven Server!');
        });

        this.server.listen(port, () => {
            this.emit('server:started', port);
        });
    }

    // 3.2. Метод stop() — останавливает сервер и генерирует событие 'server:stopped'
    stop() {
        if (this.server) {
            this.server.close(() => {
                this.emit('server:stopped');
            });
        }
    }
}

// Пример запуска и регистрация обработчиков
const app = new AppServer();

// 3.3. Зарегистрируйте обработчики
app.on('server:started', (port) => {
    console.log(`🚀 Сервер запущен на порту ${port}`);
});

app.on('request:received', ({ method, url }) => {
    console.log(`📨 Получен запрос: ${method} ${url}`);
});

app.on('server:stopped', () => {
    console.log('🛑 Сервер остановлен');
});

// Запуск сервера
app.start(3000);

// Эмуляция остановки через 10 секунд
setTimeout(() => {
    app.stop();
}, 10000);
