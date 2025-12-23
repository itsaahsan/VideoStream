const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const fs = require('fs');

class TranscodingService {
  constructor() {
    this.outputDir = path.join(__dirname, '../../uploads/processed');
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }
  }

  getVideoDuration(filePath) {
    return new Promise((resolve, reject) => {
      ffmpeg.ffprobe(filePath, (err, metadata) => {
        if (err) return reject(err);
        resolve(metadata.format.duration);
      });
    });
  }

  generateThumbnail(inputPath, outputFileName) {
    return new Promise((resolve, reject) => {
      const thumbnailDir = path.join(__dirname, '../../uploads/thumbnails');
      if (!fs.existsSync(thumbnailDir)) {
        fs.mkdirSync(thumbnailDir, { recursive: true });
      }

      const outputPath = path.join(thumbnailDir, outputFileName + '.jpg');

      ffmpeg(inputPath)
        .screenshots({
          timestamps: ['10%'],
          filename: outputFileName + '.jpg',
          folder: thumbnailDir,
          size: '1280x720'
        })
        .on('end', () => resolve(outputPath))
        .on('error', (err) => reject(err));
    });
  }

  transcodeToHLS(inputPath, outputFileName) {
    return new Promise((resolve, reject) => {
      const hlsDir = path.join(this.outputDir, outputFileName);
      if (!fs.existsSync(hlsDir)) {
        fs.mkdirSync(hlsDir, { recursive: true });
      }

      const qualities = [
        { name: '1080p', width: 1920, height: 1080, bitrate: '5000k' },
        { name: '720p', width: 1280, height: 720, bitrate: '2800k' },
        { name: '480p', width: 854, height: 480, bitrate: '1400k' },
        { name: '360p', width: 640, height: 360, bitrate: '800k' }
      ];

      const transcodePromises = qualities.map(quality => {
        return new Promise((res, rej) => {
          const qualityDir = path.join(hlsDir, quality.name);
          if (!fs.existsSync(qualityDir)) {
            fs.mkdirSync(qualityDir, { recursive: true });
          }

          ffmpeg(inputPath)
            .outputOptions([
              '-c:v libx264',
              '-c:a aac',
              `-b:v ${quality.bitrate}`,
              '-b:a 128k',
              `-s ${quality.width}x${quality.height}`,
              '-start_number 0',
              '-hls_time 10',
              '-hls_list_size 0',
              '-f hls'
            ])
            .output(path.join(qualityDir, 'index.m3u8'))
            .on('end', () => res({ quality: quality.name, path: qualityDir }))
            .on('error', (err) => rej(err))
            .run();
        });
      });

      Promise.all(transcodePromises)
        .then(results => {
          const masterPlaylist = this.generateMasterPlaylist(results, outputFileName);
          fs.writeFileSync(path.join(hlsDir, 'master.m3u8'), masterPlaylist);
          resolve({ hlsDir, qualities: results });
        })
        .catch(reject);
    });
  }

  generateMasterPlaylist(qualities, fileName) {
    let playlist = '#EXTM3U\n#EXT-X-VERSION:3\n';

    const bandwidths = {
      '1080p': 5000000,
      '720p': 2800000,
      '480p': 1400000,
      '360p': 800000
    };

    qualities.forEach(q => {
      playlist += `#EXT-X-STREAM-INF:BANDWIDTH=${bandwidths[q.quality]},RESOLUTION=${this.getResolution(q.quality)}\n`;
      playlist += `${q.quality}/index.m3u8\n`;
    });

    return playlist;
  }

  getResolution(quality) {
    const resolutions = {
      '1080p': '1920x1080',
      '720p': '1280x720',
      '480p': '854x480',
      '360p': '640x360'
    };
    return resolutions[quality] || '1280x720';
  }

  cleanup(filePath) {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
}

module.exports = new TranscodingService();
