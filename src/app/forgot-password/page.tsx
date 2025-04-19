'use client';

import { useState } from 'react';
import Link from 'next/link';
import { NotificationManager } from '@/lib/notifications';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('E-posta adresi gerekli');
      return;
    }

    if (!validateEmail(email)) {
      setError('Geçerli bir e-posta adresi giriniz');
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      // Show success message
      NotificationManager.success('Şifre sıfırlama talimatları e-posta adresinize gönderildi.');
      setIsSubmitted(true);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <Link href="/login" className="inline-block mb-6 text-left w-full">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-6 w-6 text-primary-600" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M10 19l-7-7m0 0l7-7m-7 7h18" 
            />
          </svg>
        </Link>
        
        <img 
          src="/assets/images/bdays-logo.png" 
          alt="Blockchain Days Logo" 
          className="login-logo"
        />
        <h1 className="login-title">Şifremi Unuttum</h1>
        <p className="login-subtitle">
          Şifrenizi sıfırlamak için e-posta adresinizi girin. Size bir sıfırlama bağlantısı göndereceğiz.
        </p>
        
        {isSubmitted ? (
          <div className="text-center">
            <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-md">
              Şifre sıfırlama talimatları <strong>{email}</strong> adresine gönderildi.
              <br />Lütfen e-posta kutunuzu kontrol edin.
            </div>
            
            <Link 
              href="/login" 
              className="inline-block px-4 py-2 text-primary-600 border border-primary-600 rounded-md hover:bg-primary-600 hover:text-white transition-colors"
            >
              Giriş sayfasına dön
            </Link>
          </div>
        ) : (
          <form className="login-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="email">E-posta</label>
              <input
                type="email"
                id="email"
                className={`form-input ${error ? 'border-red-500' : ''}`}
                placeholder="ornek@email.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError('');
                }}
              />
              {error && <p className="form-error">{error}</p>}
            </div>
            
            <button
              type="submit"
              className="btn-login mt-6"
              disabled={isLoading}
            >
              {isLoading ? 'Gönderiliyor...' : 'Şifre Sıfırlama Gönder'}
            </button>
            
            <div className="text-center mt-4">
              <Link href="/login" className="text-sm text-primary-600 hover:underline">
                Giriş sayfasına dön
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
} 