const express = require('express');
const router = express.Router();
const videoController = require('../controllers/videoController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

router.post('/upload', auth, upload.single('video'), videoController.uploadVideo);
router.get('/', videoController.getVideos);
router.get('/:id', videoController.getVideoById);
router.put('/:id', auth, videoController.updateVideo);
router.delete('/:id', auth, videoController.deleteVideo);
router.post('/:id/view', videoController.incrementViews);
router.post('/:id/like', auth, videoController.toggleLike);

module.exports = router;
