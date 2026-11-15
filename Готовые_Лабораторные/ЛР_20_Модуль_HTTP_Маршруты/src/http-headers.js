// выполнил Вдовиченко Егор Дмитриевич
const http = require('http');

const server = http.createServer((req, res) => {
    if (req.url === '/headers') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            headers: req.headers,
            method: req.method,
            url: req.url,
            httpVersion: req.httpVersion
        }, null, 2));
    } else if (req.url === '/headers/set') {
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.setHeader('X-Powered-By', 'Node.js');
        
        res.setHeader('Cache-Control', 'no-cache');
        res.writeHead(200);
        res.end('Заголовки установлены');
    } else if (req.url === '/headers/check') {
        
        const hasContentType = res.hasHeader('Content-Type');
        const hasXGroup = res.hasHeader('X-Group');
        const hasUnknown = res.hasHeader('X-Unknown');
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ hasContentType, hasXGroup, hasUnknown }, null, 2));
    } else {
        res.writeHead(404);
        res.end('Not Found');
    }
});

server.listen(3000, () => {
    console.log('Сервер заголовков запущен на порту 3000');
    if (process.env.AUTOMATED) setTimeout(() => server.close(), 1000);
});
