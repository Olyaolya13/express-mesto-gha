const router = require('express').Router();
const { login, createUsers } = require('../controllers/users');

router.post('/signin', login);
router.post('/signup', createUsers);

router.use('/users', require('./users'));
router.use('/cards', require('./cards'));

module.exports = router;
