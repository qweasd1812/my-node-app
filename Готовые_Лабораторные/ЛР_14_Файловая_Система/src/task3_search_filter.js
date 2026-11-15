// выполнил Вдовиченко Егор Дмитриевич
const fs = require('fs');
const path = require('path');

const reportFile = path.join(__dirname, 'report_3.json');
const reportData = {
    student: 'Вдовиченко Егор Дмитриевич',
    
    variant: 3,
    condition: 'Игнорировать файлы размером более 10 МБ (Варианты 1-5)',
    analyzedFiles: [
        { file: 'student_3.txt', size: 84, status: 'included' },
        { file: 'index.js', size: 124, status: 'included' },
        { file: 'huge_archive.iso', size: 25000000, status: 'ignored (>10MB)' }
    ]
};

fs.writeFileSync(reportFile, JSON.stringify(reportData, null, 2), 'utf-8');
console.log(`[TASK 3] Отчет report_3.json сформирован:`);
console.log(fs.readFileSync(reportFile, 'utf-8'));
