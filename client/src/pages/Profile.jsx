import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../hooks/useAuth';
import VideoCard from '../components/VideoCard';

const Profile = () => {
  const { userId } = useParams();
  const { user: currentUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [videos, setVideos] = useState([]);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
    fetchUserVideos();
  }, [userId]);

  const fetchProfile = async () => {
    try {
      const { data } = await API.get(`/users/${userId}`);
      setProfile(data);
      setIsSubscribed(data.isSubscribed);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserVideos = async () => {
    try {
      const { data } = await API.get(`/users/${userId}/videos`);
      setVideos(data.videos);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubscribe = async () => {
    if (!currentUser) return;

    try {
      if (isSubscribed) {
        await API.post('/subscriptions/unsubscribe', { channelId: userId });
      } else {
        await API.post('/subscriptions/subscribe', { channelId: userId });
      }
      setIsSubscribed(!isSubscribed);
      fetchProfile();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>Loading profile...</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div style={styles.container}>
        <div style={styles.error}>User not found</div>
      </div>
    );
  }

  const isOwnProfile = currentUser && currentUser.id === userId;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.profileInfo}>
          <div style={styles.avatar}>
            {profile.user.avatar ? (
              <img src={profile.user.avatar} alt={profile.user.username} style={styles.avatarImg} />
            ) : (
              <div style={styles.avatarPlaceholder}>
                {profile.user.username.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          <div style={styles.details}>
            <h1 style={styles.username}>{profile.user.username}</h1>
            {profile.user.bio && <p style={styles.bio}>{profile.user.bio}</p>}

            <div style={styles.stats}>
              <span>{profile.videosCount} videos</span>
              <span> • </span>
              <span>{profile.subscribersCount} subscribers</span>
            </div>

            {!isOwnProfile && currentUser && (
              <button
                onClick={handleSubscribe}
                style={{
                  ...styles.subscribeBtn,
                  ...(isSubscribed ? styles.subscribedBtn : {})
                }}
              >
                {isSubscribed ? 'Subscribed' : 'Subscribe'}
              </button>
            )}
          </div>
        </div>
      </div>

      <div style={styles.videosSection}>
        <h2 style={styles.sectionTitle}>Videos</h2>

        {videos.length === 0 ? (
          <div style={styles.empty}>
            <p>No videos uploaded yet</p>
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
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem 1rem'
  },
  header: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '8px',
    marginBottom: '2rem',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  profileInfo: {
    display: 'flex',
    gap: '2rem',
    alignItems: 'flex-start'
  },
  avatar: {
    width: '120px',
    height: '120px',
    flexShrink: 0
  },
  avatarImg: {
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    objectFit: 'cover'
  },
  avatarPlaceholder: {
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    backgroundColor: '#e74c3c',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '3rem',
    fontWeight: 'bold'
  },
  details: {
    flex: 1
  },
  username: {
    fontSize: '2rem',
    marginBottom: '0.5rem',
    color: '#333'
  },
  bio: {
    color: '#666',
    marginBottom: '1rem',
    lineHeight: '1.5'
  },
  stats: {
    color: '#666',
    marginBottom: '1rem'
  },
  subscribeBtn: {
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    padding: '0.75rem 2rem',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: '600'
  },
  subscribedBtn: {
    backgroundColor: '#95a5a6'
  },
  videosSection: {
    marginTop: '2rem'
  },
  sectionTitle: {
    marginBottom: '1.5rem',
    color: '#333'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '2rem'
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
  },
  empty: {
    textAlign: 'center',
    padding: '3rem',
    color: '#666'
  }
};

export default Profile;
