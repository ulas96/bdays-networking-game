'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { StorageManager } from '@/lib/storage';
import RegistrationModal from '@/components/RegistrationModal';
import Profile from '@/components/Profile';
import FriendFinder from '@/components/FriendFinder';
import Leaderboard from '@/components/Leaderboard';
import { NotificationManager } from '@/lib/notifications';
import ServiceWorkerRegistration from './ServiceWorkerRegistration';

export default function Home() {
  const router = useRouter();
  const [isRegistered, setIsRegistered] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userPoints, setUserPoints] = useState(0);

  useEffect(() => {
    // Check if user is registered
    const registered = StorageManager.isRegistered();
    
    if (!registered) {
      // Redirect to login page if not registered
      router.push('/login');
      return;
    }
    
    setIsRegistered(registered);
    
    // Get user points
    const user = StorageManager.getUser();
    if (user) {
      setUserPoints(user.points);
    }
    
    setIsLoading(false);
  }, [router]);

  // Update when user registers
  const handleRegistration = () => {
    setIsRegistered(true);
    const user = StorageManager.getUser();
    if (user) {
      setUserPoints(user.points);
    }
  };

  // Handle logout
  const handleLogout = () => {
    if (window.confirm('Çıkış yapmak istediğinize emin misiniz?')) {
      StorageManager.clearAll();
      NotificationManager.success('Başarıyla çıkış yapıldı');
      router.push('/login');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <main>
      {/* Register Service Worker */}
      <ServiceWorkerRegistration />
      
      {/* Registration Modal */}
      <RegistrationModal 
        onRegister={handleRegistration} 
        isActive={!isRegistered}
      />
      
      {/* Main App */}
      <div className={isRegistered ? 'block' : 'hidden'}>
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center">
                <img 
                  src="/assets/images/bdays-logo.png" 
                  alt="BDays Logo" 
                  className="h-10 mr-2"
                />
                <h1 className="text-xl font-bold text-gray-800">Blockchain Days'25</h1>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded font-medium">
                  {userPoints} puan
                </div>
                <button 
                  onClick={handleLogout}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                >
                  Çıkış Yap
                </button>
              </div>
            </div>
          </div>
        </header>
        
        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <Profile />
            </div>
            
            <div className="space-y-8">
              <FriendFinder />
              <Leaderboard />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
