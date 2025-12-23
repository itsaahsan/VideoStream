# 🎬 VideoStream - Professional Video Streaming Platform

A full-featured video streaming platform similar to YouTube/Twitch, built with modern web technologies. Upload, transcode, stream, and interact with videos seamlessly.

![VideoStream Platform](./client/public/streaming.png)

## ✨ Features

### 🎥 **Video Management**
- **Video Upload** with real-time progress tracking (up to 500MB)
- **Automatic Transcoding** using FFmpeg to multiple qualities (1080p, 720p, 480p, 360p)
- **HLS Adaptive Streaming** for smooth playback on any connection
- **Thumbnail Generation** automatically created from video
- **Video Processing Queue** with status tracking (processing/ready/failed)

### 📺 **Streaming & Playback**
- **Adaptive Quality Streaming** automatically adjusts based on bandwidth
- **HLS (HTTP Live Streaming)** protocol support
- **Video.js Player** with modern controls
- **Responsive Video Player** works on all devices
- **CloudFront CDN** integration for global delivery

### 👥 **User Features**
- **User Authentication** with JWT tokens
- **User Profiles** with avatar and bio
- **Subscription System** - subscribe to favorite channels
- **Watch History** - track what you've watched
- **Playlists** - create and manage video collections
- **Comments** - engage with video content (supports replies)
- **Likes** - on videos and comments

### 🔍 **Discovery**
- **Search Functionality** - find videos by title, description, or tags
- **Video Recommendations** based on popularity
- **Category Filtering** with tags
- **Trending Videos** section
- **User Channel Pages** with all their videos

### 🎨 **Modern UI/UX**
- **Beautiful Gradient Design** with purple and red color scheme
- **Glassmorphism Effects** with backdrop blur
- **Smooth Animations** and transitions
- **Hover Effects** on interactive elements
- **Responsive Design** - works perfectly on mobile, tablet, and desktop
- **Custom Icons** with SVG graphics
- **Loading States** with shimmer effects

## 🛠️ Tech Stack

### **Frontend**
- **React 18** - UI framework
- **Vite** - blazing fast build tool
- **React Router** - navigation
- **Axios** - HTTP client
- **Video.js** - video player
- **@videojs/http-streaming** - HLS support
- **CSS3** with CSS Variables and modern animations

### **Backend**
- **Node.js** - runtime environment
- **Express.js** - web framework
- **MongoDB** with Mongoose - database
- **JWT** - authentication
- **bcryptjs** - password hashing
- **Multer** - file upload handling
- **Fluent-FFmpeg** - video processing
- **AWS S3** - video storage
- **AWS CloudFront** - CDN delivery

## 📁 Project Structure

```
VideoStream/
├── client/                      # React frontend
│   ├── public/
│   │   └── streaming.png       # Logo and favicon
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js        # API configuration
│   │   ├── components/
│   │   │   ├── Icons.jsx       # SVG icon components
│   │   │   ├── Navbar.jsx      # Navigation bar
│   │   │   ├── VideoCard.jsx   # Video card component
│   │   │   └── VideoPlayer.jsx # Video player wrapper
│   │   ├── context/
│   │   │   └── AuthContext.jsx # Authentication context
│   │   ├── hooks/
│   │   │   └── useAuth.js      # Auth hook
│   │   ├── pages/
│   │   │   ├── Home.jsx        # Home page with video grid
│   │   │   ├── Watch.jsx       # Video watch page
│   │   │   ├── Upload.jsx      # Video upload page
│   │   │   ├── Profile.jsx     # User profile page
│   │   │   ├── Search.jsx      # Search results page
│   │   │   ├── History.jsx     # Watch history
│   │   │   ├── Subscriptions.jsx # Subscriptions page
│   │   │   ├── Playlists.jsx   # Playlists management
│   │   │   ├── Login.jsx       # Login page
│   │   │   └── Register.jsx    # Registration page
│   │   ├── App.jsx             # Main app component
│   │   ├── index.css           # Global styles
│   │   └── main.jsx            # Entry point
│   └── package.json
│
├── server/                      # Node.js backend
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.js     # MongoDB connection
│   │   │   └── aws.js          # AWS S3 configuration
│   │   ├── controllers/
│   │   │   ├── authController.js       # Authentication logic
│   │   │   ├── videoController.js      # Video management
│   │   │   ├── commentController.js    # Comments logic
│   │   │   ├── userController.js       # User profiles
│   │   │   ├── subscriptionController.js
│   │   │   ├── historyController.js
│   │   │   └── playlistController.js
│   │   ├── middleware/
│   │   │   ├── auth.js         # JWT authentication
│   │   │   └── upload.js       # Multer file upload
│   │   ├── models/
│   │   │   ├── User.js         # User schema
│   │   │   ├── Video.js        # Video schema
│   │   │   ├── Comment.js      # Comment schema
│   │   │   ├── Subscription.js # Subscription schema
│   │   │   ├── WatchHistory.js # Watch history schema
│   │   │   └── Playlist.js     # Playlist schema
│   │   ├── routes/
│   │   │   ├── auth.js         # Auth routes
│   │   │   ├── videos.js       # Video routes
│   │   │   ├── comments.js     # Comment routes
│   │   │   ├── users.js        # User routes
│   │   │   ├── subscriptions.js
│   │   │   ├── history.js
│   │   │   └── playlists.js
│   │   ├── services/
│   │   │   ├── transcoding.js  # FFmpeg video processing
│   │   │   └── s3Service.js    # AWS S3 operations
│   │   ├── app.js              # Express app setup
│   │   └── server.js           # Server entry point
│   ├── uploads/                # Temporary upload storage
│   ├── .env.example            # Environment variables template
│   └── package.json
│
├── .gitignore
├── check-setup.js              # Setup checker script
├── SETUP.txt                   # Detailed setup guide
└── README.md                   # This file
```

