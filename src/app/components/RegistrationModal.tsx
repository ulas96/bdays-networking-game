import React from 'react';

const RegistrationModal = ({ onRegister }) => (
  <div className="modal active">
    <div className="modal-content">
      <div className="modal-header">
        <h2>Blockchain Days'25'e Hoş Geldiniz</h2>
        <img src={require('../assets/images/bdays-logo.png')} alt="BDays Logo" className="modal-logo" />
      </div>
      <p className="modal-description">Etkinliğe katılmak için lütfen bilgilerinizi girin</p>
      <form id="registration-form" onSubmit={onRegister}>
        <div className="form-group">
          <label htmlFor="name">Ad Soyad <span className="required">*</span></label>
          <input type="text" id="name" placeholder="Adınız ve Soyadınız" required />
          <div className="error-message" />
        </div>
        <div className="form-group">
          <label htmlFor="email">E-posta <span className="required">*</span></label>
          <input type="email" id="email" placeholder="ornek@email.com" required />
          <div className="error-message" />
        </div>
        <div className="form-group">
          <label htmlFor="phone">Telefon Numarası (Opsiyonel)</label>
          <div className="phone-input-container">
            <span className="country-code">+90</span>
            <input type="tel" id="phone" placeholder="5XX XXX XX XX" />
          </div>
          <div className="error-message" />
        </div>
        <div className="form-group">
          <label htmlFor="linkedin">LinkedIn Profili (Opsiyonel)</label>
          <input type="url" id="linkedin" placeholder="https://linkedin.com/in/username" />
          <div className="error-message" />
        </div>
        <button type="submit" className="btn btn-primary">Kayıt Ol</button>
      </form>
    </div>
  </div>
);

export default RegistrationModal;
