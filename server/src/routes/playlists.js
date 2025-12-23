const express = require('express');
const router = express.Router();
const playlistController = require('../controllers/playlistController');
const auth = require('../middleware/auth');

router.post('/', auth, playlistController.createPlaylist);
router.get('/', auth, playlistController.getPlaylists);
router.get('/:id', playlistController.getPlaylist);
router.put('/:id', auth, playlistController.updatePlaylist);
router.delete('/:id', auth, playlistController.deletePlaylist);
router.post('/:id/add-video', auth, playlistController.addVideoToPlaylist);
router.delete('/:id/remove-video/:videoId', auth, playlistController.removeVideoFromPlaylist);

module.exports = router;
