import { Link } from 'react-router-dom';
import { PlayIcon, EyeIcon, VerifiedIcon, SettingsIcon } from './Icons';

const VideoCard = ({ video }) => {
  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatViews = (views) => {
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
    if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
    return views;
  };

  const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);

    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + ' years ago';

    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + ' months ago';

    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + ' days ago';

    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + ' hours ago';

    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + ' minutes ago';

    return Math.floor(seconds) + ' seconds ago';
  };

  return (
    <Link to={`/watch/${video._id}`} style={styles.card} className="video-card">
      <div style={styles.thumbnailContainer}>
        <img
          src={video.thumbnail || 'https://via.placeholder.com/320x180?text=Video'}
          alt={video.title}
          style={styles.thumbnail}
        />
        <div style={styles.overlay}>
          <div style={styles.playIcon}>
            <PlayIcon size={28} color="white" />
          </div>
        </div>
        {video.duration > 0 && (
          <span style={styles.duration}>{formatDuration(video.duration)}</span>
        )}
        {video.status === 'processing' && (
          <div style={styles.processingBadge}>
            <SettingsIcon size={14} color="white" />
            <span>Processing</span>
          </div>
        )}
      </div>

      <div style={styles.info}>
        <div style={styles.uploaderAvatar}>
          {video.uploader?.avatar ? (
            <img src={video.uploader.avatar} alt={video.uploader.username} style={styles.avatarImg} />
          ) : (
            <div style={styles.avatarPlaceholder}>
              {video.uploader?.username?.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        <div style={styles.details}>
          <h3 style={styles.title}>{video.title}</h3>

          <div style={styles.uploaderInfo}>
            <span style={styles.uploader}>{video.uploader?.username}</span>
            {video.uploader && <VerifiedIcon size={16} />}
          </div>

          <div style={styles.meta}>
            <span style={styles.metaItem}>
              <EyeIcon size={16} color="#b2bec3" />
              {formatViews(video.views)}
            </span>
            <span style={styles.metaDot}>•</span>
            <span style={styles.metaItem}>{timeAgo(video.createdAt)}</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        .video-card {
          animation: fadeIn 0.5s ease-out;
        }

        .video-card:hover {
          transform: translateY(-8px) scale(1.02);
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </Link>
  );
};

const styles = {
  card: {
    textDecoration: 'none',
    color: 'inherit',
    cursor: 'pointer',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    display: 'block',
    borderRadius: '16px',
    overflow: 'hidden',
    background: 'white',
    boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
    position: 'relative'
  },
  thumbnailContainer: {
    position: 'relative',
    width: '100%',
    paddingBottom: '56.25%',
    backgroundColor: '#f0f0f0',
    borderRadius: '16px 16px 0 0',
    overflow: 'hidden'
  },
  thumbnail: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.4s ease'
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%)',
    opacity: 0,
    transition: 'opacity 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  playIcon: {
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #ff4757 0%, #ff6348 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontSize: '1.5rem',
    fontWeight: 'bold',
    boxShadow: '0 4px 20px rgba(255,71,87,0.5)',
    transform: 'scale(0.8)',
    transition: 'transform 0.3s ease'
  },
  duration: {
    position: 'absolute',
    bottom: '12px',
    right: '12px',
    background: 'rgba(0,0,0,0.85)',
    backdropFilter: 'blur(8px)',
    color: 'white',
    padding: '4px 10px',
    borderRadius: '6px',
    fontSize: '0.75rem',
    fontWeight: '700',
    letterSpacing: '0.5px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
  },
  processingBadge: {
    position: 'absolute',
    top: '12px',
    left: '12px',
    background: 'linear-gradient(135deg, #5352ed 0%, #3742fa 100%)',
    color: 'white',
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '0.75rem',
    fontWeight: '600',
    boxShadow: '0 2px 8px rgba(83,82,237,0.4)',
    display: 'flex',
    alignItems: 'center',
    gap: '0.3rem'
  },
  info: {
    padding: '1rem',
    display: 'flex',
    gap: '0.75rem'
  },
  uploaderAvatar: {
    width: '36px',
    height: '36px',
    flexShrink: 0
  },
  avatarImg: {
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    objectFit: 'cover',
    border: '2px solid #f0f0f0'
  },
  avatarPlaceholder: {
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.9rem',
    fontWeight: '700',
    border: '2px solid #f0f0f0'
  },
  details: {
    flex: 1,
    minWidth: 0
  },
  title: {
    fontSize: '1rem',
    fontWeight: '700',
    marginBottom: '0.4rem',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    lineHeight: '1.4',
    color: '#2d3436',
    letterSpacing: '-0.3px'
  },
  uploaderInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    marginBottom: '0.4rem'
  },
  uploader: {
    fontSize: '0.85rem',
    color: '#636e72',
    fontWeight: '600'
  },
  meta: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.8rem',
    color: '#b2bec3'
  },
  metaItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.3rem'
  },
  metaDot: {
    color: '#dfe6e9'
  }
};

export default VideoCard;