## 🚀 Getting Started

### Prerequisites

1. **Node.js** (v16 or higher)
   ```bash
   node --version  # Should be v16+
   ```

2. **MongoDB** (local or Atlas)
   - Local: Install from [mongodb.com](https://www.mongodb.com/try/download/community)
   - Cloud: Create free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

3. **FFmpeg** (required for video processing)
   - **Windows**: Download from [ffmpeg.org](https://ffmpeg.org/download.html)
   - **macOS**: `brew install ffmpeg`
   - **Linux**: `sudo apt-get install ffmpeg`

   Verify installation:
   ```bash
   ffmpeg -version
   ```

4. **AWS Account** (for S3 and CloudFront)
   - Create an S3 bucket
   - Set up CloudFront distribution (optional but recommended)
   - Create IAM user with S3 access
   - Get Access Key ID and Secret Access Key

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd VideoStream
   ```

2. **Install dependencies**
   ```bash
   # Install server dependencies
   cd server
   npm install

   # Install client dependencies
   cd ../client
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cd server
   cp .env.example .env
   ```

   Edit `.env` with your configuration:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/videostream
   JWT_SECRET=your-super-secret-jwt-key-change-this

   AWS_ACCESS_KEY_ID=your-aws-access-key
   AWS_SECRET_ACCESS_KEY=your-aws-secret-key
   AWS_REGION=us-east-1
   AWS_S3_BUCKET=your-bucket-name
   AWS_CLOUDFRONT_URL=https://your-cloudfront-url

   NODE_ENV=development
   ```

4. **Start MongoDB** (if using local installation)
   ```bash
   mongod
   ```

5. **Run the application**

   **Terminal 1** - Start backend:
   ```bash
   cd server
   npm run dev
   ```

   **Terminal 2** - Start frontend:
   ```bash
   cd client
   npm run dev
   ```

6. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000
   - Health Check: http://localhost:5000/health

### Quick Setup Checker

Run the setup checker to verify all prerequisites:
```bash
node check-setup.js
```

## 📖 Usage Guide

### For Users

1. **Register an Account**
   - Click "Sign Up" in the navbar
   - Enter username, email, and password
   - Automatically logged in after registration

2. **Upload a Video**
   - Click "Upload Video" button
   - Select video file (max 500MB)
   - Add title, description, and tags
   - Monitor upload progress
   - Video will be processed automatically

3. **Watch Videos**
   - Browse videos on home page
   - Click any video to watch
   - Player supports quality switching
   - View count updates automatically

4. **Interact with Content**
   - **Like videos** - Click the heart icon
   - **Comment** - Share your thoughts below videos
   - **Reply** - Respond to other comments
   - **Subscribe** - Follow your favorite creators

5. **Manage Your Content**
   - **Watch History** - View previously watched videos
   - **Playlists** - Create and organize video collections
   - **Subscriptions** - See channels you follow
   - **Profile** - View and edit your profile

### For Developers

#### API Endpoints

**Authentication**
```
POST   /api/auth/register        # Register new user
POST   /api/auth/login           # Login
GET    /api/auth/profile         # Get current user (requires auth)
PUT    /api/auth/profile         # Update profile (requires auth)
```

**Videos**
```
POST   /api/videos/upload        # Upload video (requires auth)
GET    /api/videos               # Get all videos (with pagination & search)
GET    /api/videos/:id           # Get video by ID
PUT    /api/videos/:id           # Update video (requires auth)
DELETE /api/videos/:id           # Delete video (requires auth)
POST   /api/videos/:id/view      # Increment view count
POST   /api/videos/:id/like      # Toggle like (requires auth)
```

**Comments**
```
POST   /api/comments             # Create comment (requires auth)
GET    /api/comments/video/:videoId  # Get comments for video
PUT    /api/comments/:id         # Update comment (requires auth)
DELETE /api/comments/:id         # Delete comment (requires auth)
POST   /api/comments/:id/like    # Toggle like (requires auth)
```

**Users**
```
GET    /api/users/:userId        # Get user profile
GET    /api/users/:userId/videos # Get user's videos
```

**Subscriptions**
```
POST   /api/subscriptions/subscribe     # Subscribe to channel
POST   /api/subscriptions/unsubscribe   # Unsubscribe
GET    /api/subscriptions/my-subscriptions  # Get subscriptions
GET    /api/subscriptions/subscribers/:userId # Get subscriber count
GET    /api/subscriptions/check/:channelId   # Check if subscribed
```

**Watch History**
```
POST   /api/history              # Add to history
GET    /api/history              # Get watch history
DELETE /api/history/clear        # Clear all history
DELETE /api/history/:videoId     # Remove from history
```

**Playlists**
```
POST   /api/playlists            # Create playlist
GET    /api/playlists            # Get user's playlists
GET    /api/playlists/:id        # Get playlist by ID
PUT    /api/playlists/:id        # Update playlist
DELETE /api/playlists/:id        # Delete playlist
POST   /api/playlists/:id/add-video        # Add video to playlist
DELETE /api/playlists/:id/remove-video/:videoId  # Remove from playlist
```

## 🎨 Customization

### Colors & Branding

Edit `client/src/index.css` to customize colors:
```css
:root {
  --primary-color: #ff4757;      /* Main brand color */
  --secondary-color: #2ed573;    /* Success/green */
  --accent-color: #5352ed;       /* Purple accent */
  /* ... more variables */
}
```

### Logo

Replace `client/public/streaming.png` with your own logo.

### Video Quality Settings

Edit `server/src/services/transcoding.js`:
```javascript
const qualities = [
  { name: '1080p', width: 1920, height: 1080, bitrate: '5000k' },
  { name: '720p', width: 1280, height: 720, bitrate: '2800k' },
  // Add or modify qualities
];
```

## 🔧 Advanced Configuration

### Production Deployment

1. **Build frontend**
   ```bash
   cd client
   npm run build
   ```

2. **Set environment to production**
   ```env
   NODE_ENV=production
   ```

3. **Use process manager**
   ```bash
   npm install -g pm2
   pm2 start server/src/server.js --name videostream
   ```

4. **Setup reverse proxy** (Nginx example)
   ```nginx
   server {
     listen 80;
     server_name yourdomain.com;

     location / {
       proxy_pass http://localhost:5173;
     }

     location /api {
       proxy_pass http://localhost:5000;
     }
   }
   ```

### Video Storage Options

**Local Storage** (Development)
- Videos stored in `server/uploads/`
- Good for testing, not recommended for production

**AWS S3** (Recommended)
- Scalable and reliable
- Configure in `.env`
- Automatic upload after transcoding

**Custom Storage**
- Implement custom storage service in `server/src/services/`

## 🐛 Troubleshooting

### FFmpeg not found
```bash
# Verify FFmpeg is installed
ffmpeg -version

# Add to PATH if needed (Windows)
setx PATH "%PATH%;C:\path\to\ffmpeg\bin"
```

### MongoDB connection error
```bash
# Check if MongoDB is running
mongod --version

# Start MongoDB service
# Windows: net start MongoDB
# Linux: sudo systemctl start mongod
# macOS: brew services start mongodb-community
```

### Video upload fails
- Check file size (max 500MB)
- Verify upload directory permissions
- Check AWS credentials if using S3

### Video not playing
- Ensure video status is 'ready'
- Verify HLS URL is accessible
- Check browser console for errors
- Confirm FFmpeg processing completed

## 📝 License

This project is open source and available under the MIT License.

## 👨‍💻 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- Email: your.email@example.com

## 🙏 Acknowledgments

- **FFmpeg** - Video processing
- **Video.js** - HTML5 video player
- **MongoDB** - Database
- **AWS** - Cloud services
- **React** - UI framework

## 🔮 Future Enhancements

- [ ] Live streaming support
- [ ] Video analytics dashboard
- [ ] Advanced video editor
- [ ] Mobile apps (React Native)
- [ ] AI-powered recommendations
- [ ] Content moderation tools
- [ ] Multi-language support
- [ ] Real-time notifications
- [ ] Video chapters/timestamps
- [ ] Screen recording feature

---

**Made with ❤️ and ☕** - Happy Streaming! 🎬
