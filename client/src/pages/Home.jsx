import { useState, useEffect } from 'react';
import API from '../api/axios';
import VideoCard from '../components/VideoCard';
import { useAuth } from '../hooks/useAuth';
import { VideoIcon, FilmIcon, CameraIcon } from '../components/Icons';

const Home = () => {
  const { user } = useAuth();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const { data } = await API.get('/videos');
      setVideos(data.videos);
    } catch (err) {
      setError('Failed to load videos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>
          <div className="spinner"></div>
          <p style={styles.loadingText}>Loading awesome videos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.error}>
          <span style={styles.errorIcon}>⚠️</span>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.wrapper}>
      {/* Hero Section */}
      {!user && (
        <div style={styles.hero}>
          <div style={styles.heroContent}>
            <h1 style={styles.heroTitle}>
              Welcome to <span style={styles.heroHighlight}>VideoStream</span>
            </h1>
            <p style={styles.heroSubtitle}>
              Discover, watch, and share amazing videos from creators around the world
            </p>
            <div style={styles.heroActions}>
              <a href="/register" style={styles.heroPrimaryBtn}>
                Get Started Free
              </a>
              <a href="/login" style={styles.heroSecondaryBtn}>
                Sign In
              </a>
            </div>
          </div>
          <div style={styles.heroDecoration}>
            <div style={styles.floatingCard1}>
              <VideoIcon size={60} color="rgba(255,255,255,0.4)" />
            </div>
            <div style={styles.floatingCard2}>
              <FilmIcon size={50} color="rgba(255,255,255,0.4)" />
            </div>
            <div style={styles.floatingCard3}>
              <CameraIcon size={45} color="rgba(255,255,255,0.4)" />
            </div>
          </div>
        </div>
      )}

      <div style={styles.container}>
        {videos.length === 0 ? (
          <div style={styles.empty}>
            <div style={styles.emptyIcon}>
              <VideoIcon size={80} color="#ddd" />
            </div>
            <h3 style={styles.emptyTitle}>No videos yet</h3>
            <p style={styles.emptyText}>Be the first to upload!</p>
            {user && (
              <a href="/upload" style={styles.uploadEmptyBtn}>
                Upload Your First Video
              </a>
            )}
          </div>
        ) : (
          <div style={styles.grid}>
            {videos.map(video => (
              <VideoCard key={video._id} video={video} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  wrapper: {
    minHeight: 'calc(100vh - 80px)'
  },
  hero: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '4rem 2rem',
    position: 'relative',
    overflow: 'hidden',
    marginBottom: '3rem'
  },
  heroContent: {
    maxWidth: '1200px',
    margin: '0 auto',
    textAlign: 'center',
    position: 'relative',
    zIndex: 2
  },
  heroTitle: {
    fontSize: '3.5rem',
    fontWeight: '900',
    color: 'white',
    marginBottom: '1.5rem',
    lineHeight: '1.2',
    letterSpacing: '-2px',
    textShadow: '0 4px 20px rgba(0,0,0,0.2)'
  },
  heroHighlight: {
    background: 'linear-gradient(135deg, #ff4757 0%, #ff6348 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    display: 'inline-block'
  },
  heroSubtitle: {
    fontSize: '1.25rem',
    color: 'rgba(255,255,255,0.9)',
    marginBottom: '2.5rem',
    maxWidth: '600px',
    margin: '0 auto 2.5rem'
  },
  heroActions: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center',
    flexWrap: 'wrap'
  },
  heroPrimaryBtn: {
    background: 'linear-gradient(135deg, #ff4757 0%, #ff6348 100%)',
    color: 'white',
    padding: '1rem 2.5rem',
    borderRadius: '30px',
    textDecoration: 'none',
    fontWeight: '700',
    fontSize: '1.1rem',
    boxShadow: '0 8px 24px rgba(255,71,87,0.4)',
    transition: 'all 0.3s ease',
    display: 'inline-block'
  },
  heroSecondaryBtn: {
    background: 'rgba(255,255,255,0.2)',
    color: 'white',
    padding: '1rem 2.5rem',
    borderRadius: '30px',
    textDecoration: 'none',
    fontWeight: '700',
    fontSize: '1.1rem',
    border: '2px solid rgba(255,255,255,0.3)',
    backdropFilter: 'blur(10px)',
    transition: 'all 0.3s ease',
    display: 'inline-block'
  },
  heroDecoration: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
    zIndex: 1
  },
  floatingCard1: {
    position: 'absolute',
    top: '10%',
    left: '10%',
    fontSize: '4rem',
    animation: 'float 6s ease-in-out infinite',
    opacity: 0.3
  },
  floatingCard2: {
    position: 'absolute',
    top: '60%',
    right: '15%',
    fontSize: '3.5rem',
    animation: 'float 7s ease-in-out infinite 1s',
    opacity: 0.3
  },
  floatingCard3: {
    position: 'absolute',
    bottom: '15%',
    left: '15%',
    fontSize: '3rem',
    animation: 'float 8s ease-in-out infinite 2s',
    opacity: 0.3
  },
  container: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '2rem'
  },
  sectionHeader: {
    textAlign: 'center',
    marginBottom: '3rem'
  },
  heading: {
    fontSize: '2.5rem',
    fontWeight: '800',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    marginBottom: '0.5rem',
    letterSpacing: '-1px'
  },
  subheading: {
    fontSize: '1.1rem',
    color: '#636e72',
    fontWeight: '500'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '2rem',
    animation: 'fadeIn 0.5s ease-out'
  },
  loading: {
    textAlign: 'center',
    padding: '5rem 2rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1.5rem'
  },
  loadingText: {
    fontSize: '1.2rem',
    color: '#636e72',
    fontWeight: '600'
  },
  error: {
    textAlign: 'center',
    padding: '3rem 2rem',
    backgroundColor: '#fff',
    borderRadius: '16px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    maxWidth: '500px',
    margin: '3rem auto'
  },
  errorIcon: {
    fontSize: '4rem',
    marginBottom: '1rem',
    display: 'block'
  },
  empty: {
    textAlign: 'center',
    padding: '5rem 2rem',
    backgroundColor: 'white',
    borderRadius: '20px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    maxWidth: '500px',
    margin: '0 auto'
  },
  emptyIcon: {
    fontSize: '5rem',
    marginBottom: '1.5rem',
    opacity: 0.5
  },
  emptyTitle: {
    fontSize: '1.8rem',
    fontWeight: '700',
    color: '#2d3436',
    marginBottom: '0.75rem'
  },
  emptyText: {
    fontSize: '1.1rem',
    color: '#636e72',
    marginBottom: '2rem'
  },
  uploadEmptyBtn: {
    background: 'linear-gradient(135deg, #ff4757 0%, #ff6348 100%)',
    color: 'white',
    padding: '0.875rem 2rem',
    borderRadius: '25px',
    textDecoration: 'none',
    fontWeight: '600',
    fontSize: '1rem',
    boxShadow: '0 4px 12px rgba(255,71,87,0.3)',
    display: 'inline-block',
    transition: 'all 0.3s ease'
  }
};

export default Home;
