import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../hooks/useAuth';

const Subscriptions = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchSubscriptions();
  }, [user]);

  const fetchSubscriptions = async () => {
    try {
      const { data } = await API.get('/subscriptions/my-subscriptions');
      setSubscriptions(data.subscriptions);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUnsubscribe = async (channelId) => {
    try {
      await API.post('/subscriptions/unsubscribe', { channelId });
      setSubscriptions(subscriptions.filter(sub => sub.subscribedTo._id !== channelId));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>Loading subscriptions...</div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>My Subscriptions</h2>

      {subscriptions.length === 0 ? (
        <div style={styles.empty}>
          <p>You haven't subscribed to any channels yet</p>
        </div>
      ) : (
        <div style={styles.grid}>
          {subscriptions.map(sub => (
            <div key={sub._id} style={styles.card}>
              <Link to={`/profile/${sub.subscribedTo._id}`} style={styles.cardLink}>
                <div style={styles.avatar}>
                  {sub.subscribedTo.avatar ? (
                    <img src={sub.subscribedTo.avatar} alt={sub.subscribedTo.username} style={styles.avatarImg} />
                  ) : (
                    <div style={styles.avatarPlaceholder}>
                      {sub.subscribedTo.username.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <h3 style={styles.channelName}>{sub.subscribedTo.username}</h3>
                {sub.subscribedTo.bio && (
                  <p style={styles.bio}>{sub.subscribedTo.bio}</p>
                )}
              </Link>
              <button
                onClick={() => handleUnsubscribe(sub.subscribedTo._id)}
                style={styles.unsubBtn}
              >
                Unsubscribe
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem 1rem'
  },
  heading: {
    marginBottom: '2rem',
    color: '#333'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '2rem'
  },
  card: {
    backgroundColor: 'white',
    padding: '1.5rem',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    textAlign: 'center'
  },
  cardLink: {
    textDecoration: 'none',
    color: 'inherit',
    display: 'block',
    marginBottom: '1rem'
  },
  avatar: {
    width: '80px',
    height: '80px',
    margin: '0 auto 1rem'
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
    fontSize: '2rem',
    fontWeight: 'bold'
  },
  channelName: {
    fontSize: '1.1rem',
    marginBottom: '0.5rem',
    color: '#333'
  },
  bio: {
    fontSize: '0.9rem',
    color: '#666',
    lineHeight: '1.4',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical'
  },
  unsubBtn: {
    backgroundColor: '#95a5a6',
    color: 'white',
    border: 'none',
    padding: '0.5rem 1.5rem',
    borderRadius: '5px',
    cursor: 'pointer',
    width: '100%'
  },
  loading: {
    textAlign: 'center',
    padding: '3rem',
    fontSize: '1.1rem',
    color: '#666'
  },
  empty: {
    textAlign: 'center',
    padding: '3rem',
    color: '#666'
  }
};

export default Subscriptions;
