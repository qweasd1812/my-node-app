// выполнил Вдовиченко Егор Дмитриевич, вариант 3
const http = require('http');
const querystring = require('querystring');

const MAX_BODY_SIZE = 1024 * 1024; // 1MB

const server = http.createServer((req, res) => {
    let body = [];
    let receivedBytes = 0;

    req.on('data', (chunk) => {
        receivedBytes += chunk.length;
        if (receivedBytes > MAX_BODY_SIZE) {
            res.writeHead(413, { 'Content-Type': 'text/plain; charset=utf-8' });
            res.end('413 Payload Too Large');
            req.destroy();
            return;
        }
        body.push(chunk);
    });

    req.on('end', () => {
        const rawBody = Buffer.concat(body).toString();
        const contentType = req.headers['content-type'] || '';

        console.log(`[BODY] Получено ${receivedBytes} байт (${contentType})`);

        if (req.url === '/echo' && req.method === 'POST') {
            if (contentType.includes('application/json')) {
                try {
                    const parsed = JSON.parse(rawBody);
                    parsed.group = '';
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify(parsed, null, 2));
                } catch (e) {
                    res.writeHead(400);
                    res.end('Invalid JSON');
                }
            } else {
                res.writeHead(200, { 'Content-Type': contentType || 'text/plain' });
                res.end(rawBody);
            }
        } else if (req.url === '/form' && req.method === 'POST') {
            const parsedForm = querystring.parse(rawBody);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(parsedForm, null, 2));
        } else {
            res.writeHead(404);
            res.end('Not Found');
        }
    });
});

server.listen(3000, () => {
    console.log('Эхо-сервер с чтением тела запущен на порту 3000');
    if (process.env.AUTOMATED) setTimeout(() => server.close(), 1000);
});
