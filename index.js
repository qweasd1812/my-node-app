const http = require('http');

// Функция вычисления числа Пи без использования Math.PI и сторонних библиотек
function calculatePi(decimalPlaces) {
    let pi = 0;
    let divisor = 1;
    for (let i = 0; i < 5000000; i++) {
        if (i % 2 === 0) pi += 4 / divisor;
        else pi -= 4 / divisor;
        divisor += 2;
    }
    
    // Форматирование до нужного количества знаков без библиотеки Math
    let strPi = pi.toString();
    let dotIndex = strPi.indexOf('.');
    if (dotIndex !== -1 && decimalPlaces > 0) {
        return strPi.substring(0, dotIndex + 1 + decimalPlaces);
    } else if (decimalPlaces === 0 && dotIndex !== -1) {
        return strPi.substring(0, dotIndex);
    }
    return strPi;
}

const fio = "Вдовиченко Егор Дмитриевич";
const group = "477";
const journalNumber = 3;

const piValue = calculatePi(journalNumber);

const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });

    res.write(${fio}<br>);
    res.write(${group}<br>);
    res.write(Число ПИ: );

    res.end();
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(Сервер запущен на http://localhost:);
});
