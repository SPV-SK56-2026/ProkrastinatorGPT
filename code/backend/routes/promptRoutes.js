var express = require('express');
var router = express.Router();
var promptController = require('../controllers/promptController.js');


router.get('/', (req, res) => {
    res.json({ message: "ProkrastinatorGPT Prompt Routes API deluje!", status: "online" });
});

router.get('/:id', promptController.show);

router.post('/', promptController.create);

router.put('/:id', promptController.update);

router.delete('/:id', promptController.remove);

module.exports = router;