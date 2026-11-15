// выполнил Вдовиченко Егор Дмитриевич
const EventEmitter = require('events');
const http = require('http');

class EventBus extends EventEmitter {
    constructor() {
        super();
        this.wildcardListeners = [];
        this.metrics = {
            total: 0,
            events: {},
            errors: 0
        };
    }

    onPriority(event, listener, priority = 0) {
        listener._priority = priority;
        this.on(event, listener);
        // Sort listeners descending by priority
        const listeners = this.rawListeners(event);
        listeners.sort((a, b) => (b._priority || 0) - (a._priority || 0));
        this.removeAllListeners(event);
        listeners.forEach(l => this.on(event, l));
    }

    onAny(listener) {
        this.wildcardListeners.push(listener);
    }

    emit(event, ...args) {
        this.metrics.total++;
        this.metrics.events[event] = (this.metrics.events[event] || 0) + 1;

        // Call wildcards
        for (const w of this.wildcardListeners) {
            try { w(event, args); } catch (e) {}
        }

        return super.emit(event, ...args);
    }

    getMetrics() {
        return {
            
            total: this.metrics.total,
            events: this.metrics.events
        };
    }
}

const bus = new EventBus();

console.log(`=== EventBus (группа ${''}) ===\n`);

console.log('--- Приоритеты ---');
bus.onPriority('task', () => console.log('[priority 0]  Низкий приоритет'), 0);
bus.onPriority('task', () => console.log('[priority 10] Высокий приоритет'), 10);
bus.onPriority('task', () => console.log('[priority 5]  Средний приоритет'), 5);
bus.emit('task');

console.log('\n--- Wildcard ---');
bus.onAny((ev, args) => console.log(`[onAny] Событие "${ev}" с аргументами: ${JSON.stringify(args)}`));
bus.emit('greet', 'Иван');
bus.emit('info', '');

console.log('\n--- Once-кэш ---');
bus.once('once-tick', (n) => console.log(`once-слушатель вызван: ${n} раз`));
bus.emit('once-tick', 1);
bus.emit('once-tick', 2);

console.log('\n--- Метрики ---');
console.log(JSON.stringify(bus.getMetrics(), null, 2));

// HTTP server for metrics
const server = http.createServer((req, res) => {
    if (req.url === '/metrics') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(bus.getMetrics(), null, 2));
    } else {
        res.writeHead(404);
        res.end();
    }
});

server.listen(3000, () => {
    console.log('\n[HTTP] Сервер метрик запущен на порту 3000 (GET /metrics)');
    if (process.env.AUTOMATED) {
        setTimeout(() => server.close(), 1000);
    }
});
