// выполнил Вдовиченко Егор Дмитриевич
const EventEmitter = require('events');

class PluginManager extends EventEmitter {
    constructor() {
        super();
        this.on('newListener', (event) => {
            console.log(`[newListener] Добавлен слушатель "${event}"`);
        });
        this.on('removeListener', (event) => {
            console.log(`[removeListener] Удалён слушатель "${event}"`);
        });
    }

    registerPlugin(name, fn) {
        console.log(`\n[PLUGIN] Зарегистрирован: ${name}`);
        this.on(name.toLowerCase(), fn);
    }

    removePlugin(name, fn) {
        this.removeListener(name.toLowerCase(), fn);
        console.log(`[PLUGIN] Удалён: ${name}`);
    }
}

console.log('=== Система плагинов ===');
const pm = new PluginManager();
const logFn = () => console.log('Log message');
pm.registerPlugin('LoggerPlugin', logFn);
pm.removePlugin('LoggerPlugin', logFn);

console.log('\n=== Демонстрация предотвращения утечки ===');
const leaky = new EventEmitter();
console.log(`Слушателей до: ${leaky.listenerCount('ping')}`);
for (let i = 0; i < 1000; i++) {
    leaky.on('ping', () => {});
}
console.log(`Слушателей после добавления 1000: ${leaky.listenerCount('ping')}`);
leaky.removeAllListeners('ping');
console.log(`Слушателей после removeAllListeners: ${leaky.listenerCount('ping')}`);

console.log('\n=== Асинхронные слушатели ===');
const asyncEmitter = new EventEmitter();
asyncEmitter.on('async-event', async () => {
    await new Promise(r => setTimeout(r, 100));
    console.log(`[${''}] async-слушатель завершён через 100ms`);
});

asyncEmitter.emit('async-event');
console.log(`[${''}] emit вызван (не ждёт async-слушатель)`);
