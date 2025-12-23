import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../hooks/useAuth';

const Playlists = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [playlists, setPlaylists] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [newPlaylistDesc, setNewPlaylistDesc] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchPlaylists();
  }, [user]);

  const fetchPlaylists = async () => {
    try {
      const { data } = await API.get('/playlists');
      setPlaylists(data.playlists);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePlaylist = async (e) => {
    e.preventDefault();

    try {
      await API.post('/playlists', {
        name: newPlaylistName,
        description: newPlaylistDesc
      });
      setNewPlaylistName('');
      setNewPlaylistDesc('');
      setShowCreateModal(false);
      fetchPlaylists();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeletePlaylist = async (playlistId) => {
    if (!confirm('Are you sure you want to delete this playlist?')) return;

    try {
      await API.delete(`/playlists/${playlistId}`);
      setPlaylists(playlists.filter(p => p._id !== playlistId));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>Loading playlists...</div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.heading}>My Playlists</h2>
        <button onClick={() => setShowCreateModal(true)} style={styles.createBtn}>
          Create Playlist
        </button>
      </div>

      {showCreateModal && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <h3 style={styles.modalTitle}>Create New Playlist</h3>
            <form onSubmit={handleCreatePlaylist} style={styles.form}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Name</label>
                <input
                  type="text"
                  value={newPlaylistName}
                  onChange={(e) => setNewPlaylistName(e.target.value)}
                  required
                  style={styles.input}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Description</label>
                <textarea
                  value={newPlaylistDesc}
                  onChange={(e) => setNewPlaylistDesc(e.target.value)}
                  rows="3"
                  style={styles.textarea}
                />
              </div>

              <div style={styles.modalActions}>
                <button type="button" onClick={() => setShowCreateModal(false)} style={styles.cancelBtn}>
                  Cancel
                </button>
                <button type="submit" style={styles.submitBtn}>
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {playlists.length === 0 ? (
        <div style={styles.empty}>
          <p>You haven't created any playlists yet</p>
        </div>
      ) : (
        <div style={styles.grid}>
          {playlists.map(playlist => (
            <div key={playlist._id} style={styles.card}>
              <Link to={`/playlist/${playlist._id}`} style={styles.cardLink}>
                <div style={styles.thumbnail}>
                  <div style={styles.placeholderThumb}>📝</div>
                </div>
                <div style={styles.playlistInfo}>
                  <h3 style={styles.playlistName}>{playlist.name}</h3>
                  {playlist.description && (
                    <p style={styles.description}>{playlist.description}</p>
                  )}
                  <p style={styles.videoCount}>{playlist.videos.length} videos</p>
                </div>
              </Link>
              <button
                onClick={() => handleDeletePlaylist(playlist._id)}
                style={styles.deleteBtn}
              >
                Delete
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
  createBtn: {
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    padding: '0.75rem 1.5rem',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '1rem'
  },
  modal: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000
  },
  modalContent: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '8px',
    width: '90%',
    maxWidth: '500px'
  },
  modalTitle: {
    marginBottom: '1.5rem',
    color: '#333'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  },
  label: {
    fontWeight: '500',
    color: '#555'
  },
  input: {
    padding: '0.75rem',
    border: '1px solid #ddd',
    borderRadius: '5px',
    fontSize: '1rem'
  },
  textarea: {
    padding: '0.75rem',
    border: '1px solid #ddd',
    borderRadius: '5px',
    fontSize: '1rem',
    fontFamily: 'inherit',
    resize: 'vertical'
  },
  modalActions: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'flex-end',
    marginTop: '1rem'
  },
  cancelBtn: {
    backgroundColor: '#95a5a6',
    color: 'white',
    border: 'none',
    padding: '0.75rem 1.5rem',
    borderRadius: '5px',
    cursor: 'pointer'
  },
  submitBtn: {
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    padding: '0.75rem 1.5rem',
    borderRadius: '5px',
    cursor: 'pointer'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '2rem'
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    overflow: 'hidden'
  },
  cardLink: {
    textDecoration: 'none',
    color: 'inherit',
    display: 'block'
  },
  thumbnail: {
    backgroundColor: '#f5f5f5',
    aspectRatio: '16/9',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  placeholderThumb: {
    fontSize: '4rem'
  },
  playlistInfo: {
    padding: '1rem'
  },
  playlistName: {
    fontSize: '1.1rem',
    marginBottom: '0.5rem',
    color: '#333'
  },
  description: {
    fontSize: '0.9rem',
    color: '#666',
    marginBottom: '0.5rem',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical'
  },
  videoCount: {
    fontSize: '0.85rem',
    color: '#999'
  },
  deleteBtn: {
    backgroundColor: 'transparent',
    color: '#c33',
    border: 'none',
    padding: '0.75rem',
    cursor: 'pointer',
    width: '100%',
    textAlign: 'center',
    borderTop: '1px solid #eee'
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

export default Playlists;
