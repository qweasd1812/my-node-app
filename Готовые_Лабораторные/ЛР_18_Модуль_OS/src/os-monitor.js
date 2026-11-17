// выполнил Вдовиченко Егор Дмитриевич, вариант 3
const os = require('os');
const fs = require('fs');
const path = require('path');

const logFile = path.join(__dirname, 'monitor.log');

function getCpuTimes() {
    const cpus = os.cpus();
    let idle = 0;
    let total = 0;
    for (const cpu of cpus) {
        for (const type in cpu.times) {
            total += cpu.times[type];
        }
        idle += cpu.times.idle;
    }
    return { idle, total };
}

let prevTimes = getCpuTimes();
let warningsCount = 0;

console.log(`Мониторинг (группа ${''}). Ctrl+C для выхода.\n`);

function logAlert(message) {
    const dateStr = new Date().toISOString().replace('T', ' ').substring(0, 19);
    fs.appendFileSync(logFile, `[${dateStr}] [${''}] ${message}\n`);
}

const timer = setInterval(() => {
    const currentTimes = getCpuTimes();
    const idleDiff = currentTimes.idle - prevTimes.idle;
    const totalDiff = currentTimes.total - prevTimes.total;
    const cpuLoad = (100 - (100 * idleDiff / totalDiff)).toFixed(1);
    prevTimes = currentTimes;

    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const ramLoad = (((totalMem - freeMem) / totalMem) * 100).toFixed(1);
    const freeGB = (freeMem / (1024 ** 3)).toFixed(2);

    let status = '';
    if (cpuLoad > 80) {
        status = '  ⚠⚠';
        warningsCount++;
        logAlert(`КРИТИЧЕСКАЯ загрузка CPU: ${cpuLoad}%`);
    } else if (cpuLoad > 50) {
        status = '  ⚠';
        warningsCount++;
        logAlert(`Высокая загрузка CPU: ${cpuLoad}%`);
    }

    console.log(`CPU: ${cpuLoad}% | RAM: ${ramLoad}% (${freeGB} ГБ свободно)${status}`);
}, 2000);

process.on('SIGINT', () => {
    clearInterval(timer);
    console.log(`\n^C\nМониторинг остановлен. Предупреждений: ${warningsCount}`);
    process.exit(0);
});

// Auto-stop after 4 ticks if run automated
if (process.env.AUTOMATED) {
    setTimeout(() => {
        clearInterval(timer);
        console.log(`\nМониторинг завершен автоматически для отчета. Предупреждений: ${warningsCount}`);
        process.exit(0);
    }, 9000);
}
