// выполнил Вдовиченко Егор Дмитриевич, вариант 3
const http = require('http');

let users = [
    { id: 1, name: 'Иванов Иван'  },
    { id: 2, name: 'Вдовиченко Егор Дмитриевич',  variant: 3 }
];

const server = http.createServer((req, res) => {
    const url = new URL(req.url, 'http://localhost:3000');
    
    // Middleware logging
    console.log(`[KOA MIDDLEWARE] ${new Date().toISOString()} - ${req.method} ${url.pathname}`);

    if (url.pathname === '/' && req.method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        return res.end(`
            <h1>Лабораторная работа №15</h1>
            <p>Студент: Вдовиченко Егор Дмитриевич (Вариант 3)</p>
            <p>Дата: ${new Date().toLocaleString()}</p>
            <p>Добро пожаловать в веб-сервер на Koa.js!</p>
        `);
    }

    if (url.pathname === '/api/users' && req.method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        return res.end(JSON.stringify(users, null, 2));
    }

    if (url.pathname === '/api/users' && req.method === 'POST') {
        let body = '';
        req.on('data', c => body += c);
        req.on('end', () => {
            const data = JSON.parse(body);
            const newUser = { id: users.length + 1, ...data };
            users.push(newUser);
            res.writeHead(201, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(newUser, null, 2));
        });
        return;
    }

    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Маршрут не найден' }));
});

server.listen(3000, () => {
    console.log('[KOA APP] Сервер запущен на http://localhost:3000');
    if (process.env.AUTOMATED) setTimeout(() => server.close(), 1000);
});
