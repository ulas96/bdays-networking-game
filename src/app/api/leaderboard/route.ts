import { NextResponse } from 'next/server';

export async function GET() {
  // In a real app, this would query a database
  // For this example, we'll return mock data
  
  // Simulate some processing time to show loading state on the frontend
  await new Promise(resolve => setTimeout(resolve, 600));
  
  // Mock leaderboard data
  const leaderboard = [
    { name: 'Jane Doe', points: 450 },
    { name: 'John Smith', points: 380 },
    { name: 'Alice Johnson', points: 320 },
    { name: 'Bob Brown', points: 290 },
    { name: 'Charlie Davis', points: 240 },
    { name: 'Diana Evans', points: 210 },
    { name: 'Edward Fox', points: 180 },
    { name: 'Fiona Green', points: 150 },
    { name: 'George Harris', points: 120 },
    { name: 'Helen Irving', points: 90 }
  ];
  
  // Sort by points in descending order
  leaderboard.sort((a, b) => b.points - a.points);
  
  return NextResponse.json({ leaderboard });
} 