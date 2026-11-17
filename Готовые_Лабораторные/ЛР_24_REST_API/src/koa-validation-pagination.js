// выполнил Вдовиченко Егор Дмитриевич, вариант 3
const http = require('http');
const url = require('url');

const allStudents = [
    { id: 1, name: 'Иванов Иван',  score: 4.5 },
    { id: 2, name: 'Вдовиченко Егор Дмитриевич',  score: 5.0, variant: 3 },
    { id: 3, name: 'Смирнов Алексей',  score: 4.8 }
];

const server = http.createServer((req, res) => {
    const parsed = url.parse(req.url, true);
    
    if (parsed.pathname === '/api/students/export/csv') {
        res.setHeader('Content-Type', 'text/csv; charset=utf-8');
        res.setHeader('Content-Disposition', 'attachment; filename="students.csv"');
        res.writeHead(200);
        res.write('id,name,group,score\n');
        allStudents.forEach(s => res.write(`${s.id},${s.name},${s.group},${s.score}\n`));
        return res.end();
    }

    if (parsed.pathname === '/api/students') {
        const page = parseInt(parsed.query.page) || 1;
        const limit = parseInt(parsed.query.limit) || 10;

        if (limit > 100) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ error: 'Лимит не может превышать 100' }));
        }

        const start = (page - 1) * limit;
        const items = allStudents.slice(start, start + limit);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({
            meta: { total: allStudents.length, page, limit, pages: Math.ceil(allStudents.length / limit) },
            data: items
        }, null, 2));
    }

    res.writeHead(404);
    res.end();
});

server.listen(3000, () => {
    console.log('[PAGINATION API] Запущен на порту 3000');
    if (process.env.AUTOMATED) setTimeout(() => server.close(), 1000);
});
