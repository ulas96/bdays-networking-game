'use client';

import { useState, useEffect } from 'react';
import { User } from '@/lib/storage';
import { ApiService } from '@/lib/api-service';
import { NotificationManager } from '@/lib/notifications';

export default function Leaderboard() {
  const [leaderboardData, setLeaderboardData] = useState<Partial<User>[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load leaderboard data on component mount
    fetchLeaderboardData();
  }, []);

  const fetchLeaderboardData = async () => {
    setIsLoading(true);
    try {
      const data = await ApiService.getLeaderboard();
      setLeaderboardData(data);
    } catch (error) {
      console.error('Error fetching leaderboard data:', error);
      NotificationManager.error('Liderlik tablosu yüklenirken bir hata oluştu.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h2 className="text-xl font-semibold mb-4">Liderlik Tablosu</h2>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      ) : leaderboardData.length > 0 ? (
        <div className="space-y-2">
          {leaderboardData.map((user, index) => (
            <div 
              key={index} 
              className={`flex items-center p-3 rounded-md ${index < 3 ? 'bg-indigo-50' : 'bg-gray-50'}`}
            >
              <div className={`
                flex items-center justify-center w-8 h-8 rounded-full mr-3
                ${index === 0 ? 'bg-yellow-400 text-white' : 
                  index === 1 ? 'bg-gray-300 text-white' : 
                  index === 2 ? 'bg-amber-600 text-white' : 'bg-gray-200 text-gray-700'}
              `}>
                {index + 1}
              </div>
              <div className="flex-1">
                <p className="font-medium">{user.name}</p>
                {user.linkedin && (
                  <a 
                    href={user.linkedin} 
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
              <div className="font-bold text-indigo-600">
                {user.points} puan
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center p-4 bg-gray-50 rounded-md">
          <p className="text-gray-500">Henüz veri bulunmamaktadır</p>
        </div>
      )}
      
      <button
        onClick={fetchLeaderboardData}
        disabled={isLoading}
        className="mt-4 w-full py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors disabled:opacity-50"
      >
        Yenile
      </button>
    </div>
  );
} 