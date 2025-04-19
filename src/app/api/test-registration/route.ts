import { NextResponse } from 'next/server';
import { setUser } from '@/lib/api-functions';

// Handler for POST requests from the frontend
export async function POST(request: Request) {
  try {
    // Parse the incoming request body
    const userData = await request.json();
    
    // Log the received data for debugging
    console.log('Received user data for registration:', userData);
    
    // Use our new API function to register the user
    const result = await setUser(
      userData.name,
      userData.email,
      userData.phone || '',
      userData.linkedin || ''
    );
    
    // Return the result from the API
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in test-registration API route:', error);
    return NextResponse.json(
      { success: false, error: String(error) }, 
      { status: 500 }
    );
  }
} 