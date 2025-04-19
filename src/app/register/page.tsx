'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { User, StorageManager } from '@/lib/storage';
import { NotificationManager } from '@/lib/notifications';
import { ApiService } from '@/lib/api-service';

export default function Register() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    linkedin: ''
  });
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    phone: '',
    linkedin: ''
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

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Ad Soyad gerekli';
      valid = false;
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'E-posta adresi gerekli';
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Geçerli bir e-posta adresi giriniz';
      valid = false;
    }

    // Phone validation (optional)
    if (formData.phone && !/^\+?[0-9]{10,15}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Geçerli bir telefon numarası giriniz';
      valid = false;
    }

    // LinkedIn validation (optional)
    if (formData.linkedin) {
      try {
        new URL(formData.linkedin);
      } catch (e) {
        newErrors.linkedin = 'Geçerli bir LinkedIn URL\'si giriniz';
        valid = false;
      }
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
      // Create user object
      const user: User = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone || undefined,
        linkedin: formData.linkedin || undefined,
        points: 0,
        friends: []
      };
      
      console.log("Attempting to register user:", user);
      
      // Register user with API
      const success = await ApiService.registerUser(user);
      
      console.log("Registration API response:", success);
      
      if (!success) {
        NotificationManager.error('Kayıt oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.');
        setIsLoading(false);
        return;
      }
      
      console.log("Attempting to login with:", user.email, user.name);
      // Try to login to get the full user details with ID
      const registeredUser = await ApiService.loginUser(user.email, user.name);
      
      console.log("Login response:", registeredUser);
      
      if (registeredUser) {
        // Save to local storage
        StorageManager.saveUser(registeredUser);
      } else {
        // If login fails, save the basic user info
        StorageManager.saveUser(user);
      }
      
      // Show success notification
      NotificationManager.success('Kaydınız başarıyla oluşturuldu!');
      
      // Redirect to home page
      router.push('/');
    } catch (error) {
      console.error('Registration error:', error);
      NotificationManager.error('Kayıt oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card max-w-xl">
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
        <h1 className="login-title">Blockchain Days'25</h1>
        <p className="login-subtitle">Networking etkinliğine kayıt olun</p>
        
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="name">
              Ad Soyad <span className="text-red-500">*</span>
            </label>
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
            <label className="form-label" htmlFor="email">
              E-posta <span className="text-red-500">*</span>
            </label>
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
          
          <div className="form-group">
            <label className="form-label" htmlFor="phone">
              Telefon Numarası (Opsiyonel)
            </label>
            <div className="flex items-center border rounded-md overflow-hidden">
              <span className="bg-gray-100 px-3 py-2 text-gray-600">+90</span>
              <input
                type="tel"
                id="phone"
                name="phone"
                className="flex-1 px-3 py-2 border-l"
                placeholder="5XX XXX XX XX"
                value={formData.phone}
                onChange={handleInputChange}
              />
            </div>
            {errors.phone && <p className="form-error">{errors.phone}</p>}
          </div>
          
          <div className="form-group">
            <label className="form-label" htmlFor="linkedin">
              LinkedIn Profili (Opsiyonel)
            </label>
            <input
              type="url"
              id="linkedin"
              name="linkedin"
              className={`form-input ${errors.linkedin ? 'border-red-500' : ''}`}
              placeholder="https://www.linkedin.com/in/kullaniciadi"
              value={formData.linkedin}
              onChange={handleInputChange}
            />
            {errors.linkedin && <p className="form-error">{errors.linkedin}</p>}
          </div>
          
          <button
            type="submit"
            className="w-full py-3 mt-6 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? 'Kaydınız yapılıyor...' : 'Kayıt Ol'}
          </button>
        </form>
      </div>
    </div>
  );
} 