'use client';

import { useState } from 'react';
import { Friend, StorageManager, User } from '@/lib/storage';
import { ApiService } from '@/lib/api-service';
import { NotificationManager } from '@/lib/notifications';

export default function FriendFinder() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Friend[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) {
      NotificationManager.warning('Lütfen bir arama terimi girin.');
      return;
    }
    
    setIsLoading(true);
    setHasSearched(true);
    
    try {
      const results = await ApiService.searchUsers(searchQuery);
      setSearchResults(results);
    } catch (error) {
      console.error('Error searching for users:', error);
      NotificationManager.error('Arama sırasında bir hata oluştu.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConnect = async (friend: Friend) => {
    try {
      const currentUser = StorageManager.getUser();
      
      if (!currentUser || !currentUser.id || !friend.id) {
        NotificationManager.error('Kullanıcı bilgileri eksik, bağlantı kurulamadı.');
        return;
      }
      
      // Call API to connect with user
      const success = await ApiService.connectWithUser(currentUser, friend);
      
      if (success) {
        // Add friend to local storage
        StorageManager.addFriend(friend);
        
        // Update user's points
        const updatedPoints = currentUser.points + 50; // 50 points for each new connection
        StorageManager.updateUser({ points: updatedPoints });
        
        NotificationManager.success(`${friend.name} ile bağlantı kuruldu!`);
        
        // Refresh search results to update UI
        if (searchQuery.trim()) {
          const refreshedResults = await ApiService.searchUsers(searchQuery);
          setSearchResults(refreshedResults);
        }
      } else {
        NotificationManager.error('Bağlantı kurulurken bir hata oluştu.');
      }
    } catch (error) {
      console.error('Error connecting with user:', error);
      NotificationManager.error('Bağlantı kurulurken bir hata oluştu.');
    }
  };

  // Check if a user is already in friends list
  const isFriend = (email: string): boolean => {
    const currentUser = StorageManager.getUser();
    if (!currentUser || !currentUser.friends) return false;
    
    return currentUser.friends.some(friend => friend.email === email);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h2 className="text-xl font-semibold mb-4">Arkadaş Bul</h2>
      
      <form onSubmit={handleSearch} className="mb-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="İsim ile ara..."
            className="flex-1 px-3 py-2 border rounded-md"
            required
          />
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Aranıyor...' : 'Ara'}
          </button>
        </div>
      </form>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      ) : hasSearched ? (
        searchResults.length > 0 ? (
          <div className="space-y-3">
            {searchResults.map((result, index) => {
              const isUserFriend = isFriend(result.email);
              
              return (
                <div key={index} className="p-3 bg-gray-50 rounded-md">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-medium">{result.name}</p>
                      {isUserFriend && <p className="text-sm text-gray-600">{result.email}</p>}
                    </div>
                    {!isUserFriend && (
                      <button
                        onClick={() => handleConnect(result)}
                        className="px-3 py-1 text-sm bg-indigo-100 text-indigo-700 rounded hover:bg-indigo-200 transition-colors"
                      >
                        Bağlan
                      </button>
                    )}
                  </div>
                  
                  <div className="flex gap-4 text-sm">
                    {isUserFriend && result.phone && (
                      <p>
                        <span className="text-gray-500">Telefon:</span> {result.phone}
                      </p>
                    )}
                    
                    {result.linkedin && (
                      <a 
                        href={result.linkedin} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-indigo-600 hover:underline flex items-center"
                      >
                        <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                        </svg>
                        LinkedIn
                      </a>
                    )}
                  </div>
                  
                  {isUserFriend && (
                    <div className="mt-2 text-xs bg-green-100 text-green-700 px-2 py-1 rounded inline-block">
                      ✓ Bağlantı kuruldu
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center p-4 bg-gray-50 rounded-md">
            <p className="text-gray-500">Arama sonucu bulunamadı.</p>
          </div>
        )
      ) : null}
    </div>
  );
} 