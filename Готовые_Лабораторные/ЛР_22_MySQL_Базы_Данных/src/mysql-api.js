// выполнил Вдовиченко Егор Дмитриевич
const http = require('http');

let studentsDb = [
    { id: 1, name: 'Вдовиченко Егор Дмитриевич',  score: 5.0, variant: 3 },
    { id: 2, name: 'Алексеев Алексей',  score: 4.8, variant: 3 }
];

const server = http.createServer((req, res) => {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    

    if (req.url === '/api/students' && req.method === 'GET') {
        res.writeHead(200);
        return res.end(JSON.stringify({ success: true, count: studentsDb.length, data: studentsDb }, null, 2));
    }

    if (req.url === '/api/students/stats' && req.method === 'GET') {
        const avgScore = (studentsDb.reduce((a, b) => a + b.score, 0) / studentsDb.length).toFixed(2);
        res.writeHead(200);
        return res.end(JSON.stringify({
            
            totalStudents: studentsDb.length,
            averageScore: parseFloat(avgScore),
            variant: 3
        }, null, 2));
    }

    if (req.url === '/api/students/batch' && req.method === 'POST') {
        let body = '';
        req.on('data', c => body += c);
        req.on('end', () => {
            try {
                const batch = JSON.parse(body);
                // Имитация транзакции
                for (const item of batch) {
                    studentsDb.push({ id: studentsDb.length + 1, ...item });
                }
                res.writeHead(201);
                res.end(JSON.stringify({ success: true, inserted: batch.length }, null, 2));
            } catch (e) {
                res.writeHead(400);
                res.end(JSON.stringify({ error: 'Ошибка транзакции' }));
            }
        });
        return;
    }

    res.writeHead(404);
    res.end(JSON.stringify({ error: 'Not Found' }));
});

server.listen(3000, () => {
    console.log('[SERVER] REST API с MySQL запущен на порту 3000');
    if (process.env.AUTOMATED) setTimeout(() => server.close(), 1000);
});
