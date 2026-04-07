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

    const data = await response.json();

    if (!response.ok) {
      console.error(`API Error (${response.status}):`, data);
      throw new Error(data.message || 'Something went wrong');
    }

    return data;
  } catch (error) {
    console.error(`Fetch failed for ${url}:`, error);
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
