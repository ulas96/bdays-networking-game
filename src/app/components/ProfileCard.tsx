import React from 'react';

const ProfileCard = ({ user, onEdit }) => (
  <div className="profile-card">
    <div className="profile-header">
      <h2>Profil Bilgileri</h2>
      <button className="btn btn-secondary" onClick={onEdit}>Düzenle</button>
    </div>
    <div className="profile-info">
      <div className="info-group">
        <label>Ad Soyad</label>
        <p>{user?.name || ''}</p>
      </div>
      <div className="info-group">
        <label>E-posta</label>
        <p>{user?.email || ''}</p>
      </div>
      <div className="info-group">
        <label>Telefon</label>
        <p>{user?.phone || ''}</p>
      </div>
      <div className="info-group">
        <label>LinkedIn</label>
        {user?.linkedin ? (
          <a href={user.linkedin} target="_blank" rel="noopener noreferrer">Profili Görüntüle</a>
        ) : (
          <span>-</span>
        )}
      </div>
    </div>
  </div>
);

export default ProfileCard;
