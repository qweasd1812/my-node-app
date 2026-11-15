// выполнил Вдовиченко Егор Дмитриевич
// Архитектура MVC

// Model
class UserModel {
    static users = [
        { id: 1, name: 'Вдовиченко Егор Дмитриевич',  variant: 3 }
    ];
    static async findAll() { return this.users; }
    static async findById(id) { return this.users.find(u => u.id === id); }
}

// Service
class UserService {
    static async getUsers() {
        const list = await UserModel.findAll();
        return list.map(u => ({ ...u, status: 'active' }));
    }
}

// Controller
class UserController {
    static async getAll(req, res) {
        const data = await UserService.getUsers();
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        
        res.writeHead(200);
        res.end(JSON.stringify({ success: true, count: data.length, data }, null, 2));
    }
}

const http = require('http');
const server = http.createServer((req, res) => {
    if (req.url === '/api/mvc/users') {
        return UserController.getAll(req, res);
    }
    res.writeHead(404);
    res.end('Not Found');
});

server.listen(3000, () => {
    console.log('[MVC API] Сервер MVC запущен на порту 3000');
    if (process.env.AUTOMATED) setTimeout(() => server.close(), 1000);
});
