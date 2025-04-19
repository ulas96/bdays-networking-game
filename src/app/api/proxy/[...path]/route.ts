import { NextRequest, NextResponse } from 'next/server';

// Map of API endpoints with index signature
const API_ENDPOINTS: { [key: string]: string } = {
  'bdays-write-user': 'https://b34fgpro7k.execute-api.eu-central-1.amazonaws.com/default/bdays-write-user',
  'bdays-read-user': 'https://manxq01vdd.execute-api.eu-central-1.amazonaws.com/default/bdays-read-user',
  'bdays-read-by-name': 'https://waq6xksnbf.execute-api.eu-central-1.amazonaws.com/default/bdays-read-by-name',
  'bdays-read-user-by-email': 'https://3n3l9jzjlg.execute-api.eu-central-1.amazonaws.com/default/bdays-read-user-by-email',
  'bdays-add-friends': 'https://jkrxhvqegh.execute-api.eu-central-1.amazonaws.com/default/bdays-add-friends',
};

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  try {
    const path = params.path.join('/');
    const endpoint = API_ENDPOINTS[path];
    
    if (!endpoint) {
      return NextResponse.json({ error: 'Invalid endpoint' }, { status: 404 });
    }
    
    const searchParams = request.nextUrl.searchParams.toString();
    const url = `${endpoint}?${searchParams}`;
    
    console.log(`Proxying GET request to: ${url}`);
    
    const response = await fetch(url);
    const data = await response.json();
    
    console.log(`Response status: ${response.status}`);
    console.log(`Response data:`, data);
    
    // If the response contains an error message, log it even if status is 200
    if (data.message && data.message.includes('Error')) {
      console.error('API returned error:', data);
    }
    
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json({ error: 'Proxy error', details: String(error) }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  try {
    const path = params.path.join('/');
    const endpoint = API_ENDPOINTS[path];
    
    if (!endpoint) {
      return NextResponse.json({ error: 'Invalid endpoint' }, { status: 404 });
    }
    
    const body = await request.json();
    console.log(`Proxying POST request to: ${endpoint}`);
    console.log('Request body:', body);
    
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    
    const data = await response.json();
    console.log(`Response status: ${response.status}`);
    console.log(`Response data:`, data);
    
    // If the response contains an error message, log it even if status is 200
    if (data.message && data.message.includes('Error')) {
      console.error('API returned error:', data);
    }
    
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json({ error: 'Proxy error', details: String(error) }, { status: 500 });
  }
} 