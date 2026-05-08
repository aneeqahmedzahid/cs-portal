const API_BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api' : 'http://localhost:5000/api');

const getAuthHeaders = () => {
  const token = sessionStorage.getItem('admin_token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

const handleResponse = async (res) => {
  if (!res.ok) {
    let errorMsg = `HTTP Error: ${res.status} ${res.statusText}`;
    try {
      const data = await res.json();
      errorMsg = data.error || data.message || errorMsg;
    } catch (e) {
      // If response is not JSON (e.g. 502 Gateway error, or CORS error)
      try {
        const text = await res.text();
        if (text) errorMsg = text.substring(0, 100);
      } catch (err) {}
    }
    throw new Error(errorMsg);
  }
  
  // Handle empty 204 No Content responses gracefully
  if (res.status === 204) return null;
  
  try {
    return await res.json();
  } catch (e) {
    return null;
  }
};

export const api = {
  // Auth
  login: async (email, password) => {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return handleResponse(res);
  },

  // News
  getNews: async () => {
    const res = await fetch(`${API_BASE_URL}/news`);
    return handleResponse(res);
  },
  getNewsById: async (id) => {
    const res = await fetch(`${API_BASE_URL}/news/${id}`);
    return handleResponse(res);
  },
  createNews: async (data) => {
    const res = await fetch(`${API_BASE_URL}/news`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  },
  updateNews: async (id, data) => {
    const res = await fetch(`${API_BASE_URL}/news/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  },
  deleteNews: async (id) => {
    const res = await fetch(`${API_BASE_URL}/news/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  // Events
  getEvents: async () => {
    const res = await fetch(`${API_BASE_URL}/events`);
    return handleResponse(res);
  },
  getEventById: async (id) => {
    const res = await fetch(`${API_BASE_URL}/events/${id}`);
    return handleResponse(res);
  },
  createEvent: async (data) => {
    const res = await fetch(`${API_BASE_URL}/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  },
  updateEvent: async (id, data) => {
    const res = await fetch(`${API_BASE_URL}/events/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  },
  deleteEvent: async (id) => {
    const res = await fetch(`${API_BASE_URL}/events/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  // Admins
  getAdmins: async () => {
    const res = await fetch(`${API_BASE_URL}/admins`, { headers: getAuthHeaders() });
    return handleResponse(res);
  },
  createAdmin: async (data) => {
    const res = await fetch(`${API_BASE_URL}/admins`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  },
  deleteAdmin: async (id) => {
    const res = await fetch(`${API_BASE_URL}/admins/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  // Faculty
  getFaculty: async () => {
    const res = await fetch(`${API_BASE_URL}/faculty`, { headers: getAuthHeaders() });
    return handleResponse(res);
  },
  createFaculty: async (data) => {
    const res = await fetch(`${API_BASE_URL}/faculty`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  },
  updateFaculty: async (id, data) => {
    const res = await fetch(`${API_BASE_URL}/faculty/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  },
  deleteFaculty: async (id) => {
    const res = await fetch(`${API_BASE_URL}/faculty/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  }
};
