// выполнил Вдовиченко Егор Дмитриевич
const os = require('os');

console.log('=== Информация о процессоре ===');
const cpus = os.cpus();
console.log(`Количество логических ядер: ${cpus.length}`);
console.log(`Модель процессора:          ${cpus[0].model}`);
const avgSpeed = cpus.reduce((acc, cpu) => acc + cpu.speed, 0) / cpus.length;
console.log(`Средняя частота:            ${Math.round(avgSpeed)} МГц\n`);

console.log('=== Информация о памяти ===');
const totalMemGB = (os.totalmem() / (1024 ** 3)).toFixed(2);
const freeMemGB = (os.freemem() / (1024 ** 3)).toFixed(2);
const usedMemGB = (totalMemGB - freeMemGB).toFixed(2);
const usedPercent = (((os.totalmem() - os.freemem()) / os.totalmem()) * 100).toFixed(1);

console.log(`Общий объём:                ${totalMemGB} ГБ`);
console.log(`Свободно:                   ${freeMemGB} ГБ`);
console.log(`Использовано:               ${usedMemGB} ГБ (${usedPercent}%)\n`);

console.log('=== Средняя загрузка (Load Average) ===');
const load = os.loadavg();
if (os.platform() === 'win32') {
    console.log(`Значения: [${load.join(', ')}] (Не поддерживается в ОС Windows, всегда 0)`);
} else {
    console.log(`1 мин: ${load[0]}, 5 мин: ${load[1]}, 15 мин: ${load[2]}`);
}

console.log(`\nГруппа: ${''}`);
if (freeMemGB / totalMemGB < 0.20) {
    console.log('ВНИМАНИЕ: Свободной памяти менее 20%!');
} else {
    console.log('Память в норме');
}
