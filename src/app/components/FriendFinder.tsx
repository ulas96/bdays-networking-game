import React, { useState } from 'react';

interface FriendFinderProps {
  onSearch: (query: string) => void;
  searchResults: any[];
}

const FriendFinder = ({ onSearch, searchResults }: FriendFinderProps) => {
  const [search, setSearch] = useState('');
  return (
    <div className="friend-finder-card">
      <h2>Arkadaş Bul</h2>
      <form className="search-form" onSubmit={e => { e.preventDefault(); onSearch(search); }}>
        <div className="search-container">
          <input
            type="text"
            placeholder="İsim ile ara..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            required
          />
          <button type="submit" className="btn btn-primary">Ara</button>
        </div>
      </form>
      <div className="search-results">
        {searchResults && searchResults.length > 0 ? (
          searchResults.map((user, i) => (
            <div key={i} className="search-result-item">{user.name}</div>
          ))
        ) : (
          <div className="message">Arama sonuçları buraya eklenecek</div>
        )}
      </div>
    </div>
  );
};

export default FriendFinder;
