// выполнил Вдовиченко Егор Дмитриевич, вариант 3
const os = require('os');

console.log('=== Сетевые интерфейсы ===');
const interfaces = os.networkInterfaces();
let primaryInterface = null;
let totalInterfaces = 0;

for (const [name, addrs] of Object.entries(interfaces)) {
    totalInterfaces++;
    console.log(`Интерфейс: ${name}`);
    for (const addr of addrs) {
        // Маскирование MAC
        const macParts = addr.mac.split(':');
        const maskedMac = macParts.length >= 6 
            ? `${macParts[0]}:${macParts[1]}:${macParts[2]}:**:**:**`
            : addr.mac;

        console.log(`  ${addr.family}:        ${addr.address}`);
        console.log(`  MAC:         ${maskedMac}`);
        console.log(`  Внутренний:  ${addr.internal ? 'да' : 'нет'}`);

        if (!addr.internal && addr.family === 'IPv4' && !primaryInterface) {
            primaryInterface = `${name} (${addr.address})`;
        }
    }
}

console.log(`\nВсего интерфейсов:        ${totalInterfaces}`);
console.log(`Основной интерфейс:       ${primaryInterface || 'Не определен'}\n`);

console.log('=== Информация о пользователе ===');
const user = os.userInfo();
console.log(`Имя пользователя:         ${user.username}`);
console.log(`UID:                      ${user.uid !== undefined ? user.uid : -1}`);
console.log(`Домашняя директория:      ${user.homedir}`);

console.log(`\nГруппа:                   ${''}`);
const isRoot = (user.uid === 0 || user.username.toLowerCase() === 'root' || user.username.toLowerCase() === 'administrator');
console.log(`Проверка root:            ${isRoot ? 'да' : 'нет'}`);
