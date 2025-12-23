import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Upload from './pages/Upload';
import Watch from './pages/Watch';
import Search from './pages/Search';
import Profile from './pages/Profile';
import History from './pages/History';
import Subscriptions from './pages/Subscriptions';
import Playlists from './pages/Playlists';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div style={styles.app}>
          <Navbar />
          <main style={styles.main}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/upload" element={<Upload />} />
              <Route path="/watch/:id" element={<Watch />} />
              <Route path="/search" element={<Search />} />
              <Route path="/profile/:userId" element={<Profile />} />
              <Route path="/history" element={<History />} />
              <Route path="/subscriptions" element={<Subscriptions />} />
              <Route path="/playlists" element={<Playlists />} />
            </Routes>
          </main>
        </div>
      </AuthProvider>
    </Router>
  );
}

const styles = {
  app: {
    minHeight: '100vh',
    backgroundColor: '#f5f5f5'
  },
  main: {
    minHeight: 'calc(100vh - 80px)'
  }
};

export default App;
