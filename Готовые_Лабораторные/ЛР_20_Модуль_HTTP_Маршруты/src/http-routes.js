// выполнил Вдовиченко Егор Дмитриевич
const http = require('http');
const url = require('url');

let students = [
    { id: 1, name: 'Иванов Иван',  score: 4.5 },
    { id: 2, name: 'Вдовиченко Егор Дмитриевич',  score: 5.0, variant: 3 },
    { id: 3, name: 'Петров Петр', group: 'ББМО-02-23', score: 3.8 }
];

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;
    const method = req.method;

    res.setHeader('Content-Type', 'application/json; charset=utf-8');

    // GET /api/students
    if (pathname === '/api/students' && method === 'GET') {
        let result = students;
        if (parsedUrl.query.group) {
            result = result.filter(s => s.group === parsedUrl.query.group);
        }
        res.writeHead(200);
        return res.end(JSON.stringify(result, null, 2));
    }

    // GET /api/students/:id
    const matchId = pathname.match(/^\/api\/students\/(\d+)$/);
    if (matchId && method === 'GET') {
        const id = parseInt(matchId[1], 10);
        const student = students.find(s => s.id === id);
        if (!student) {
            res.writeHead(404);
            return res.end(JSON.stringify({ error: 'Студент не найден' }));
        }
        res.writeHead(200);
        return res.end(JSON.stringify(student, null, 2));
    }

    // POST /api/students
    if (pathname === '/api/students' && method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            const data = JSON.parse(body);
            const newStudent = {
                id: students.length + 1,
                name: data.name,
                group: data.group || '',
                score: data.score || 4.0
            };
            students.push(newStudent);
            res.writeHead(201);
            res.end(JSON.stringify(newStudent, null, 2));
        });
        return;
    }

    // DELETE /api/students/:id
    if (matchId && method === 'DELETE') {
        const id = parseInt(matchId[1], 10);
        students = students.filter(s => s.id !== id);
        res.writeHead(200);
        return res.end(JSON.stringify({ success: true, deletedId: id }));
    }

    res.writeHead(404);
    res.end(JSON.stringify({ error: 'Маршрут не найден' }));
});

server.listen(3000, () => {
    console.log('REST API маршрутизатор запущен на порту 3000');
    if (process.env.AUTOMATED) setTimeout(() => server.close(), 1000);
});
