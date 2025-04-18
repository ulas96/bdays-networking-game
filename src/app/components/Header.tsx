import React from 'react';

const Header = ({ points, onLogout }) => (
  <header className="app-header">
    <div className="container">
      <div className="header-left">
        <img src={require('../assets/images/bdays-logo.png')} alt="BDays Logo" className="header-logo" />
        <h1>Blockchain Days'25</h1>
      </div>
      <div className="header-actions">
        <div className="user-score">
          <span>{points}</span> puan
        </div>
        <button className="btn btn-secondary" onClick={onLogout}>
          <span>Çıkış Yap</span>
        </button>
      </div>
    </div>
  </header>
);

export default Header;
