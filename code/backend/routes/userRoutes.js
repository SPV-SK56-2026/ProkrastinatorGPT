var express = require('express');
var router = express.Router();
const auth = require('../middleware/auth');
var userController = require('../controllers/userController.js');

router.get('/register', userController.showRegister);
router.get('/login', userController.showLogin);
router.get('/profile', auth, userController.profile);
router.get('/logout', userController.logout);
router.get('/list', userController.list);
router.get('/:id', userController.show);
router.get('/profile', userController.profile);
router.get('/check', auth, userController.checkToken);


router.post('/', userController.create);
router.post('/login', userController.login);

router.put('/:id', auth, userController.update);

router.delete('/:id', auth, userController.remove);

module.exports = router;