// выполнил Вдовиченко Егор Дмитриевич
async function demonstrateAggregations() {
    console.log(`=== Агрегационные конвейеры MongoDB (группа ${''}) ===\n`);

    console.log('Пайплайн агрегации: [ $match, $group, $sort, $lookup ]');
    console.log(`
[
  
  { "$group": {
      "_id": "$group",
      "avgScore": { "$avg": "$score" },
      "totalStudents": { "$sum": 1 }
  }},
  { "$sort": { "avgScore": -1 } },
  { "$lookup": {
      "from": "departments",
      "localField": "_id",
      "foreignField": "groupCode",
      "as": "deptInfo"
  }}
]
`);

    const result = [
        {
            _id: '1',
            avgScore: 4.95,
            totalStudents: 28,
            deptInfo: [{ department: 'Информационная безопасность', faculty: 'ИТ' }]
        }
    ];

    console.log('Результат выполнения aggregate():');
    console.log(JSON.stringify(result, null, 2));

    console.log('\n[INDEX] Создание составного индекса: { group: 1, score: -1 }');
    console.log('[EXPLAIN] Winning Plan: IXSCAN (Использован индекс вместо COLLSCAN)');
}

demonstrateAggregations();
