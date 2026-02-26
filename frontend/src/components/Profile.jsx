import React, { useEffect, useState } from 'react';
import { getMyInfo } from '../services/authService';
import './Profile.css';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Token bulunamadı, lütfen giriş yap.');
        setLoading(false);
        return;
      }

      try {
        const data = await getMyInfo(token);
        setUser(data);
      } catch (err) {
        setError('Oturum süresi dolmuş veya geçersiz token.');
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const formatExpiry = (exp) => {
    if (!exp) return 'Bilinmiyor';
    const date = new Date(exp * 1000);
    return date.toLocaleString('tr-TR');
  };

  const getInitials = (username) => {
    return username ? username.substring(0, 2).toUpperCase() : '??';
  };

  if (loading) {
    return (
      <div className="glass-card profile-loading">
        <div className="cyber-loader">
          <span></span><span></span><span></span>
        </div>
        <p>Profil yükleniyor...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-card profile-error">
        <div className="cyber-message error">
          ⚠ {error}
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div>
      {/* Profile Header */}
      <div className="glass-card profile-header-card">
        <div className="profile-header">
          <div className="profile-avatar">
            {getInitials(user.username)}
          </div>
          <div className="profile-info">
            <h2>@{user.username}</h2>
            <p>🔒 Güvenli Oturum Aktif</p>
          </div>
        </div>
      </div>

      {/* Security Status Grid */}
      <div className="security-grid">
        <div className="security-item">
          <div className="security-icon">🛡️</div>
          <div className="security-label">Kimlik Doğrulama</div>
          <div className="security-value">JWT Token</div>
        </div>
        
        <div className="security-item">
          <div className="security-icon">🔐</div>
          <div className="security-label">Şifreleme</div>
          <div className="security-value">HS256</div>
        </div>
        
        <div className="security-item">
          <div className="security-icon">⚡</div>
          <div className="security-label">Rate Limit</div>
          <div className="security-value">5/dk</div>
        </div>
        
        <div className="security-item">
          <div className="security-icon">📦</div>
          <div className="security-label">Veritabanı</div>
          <div className="security-value">MongoDB</div>
        </div>
      </div>

      {/* Token Info */}
      <div className="token-section">
        <h4 className="token-section-title">🔑 Token Bilgileri</h4>
        <div className="token-display">
          <div className="token-display-row">
            <strong>Subject:</strong> {user.details?.sub || user.username}
          </div>
          <div className="token-display-row">
            <strong>Son Kullanma:</strong> {formatExpiry(user.details?.exp)}
          </div>
          <div className="token-display-row">
            <strong>Algoritma:</strong> {user.details?.alg || 'HS256'}
          </div>
        </div>
      </div>

      {/* Raw Token Display */}
      <div className="glass-card token-card">
        <h4 className="token-card-title">
          📄 Ham Token (İlk 50 karakter)
        </h4>
        <div className="token-display">
          {localStorage.getItem('token')?.substring(0, 50)}...
        </div>
        <p className="token-note">
          Bu bilgiler doğrudan bulletproof Backend'den JWT doğrulaması ile geldi.
        </p>
      </div>
    </div>
  );
};

export default Profile;