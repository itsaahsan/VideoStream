import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../hooks/useAuth';
import VideoPlayer from '../components/VideoPlayer';

const Watch = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [video, setVideo] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(0);

  useEffect(() => {
    fetchVideo();
    fetchComments();
    incrementView();
  }, [id]);

  const fetchVideo = async () => {
    try {
      const { data } = await API.get(`/videos/${id}`);
      setVideo(data.video);
      setLikes(data.video.likes?.length || 0);
      if (user) {
        setLiked(data.video.likes?.includes(user.id));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const { data } = await API.get(`/comments/video/${id}`);
      setComments(data.comments);
    } catch (err) {
      console.error(err);
    }
  };

  const incrementView = async () => {
    try {
      await API.post(`/videos/${id}/view`);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLike = async () => {
    if (!user) return;

    try {
      const { data } = await API.post(`/videos/${id}/like`);
      setLiked(data.isLiked);
      setLikes(data.likes);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!user || !commentText.trim()) return;

    try {
      await API.post('/comments', {
        videoId: id,
        text: commentText
      });
      setCommentText('');
      fetchComments();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCommentDelete = async (commentId) => {
    try {
      await API.delete(`/comments/${commentId}`);
      fetchComments();
    } catch (err) {
      console.error(err);
    }
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

  if (loading) {
    return <div style={styles.loading}>Loading...</div>;
  }

  if (!video) {
    return <div style={styles.error}>Video not found</div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.playerSection}>
        {video.status === 'ready' && video.hlsUrl ? (
          <VideoPlayer
            src={video.hlsUrl}
            poster={video.thumbnail}
          />
        ) : (
          <div style={styles.processing}>
            <p>Video is being processed. Please check back later.</p>
          </div>
        )}

        <div style={styles.videoInfo}>
          <h1 style={styles.title}>{video.title}</h1>

          <div style={styles.stats}>
            <span>{formatViews(video.views)} views</span>
            <span> • </span>
            <span>{timeAgo(video.createdAt)}</span>

            <button
              onClick={handleLike}
              disabled={!user}
              style={{
                ...styles.likeButton,
                ...(liked ? styles.likeButtonActive : {})
              }}
            >
              {liked ? '👍' : '👍'} {likes}
            </button>
          </div>

          <div style={styles.uploader}>
            <Link to={`/profile/${video.uploader._id}`} style={styles.uploaderLink}>
              <strong>{video.uploader.username}</strong>
            </Link>
            {video.uploader.bio && <p style={styles.bio}>{video.uploader.bio}</p>}
          </div>

          {video.description && (
            <div style={styles.description}>
              <p>{video.description}</p>
            </div>
          )}

          {video.tags && video.tags.length > 0 && (
            <div style={styles.tags}>
              {video.tags.map((tag, index) => (
                <span key={index} style={styles.tag}>#{tag}</span>
              ))}
            </div>
          )}
        </div>

        <div style={styles.commentsSection}>
          <h3 style={styles.commentsTitle}>{comments.length} Comments</h3>

          {user && (
            <form onSubmit={handleCommentSubmit} style={styles.commentForm}>
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Add a comment..."
                style={styles.commentInput}
                rows="3"
              />
              <button type="submit" style={styles.commentButton}>
                Comment
              </button>
            </form>
          )}

          <div style={styles.commentsList}>
            {comments.map(comment => (
              <div key={comment._id} style={styles.comment}>
                <div style={styles.commentHeader}>
                  <strong>{comment.user.username}</strong>
                  <span style={styles.commentTime}>{timeAgo(comment.createdAt)}</span>
                </div>
                <p style={styles.commentText}>{comment.text}</p>

                {comment.replies && comment.replies.length > 0 && (
                  <div style={styles.replies}>
                    {comment.replies.map(reply => (
                      <div key={reply._id} style={styles.reply}>
                        <div style={styles.commentHeader}>
                          <strong>{reply.user.username}</strong>
                          <span style={styles.commentTime}>{timeAgo(reply.createdAt)}</span>
                        </div>
                        <p style={styles.commentText}>{reply.text}</p>
                      </div>
                    ))}
                  </div>
                )}

                {user && user.id === comment.user._id && (
                  <button
                    onClick={() => handleCommentDelete(comment._id)}
                    style={styles.deleteButton}
                  >
                    Delete
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem 1rem'
  },
  playerSection: {
    maxWidth: '900px'
  },
  processing: {
    backgroundColor: '#f5f5f5',
    padding: '3rem',
    borderRadius: '8px',
    textAlign: 'center',
    color: '#666'
  },
  videoInfo: {
    marginTop: '1rem'
  },
  title: {
    fontSize: '1.5rem',
    marginBottom: '0.5rem'
  },
  stats: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    color: '#666',
    marginBottom: '1rem'
  },
  likeButton: {
    marginLeft: 'auto',
    backgroundColor: '#f0f0f0',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '20px',
    cursor: 'pointer',
    fontSize: '0.9rem'
  },
  likeButtonActive: {
    backgroundColor: '#e74c3c',
    color: 'white'
  },
  uploader: {
    padding: '1rem',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    marginBottom: '1rem'
  },
  uploaderLink: {
    textDecoration: 'none',
    color: '#333'
  },
  bio: {
    marginTop: '0.5rem',
    color: '#666',
    fontSize: '0.9rem'
  },
  description: {
    padding: '1rem',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    marginBottom: '1rem',
    whiteSpace: 'pre-wrap'
  },
  tags: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.5rem',
    marginBottom: '2rem'
  },
  tag: {
    backgroundColor: '#e0e0e0',
    padding: '0.25rem 0.75rem',
    borderRadius: '15px',
    fontSize: '0.85rem',
    color: '#555'
  },
  commentsSection: {
    marginTop: '2rem',
    borderTop: '1px solid #ddd',
    paddingTop: '2rem'
  },
  commentsTitle: {
    marginBottom: '1.5rem'
  },
  commentForm: {
    marginBottom: '2rem'
  },
  commentInput: {
    width: '100%',
    padding: '0.75rem',
    border: '1px solid #ddd',
    borderRadius: '5px',
    fontSize: '0.9rem',
    fontFamily: 'inherit',
    marginBottom: '0.5rem',
    resize: 'vertical'
  },
  commentButton: {
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    padding: '0.5rem 1.5rem',
    borderRadius: '5px',
    cursor: 'pointer'
  },
  commentsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem'
  },
  comment: {
    padding: '1rem',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px'
  },
  commentHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '0.5rem'
  },
  commentTime: {
    fontSize: '0.85rem',
    color: '#999'
  },
  commentText: {
    marginBottom: '0.5rem'
  },
  replies: {
    marginTop: '1rem',
    marginLeft: '2rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  reply: {
    padding: '0.75rem',
    backgroundColor: '#fff',
    borderRadius: '8px'
  },
  deleteButton: {
    backgroundColor: 'transparent',
    color: '#c33',
    border: 'none',
    padding: '0.25rem 0.5rem',
    cursor: 'pointer',
    fontSize: '0.85rem'
  },
  loading: {
    textAlign: 'center',
    padding: '3rem',
    fontSize: '1.1rem',
    color: '#666'
  },
  error: {
    textAlign: 'center',
    padding: '3rem',
    fontSize: '1.1rem',
    color: '#c33'
  }
};

export default Watch;
