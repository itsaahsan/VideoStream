const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');

router.get('/:userId', userController.getUserProfile);
router.get('/:userId/videos', userController.getUserVideos);

module.exports = router;
