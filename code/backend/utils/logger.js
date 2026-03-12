// utils/logger.js

const LogType = Object.freeze({
    INFO: 'INFO',
    WARN: 'WARN',
    SUCCESS: 'SUCCESS',
    ERROR: 'ERROR'
});

const getTimestamp = () => new Date().toLocaleString('sl-SI');

const log = (type, message) => {
    const ts = getTimestamp();
    const formattedMsg = `${ts} | PGPT LOG: [${type}] ${message}`;

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
};

module.exports = {
    log,
    LogType
};