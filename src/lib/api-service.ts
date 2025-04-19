// Import types
import { User, Friend } from './storage';
import * as ApiFunctions from './api-functions';

// API endpoints (using local proxy to avoid CORS)
const API_ENDPOINTS = {
  WRITE_USER: '/api/proxy/bdays-write-user',
  READ_USER_BY_ID: '/api/proxy/bdays-read-user',
  READ_USER_BY_NAME: '/api/proxy/bdays-read-by-name',
  READ_USER_BY_EMAIL: '/api/proxy/bdays-read-user-by-email',
  ADD_FRIENDS: '/api/proxy/bdays-add-friends',
};

// Direct API endpoints (for server-side calls)
const DIRECT_API_ENDPOINTS = {
  WRITE_USER: 'https://b34fgpro7k.execute-api.eu-central-1.amazonaws.com/default/bdays-write-user',
  READ_USER_BY_ID: 'https://manxq01vdd.execute-api.eu-central-1.amazonaws.com/default/bdays-read-user',
  READ_USER_BY_NAME: 'https://waq6xksnbf.execute-api.eu-central-1.amazonaws.com/default/bdays-read-by-name',
  READ_USER_BY_EMAIL: 'https://3n3l9jzjlg.execute-api.eu-central-1.amazonaws.com/default/bdays-read-user-by-email',
  ADD_FRIENDS: 'https://jkrxhvqegh.execute-api.eu-central-1.amazonaws.com/default/bdays-add-friends',
};

export class ApiService {
  // Register a new user
  static async registerUser(user: User): Promise<boolean> {
    try {
      console.log('Sending registration request with data:', {
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        linkedin: user.linkedin || '',
      });
      
      const response = await ApiFunctions.setUser(
        user.name,
        user.email,
        user.phone || '',
        user.linkedin || ''
      );
      
      console.log('Registration response data:', response);
      
      // Check for error message in response data
      if (response && response.message && response.message.includes('Error')) {
        console.error('API returned error:', response.message);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error registering user:', error);
      return false;
    }
  }
  
  // Login user by email
  static async loginUser(email: string, name: string): Promise<User | null> {
    try {
      const data = await ApiFunctions.getUserByEmail(email);

      console.log('Login response data:', data);
      
      // Make sure data exists and name matches
      if (Array.isArray(data) && data.length > 0 && data[0].name && data[0].name.toLowerCase() === name.toLowerCase()) {
        return {
          id: data[0].id,
          name: data[0].name,
          email: data[0].email,
          phone: data[0].phone,
          linkedin: data[0].linkedin,
          points: data[0].points || 0,
          friends: data[0].friends || [],
        };
      } else if (data && !Array.isArray(data) && data.name && data.name.toLowerCase() === name.toLowerCase()) {
        // Fallback for non-array response
        return {
          id: data.id,
          name: data.name,
          email: data.email,
          phone: data.phone,
          linkedin: data.linkedin,
          points: data.points || 0,
          friends: data.friends || [],
        };
      }
      
      return null;
    } catch (error) {
      console.error('Error logging in user:', error);
      return null;
    }
  }
  
  // Search for users by name
  static async searchUsers(query: string): Promise<Friend[]> {
    try {
      const data = await ApiFunctions.getUserByName(query);
      
      // Format the results to match our Friend interface
      if (Array.isArray(data)) {
        return data.map(user => ({
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          linkedin: user.linkedin,
        }));
      }
      
      return [];
    } catch (error) {
      console.error('Error searching users:', error);
      return [];
    }
  }
  
  // Connect with a user (add as friend)
  static async connectWithUser(currentUser: User, friend: Friend): Promise<boolean> {
    try {
      if (!currentUser.id || !friend.id) {
        console.error('Cannot connect users: missing ID');
        return false;
      }
      
      const data = await ApiFunctions.addFriends(currentUser.id, friend.id);
      return !!data;
    } catch (error) {
      console.error('Error connecting with user:', error);
      return false;
    }
  }
  
  // Get user details by ID
  static async getUserById(id: string): Promise<User | null> {
    try {
      const data = await ApiFunctions.getUserById(id);
      
      console.log('GetUserById response data:', data);
      
      // Check if data is an array and handle accordingly
      if (Array.isArray(data) && data.length > 0) {
        return {
          id: data[0].id,
          name: data[0].name,
          email: data[0].email,
          phone: data[0].phone,
          linkedin: data[0].linkedin,
          points: data[0].points || 0,
          friends: data[0].friends || [],
        };
      }
      // Handle single object response
      else if (data && data.id) {
        return {
          id: data.id,
          name: data.name,
          email: data.email,
          phone: data.phone,
          linkedin: data.linkedin,
          points: data.points || 0,
          friends: data.friends || [],
        };
      }
      
      return null;
    } catch (error) {
      console.error('Error getting user:', error);
      return null;
    }
  }
  
  // Get leaderboard data
  static async getLeaderboard(): Promise<Partial<User>[]> {
    try {
      const data = await ApiFunctions.getLeaderboard();
      
      if (Array.isArray(data)) {
        return data.map(user => ({
          id: user.id,
          name: user.name,
          email: user.email,
          points: user.points || 0,
        })).sort((a, b) => (b.points || 0) - (a.points || 0)).slice(0, 10);
      }
      
      return [];
    } catch (error) {
      console.error('Error getting leaderboard:', error);
      return [];
    }
  }

  // Test function to register a user with known good data
  static async testRegistration(): Promise<any> {
    try {
      // Use unique email to avoid conflicts
      const timestamp = new Date().getTime();
      const testUser = {
        name: "Test User",
        email: `test.user.${timestamp}@example.com`,
        phone: "+905551234567",
        linkedin: "https://linkedin.com/in/testuser"
      };
      
      console.log('Sending test registration with data:', testUser);
      
      const response = await ApiFunctions.setUser(
        testUser.name,
        testUser.email,
        testUser.phone,
        testUser.linkedin
      );
      
      return {
        success: true,
        data: response
      };
    } catch (error) {
      console.error('Test registration error:', error);
      return { error: String(error) };
    }
  }
} 