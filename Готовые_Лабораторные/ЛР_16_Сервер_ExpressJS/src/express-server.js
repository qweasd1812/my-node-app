// выполнил Вдовиченко Егор Дмитриевич
const http = require('http');

let books = [
    { id: 1, title: 'Война и мир', author: 'Толстой', year: 1869 },
    { id: 2, title: 'Преступление и наказание', author: 'Достоевский', year: 1866 }
];

const server = http.createServer((req, res) => {
    const url = new URL(req.url, 'http://localhost:3000');

    if (url.pathname === '/' && req.method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        return res.end(`
            <h1>Лабораторная работа №16</h1>
            <p>Студент: Вдовиченко Егор Дмитриевич</p>
            <p>Маршруты: /about, /contacts, /api/books</p>
        `);
    }

    if (url.pathname === '/about' && req.method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        return res.end(`<h1>О разработчике</h1><p>Студент: Вдовиченко Егор Дмитриевич, Вариант: 3</p>`);
    }

    if (url.pathname === '/api/books' && req.method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        return res.end(JSON.stringify(books, null, 2));
    }

    if (url.pathname === '/api/books' && req.method === 'POST') {
        let body = '';
        req.on('data', c => body += c);
        req.on('end', () => {
            const data = JSON.parse(body);
            const newBook = { id: books.length + 1, ...data };
            books.push(newBook);
            res.writeHead(201, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(newBook, null, 2));
        });
        return;
    }

    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not found' }));
});

server.listen(3000, () => {
    console.log('[EXPRESS APP] Сервер запущен на http://localhost:3000');
    if (process.env.AUTOMATED) setTimeout(() => server.close(), 1000);
});
