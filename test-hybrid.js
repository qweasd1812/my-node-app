// выполнил Вдовиченко Егор Дмитриевич
const FileManagerHybrid = require('./fileOperationsHybrid');

const fileManager = new FileManagerHybrid('./test-data-hybrid');

async function testHybrid() {
    console.log('=== ТЕСТИРОВАНИЕ ГИБРИДНОГО МОДУЛЯ (КОЛБЭКИ И ПРОМИСЫ) ===\n');

    console.log('1. Тест через колбэк: создание файла...');
    fileManager.createFile('callback-test.txt', 'Создано через колбэк!', (err, filePath) => {
        if (err) {
            console.error('Ошибка в колбэке:', err.message);
            return;
        }
        console.log(` ✅ Файл создан через колбэк: ${filePath}`);

        fileManager.readFile('callback-test.txt', async (readErr, content) => {
            if (readErr) {
                console.error('Ошибка чтения:', readErr.message);
                return;
            }
            console.log(` ✅ Прочитано через колбэк: "${content}"`);

            console.log('\n2. Тест через промис (async/await): создание файла...');
            try {
                const promisePath = await fileManager.createFile('promise-test.txt', 'Создано через промис!');
                console.log(` ✅ Файл создан через промис: ${promisePath}`);

                const promiseContent = await fileManager.readFile('promise-test.txt');
                console.log(` ✅ Прочитано через промис: "${promiseContent}"`);

                console.log('\n3. Тест обработки ошибок: чтение несуществующего файла...');
                try {
                    await fileManager.readFile('non-existent.txt');
                } catch (e) {
                    console.log(` ✅ Ошибка успешно перехвачена промисом: ${e.message}`);
                }

                fileManager.readFile('non-existent.txt', (errNotFound) => {
                    if (errNotFound) {
                        console.log(` ✅ Ошибка успешно перехвачена колбэком: ${errNotFound.message}`);
                    }

                    console.log('\n4. Очистка файлов...');
                    Promise.all([
                        fileManager.deleteFile('callback-test.txt'),
                        fileManager.deleteFile('promise-test.txt')
                    ]).then(() => {
                        console.log(' ✅ Все тестовые файлы удалены');
                        console.log('\n✅ Гибридный модуль полностью протестирован!');
                    });
                });

            } catch (err) {
                console.error('Ошибка в блоке промисов:', err.message);
            }
        });
    });
}

testHybrid();
