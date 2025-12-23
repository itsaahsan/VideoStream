const Subscription = require('../models/Subscription');
const User = require('../models/User');

exports.subscribe = async (req, res) => {
  try {
    const { channelId } = req.body;

    if (channelId === req.userId.toString()) {
      return res.status(400).json({ error: 'Cannot subscribe to yourself' });
    }

    const existingSub = await Subscription.findOne({
      subscriber: req.userId,
      subscribedTo: channelId
    });

    if (existingSub) {
      return res.status(400).json({ error: 'Already subscribed' });
    }

    const subscription = new Subscription({
      subscriber: req.userId,
      subscribedTo: channelId
    });

    await subscription.save();

    res.status(201).json({ message: 'Subscribed successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.unsubscribe = async (req, res) => {
  try {
    const { channelId } = req.body;

    await Subscription.findOneAndDelete({
      subscriber: req.userId,
      subscribedTo: channelId
    });

    res.json({ message: 'Unsubscribed successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getSubscriptions = async (req, res) => {
  try {
    const subscriptions = await Subscription.find({ subscriber: req.userId })
      .populate('subscribedTo', 'username avatar bio');

    res.json({ subscriptions });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getSubscribers = async (req, res) => {
  try {
    const { userId } = req.params;

    const count = await Subscription.countDocuments({ subscribedTo: userId });

    res.json({ count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.checkSubscription = async (req, res) => {
  try {
    const { channelId } = req.params;

    const subscription = await Subscription.findOne({
      subscriber: req.userId,
      subscribedTo: channelId
    });

    res.json({ isSubscribed: !!subscription });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
