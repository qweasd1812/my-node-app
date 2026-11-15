// выполнил Вдовиченко Егор Дмитриевич
const http = require('http');
const EventEmitter = require('events');
const fs = require('fs');
const path = require('path');

const logFile = path.join(__dirname, 'server.log');

class Logger extends EventEmitter {
    log(event, details) {
        const dateStr = new Date().toISOString();
        const msg = `[${dateStr}] [EVENT: ${event}] [${''}] ${JSON.stringify(details)}\n`;
        fs.appendFileSync(logFile, msg);
        this.emit('logged', msg.trim());
    }
}

const logger = new Logger();
logger.on('logged', (msg) => console.log(`[LOGGER] ${msg}`));

const server = http.createServer((req, res) => {
    logger.log('request', { method: req.method, url: req.url });
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({
        lab: 12,
        student: 'Вдовиченко Егор Дмитриевич',
        
        url: req.url
    }, null, 2));
});

server.listen(3000, () => {
    logger.log('server:start', { port: 3000 });
    if (process.env.AUTOMATED) setTimeout(() => server.close(), 1000);
});
