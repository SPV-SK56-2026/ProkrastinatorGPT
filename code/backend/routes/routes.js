var express = require('express');
var router = express.Router();
var userController = require('../controllers/userController.js');


router.get('/', (req, res) => {
    res.json({ message: "ProkrastinatorGPT API deluje!", status: "online" });
});

module.exports = router;