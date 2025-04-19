'use client';

import { useState, useEffect } from 'react';
import { User, Friend, StorageManager } from '@/lib/storage';
import { NotificationManager } from '@/lib/notifications';
import { ApiService } from '@/lib/api-service';

export default function Profile() {
  const [user, setUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    linkedin: ''
  });

  useEffect(() => {
    // Load user data on component mount
    const userData = StorageManager.getUser();
    if (userData) {
      setUser(userData);
      setFormData({
        name: userData.name,
        email: userData.email,
        phone: userData.phone || '',
        linkedin: userData.linkedin || ''
      });
    }
  }, []);

  const refreshUserData = async () => {
    const userData = StorageManager.getUser();
    if (!userData || !userData.id) {
      return;
    }
    
    setIsRefreshing(true);
    
    try {
      const freshUserData = await ApiService.getUserById(userData.id);
      
      if (freshUserData) {
        setUser(freshUserData);
        StorageManager.saveUser(freshUserData);
        NotificationManager.success('Profil bilgileri güncellendi.');
      }
    } catch (error) {
      console.error('Error refreshing user data:', error);
      NotificationManager.error('Profil bilgileri güncellenirken bir hata oluştu.');
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    
    // Reset form data if canceling edit
    if (isEditing && user) {
      setFormData({
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        linkedin: user.linkedin || ''
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email) {
      NotificationManager.error('Ad ve e-posta alanları zorunludur.');
      return;
    }
    
    // Update user data
    if (user) {
      const updatedUser = {
        ...user,
        name: formData.name,
        email: formData.email,
        phone: formData.phone || undefined,
        linkedin: formData.linkedin || undefined
      };
      
      try {
        // If the user has an ID, try to update via API
        if (user.id) {
          // For now we don't have an update API, so just save locally
          // In a real app, you would call an API endpoint to update the user
        }
        
        StorageManager.updateUser(updatedUser);
        setUser(updatedUser);
        setIsEditing(false);
        NotificationManager.success('Profil bilgileriniz güncellendi.');
      } catch (error) {
        console.error('Error updating profile:', error);
        NotificationManager.error('Profil bilgileriniz güncellenirken bir hata oluştu.');
      }
    }
  };

  if (!user) {
    return <div className="flex justify-center items-center h-40">Yükleniyor...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Profil Bilgileri</h2>
        <div className="flex gap-2">
          <button 
            onClick={refreshUserData}
            disabled={isRefreshing}
            className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors disabled:opacity-50"
          >
            {isRefreshing ? 'Yenileniyor...' : 'Yenile'}
          </button>
          <button 
            onClick={handleEditToggle}
            className="px-3 py-1 text-sm bg-indigo-100 text-indigo-700 rounded hover:bg-indigo-200 transition-colors"
          >
            {isEditing ? 'İptal' : 'Düzenle'}
          </button>
        </div>
      </div>
      
      {isEditing ? (
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Ad Soyad</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>
          
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">E-posta</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>
          
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Telefon (Opsiyonel)</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
          
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">LinkedIn (Opsiyonel)</label>
            <input
              type="url"
              name="linkedin"
              value={formData.linkedin}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
          
          <button 
            type="submit"
            className="w-full py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            Kaydet
          </button>
        </form>
      ) : (
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-500">Ad Soyad</label>
            <p className="font-medium">{user.name}</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-500">E-posta</label>
            <p className="font-medium">{user.email}</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-500">Telefon</label>
            <p className="font-medium">{user.phone || '-'}</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-500">LinkedIn</label>
            {user.linkedin ? (
              <a 
                href={user.linkedin} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-blue-600 hover:text-blue-800 flex items-center mt-1"
              >
                <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
                Profili Görüntüle
              </a>
            ) : (
              <p>-</p>
            )}
          </div>
        </div>
      )}
      
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">Arkadaşlarım</h3>
        {user.friends.length > 0 ? (
          <div className="space-y-2">
            {user.friends.map((friend, index) => (
              <div key={index} className="p-3 bg-gray-50 rounded-md">
                <p className="font-medium">{friend.name}</p>
                <p className="text-sm text-gray-600">{friend.email}</p>
                {friend.linkedin && (
                  <a 
                    href={friend.linkedin} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-blue-600 hover:text-blue-800 text-sm flex items-center mt-1"
                  >
                    <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                    </svg>
                    LinkedIn
                  </a>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center p-4 bg-gray-50 rounded-md">
            <p className="text-gray-500">Henüz arkadaşınız bulunmamaktadır</p>
          </div>
        )}
      </div>
    </div>
  );
} 