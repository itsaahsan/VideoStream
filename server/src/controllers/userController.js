const User = require('../models/User');
const Video = require('../models/Video');
const Subscription = require('../models/Subscription');

exports.getUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId || userId === 'undefined') {
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    const user = await User.findById(userId).select('-password');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const videosCount = await Video.countDocuments({ uploader: userId });
    const subscribersCount = await Subscription.countDocuments({ subscribedTo: userId });

    let isSubscribed = false;
    if (req.userId) {
      const subscription = await Subscription.findOne({
        subscriber: req.userId,
        subscribedTo: userId
      });
      isSubscribed = !!subscription;
    }

    res.json({
      user,
      videosCount,
      subscribersCount,
      isSubscribed
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUserVideos = async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 20 } = req.query;

    if (!userId || userId === 'undefined') {
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    const videos = await Video.find({ uploader: userId, status: 'ready' })
      .populate('uploader', 'username avatar')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Video.countDocuments({ uploader: userId, status: 'ready' });

    res.json({
      videos,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
