// выполнил Вдовиченко Егор Дмитриевич, вариант 3
class DatabaseSimulator {
    constructor() {
        this.students = [
            { id: 1, name: 'Иванов Иван',  score: 4.5, variant: 1 }
        ];
    }

    async createTable() {
        console.log('[SQL] CREATE TABLE IF NOT EXISTS students (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255), group_name VARCHAR(50), score DECIMAL(3,2), variant INT);');
        console.log('Таблица students проверена/создана.');
    }

    async insertStudent(name, group_name, score, variant) {
        const newId = this.students.length + 1;
        const student = { id: newId, name, group_name, score, variant };
        this.students.push(student);
        console.log(`[SQL INSERT] Добавлен студент ID ${newId}: ${name} (Вариант ${variant})`);
        return newId;
    }

    async getStudentsByGroup(group_name) {
        console.log(`[SQL SELECT] Выборка студентов группы ${group_name}`);
        return this.students.filter(s => s.group_name === group_name);
    }

    async updateScore(id, newScore) {
        const st = this.students.find(s => s.id === id);
        if (st) st.score = newScore;
        console.log(`[SQL UPDATE] Обновлена оценка студента ID ${id} -> ${newScore}`);
    }

    async deleteStudent(id) {
        this.students = this.students.filter(s => s.id !== id);
        console.log(`[SQL DELETE] Студент ID ${id} удален из БД`);
    }
}

async function runCrud() {
    console.log('=== CRUD-операции MySQL ===\n');
    const db = new DatabaseSimulator();

    await db.createTable();
    const id = await db.insertStudent('Вдовиченко Егор Дмитриевич', 5.0, 3);
    
    const list = await db.getStudentsByGroup('');
    console.log('Текущий список студентов:', list);

    await db.updateScore(id, 4.9);
    await db.deleteStudent(1);
}

runCrud();
