const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api';

// Simple validation to warn about common issues in production
if (import.meta.env.PROD && (!import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_BASE_URL.startsWith('http:'))) {
  console.warn('VITE_API_BASE_URL is not defined or is using insecure HTTP in production. API calls will likely fail due to Mixed Content restrictions.');
}

export async function fetchApi(endpoint: string, options: RequestInit = {}) {
  // Ensure we don't have double slashes if endpoint starts with one
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = `${API_URL}${cleanEndpoint}`;
  
  // Use a more descriptive error for debugging in the browser console
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    let data;
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.indexOf("application/json") !== -1) {
      data = await response.json();
    } else {
      const text = await response.text();
      console.error(`Received non-JSON response from ${url}:`, text);
      throw new Error(`Server error: Received non-JSON response (${response.status}) from ${url}`);
    }

    if (!response.ok) {
      console.error(`API Error (${response.status}) at ${url}:`, data);
      throw new Error(data.message || `API Error: ${response.status} ${response.statusText}`);
    }

    return data;
  } catch (error: any) {
    console.error(`Fetch failed for ${url}:`, error);
    
    // Check if it's a mixed content error or incorrect URL
    if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
      const isHttpsFrontend = window.location.protocol === 'https:';
      const isHttpBackend = url.startsWith('http:');
      
      if (isHttpsFrontend && isHttpBackend) {
        throw new Error(`Mixed Content Error: Your frontend is on HTTPS (${window.location.origin}) but trying to call an HTTP backend (${url}). Update your VITE_API_BASE_URL environment variable to use HTTPS (https://).`);
      }
      
      throw new Error(`Network error: Could not reach the backend at ${url}. Ensure the backend is running and CORS is correctly configured for ${window.location.origin}`);
    }
    throw error;
  }
}

export async function getOffers() {
  const data = await fetchApi('/offers');
  return data.data.offers;
}

export async function createBooking(bookingData: any) {
  const token = localStorage.getItem('token');
  return fetchApi('/bookings', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(bookingData),
  });
}

export async function getHotels() {
  const data = await fetchApi('/hotels');
  return data.data.hotels;
}

export async function getRoomsByHotel(hotelId: number) {
  const data = await fetchApi(`/hotels/${hotelId}/rooms`);
  return data.data.rooms;
}

export async function validatePromoCode(codeData: { code: string; roomId: number; checkIn: string; checkOut: string }) {
  return fetchApi('/offers/validate', {
    method: 'POST',
    body: JSON.stringify(codeData),
  });
}

export async function submitContactMessage(messageData: any) {
  return fetchApi('/contact/message', {
    method: 'POST',
    body: JSON.stringify(messageData),
  });
}

export async function subscribeNewsletter(email: string) {
  return fetchApi('/contact/newsletter', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}
