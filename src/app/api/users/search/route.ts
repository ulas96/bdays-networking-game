import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  // Get the search query from the request
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q');
  
  if (!query) {
    return NextResponse.json(
      { error: 'Missing search query' },
      { status: 400 }
    );
  }
  
  // In a real app, this would query a database
  // For this example, we'll return mock data
  
  // Simulate some processing time to show loading state on the frontend
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Mock search results based on the query
  const results = [
    {
      name: `User ${query} 1`,
      email: `${query.toLowerCase().replace(/\s+/g, '')}1@example.com`,
      phone: '+905551234567',
      linkedin: 'https://linkedin.com/in/user1'
    },
    {
      name: `User ${query} 2`,
      email: `${query.toLowerCase().replace(/\s+/g, '')}2@example.com`,
      phone: '+905551234568',
      linkedin: 'https://linkedin.com/in/user2'
    },
    {
      name: `User ${query} 3`,
      email: `${query.toLowerCase().replace(/\s+/g, '')}3@example.com`,
      phone: '+905551234569',
      linkedin: 'https://linkedin.com/in/user3'
    }
  ];
  
  return NextResponse.json({ results });
} 