// выполнил Вдовиченко Егор Дмитриевич, вариант 3
const http = require('http');

const server = http.createServer((req, res) => {
    const dateStr = new Date().toISOString().replace('T', ' ').substring(0, 19);
    
    if (req.url === '/' && req.method === 'GET') {
        console.log(`[${dateStr}] GET / 200`);
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(`
            <h1>=== Лабораторная работа №20 ===</h1>
            <p>Метод: GET</p>
            <p>URL: /</p>
        `);
    } else if (req.url === '/about' && req.method === 'GET') {
        console.log(`[${dateStr}] GET /about 200`);
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(`
            <h1>=== О студенте ===</h1>
            <p>Студент: Вдовиченко Егор Дмитриевич</p>
            <p>Вариант: 3</p>
        `);
    } else {
        console.log(`[${dateStr}] ${req.method} ${req.url} 404`);
        res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(`
            <h1>=== 404 Not Found ===</h1>
            <p>Путь ${req.url} не найден</p>
        `);
    }
});

server.listen(3000, () => {
    console.log('Сервер запущен на порту 3000');
    if (process.env.AUTOMATED) setTimeout(() => server.close(), 1000);
});
