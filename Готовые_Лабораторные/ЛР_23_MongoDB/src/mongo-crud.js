// выполнил Вдовиченко Егор Дмитриевич, вариант 3
class MongoCollectionSimulator {
    constructor() {
        this.docs = [
            { _id: '65432101', name: 'Иванов Иван',  score: 4.5, variant: 1 }
        ];
    }

    async insertOne(doc) {
        const _id = '654321' + (this.docs.length + 10);
        const newDoc = { _id, ...doc };
        this.docs.push(newDoc);
        console.log(`[INSERT] Документ добавлен с insertedId: ${_id}`);
        return { acknowledged: true, insertedId: _id };
    }

    async find(filter = {}) {
        return {
            toArray: async () => {
                return this.docs.filter(d => {
                    for (const k in filter) {
                        if (d[k] !== filter[k]) return false;
                    }
                    return true;
                });
            }
        };
    }

    async updateOne(filter, update) {
        const doc = this.docs.find(d => d._id === filter._id);
        if (doc && update.$set) {
            Object.assign(doc, update.$set);
            console.log(`[UPDATE] Документ ${filter._id} обновлен:`, update.$set);
        }
    }

    async deleteMany(filter) {
        const before = this.docs.length;
        this.docs = this.docs.filter(d => d.group !== filter.group);
        console.log(`[DELETE] Удалено документов: ${before - this.docs.length}`);
    }
}

async function runMongoCrud() {
    console.log('=== CRUD-операции MongoDB ===\n');
    const col = new MongoCollectionSimulator();

    await col.insertOne({
        name: 'Вдовиченко Егор Дмитриевич',
        
        score: 5.0,
        variant: 3
    });

    const cursor = await col.find({  });
    const results = await cursor.toArray();
    console.log('\nРезультаты find():', JSON.stringify(results, null, 2));

    await col.updateOne({ _id: '65432101' }, { $set: { score: 4.8 } });
}

runMongoCrud();
