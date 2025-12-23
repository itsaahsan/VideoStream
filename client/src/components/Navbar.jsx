import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { SearchIcon, HistoryIcon, PlaylistIcon, SubscriptionIcon, UploadIcon } from './Icons';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.container}>
        <Link to="/" style={styles.logoContainer}>
          <img src="/streaming.png" alt="VideoStream" style={styles.logoImage} />
          <span style={styles.logoText}>VideoStream</span>
        </Link>

        <form onSubmit={handleSearch} style={styles.searchForm}>
          <div style={styles.searchWrapper}>
            <span style={styles.searchIcon}>
              <SearchIcon size={20} color="#999" />
            </span>
            <input
              type="text"
              placeholder="Search videos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={styles.searchInput}
            />
          </div>
          <button type="submit" style={styles.searchBtn}>
            <SearchIcon size={18} color="white" />
            <span>Search</span>
          </button>
        </form>

        <div style={styles.actions}>
          {user ? (
            <>
              <Link to="/history" style={styles.iconBtn} title="Watch History">
                <HistoryIcon size={22} color="white" />
              </Link>
              <Link to="/playlists" style={styles.iconBtn} title="Playlists">
                <PlaylistIcon size={22} color="white" />
              </Link>
              <Link to="/subscriptions" style={styles.iconBtn} title="Subscriptions">
                <SubscriptionIcon size={22} color="white" />
              </Link>
              <Link to="/upload" style={styles.uploadBtn}>
                <UploadIcon size={20} color="white" />
                <span>Upload</span>
              </Link>
              <Link to={`/profile/${user.id}`} style={styles.profileBtn}>
                <div style={styles.avatar}>
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.username} style={styles.avatarImg} />
                  ) : (
                    <span>{user.username.charAt(0).toUpperCase()}</span>
                  )}
                </div>
                <span style={styles.username}>{user.username}</span>
              </Link>
              <button onClick={handleLogout} style={styles.logoutBtn}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={styles.loginBtn}>
                Login
              </Link>
              <Link to="/register" style={styles.registerBtn}>
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
    padding: '1rem 0',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    backdropFilter: 'blur(10px)'
  },
  container: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '0 2rem',
    display: 'flex',
    alignItems: 'center',
    gap: '2rem'
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    textDecoration: 'none',
    transition: 'all 0.3s ease'
  },
  logoImage: {
    width: '45px',
    height: '45px',
    objectFit: 'contain',
    filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))',
    transition: 'transform 0.3s ease'
  },
  logoText: {
    fontSize: '1.5rem',
    fontWeight: 800,
    background: 'linear-gradient(135deg, #fff 0%, #f0f0f0 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    letterSpacing: '-0.5px'
  },
  searchForm: {
    flex: 1,
    display: 'flex',
    gap: '0.75rem',
    maxWidth: '600px'
  },
  searchWrapper: {
    flex: 1,
    position: 'relative',
    display: 'flex',
    alignItems: 'center'
  },
  searchIcon: {
    position: 'absolute',
    left: '1rem',
    fontSize: '1.1rem',
    pointerEvents: 'none',
    opacity: 0.7
  },
  searchInput: {
    width: '100%',
    padding: '0.75rem 1rem 0.75rem 3rem',
    border: 'none',
    borderRadius: '25px',
    fontSize: '0.95rem',
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(10px)',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    transition: 'all 0.3s ease'
  },
  searchBtn: {
    background: 'linear-gradient(135deg, #ff4757 0%, #ff6348 100%)',
    color: 'white',
    border: 'none',
    padding: '0.75rem 2rem',
    borderRadius: '25px',
    cursor: 'pointer',
    fontWeight: 600,
    fontSize: '0.95rem',
    boxShadow: '0 4px 12px rgba(255,71,87,0.3)',
    transition: 'all 0.3s ease',
    whiteSpace: 'nowrap'
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem'
  },
  iconBtn: {
    width: '42px',
    height: '42px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(255, 255, 255, 0.15)',
    backdropFilter: 'blur(10px)',
    textDecoration: 'none',
    transition: 'all 0.3s ease',
    border: '2px solid rgba(255, 255, 255, 0.2)'
  },
  iconText: {
    fontSize: '1.2rem'
  },
  uploadBtn: {
    background: 'linear-gradient(135deg, #2ed573 0%, #26de81 100%)',
    color: 'white',
    border: 'none',
    padding: '0.65rem 1.5rem',
    borderRadius: '25px',
    cursor: 'pointer',
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontWeight: 600,
    fontSize: '0.95rem',
    boxShadow: '0 4px 12px rgba(46,213,115,0.3)',
    transition: 'all 0.3s ease',
    whiteSpace: 'nowrap'
  },
  profileBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    textDecoration: 'none',
    padding: '0.4rem 1rem 0.4rem 0.4rem',
    borderRadius: '25px',
    background: 'rgba(255, 255, 255, 0.15)',
    backdropFilter: 'blur(10px)',
    transition: 'all 0.3s ease',
    border: '2px solid rgba(255, 255, 255, 0.2)'
  },
  avatar: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #ff4757 0%, #ff6348 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontWeight: '700',
    fontSize: '0.9rem',
    overflow: 'hidden'
  },
  avatarImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },
  username: {
    color: 'white',
    fontWeight: 600,
    fontSize: '0.9rem'
  },
  logoutBtn: {
    background: 'rgba(255, 71, 87, 0.2)',
    color: 'white',
    border: '2px solid rgba(255, 71, 87, 0.4)',
    padding: '0.65rem 1.5rem',
    borderRadius: '25px',
    cursor: 'pointer',
    fontWeight: 600,
    fontSize: '0.9rem',
    transition: 'all 0.3s ease',
    backdropFilter: 'blur(10px)'
  },
  loginBtn: {
    color: 'white',
    textDecoration: 'none',
    padding: '0.65rem 1.5rem',
    borderRadius: '25px',
    fontWeight: 600,
    fontSize: '0.95rem',
    background: 'rgba(255, 255, 255, 0.15)',
    backdropFilter: 'blur(10px)',
    border: '2px solid rgba(255, 255, 255, 0.3)',
    transition: 'all 0.3s ease',
    display: 'inline-block'
  },
  registerBtn: {
    background: 'linear-gradient(135deg, #ff4757 0%, #ff6348 100%)',
    color: 'white',
    border: 'none',
    padding: '0.65rem 1.5rem',
    borderRadius: '25px',
    cursor: 'pointer',
    textDecoration: 'none',
    display: 'inline-block',
    fontWeight: 600,
    fontSize: '0.95rem',
    boxShadow: '0 4px 12px rgba(255,71,87,0.3)',
    transition: 'all 0.3s ease'
  }
};

export default Navbar;
