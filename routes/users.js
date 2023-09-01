const router = require('express').Router();
const {
  getUsers, getUsersById, editUsers, editAvatar,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/:userId', getUsersById);
router.patch('/me', editUsers);
router.patch('/me/avatar', editAvatar);

module.exports = router;
