// Type definitions
export interface User {
  id?: string;
  name: string;
  email: string;
  phone?: string;
  linkedin?: string;
  points: number;
  friends: Friend[];
}

export interface Friend {
  id?: string;
  name: string;
  email: string;
  phone?: string;
  linkedin?: string;
}

// Storage keys
const STORAGE_KEYS = {
  USER: 'bd_user',
  REGISTERED: 'bd_registered',
};

export class StorageManager {
  // Check if the browser supports localStorage
  private static isStorageSupported(): boolean {
    try {
      const test = 'test';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (e) {
      return false;
    }
  }

  // Get user data
  static getUser(): User | null {
    if (!this.isStorageSupported()) return null;
    
    const userData = localStorage.getItem(STORAGE_KEYS.USER);
    return userData ? JSON.parse(userData) : null;
  }

  // Save user data
  static saveUser(user: User): void {
    if (!this.isStorageSupported()) return;
    
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    this.setRegistered(true);
  }

  // Update user data
  static updateUser(userData: Partial<User>): void {
    if (!this.isStorageSupported()) return;
    
    const currentUser = this.getUser();
    if (currentUser) {
      const updatedUser = { ...currentUser, ...userData };
      this.saveUser(updatedUser);
    }
  }

  // Check if user is registered
  static isRegistered(): boolean {
    if (!this.isStorageSupported()) return false;
    
    return localStorage.getItem(STORAGE_KEYS.REGISTERED) === 'true';
  }

  // Set registered status
  static setRegistered(status: boolean): void {
    if (!this.isStorageSupported()) return;
    
    localStorage.setItem(STORAGE_KEYS.REGISTERED, status.toString());
  }

  // Add friend to user's friend list
  static addFriend(friend: Friend): void {
    if (!this.isStorageSupported()) return;
    
    const user = this.getUser();
    if (user) {
      // Check if friend already exists
      const friendExists = user.friends.some(f => f.email === friend.email);
      
      if (!friendExists) {
        const updatedFriends = [...user.friends, friend];
        this.updateUser({ friends: updatedFriends });
      }
    }
  }

  // Clear all storage data
  static clearAll(): void {
    if (!this.isStorageSupported()) return;
    
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.REGISTERED);
  }
} 