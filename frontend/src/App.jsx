import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { useState } from 'react';
import Login from './components/Login';
import Register from './components/Register';
import Profile from './components/Profile';
import MouseGlow from './components/MouseGlow';
import HackerIllustration from './components/HackerIllustration';
import './CyberStyles.css';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (x, y) => {
    setMousePos({ x, y });
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  return (
    <Router>
      <div className="app-container">
        <MouseGlow onMouseMove={handleMouseMove} />
        <HackerIllustration mouseX={mousePos.x} mouseY={mousePos.y} />
        
        <header className="cyber-header">
          <h1 className="cyber-title">
            <span className="shield-icon">🛡️</span> Bulletproof Security
          </h1>
          <p className="cyber-subtitle">Ultra Secure Authentication System</p>
        </header>

        {!token && (
          <nav className="nav-links">
            <Link to="/" className={`nav-link ${!token ? 'active' : ''}`}>
              Giriş Yap
            </Link>
            <Link to="/register" className="nav-link">
              Kayıt Ol
            </Link>
          </nav>
        )}

        <Routes>
          <Route path="/" element={
            !token ? (
              <Login onLoginSuccess={(newToken) => setToken(newToken)} />
            ) : (
              <div className="dashboard-container">
                <Profile />
                <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                  <button onClick={handleLogout} className="cyber-button danger">
                    🔒 Güvenli Çıkış
                  </button>
                </div>
              </div>
            )
          } />

          <Route path="/register" element={
            token ? <Navigate to="/" /> : <Register />
          } />

          <Route path="/login" element={
            token ? <Navigate to="/" /> : <Login onLoginSuccess={(newToken) => setToken(newToken)} />
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;