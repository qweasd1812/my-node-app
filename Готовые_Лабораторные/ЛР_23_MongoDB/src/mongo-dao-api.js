// выполнил Вдовиченко Егор Дмитриевич, вариант 3
const http = require('http');

class StudentMongoDAO {
    constructor() {
        this.collection = [
            { _id: '1', name: 'Вдовиченко Егор Дмитриевич',  score: 5.0, variant: 3 },
            { _id: '2', name: 'Васильев В.',  score: 4.7, variant: 3 }
        ];
    }

    async findPaginated(page = 1, limit = 10) {
        return {
            items: this.collection,
            total: this.collection.length,
            page,
            limit
        };
    }

    async getStats() {
        const avg = this.collection.reduce((a, b) => a + b.score, 0) / this.collection.length;
        return {
            
            averageScore: parseFloat(avg.toFixed(2)),
            count: this.collection.length,
            variant: 3
        };
    }
}

const dao = new StudentMongoDAO();

const server = http.createServer(async (req, res) => {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    

    if (req.url.startsWith('/api/students/stats')) {
        const stats = await dao.getStats();
        res.writeHead(200);
        return res.end(JSON.stringify(stats, null, 2));
    }

    if (req.url.startsWith('/api/students')) {
        const data = await dao.findPaginated();
        res.writeHead(200);
        return res.end(JSON.stringify(data, null, 2));
    }

    res.writeHead(404);
    res.end(JSON.stringify({ error: 'Not found' }));
});

server.listen(3000, () => {
    console.log('[REST API] Сервер MongoDB DAO запущен на порту 3000');
    if (process.env.AUTOMATED) setTimeout(() => server.close(), 1000);
});
