// выполнил Вдовиченко Егор Дмитриевич, вариант 3
const { Readable, Transform } = require('stream');

const students = [
    { id: 1, name: 'Иванов Иван',  grades: [4, 5, 4] },
    { id: 2, name: 'Вдовиченко Егор Дмитриевич',  grades: [5, 5, 5] },
    { id: 3, name: 'Сидоров Сидор',  grades: [3, 4, 4] }
];

// Transform в Object Mode
const calculateGpaTransform = new Transform({
    objectMode: true,
    transform(student, encoding, callback) {
        const avg = (student.grades.reduce((a, b) => a + b, 0) / student.grades.length).toFixed(2);
        this.push({
            ...student,
            averageScore: parseFloat(avg)
        });
        callback();
    }
});

// Transform объектов в CSV-строки
const csvFormatter = new Transform({
    objectMode: true,
    transform(student, encoding, callback) {
        const line = `${student.id},${student.name},${student.group},${student.averageScore}\n`;
        this.push(line);
        callback();
    }
});

console.log('=== Object Mode & CSV Transform ===\n');
console.log('ID,Имя,Группа,СреднийБалл');

Readable.from(students)
    .pipe(calculateGpaTransform)
    .pipe(csvFormatter)
    .pipe(process.stdout);
