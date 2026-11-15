// выполнил Вдовиченко Егор Дмитриевич
const EventEmitter = require('events');
const emitter = new EventEmitter();

emitter.on('greet', (name) => {
    console.log(`[greet] Привет, ${name}!`);
});

emitter.on('info', () => {
    console.log(`[info] Студент: Вдовиченко Егор Дмитриевич`);
    console.log(`[info] Вариант: 3`);
});

emitter.on('bye', () => {
    console.log('[bye] До свидания!');
});

console.log('=== Демонстрация EventEmitter ===\n');

emitter.emit('greet', 'Иван');
emitter.emit('info');
emitter.emit('bye');

console.log('');
const hasUnknown = emitter.emit('unknown');
console.log(`Событие "unknown" без слушателей: ${hasUnknown}`);

const hasGreet = emitter.emit('greet', 'Егор');
console.log(`Событие "greet" со слушателями: ${hasGreet}`);
