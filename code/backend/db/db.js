'use strict';

const { Pool } = require('pg');
require('dotenv').config();
const { log, LogType } = require('../utils/logger'); // Uvoz tvojega loggerja

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// Zabeleži vsako novo povezavo v poolu
pool.on('connect', () => {
  log(LogType.INFO, 'Vzpostavljena nova povezava s PostgreSQL poolom.');
});

// Zabeleži kritične napake baze
pool.on('error', (err) => {
  log(LogType.ERROR, `Nepričakovana napaka PostgreSQL poola: ${err.message}`);
});

module.exports = pool;