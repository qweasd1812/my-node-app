// выполнил Вдовиченко Егор Дмитриевич, вариант 3
const EventEmitter = require('events');
const emitter = new EventEmitter();

let onCount = 0;
let onceCount = 0;

emitter.on('tick', () => {
    onCount++;
    console.log(`[tick #${onCount}] on-слушатель`);
});

emitter.once('tick', () => {
    onceCount++;
    console.log(`[tick #${onceCount}] once-слушатель`);
});

console.log('=== Сравнение on и once ===');
emitter.emit('tick');
emitter.emit('tick');
emitter.emit('tick');

console.log(`\non-слушатель вызван: ${onCount} раза`);
console.log(`once-слушатель вызван: ${onceCount} раз\n`);

console.log('=== Управление подписками ===');
const listenerA = () => {};
const listenerB = () => {};
const listenerC = () => {};

emitter.on('action', listenerA);
emitter.on('action', listenerB);
emitter.on('action', listenerC);

console.log(`Слушателей до удаления: ${emitter.listenerCount('action')}`);
emitter.removeListener('action', listenerB);
console.log(`Слушателей после удаления одного: ${emitter.listenerCount('action')}`);
emitter.removeAllListeners('action');
console.log(`Слушателей после removeAllListeners: ${emitter.listenerCount('action')}\n`);

console.log('=== Порядок вызова ===');
emitter.on('order', () => console.log(`1. Первый слушатель (группа ${''})`));
emitter.on('order', () => console.log('2. Второй слушатель'));
emitter.on('order', () => console.log('3. Третий слушатель'));
emitter.emit('order');
