// выполнил Вдовиченко Егор Дмитриевич
const http = require('http');

const JWT_SECRET = 'super-secret-key-bbmo';

function createMockToken(payload) {
    const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64');
    const body = Buffer.from(JSON.stringify(payload)).toString('base64');
    const signature = 'mockSignature12345';
    return `${header}.${body}.${signature}`;
}

const server = http.createServer((req, res) => {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');

    if (req.url === '/api/auth/login' && req.method === 'POST') {
        const token = createMockToken({
            sub: 1,
            name: 'Вдовиченко Егор Дмитриевич',
            
            role: 'admin'
        });
        res.writeHead(200);
        return res.end(JSON.stringify({
            success: true,
            accessToken: token,
            tokenType: 'Bearer',
            expiresIn: 3600
        }, null, 2));
    }

    if (req.url === '/api/protected') {
        const auth = req.headers['authorization'];
        if (!auth || !auth.startsWith('Bearer ')) {
            res.writeHead(401);
            return res.end(JSON.stringify({ error: '401 Unauthorized (Токен не передан)' }));
        }
        res.writeHead(200);
        return res.end(JSON.stringify({
            message: 'Доступ разрешен',
            
            user: 'Вдовиченко Егор Дмитриевич'
        }, null, 2));
    }

    res.writeHead(404);
    res.end();
});

server.listen(3000, () => {
    console.log('[AUTH SERVER] Сервер авторизации JWT запущен на порту 3000');
    if (process.env.AUTOMATED) setTimeout(() => server.close(), 1000);
});
