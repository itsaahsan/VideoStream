import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../hooks/useAuth';
import VideoCard from '../components/VideoCard';

const History = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchHistory();
  }, [user]);

  const fetchHistory = async () => {
    try {
      const { data } = await API.get('/history');
      setHistory(data.history);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleClearHistory = async () => {
    if (!confirm('Are you sure you want to clear your watch history?')) return;

    try {
      await API.delete('/history/clear');
      setHistory([]);
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemove = async (videoId) => {
    try {
      await API.delete(`/history/${videoId}`);
      setHistory(history.filter(item => item.video._id !== videoId));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>Loading history...</div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.heading}>Watch History</h2>
        {history.length > 0 && (
          <button onClick={handleClearHistory} style={styles.clearBtn}>
            Clear History
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div style={styles.empty}>
          <p>Your watch history is empty</p>
        </div>
      ) : (
        <div style={styles.list}>
          {history.map(item => item.video && (
            <div key={item._id} style={styles.item}>
              <div style={styles.videoWrapper}>
                <VideoCard video={item.video} />
              </div>
              <button
                onClick={() => handleRemove(item.video._id)}
                style={styles.removeBtn}
              >
                Remove
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
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem'
  },
  heading: {
    color: '#333'
  },
  clearBtn: {
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    padding: '0.5rem 1.5rem',
    borderRadius: '5px',
    cursor: 'pointer'
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  item: {
    display: 'flex',
    gap: '1rem',
    alignItems: 'flex-start',
    backgroundColor: 'white',
    padding: '1rem',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  videoWrapper: {
    flex: 1
  },
  removeBtn: {
    backgroundColor: 'transparent',
    color: '#c33',
    border: '1px solid #c33',
    padding: '0.5rem 1rem',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '0.9rem'
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

export default History;
