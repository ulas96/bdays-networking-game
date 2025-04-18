import React from 'react';

const Leaderboard = ({ users }) => (
  <div className="leaderboard-card">
    <h2>Liderlik Tablosu</h2>
    <div className="leaderboard-list">
      {(!users || users.length === 0) ? (
        <div className="leaderboard-empty">
          <p>Henüz katılımcı bulunmuyor</p>
        </div>
      ) : (
        users.map((user, index) => (
          <div className="leaderboard-item" key={user.email || index} style={{ animationDelay: `${index * 0.1}s` }}>
            <span className={`rank ${index < 3 ? 'top-' + (index + 1) : ''}`}>#{index + 1}</span>
            <div className="user-info">
              <strong>{user.name}</strong>
              {user.linkedin && (
                <a href={user.linkedin} target="_blank" rel="noopener noreferrer" className="linkedin-link">
                  <span className="linkedin-icon"></span>
                </a>
              )}
            </div>
            <span className="points">{user.points} puan</span>
          </div>
        ))
      )}
    </div>
  </div>
);

export default Leaderboard;
