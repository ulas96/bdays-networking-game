'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { StorageManager, User } from '@/lib/storage';
import { NotificationManager } from '@/lib/notifications';
import { ApiService } from '@/lib/api-service';

export default function Login() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });
  const [errors, setErrors] = useState({
    name: '',
    email: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    // Clear error when user types
    if (errors[name as keyof typeof errors]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = { ...errors };

    if (!formData.name.trim()) {
      newErrors.name = 'Ad Soyad gerekli';
      valid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = 'E-posta adresi gerekli';
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Geçerli bir e-posta adresi giriniz';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Login user with API
      const user = await ApiService.loginUser(formData.email, formData.name);
      
      if (!user) {
        NotificationManager.error('Kullanıcı bulunamadı veya bilgiler eşleşmiyor.');
        setIsLoading(false);
        return;
      }
      
      // Save to local storage
      StorageManager.saveUser(user);
      
      // Display success notification
      NotificationManager.success('Giriş başarılı!');
      
      // Redirect to home page
      router.push('/');
    } catch (error) {
      console.error('Login error:', error);
      NotificationManager.error('Giriş yapılırken bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <img 
          src="/assets/images/bdays-logo.png" 
          alt="Blockchain Days Logo" 
          className="login-logo"
        />
        <h1 className="login-title">Blockchain Days'25</h1>
        <p className="login-subtitle">Networking etkinliğine hoş geldiniz!</p>
        
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="name">Ad Soyad</label>
            <input
              type="text"
              id="name"
              name="name"
              className={`form-input ${errors.name ? 'border-red-500' : ''}`}
              placeholder="Adınız ve Soyadınız"
              value={formData.name}
              onChange={handleInputChange}
            />
            {errors.name && <p className="form-error">{errors.name}</p>}
          </div>
          
          <div className="form-group">
            <label className="form-label" htmlFor="email">E-posta</label>
            <input
              type="email"
              id="email"
              name="email"
              className={`form-input ${errors.email ? 'border-red-500' : ''}`}
              placeholder="ornek@email.com"
              value={formData.email}
              onChange={handleInputChange}
            />
            {errors.email && <p className="form-error">{errors.email}</p>}
          </div>
          
          <button
            type="submit"
            className="btn-login mt-6"
            disabled={isLoading}
          >
            {isLoading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
          </button>
        </form>
        
        <div className="divider">
          <span>veya</span>
        </div>
        
        <Link href="/register" className="btn-register">
          Hemen Kayıt Ol
        </Link>
      </div>
    </div>
  );
} 