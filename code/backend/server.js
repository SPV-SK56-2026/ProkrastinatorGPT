'use strict';

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const pool = require('./db/db');

dotenv.config();

var router = require('./routes/routes');
var userRouter = require('./routes/userRoutes');
var promptRouter = require('./routes/promptRoutes');
var bugRouter = require('./routes/bugRoutes');

const app = express();

app.use(cors());
app.use(express.json());


app.use('/', router);
app.use('/users', userRouter);
app.use('/prompt', promptRouter);
app.use('/bug', bugRouter);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server runing on ${PORT}`);
});
