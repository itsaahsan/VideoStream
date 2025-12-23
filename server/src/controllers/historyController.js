const WatchHistory = require('../models/WatchHistory');

exports.addToHistory = async (req, res) => {
  try {
    const { videoId, progress } = req.body;

    const existing = await WatchHistory.findOne({
      user: req.userId,
      video: videoId
    });

    if (existing) {
      existing.watchedAt = Date.now();
      existing.progress = progress || 0;
      await existing.save();
    } else {
      const history = new WatchHistory({
        user: req.userId,
        video: videoId,
        progress: progress || 0
      });
      await history.save();
    }

    res.json({ message: 'Added to history' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getHistory = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;

    const history = await WatchHistory.find({ user: req.userId })
      .populate({
        path: 'video',
        populate: { path: 'uploader', select: 'username avatar' }
      })
      .sort({ watchedAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await WatchHistory.countDocuments({ user: req.userId });

    res.json({
      history,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.clearHistory = async (req, res) => {
  try {
    await WatchHistory.deleteMany({ user: req.userId });
    res.json({ message: 'History cleared' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.removeFromHistory = async (req, res) => {
  try {
    const { videoId } = req.params;

    await WatchHistory.findOneAndDelete({
      user: req.userId,
      video: videoId
    });

    res.json({ message: 'Removed from history' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
