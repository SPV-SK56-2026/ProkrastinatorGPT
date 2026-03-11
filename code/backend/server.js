const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
var router = require('./routes/routes');
var userRouter = require('./routes/userRoutes');
var promptRouter = require('./routes/promptRoutes');
var bugRouter = require('./routes/bugRoutes');

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Povezava na MongoDB (Docker uporablja ime servisa 'db')
const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/prokrastinator';
mongoose.connect(mongoUri)
    .then(() => console.log('Povezan na MongoDB!'))
    .catch(err => console.error('Napaka pri povezavi na DB:', err));

app.use('/', router);
app.use('/users', userRouter);
app.use('/prompt', promptRouter);
app.use('/bug', bugRouter);

const PORT = process.env.PORT || 5000;
