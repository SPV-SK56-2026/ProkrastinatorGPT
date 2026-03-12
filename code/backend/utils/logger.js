// utils/logger.js
const fs = require('fs');
const path = require('path');

const LogType = Object.freeze({
    INFO: 'INFO',
    WARN: 'WARN',
    SUCCESS: 'SUCCESS',
    ERROR: 'ERROR'
});

// Pot do mape z logi (backend/logs)
const LOGS_DIR = path.join(__dirname, '../logs');

// Preveri, če mapa logs obstaja, če ne, jo ustvari
if (!fs.existsSync(LOGS_DIR)) {
    fs.mkdirSync(LOGS_DIR, { recursive: true });
}

const getTimestamp = () => new Date().toLocaleString('sl-SI');

// Pomožna funkcija za ime datoteke (npr. 12-3-2026.txt)
const getDateForFile = () => {
    const d = new Date();
    return `${d.getDate()}-${d.getMonth() + 1}-${d.getFullYear()}.txt`;
};

const log = (type, message) => {
    const ts = getTimestamp();
    const formattedMsg = `[${ts}] [${type}] ${message}`;

    // 1. IZPIS V KONZOLO
    switch (type) {
        case LogType.ERROR:
            console.error(formattedMsg);
            break;
        case LogType.WARN:
            console.warn(formattedMsg);
            break;
        default:
            console.log(formattedMsg);
            break;
    }

    // 2. ZAPIS V DATOTEKO
    const fileName = getDateForFile();
    const filePath = path.join(LOGS_DIR, fileName);

    // appendFile doda vsebino na konec datoteke, če ne obstaja, jo ustvari
    fs.appendFile(filePath, formattedMsg + '\n', (err) => {
        if (err) {
            console.error(`[${ts}] [ERROR] Neuspešno pisanje v log datoteko: ${err.message}`);
        }
    });
};

module.exports = {
    log,
    LogType
};