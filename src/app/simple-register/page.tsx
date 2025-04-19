'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { StorageManager } from '@/lib/storage';

export default function SimpleRegister() {
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
  const [apiResponse, setApiResponse] = useState<any>(null);

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

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setApiResponse(null);

    try {
      // Direct API call via our proxy
      const registerResponse = await fetch('/api/proxy/bdays-write-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone || '',
          linkedin: formData.linkedin || '',
        }),
      });
      
      // Get the response data regardless of status
      const registerData = await registerResponse.json();
      setApiResponse({
        status: registerResponse.status,
        data: registerData
      });
      
      if (!registerResponse.ok) {
        console.error('Registration failed:', registerData);
        setIsLoading(false);
        return;
      }
      
      // After successful registration, try to login
      const loginResponse = await fetch(`/api/proxy/bdays-read-user-by-email?email=${encodeURIComponent(formData.email)}`);
      
      if (!loginResponse.ok) {
        console.error('Login failed after registration');
        setIsLoading(false);
        return;
      }
      
      const userData = await loginResponse.json();
      
      // Store user data in localStorage
      StorageManager.saveUser({
        id: userData.id,
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        linkedin: userData.linkedin,
        points: userData.points || 0,
        friends: userData.friends || [],
      });
      
      // Success! Redirect to home page
      router.push('/');
    } catch (error) {
      console.error('Registration error:', error);
      setApiResponse({
        error: String(error)
      });
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
        <p className="login-subtitle">Basit Kayıt Sayfası (API Testi)</p>
        
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
        
        {apiResponse && (
          <div className="mt-4 p-4 bg-gray-100 rounded-md">
            <h3 className="text-lg font-semibold mb-2">API Yanıtı:</h3>
            <pre className="text-xs overflow-auto max-h-40 bg-black text-white p-2 rounded">
              {JSON.stringify(apiResponse, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
} 