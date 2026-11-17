// выполнил Вдовиченко Егор Дмитриевич, вариант 3
class StudentDAO {
    constructor() {
        this.data = [
            { id: 1, name: 'Иванов Иван',  score: 4.5, variant: 1 },
            { id: 2, name: 'Вдовиченко Егор Дмитриевич',  score: 5.0, variant: 3 },
            { id: 3, name: 'Сидоров Сидор', group: 'ББМО-02-23', score: 3.8, variant: 2 }
        ];
    }

    async create(studentData) {
        if (!studentData.name || studentData.score < 2 || studentData.score > 5) {
            throw new Error('Ошибка валидации данных студента');
        }
        const newStudent = { id: this.data.length + 1, ...studentData };
        this.data.push(newStudent);
        return newStudent;
    }

    async findPaginated({ page = 1, limit = 2, group = null } = {}) {
        let filtered = this.data;
        if (group) filtered = filtered.filter(s => s.group === group);
        
        const start = (page - 1) * limit;
        const items = filtered.slice(start, start + limit);
        return {
            page,
            limit,
            total: filtered.length,
            totalPages: Math.ceil(filtered.length / limit),
            items
        };
    }
}

async function runDAO() {
    console.log(`=== Тестирование StudentDAO (группа ${''}) ===\n`);
    const dao = new StudentDAO();

    console.log('Пагинация (страница 1, лимит 2):');
    const page1 = await dao.findPaginated({ page: 1, limit: 2 });
    console.log(JSON.stringify(page1, null, 2));

    console.log('\nФильтрация по группе :');
    const groupData = await dao.findPaginated({  });
    console.log(JSON.stringify(groupData, null, 2));
}

runDAO();
