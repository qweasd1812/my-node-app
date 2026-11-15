// выполнил Вдовиченко Егор Дмитриевич
const EventEmitter = require('events');
const fs = require('fs');

console.log('=== Исследование фаз Event Loop ===\n');

console.log('1. Синхронный код (Main line)');

process.nextTick(() => {
    console.log('3. process.nextTick (Microtask очередь 1)');
});

Promise.resolve().then(() => {
    console.log('4. Promise.then (Microtask очередь 2)');
});

setTimeout(() => {
    console.log('5. setTimeout 0ms (Фаза Timers)');
}, 0);

setImmediate(() => {
    console.log('6. setImmediate (Фаза Check)');
});

console.log('2. Синхронный код завершен');

// Собственное событие с параметрами
const orderBus = new EventEmitter();
orderBus.on('order:processed', (order) => {
    console.log(`\n[ORDER EVENT] Заказ #${order.id} на сумму ${order.amount} руб. успешно выполнен для ${order.student}!`);
});

setTimeout(() => {
    orderBus.emit('order:processed', {
        id: 101,
        amount: 2500,
        student: 'Вдовиченко Егор Дмитриевич',
        variant: 3
    });
}, 100);
