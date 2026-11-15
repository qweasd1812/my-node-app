// выполнил Вдовиченко Егор Дмитриевич, вариант 3
const http = require('http');

let users = [
    { id: 1, email: 'student@mirea.ru', role: 'student',  name: 'Вдовиченко Егор Дмитриевич' }
];

const server = http.createServer((req, res) => {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    

    if (req.url === '/api/users' && req.method === 'GET') {
        res.writeHead(200);
        return res.end(JSON.stringify(users, null, 2));
    }

    if (req.url === '/api/users' && req.method === 'POST') {
        let body = '';
        req.on('data', c => body += c);
        req.on('end', () => {
            const data = JSON.parse(body);
            if (!data.email) {
                res.writeHead(400);
                return res.end(JSON.stringify({ error: 'Поле email обязательно' }));
            }
            const newUser = { id: users.length + 1, ...data  };
            users.push(newUser);
            res.writeHead(201);
            res.end(JSON.stringify(newUser, null, 2));
        });
        return;
    }

    res.writeHead(404);
    res.end(JSON.stringify({ error: 'Маршрут не найден' }));
});

server.listen(3000, () => {
    console.log('[KOA REST API] Сервер запущен на порту 3000');
    if (process.env.AUTOMATED) setTimeout(() => server.close(), 1000);
});
