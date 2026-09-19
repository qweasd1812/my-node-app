// выполнил Вдовиченко Егор Дмитриевич
const fs = require('fs').promises;
const path = require('path');

function formatDate(date) {
    const pad = (n) => String(n).padStart(2, '0');
    const yyyy = date.getFullYear();
    const mm = pad(date.getMonth() + 1);
    const dd = pad(date.getDate());
    const hh = pad(date.getHours());
    const min = pad(date.getMinutes());
    const ss = pad(date.getSeconds());
    return `${yyyy}-${mm}-${dd} ${hh}:${min}:${ss}`;
}

async function runTask1() {
    const variant = 3;
    const fileName = `student_${variant}.txt`;
    const filePath = path.join('.', fileName);

    const studentInfo = [
        'Студент: Вдовиченко Егор',
        'Группа: 477',
        `Вариант: ${variant}`,
        `Дата: ${formatDate(new Date())}`,
        '',
        'Любимые книги:',
        '1. "Война и мир" - Л. Толстой',
        '2. "Преступление и наказание" - Ф. Достоевский',
        '3. "Мастер и Маргарита" - М. Булгаков',
        '4. "1984" - Дж. Оруэлл',
        '5. "Гарри Поттер" - Дж. Роулинг'
    ];

    try {
        const initialContent = studentInfo.join('\n') + '\n';
        await fs.writeFile(filePath, initialContent, 'utf8');

        const readInitial = await fs.readFile(filePath, 'utf8');
        const linesCount = readInitial.trim().split('\n').length + 1;
        const countLine = `Количество записей: ${linesCount}\n`;

        await fs.appendFile(filePath, countLine, 'utf8');

        const finalContent = await fs.readFile(filePath, 'utf8');

        console.log(`Создан файл: ${fileName}`);
        console.log('Содержимое файла:');
        console.log('─────────────────────────────────');
        process.stdout.write(finalContent);
        console.log('─────────────────────────────────');
    } catch (err) {
        console.error('Ошибка при работе с файлом:', err.message);
    }
}

runTask1();
