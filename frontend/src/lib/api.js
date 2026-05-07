const API_BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api' : 'http://localhost:5000/api');

const getAuthHeaders = () => {
  const token = sessionStorage.getItem('admin_token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

export const api = {
  // Auth
  login: async (email, password) => {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    if (!res.ok) throw new Error((await res.json()).error);
    return res.json();
  },

  // News
  getNews: async () => {
    const res = await fetch(`${API_BASE_URL}/news`);
    if (!res.ok) throw new Error('Failed to fetch news');
    return res.json();
  },
  getNewsById: async (id) => {
    const res = await fetch(`${API_BASE_URL}/news/${id}`);
    if (!res.ok) throw new Error('Failed to fetch news item');
    return res.json();
  },
  createNews: async (data) => {
    const res = await fetch(`${API_BASE_URL}/news`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error((await res.json()).error);
    return res.json();
  },
  updateNews: async (id, data) => {
    const res = await fetch(`${API_BASE_URL}/news/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error((await res.json()).error);
    return res.json();
  },
  deleteNews: async (id) => {
    const res = await fetch(`${API_BASE_URL}/news/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error((await res.json()).error);
    return res.json();
  },

  // Events
  getEvents: async () => {
    const res = await fetch(`${API_BASE_URL}/events`);
    if (!res.ok) throw new Error('Failed to fetch events');
    return res.json();
  },
  getEventById: async (id) => {
    const res = await fetch(`${API_BASE_URL}/events/${id}`);
    if (!res.ok) throw new Error('Failed to fetch event item');
    return res.json();
  },
  createEvent: async (data) => {
    const res = await fetch(`${API_BASE_URL}/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error((await res.json()).error);
    return res.json();
  },
  updateEvent: async (id, data) => {
    const res = await fetch(`${API_BASE_URL}/events/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error((await res.json()).error);
    return res.json();
  },
  deleteEvent: async (id) => {
    const res = await fetch(`${API_BASE_URL}/events/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error((await res.json()).error);
    return res.json();
  },

  // Admins
  getAdmins: async () => {
    const res = await fetch(`${API_BASE_URL}/admins`, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error('Failed to fetch admins');
    return res.json();
  },
  createAdmin: async (data) => {
    const res = await fetch(`${API_BASE_URL}/admins`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error((await res.json()).error);
    return res.json();
  },
  deleteAdmin: async (id) => {
    const res = await fetch(`${API_BASE_URL}/admins/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error((await res.json()).error);
    return res.json();
  },

  // Faculty
  getFaculty: async () => {
    const res = await fetch(`${API_BASE_URL}/faculty`, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error('Failed to fetch faculty');
    return res.json();
  },
  createFaculty: async (data) => {
    const res = await fetch(`${API_BASE_URL}/faculty`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error((await res.json()).error);
    return res.json();
  },
  updateFaculty: async (id, data) => {
    const res = await fetch(`${API_BASE_URL}/faculty/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error((await res.json()).error);
    return res.json();
  },
  deleteFaculty: async (id) => {
    const res = await fetch(`${API_BASE_URL}/faculty/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error((await res.json()).error);
    return res.json();
  }
};
