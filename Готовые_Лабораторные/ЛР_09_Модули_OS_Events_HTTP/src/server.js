// выполнил Вдовиченко Егор Дмитриевич, вариант 3
const os = require('os');
const EventEmitter = require('events');
const http = require('http');

console.log('=== Лабораторная работа 9: Модули OS, Events, HTTP ===');
console.log(`Студент: Вдовиченко Егор Дмитриевич, Вариант: 3`);

// 1. Модуль OS
console.log(`[OS] Платформа: ${os.platform()} (${os.arch()})`);
console.log(`[OS] Процессор: ${os.cpus()[0].model} (ядер: ${os.cpus().length})`);
console.log(`[OS] Свободная память: ${Math.round(os.freemem() / 1024 / 1024)} МБ из ${Math.round(os.totalmem() / 1024 / 1024)} МБ`);

// 2. Модуль Events (Шина событий)
const bus = new EventEmitter();
bus.on('request:received', (data) => {
    console.log(`[EVENT] Входящий запрос: ${data.method} ${data.url} в ${data.time}`);
});

// 3. Модуль HTTP
const server = http.createServer((req, res) => {
    bus.emit('request:received', {
        method: req.method,
        url: req.url,
        time: new Date().toISOString()
    });

    res.writeHead(200, {
        'Content-Type': 'application/json; charset=utf-8',
        'X-Student': encodeURIComponent('Вдовиченко Егор Дмитриевич')
    });

    res.end(JSON.stringify({
        lab: 9,
        student: 'Вдовиченко Егор Дмитриевич',
        variant: 3,
        system: {
            platform: os.platform(),
            uptime: os.uptime(),
            free_memory_mb: Math.round(os.freemem() / 1024 / 1024)
        }
    }, null, 2));
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`[HTTP] Сервер успешно запущен на http://localhost:${PORT}`);
});
