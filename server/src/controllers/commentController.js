const Comment = require('../models/Comment');

exports.createComment = async (req, res) => {
  try {
    const { videoId, text, parentCommentId } = req.body;

    const comment = new Comment({
      video: videoId,
      user: req.userId,
      text,
      parentComment: parentCommentId || null
    });

    await comment.save();
    await comment.populate('user', 'username avatar');

    res.status(201).json({ comment });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getComments = async (req, res) => {
  try {
    const { videoId } = req.params;
    const { page = 1, limit = 20 } = req.query;

    const comments = await Comment.find({
      video: videoId,
      parentComment: null
    })
      .populate('user', 'username avatar')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Comment.countDocuments({
      video: videoId,
      parentComment: null
    });

    for (let comment of comments) {
      const replies = await Comment.find({ parentComment: comment._id })
        .populate('user', 'username avatar')
        .sort({ createdAt: 1 });
      comment._doc.replies = replies;
    }

    res.json({
      comments,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateComment = async (req, res) => {
  try {
    const { text } = req.body;
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    if (comment.user.toString() !== req.userId.toString()) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    comment.text = text;
    await comment.save();

    res.json({ comment });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    if (comment.user.toString() !== req.userId.toString()) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    await Comment.deleteMany({ parentComment: comment._id });
    await Comment.findByIdAndDelete(req.params.id);

    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.toggleLike = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    const likeIndex = comment.likes.indexOf(req.userId);

    if (likeIndex > -1) {
      comment.likes.splice(likeIndex, 1);
    } else {
      comment.likes.push(req.userId);
    }

    await comment.save();

    res.json({ likes: comment.likes.length, isLiked: likeIndex === -1 });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
