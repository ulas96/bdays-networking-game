import React from 'react';

const FriendsSection = ({ friends }) => (
  <div className="friends-section">
    <h3>Arkadaşlarım</h3>
    <div className="friends-container">
      {(!friends || friends.length === 0) ? (
        <div className="message">Henüz arkadaşınız bulunmamaktadır</div>
      ) : (
        friends.map((friend, i) => (
          <div key={i} className="friend-item">{friend.name}</div>
        ))
      )}
    </div>
  </div>
);

export default FriendsSection;
