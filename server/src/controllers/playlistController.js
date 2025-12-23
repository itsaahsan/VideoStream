const Playlist = require('../models/Playlist');

exports.createPlaylist = async (req, res) => {
  try {
    const { name, description, isPublic } = req.body;

    const playlist = new Playlist({
      name,
      description,
      user: req.userId,
      isPublic: isPublic !== undefined ? isPublic : true
    });

    await playlist.save();

    res.status(201).json({ playlist });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getPlaylists = async (req, res) => {
  try {
    const { userId } = req.query;
    const query = userId ? { user: userId } : { user: req.userId };

    const playlists = await Playlist.find(query)
      .populate('user', 'username avatar')
      .sort({ createdAt: -1 });

    res.json({ playlists });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getPlaylist = async (req, res) => {
  try {
    const playlist = await Playlist.findById(req.params.id)
      .populate('user', 'username avatar')
      .populate({
        path: 'videos',
        populate: { path: 'uploader', select: 'username avatar' }
      });

    if (!playlist) {
      return res.status(404).json({ error: 'Playlist not found' });
    }

    res.json({ playlist });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updatePlaylist = async (req, res) => {
  try {
    const { name, description, isPublic } = req.body;
    const playlist = await Playlist.findById(req.params.id);

    if (!playlist) {
      return res.status(404).json({ error: 'Playlist not found' });
    }

    if (playlist.user.toString() !== req.userId.toString()) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    if (name) playlist.name = name;
    if (description !== undefined) playlist.description = description;
    if (isPublic !== undefined) playlist.isPublic = isPublic;

    await playlist.save();

    res.json({ playlist });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deletePlaylist = async (req, res) => {
  try {
    const playlist = await Playlist.findById(req.params.id);

    if (!playlist) {
      return res.status(404).json({ error: 'Playlist not found' });
    }

    if (playlist.user.toString() !== req.userId.toString()) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    await Playlist.findByIdAndDelete(req.params.id);

    res.json({ message: 'Playlist deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.addVideoToPlaylist = async (req, res) => {
  try {
    const { videoId } = req.body;
    const playlist = await Playlist.findById(req.params.id);

    if (!playlist) {
      return res.status(404).json({ error: 'Playlist not found' });
    }

    if (playlist.user.toString() !== req.userId.toString()) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    if (playlist.videos.includes(videoId)) {
      return res.status(400).json({ error: 'Video already in playlist' });
    }

    playlist.videos.push(videoId);
    await playlist.save();

    res.json({ playlist });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.removeVideoFromPlaylist = async (req, res) => {
  try {
    const { videoId } = req.params;
    const playlist = await Playlist.findById(req.params.id);

    if (!playlist) {
      return res.status(404).json({ error: 'Playlist not found' });
    }

    if (playlist.user.toString() !== req.userId.toString()) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    playlist.videos = playlist.videos.filter(v => v.toString() !== videoId);
    await playlist.save();

    res.json({ playlist });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
