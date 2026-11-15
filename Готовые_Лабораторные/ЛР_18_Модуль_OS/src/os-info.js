// выполнил Вдовиченко Егор Дмитриевич
const os = require('os');

console.log(`=== Информация о системе ===`);
console.log(`Платформа:      ${os.platform()}`);
console.log(`Тип ОС:         ${os.type()}`);
console.log(`Архитектура:    ${os.arch()}`);
console.log(`Версия ОС:      ${os.release()}`);
console.log(`Имя хоста:      ${os.hostname()}`);

const uptime = os.uptime();
const hours = Math.floor(uptime / 3600);
const minutes = Math.floor((uptime % 3600) / 60);
const seconds = Math.floor(uptime % 60);
console.log(`Время работы:   ${hours} ч ${minutes} мин ${seconds} сек\n`);

const platform = os.platform();
if (platform === 'win32') {
    console.log('Вы работаете в Windows');
} else if (platform === 'linux') {
    console.log('Вы работаете в Linux');
} else if (platform === 'darwin') {
    console.log('Вы работаете в macOS');
} else {
    console.log('Неизвестная платформа');
}
