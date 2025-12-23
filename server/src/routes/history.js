const express = require('express');
const router = express.Router();
const historyController = require('../controllers/historyController');
const auth = require('../middleware/auth');

router.post('/', auth, historyController.addToHistory);
router.get('/', auth, historyController.getHistory);
router.delete('/clear', auth, historyController.clearHistory);
router.delete('/:videoId', auth, historyController.removeFromHistory);

module.exports = router;
