// выполнил Вдовиченко Егор Дмитриевич, вариант 3
const fs = require('fs');
const path = require('path');

const studentFile = path.join(__dirname, 'student_3.txt');
const studentContent = `Студент: Вдовиченко Егор Дмитриевич\n\nВариант: 3\nДата: 2026-11-14\n`;

fs.writeFileSync(studentFile, studentContent, 'utf-8');
console.log(`[TASK 1] Файл student_3.txt успешно создан:`);
console.log(fs.readFileSync(studentFile, 'utf-8'));

// Task 2: Вариант 3 нечетный -> создаем 3 вложенные папки header, footer, sidebar в src/components
const baseCompDir = path.join(__dirname, 'components_tree', 'src', 'components');
['header', 'footer', 'sidebar'].forEach(sub => {
    const p = path.join(baseCompDir, sub);
    fs.mkdirSync(p, { recursive: true });
    fs.writeFileSync(path.join(p, 'index.js'), `// Компонент ${sub} (Вариант 3)\n`);
});
console.log('[TASK 2] Структура каталогов header, footer, sidebar успешно создана в src/components');
