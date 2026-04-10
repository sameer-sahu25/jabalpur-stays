const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api';

export async function fetchApi(endpoint: string, options: RequestInit = {}) {
  const url = `${API_URL}${endpoint}`;
  console.log(`Fetching: ${url}`);
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
      throw new Error(`Server error: Received non-JSON response (${response.status})`);
    }

    if (!response.ok) {
      console.error(`API Error (${response.status}):`, data);
      throw new Error(data.message || `API Error: ${response.status} ${response.statusText}`);
    }

    return data;
  } catch (error: any) {
    console.error(`Fetch failed for ${url}:`, error);
    if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
      throw new Error('Network error: Could not reach the backend server. Please check your connection and ensure the backend is running.');
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
