'use strict';

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const pool = require('./db/db');
const { log, LogType } = require('./utils/logger');

dotenv.config();

// Preverjanje povezave z bazo ob zagonu
pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        log(LogType.ERROR, `Povezava z bazo ni uspela: ${err.message}`);
    } else {
        log(LogType.SUCCESS, "Povezava s podatkovno bazo je aktivna.");
    }
});

const router = require('./routes/routes');
const userRouter = require('./routes/userRoutes');
const promptRouter = require('./routes/promptRoutes');
const bugRouter = require('./routes/bugRoutes');

const app = express();

app.use(cors());
app.use(express.json());

// Toggle za beleženje vseh vhodnih HTTP zahtevkov
const ENABLE_REQUEST_LOGGING = false;

// Pogojni middleware za beleženje zahtevkov
if (ENABLE_REQUEST_LOGGING) {
    app.use((req, res, next) => {
        log(LogType.INFO, `${req.method} zahtevek na ${req.url}`);
        next();
    });
}

app.use('/', router);
app.use('/users', userRouter);
app.use('/prompt', promptRouter);
app.use('/bug', bugRouter);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
    log(LogType.SUCCESS, `Strežnik ProkrastinatorGPT uspešno zagnan na vratih ${PORT}`);
});

server.on('error', (err) => {
    log(LogType.ERROR, `Kritična napaka strežnika: ${err.message}`);
});