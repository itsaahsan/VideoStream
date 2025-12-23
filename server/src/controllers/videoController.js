const Video = require('../models/Video');
const transcodingService = require('../services/transcoding');
const s3Service = require('../services/s3Service');
const path = require('path');
const fs = require('fs');

exports.uploadVideo = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No video file provided' });
    }

    const { title, description, tags } = req.body;
    const videoPath = req.file.path;
    const fileName = req.file.filename;

    const duration = await transcodingService.getVideoDuration(videoPath);

    const video = new Video({
      title,
      description,
      uploader: req.userId,
      originalFileName: req.file.originalname,
      fileName,
      fileSize: req.file.size,
      duration,
      videoUrl: videoPath,
      tags: tags ? JSON.parse(tags) : [],
      status: 'processing'
    });

    await video.save();

    res.status(201).json({
      message: 'Video uploaded successfully. Processing started.',
      video
    });

    processVideo(video._id, videoPath, fileName).catch(console.error);

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: error.message });
  }
};

async function processVideo(videoId, videoPath, fileName) {
  try {
    const video = await Video.findById(videoId);
    if (!video) return;

    const baseFileName = path.parse(fileName).name;

    const thumbnailPath = await transcodingService.generateThumbnail(videoPath, baseFileName);

    const thumbnailKey = `thumbnails/${baseFileName}.jpg`;
    const thumbnailUrl = await s3Service.uploadFile(thumbnailPath, thumbnailKey, 'image/jpeg');

    video.thumbnail = s3Service.getCloudFrontUrl(thumbnailKey);

    const { hlsDir, qualities } = await transcodingService.transcodeToHLS(videoPath, baseFileName);

    const hlsPrefix = `videos/${baseFileName}`;
    await s3Service.uploadDirectory(hlsDir, hlsPrefix);

    video.hlsUrl = s3Service.getCloudFrontUrl(`${hlsPrefix}/master.m3u8`);
    video.qualities = qualities.map(q => ({
      quality: q.quality,
      url: s3Service.getCloudFrontUrl(`${hlsPrefix}/${q.quality}/index.m3u8`)
    }));
    video.status = 'ready';

    await video.save();

    transcodingService.cleanup(videoPath);
    transcodingService.cleanup(thumbnailPath);
    if (fs.existsSync(hlsDir)) {
      fs.rmSync(hlsDir, { recursive: true, force: true });
    }

    console.log(`Video ${videoId} processed successfully`);
  } catch (error) {
    console.error('Processing error:', error);
    const video = await Video.findById(videoId);
    if (video) {
      video.status = 'failed';
      await video.save();
    }
  }
}

exports.getVideos = async (req, res) => {
  try {
    const { page = 1, limit = 20, search, userId } = req.query;
    const query = { status: 'ready' };

    if (search) {
      query.$text = { $search: search };
    }

    if (userId) {
      query.uploader = userId;
    }

    const videos = await Video.find(query)
      .populate('uploader', 'username avatar')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Video.countDocuments(query);

    res.json({
      videos,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getVideoById = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id)
      .populate('uploader', 'username avatar bio');

    if (!video) {
      return res.status(404).json({ error: 'Video not found' });
    }

    res.json({ video });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateVideo = async (req, res) => {
  try {
    const { title, description, tags } = req.body;
    const video = await Video.findById(req.params.id);

    if (!video) {
      return res.status(404).json({ error: 'Video not found' });
    }

    if (video.uploader.toString() !== req.userId.toString()) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    if (title) video.title = title;
    if (description !== undefined) video.description = description;
    if (tags) video.tags = tags;

    await video.save();

    res.json({ video });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);

    if (!video) {
      return res.status(404).json({ error: 'Video not found' });
    }

    if (video.uploader.toString() !== req.userId.toString()) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    await Video.findByIdAndDelete(req.params.id);

    res.json({ message: 'Video deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.incrementViews = async (req, res) => {
  try {
    const video = await Video.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    );

    if (!video) {
      return res.status(404).json({ error: 'Video not found' });
    }

    res.json({ views: video.views });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.toggleLike = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);

    if (!video) {
      return res.status(404).json({ error: 'Video not found' });
    }

    const likeIndex = video.likes.indexOf(req.userId);

    if (likeIndex > -1) {
      video.likes.splice(likeIndex, 1);
    } else {
      video.likes.push(req.userId);
    }

    await video.save();

    res.json({ likes: video.likes.length, isLiked: likeIndex === -1 });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
