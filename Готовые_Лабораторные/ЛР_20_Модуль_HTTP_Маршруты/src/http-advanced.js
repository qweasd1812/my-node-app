// выполнил Вдовиченко Егор Дмитриевич
const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, 'public');
os.makedirs = fs.mkdirSync;
if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });
fs.writeFileSync(path.join(publicDir, 'index.html'), '<h1>Главная страница</h1>');
fs.writeFileSync(path.join(publicDir, 'style.css'), 'body { background: #1e1e1e; color: #fff; }');

let requestCount = 0;

const server = http.createServer((req, res) => {
    requestCount++;
    

    // Safe static file serving
    if (req.url.startsWith('/static/')) {
        const safeSuffix = path.normalize(req.url.replace('/static/', '')).replace(/^(\\.\\.(\\/|\\\\|$))+/, '');
        if (req.url.includes('..')) {
            res.writeHead(403);
            return res.end('403 Forbidden (Path traversal detected)');
        }
        const filePath = path.join(publicDir, safeSuffix);
        if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
            const etag = '"abc123etag"';
            if (req.headers['if-none-match'] === etag) {
                res.writeHead(304);
                return res.end();
            }
            res.setHeader('ETag', etag);
            res.setHeader('Cache-Control', 'max-age=60');
            res.writeHead(200, { 'Content-Type': filePath.endsWith('.css') ? 'text/css' : 'text/html' });
            return fs.createReadStream(filePath).pipe(res);
        }
    }

    if (req.url === '/metrics') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({
            
            totalRequests: requestCount,
            status: 'operational',
            uptime: process.uptime()
        }, null, 2));
    }

    res.writeHead(404);
    res.end('404 Not Found');
});

server.listen(3000, () => {
    console.log('[INFO] HTTP-сервер запущен на порту 3000');
    if (process.env.AUTOMATED) setTimeout(() => server.close(), 1000);
});
