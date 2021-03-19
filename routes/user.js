const router = require('express').Router();
const {
  getAllUsers,
  getUser,
  createUser,
  validateUserId,
  updateProfile,
  updateAvatar,
} = require('../controllers/user');

router.get('/', getAllUsers);
router.get('/:userId', validateUserId, getUser);
router.post('/', createUser);
router.patch('/me', updateProfile); // валидация отключена, т.к. id прописан
router.patch('/me/avatar', updateAvatar); // аналогично

module.exports = router;
