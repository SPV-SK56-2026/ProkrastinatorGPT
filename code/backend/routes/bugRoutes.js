var express = require('express');
var router = express.Router();
var bugController = require('../controllers/bugController.js');


router.get('/', (req, res) => {
    res.json({ message: "ProkrastinatorGPT API Bug Rotes deluje!", status: "online" });
});

router.get('/:id', bugController.show);

router.post('/', bugController.create);

router.put('/:id', bugController.update);

router.delete('/:id', bugController.remove);

module.exports = router;