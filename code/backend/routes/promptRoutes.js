var express = require('express');
var router = express.Router();
var promptController = require('../controllers/promptController.js');

router.get('/', (req, res) => {
    res.json({ message: "ProkrastinatorGPT Prompt Routes API deluje!", status: "online" });
});

// 1. Dodaš novo pot tukaj (običajno je POST, če pošiljaš podatke za obdelavo)
router.post('/preprocess', promptController.preprocess);

// Poti s parametri naj bodo spodaj
router.get('/:id', promptController.show);
router.post('/', promptController.create);
router.put('/:id', promptController.update);
router.delete('/:id', promptController.remove);

module.exports = router;