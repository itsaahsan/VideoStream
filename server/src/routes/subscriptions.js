const express = require('express');
const router = express.Router();
const subscriptionController = require('../controllers/subscriptionController');
const auth = require('../middleware/auth');

router.post('/subscribe', auth, subscriptionController.subscribe);
router.post('/unsubscribe', auth, subscriptionController.unsubscribe);
router.get('/my-subscriptions', auth, subscriptionController.getSubscriptions);
router.get('/subscribers/:userId', subscriptionController.getSubscribers);
router.get('/check/:channelId', auth, subscriptionController.checkSubscription);

module.exports = router;
