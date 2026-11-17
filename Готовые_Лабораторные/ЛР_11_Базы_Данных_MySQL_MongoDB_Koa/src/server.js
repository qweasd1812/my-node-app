// выполнил Вдовиченко Егор Дмитриевич, вариант 3
const http = require('http');

console.log('=== Лабораторная работа 11: Основы работы с БД и архитектура MVC ===');
console.log(`Студент: Вдовиченко Егор Дмитриевич, Вариант: 3`);

// 1. Модель (Model - слой абстракции данных)
class StudentModel {
    static data = [
        { id: 1, name: 'Вдовиченко Егор Дмитриевич', grade: 5.0, variant: 3 },
        { id: 2, name: 'Иванов Иван Иванович', grade: 4.8, variant: 1 },
        { id: 3, name: 'Петров Петр Сергеевич', grade: 4.6, variant: 2 }
    ];

    static async findAll() {
        return new Promise((resolve) => setTimeout(() => resolve(this.data), 10));
    }
}

// 2. Сервис (Service - слой бизнес-логики)
class StudentService {
    static async getTopStudents() {
        const students = await StudentModel.findAll();
        return students.filter(s => s.grade >= 4.7);
    }
}

// 3. Контроллер (Controller - обработчик HTTP)
class StudentController {
    static async handleGetStudents(req, res) {
        const students = await StudentService.getTopStudents();
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({
            lab: 11,
            architecture: 'MVC',
            student: 'Вдовиченко Егор Дмитриевич',
            top_students: students
        }, null, 2));
    }
}

const server = http.createServer((req, res) => {
    if (req.url === '/api/students') {
        return StudentController.handleGetStudents(req, res);
    }
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not Found' }));
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`[MVC-DB] Сервер слушает порт ${PORT} на http://localhost:${PORT}/api/students`);
});
