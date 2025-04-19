'use client';

import { useState } from 'react';
import { User, StorageManager } from '@/lib/storage';
import { NotificationManager } from '@/lib/notifications';

interface RegistrationModalProps {
  onRegister: () => void;
  isActive: boolean;
}

export default function RegistrationModal({ onRegister, isActive }: RegistrationModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    linkedin: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const validateForm = () => {
    // Basic validation
    if (!formData.name.trim()) {
      NotificationManager.error('Lütfen adınızı girin.');
      return false;
    }
    
    if (!formData.email.trim()) {
      NotificationManager.error('Lütfen e-posta adresinizi girin.');
      return false;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      NotificationManager.error('Lütfen geçerli bir e-posta adresi girin.');
      return false;
    }
    
    // Phone validation (optional field)
    if (formData.phone.trim()) {
      const phoneRegex = /^\+?[0-9]{10,15}$/;
      if (!phoneRegex.test(formData.phone.replace(/\s/g, ''))) {
        NotificationManager.error('Lütfen geçerli bir telefon numarası girin.');
        return false;
      }
    }
    
    // LinkedIn validation (optional field)
    if (formData.linkedin.trim()) {
      try {
        new URL(formData.linkedin);
      } catch (e) {
        NotificationManager.error('Lütfen geçerli bir LinkedIn URL\'si girin.');
        return false;
      }
    }
    
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    // Create user object
    const newUser: User = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone || undefined,
      linkedin: formData.linkedin || undefined,
      points: 0,
      friends: []
    };
    
    // Save to storage
    StorageManager.saveUser(newUser);
    
    // Show success notification
    NotificationManager.success('Kaydınız başarıyla tamamlandı!');
    
    // Call onRegister callback
    onRegister();
  };

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ${isActive ? 'block' : 'hidden'}`}>
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4 overflow-hidden">
        <div className="p-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Blockchain Days'25'e Hoş Geldiniz</h2>
            <img 
              src="/assets/images/bdays-logo.png" 
              alt="BDays Logo" 
              className="h-16 mx-auto my-4"
            />
            <p className="text-gray-600">Etkinliğe katılmak için lütfen bilgilerinizi girin</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Ad Soyad <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Adınız ve Soyadınız"
                className="w-full px-3 py-2 border rounded-md"
                required
              />
            </div>
            
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                E-posta <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="ornek@email.com"
                className="w-full px-3 py-2 border rounded-md"
                required
              />
            </div>
            
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Telefon Numarası (Opsiyonel)
              </label>
              <div className="flex items-center border rounded-md overflow-hidden">
                <span className="bg-gray-100 px-3 py-2 text-gray-600">+90</span>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="5XX XXX XX XX"
                  className="flex-1 px-3 py-2 border-l"
                />
              </div>
            </div>
            
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                LinkedIn Profili (Opsiyonel)
              </label>
              <input
                type="url"
                name="linkedin"
                value={formData.linkedin}
                onChange={handleInputChange}
                placeholder="https://linkedin.com/in/username"
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            
            <button
              type="submit"
              className="w-full py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
            >
              Kayıt Ol
            </button>
          </form>
        </div>
      </div>
    </div>
  );
} 