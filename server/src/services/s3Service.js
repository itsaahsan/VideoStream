const { s3 } = require('../config/aws');
const fs = require('fs');
const path = require('path');

class S3Service {
  async uploadFile(filePath, key, contentType = 'application/octet-stream') {
    const fileContent = fs.readFileSync(filePath);

    const params = {
      Bucket: process.env.AWS_S3_BUCKET,
      Key: key,
      Body: fileContent,
      ContentType: contentType
    };

    try {
      const result = await s3.upload(params).promise();
      return result.Location;
    } catch (error) {
      console.error('S3 upload error:', error);
      throw error;
    }
  }

  async uploadDirectory(dirPath, prefix) {
    const files = this.getAllFiles(dirPath);
    const uploadPromises = files.map(file => {
      const key = prefix + '/' + path.relative(dirPath, file).replace(/\\/g, '/');
      const contentType = this.getContentType(file);
      return this.uploadFile(file, key, contentType);
    });

    return Promise.all(uploadPromises);
  }

  getAllFiles(dirPath, arrayOfFiles = []) {
    const files = fs.readdirSync(dirPath);

    files.forEach(file => {
      const filePath = path.join(dirPath, file);
      if (fs.statSync(filePath).isDirectory()) {
        arrayOfFiles = this.getAllFiles(filePath, arrayOfFiles);
      } else {
        arrayOfFiles.push(filePath);
      }
    });

    return arrayOfFiles;
  }

  getContentType(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    const contentTypes = {
      '.m3u8': 'application/vnd.apple.mpegurl',
      '.ts': 'video/mp2t',
      '.mp4': 'video/mp4',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png'
    };
    return contentTypes[ext] || 'application/octet-stream';
  }

  getCloudFrontUrl(key) {
    if (process.env.AWS_CLOUDFRONT_URL) {
      return `${process.env.AWS_CLOUDFRONT_URL}/${key}`;
    }
    return `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
  }

  async deleteFile(key) {
    const params = {
      Bucket: process.env.AWS_S3_BUCKET,
      Key: key
    };

    try {
      await s3.deleteObject(params).promise();
    } catch (error) {
      console.error('S3 delete error:', error);
      throw error;
    }
  }
}

module.exports = new S3Service();
