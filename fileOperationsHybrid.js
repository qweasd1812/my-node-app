// выполнил Вдовиченко Егор Дмитриевич
const fs = require('fs');
const path = require('path');

class FileManagerHybrid {
    constructor(baseDir = './data-hybrid') {
        this.baseDir = baseDir;
        if (!fs.existsSync(baseDir)) {
            fs.mkdirSync(baseDir, { recursive: true });
        }
    }

    _handleDual(action, callback) {
        if (typeof callback === 'function') {
            action()
                .then(res => callback(null, res))
                .catch(err => callback(err, null));
            return;
        }
        return action();
    }

    createFile(filename, content, callback) {
        return this._handleDual(async () => {
            if (!filename || typeof filename !== 'string') {
                throw new Error('Имя файла должно быть непустой строкой');
            }
            if (content === undefined || content === null) {
                throw new Error('Содержимое файла не может быть пустым');
            }
            const filePath = path.join(this.baseDir, filename);
            await fs.promises.writeFile(filePath, content, 'utf8');
            return filePath;
        }, callback);
    }

    readFile(filename, callback) {
        return this._handleDual(async () => {
            if (!filename || typeof filename !== 'string') {
                throw new Error('Имя файла должно быть непустой строкой');
            }
            const filePath = path.join(this.baseDir, filename);
            return await fs.promises.readFile(filePath, 'utf8');
        }, callback);
    }

    getFileStats(filename, callback) {
        return this._handleDual(async () => {
            if (!filename || typeof filename !== 'string') {
                throw new Error('Имя файла должно быть непустой строкой');
            }
            const filePath = path.join(this.baseDir, filename);
            const stats = await fs.promises.stat(filePath);
            return {
                size: stats.size,
                created: stats.birthtime,
                modified: stats.mtime,
                isFile: stats.isFile()
            };
        }, callback);
    }

    deleteFile(filename, callback) {
        return this._handleDual(async () => {
            if (!filename || typeof filename !== 'string') {
                throw new Error('Имя файла должно быть непустой строкой');
            }
            const filePath = path.join(this.baseDir, filename);
            await fs.promises.unlink(filePath);
            return true;
        }, callback);
    }

    listFiles(callback) {
        return this._handleDual(async () => {
            const files = await fs.promises.readdir(this.baseDir);
            const results = await Promise.all(
                files.map(async (file) => {
                    const filePath = path.join(this.baseDir, file);
                    const stats = await fs.promises.stat(filePath);
                    return { name: file, isFile: stats.isFile() };
                })
            );
            return results.filter(item => item.isFile).map(item => item.name);
        }, callback);
    }
}

module.exports = FileManagerHybrid;
