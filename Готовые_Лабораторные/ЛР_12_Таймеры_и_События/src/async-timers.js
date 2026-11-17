// выполнил Вдовиченко Егор Дмитриевич, вариант 3
console.log(`=== Асинхронная обработка с таймерами (группа ${''}) ===\n`);

const queue = ['Задача 1', 'Задача 2', 'Задача 3'];
let count = 0;

const intervalId = setInterval(() => {
    if (queue.length > 0) {
        const item = queue.shift();
        console.log(`[INTERVAL 500ms] Обработка: ${item}`);
    } else {
        clearInterval(intervalId);
        console.log('[FINISH] Все задачи из очереди обработаны!');
    }
}, 500);

setTimeout(() => {
    console.log('[TIMEOUT 1500ms] Контрольный таймаут завершен');
}, 1500);
