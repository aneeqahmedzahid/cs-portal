const API_BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api' : 'http://localhost:5001/api');

const getAuthHeaders = () => {
  const token = sessionStorage.getItem('admin_token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

/**
 * Enhanced Fetch Wrapper
 * Handles: JSON parsing, Error catching, Base URL, and Auth Headers
 */
async function request(endpoint, options = {}) {
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
  
  const headers = {
    'Content-Type': 'application/json',
    ...getAuthHeaders(),
    ...options.headers,
  };

  // Remove Content-Type if it's FormData (let fetch set it for multipart/form-data)
  if (options.body instanceof FormData) {
    delete headers['Content-Type'];
  }

  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json().catch(() => null);

    if (!response.ok) {
      const errorMessage = data?.error || data?.message || `Request failed with status ${response.status}`;
      
      // Auto logout if 401 Unauthorized
      if (response.status === 401 && !url.includes('/auth/login')) {
        sessionStorage.removeItem('admin_token');
        window.location.href = '/admin/login';
      }
      
      throw new Error(errorMessage);
    }

    return data;
  } catch (error) {
    console.error(`[API Error] ${options.method || 'GET'} ${url}:`, error.message);
    throw error;
  }
}

export const api = {
  // Health Check
  checkHealth: () => request('/health'),

  // Auth
  login: (email, password) => 
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    }),

  // News
  getNews: () => request('/news'),
  getNewsById: (id) => request(`/news/${id}`),
  createNews: (data) => 
    request('/news', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
  updateNews: (id, data) => 
    request(`/news/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    }),
  deleteNews: (id) => 
    request(`/news/${id}`, {
      method: 'DELETE'
    }),

  // Events
  getEvents: () => request('/events'),
  getEventById: (id) => request(`/events/${id}`),
  createEvent: (data) => 
    request('/events', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
  updateEvent: (id, data) => 
    request(`/events/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    }),
  deleteEvent: (id) => 
    request(`/events/${id}`, {
      method: 'DELETE'
    }),

  // Admins
  getAdmins: () => request('/admins'),
  createAdmin: (data) => 
    request('/admins', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
  deleteAdmin: (id) => 
    request(`/admins/${id}`, {
      method: 'DELETE'
    }),

  // Faculty
  getFaculty: () => request('/faculty'),
  createFaculty: (data) => 
    request('/faculty', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
  updateFaculty: (id, data) => 
    request(`/faculty/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    }),
  deleteFaculty: (id) => 
    request(`/faculty/${id}`, {
      method: 'DELETE'
    }),

  // Image Upload
  uploadImage: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return request('/upload', {
      method: 'POST',
      body: formData
    });
  }
};

