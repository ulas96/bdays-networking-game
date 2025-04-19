'use client';

import { useState } from 'react';
import Link from 'next/link';
import * as ApiFunctions from '@/lib/api-functions';

export default function DebugPage() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "Test User",
    email: `test.user.${new Date().getTime()}@example.com`,
    phone: "+905551234567",
    linkedin: "https://linkedin.com/in/testuser",
    id: "", // For user ID lookups
    user1: "", // For adding friends
    user2: "" // For adding friends
  });

  // Update form data when changing input values
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Generate a new random email
  const refreshEmail = () => {
    setFormData(prev => ({
      ...prev,
      email: `test.user.${new Date().getTime()}@example.com`
    }));
  };

  // Test user registration
  const testSetUser = async () => {
    setLoading(true);
    try {
      const response = await ApiFunctions.setUser(
        formData.name,
        formData.email,
        formData.phone,
        formData.linkedin
      );
      setResults({
        type: 'setUser',
        success: true,
        data: response
      });
    } catch (error) {
      console.error('Error in setUser:', error);
      setResults({
        type: 'setUser',
        success: false,
        error: String(error)
      });
    } finally {
      setLoading(false);
    }
  };

  // Test getting user by email
  const testGetUserByEmail = async () => {
    setLoading(true);
    try {
      const response = await ApiFunctions.getUserByEmail(formData.email);
      setResults({
        type: 'getUserByEmail',
        success: true,
        data: response
      });
      // If we get a user, set the ID for further testing
      if (response && response.id) {
        setFormData(prev => ({
          ...prev,
          id: response.id
        }));
      }
    } catch (error) {
      console.error('Error in getUserByEmail:', error);
      setResults({
        type: 'getUserByEmail',
        success: false,
        error: String(error)
      });
    } finally {
      setLoading(false);
    }
  };

  // Test getting user by ID
  const testGetUserById = async () => {
    setLoading(true);
    try {
      const response = await ApiFunctions.getUserById(formData.id);
      setResults({
        type: 'getUserById',
        success: true,
        data: response
      });
    } catch (error) {
      console.error('Error in getUserById:', error);
      setResults({
        type: 'getUserById',
        success: false,
        error: String(error)
      });
    } finally {
      setLoading(false);
    }
  };

  // Test getting user by name
  const testGetUserByName = async () => {
    setLoading(true);
    try {
      const response = await ApiFunctions.getUserByName(formData.name);
      setResults({
        type: 'getUserByName',
        success: true,
        data: response
      });
    } catch (error) {
      console.error('Error in getUserByName:', error);
      setResults({
        type: 'getUserByName',
        success: false,
        error: String(error)
      });
    } finally {
      setLoading(false);
    }
  };

  // Test adding friends
  const testAddFriends = async () => {
    setLoading(true);
    try {
      const response = await ApiFunctions.addFriends(formData.user1, formData.user2);
      setResults({
        type: 'addFriends',
        success: true,
        data: response
      });
    } catch (error) {
      console.error('Error in addFriends:', error);
      setResults({
        type: 'addFriends',
        success: false,
        error: String(error)
      });
    } finally {
      setLoading(false);
    }
  };

  // Test getting leaderboard
  const testGetLeaderboard = async () => {
    setLoading(true);
    try {
      const response = await ApiFunctions.getLeaderboard();
      setResults({
        type: 'getLeaderboard',
        success: true,
        data: response
      });
    } catch (error) {
      console.error('Error in getLeaderboard:', error);
      setResults({
        type: 'getLeaderboard',
        success: false,
        error: String(error)
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">API Debug Page</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">User Info</h2>
          
          <div className="grid grid-cols-1 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded"
                placeholder="User's name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <div className="flex space-x-2">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="flex-1 px-3 py-2 border rounded"
                  placeholder="User's email"
                />
                <button
                  onClick={refreshEmail}
                  className="bg-gray-200 px-2 py-1 rounded"
                >
                  🔄
                </button>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded"
                placeholder="User's phone"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                LinkedIn
              </label>
              <input
                type="text"
                name="linkedin"
                value={formData.linkedin}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded"
                placeholder="User's LinkedIn URL"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                User ID (for getUserById)
              </label>
              <input
                type="text"
                name="id"
                value={formData.id}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded"
                placeholder="User ID from previous query"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  User 1 ID (for addFriends)
                </label>
                <input
                  type="text"
                  name="user1"
                  value={formData.user1}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded"
                  placeholder="First user ID"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  User 2 ID (for addFriends)
                </label>
                <input
                  type="text"
                  name="user2"
                  value={formData.user2}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded"
                  placeholder="Second user ID"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">API Tests</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button
              onClick={testSetUser}
              disabled={loading}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
            >
              {loading ? 'Testing...' : 'Register User'}
            </button>
            
            <button
              onClick={testGetUserByEmail}
              disabled={loading}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50"
            >
              {loading ? 'Testing...' : 'Get User by Email'}
            </button>
            
            <button
              onClick={testGetUserById}
              disabled={loading || !formData.id}
              className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded disabled:opacity-50"
            >
              {loading ? 'Testing...' : 'Get User by ID'}
            </button>
            
            <button
              onClick={testGetUserByName}
              disabled={loading}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded disabled:opacity-50"
            >
              {loading ? 'Testing...' : 'Get User by Name'}
            </button>
            
            <button
              onClick={testAddFriends}
              disabled={loading || !formData.user1 || !formData.user2}
              className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded disabled:opacity-50"
            >
              {loading ? 'Testing...' : 'Add Friends'}
            </button>
            
            <button
              onClick={testGetLeaderboard}
              disabled={loading}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded disabled:opacity-50"
            >
              {loading ? 'Testing...' : 'Get Leaderboard'}
            </button>
          </div>
        </div>
      </div>

      <div className="mt-6 bg-white p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Test Results</h2>
        {results ? (
          <div className="bg-gray-100 p-3 rounded">
            <p className="font-semibold mb-2">
              API: {results.type} - Status: {results.success ? '✅ Success' : '❌ Failed'}
            </p>
            {results.data && (
              <div className="mb-2">
                <p className="font-semibold">Data:</p>
                <pre className="text-xs bg-gray-200 p-2 rounded overflow-x-auto max-h-96">
                  {JSON.stringify(results.data, null, 2)}
                </pre>
              </div>
            )}
            {results.error && (
              <p className="text-red-500"><span className="font-semibold">Error:</span> {results.error}</p>
            )}
          </div>
        ) : (
          <p className="text-gray-500">No test results yet. Run a test to see results.</p>
        )}
      </div>

      <div className="mt-6 p-4 bg-white rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Navigation</h2>
        <div className="flex flex-col gap-2">
          <Link href="/" className="text-blue-500 hover:underline">Home</Link>
          <Link href="/login" className="text-blue-500 hover:underline">Login Page</Link>
          <Link href="/register" className="text-blue-500 hover:underline">Register Page</Link>
        </div>
      </div>
    </div>
  );
} 