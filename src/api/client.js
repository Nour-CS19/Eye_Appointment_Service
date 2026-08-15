const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

function getToken() {
  return localStorage.getItem('eyecare_admin_token');
}

async function request(path, { method = 'GET', body, auth = false } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (auth) {
    const token = getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined
  });

  let data = null;
  try {
    data = await res.json();
  } catch {
    // no JSON body
  }

  if (!res.ok) {
    const message = (data && data.error) || `Request failed with status ${res.status}`;
    throw new Error(message);
  }
  return data;
}

export const api = {
  // Public
  getDoctors: () => request('/doctors'),
  getServices: () => request('/services'),
  getProducts: () => request('/products'),
  getAvailability: (date, doctor) => request(`/appointments/availability?date=${encodeURIComponent(date)}&doctor=${encodeURIComponent(doctor)}`),
  bookAppointment: (payload) => request('/appointments', { method: 'POST', body: payload }),
  placeOrder: (payload) => request('/orders', { method: 'POST', body: payload }),
  sendMessage: (payload) => request('/messages', { method: 'POST', body: payload }),

  // Auth
  login: (email, password) => request('/auth/login', { method: 'POST', body: { email, password } }),
  register: (payload) => request('/auth/register', { method: 'POST', body: payload }),
  userLogin: (payload) => request('/auth/user-login', { method: 'POST', body: payload }),
  changePassword: (payload) => request('/auth/change-password', { method: 'POST', body: payload, auth: true }),

  // Admin
  getStats: () => request('/stats', { auth: true }),
  getAppointments: () => request('/appointments', { auth: true }),
  updateAppointmentStatus: (id, status) => request(`/appointments/${id}`, { method: 'PATCH', body: { status }, auth: true }),
  deleteAppointment: (id) => request(`/appointments/${id}`, { method: 'DELETE', auth: true }),
  getOrders: () => request('/orders', { auth: true }),
  getMessages: () => request('/messages', { auth: true }),
  markMessageRead: (id, read) => request(`/messages/${id}`, { method: 'PATCH', body: { read }, auth: true }),

  createDoctor: (payload) => request('/doctors', { method: 'POST', body: payload, auth: true }),
  updateDoctor: (id, payload) => request(`/doctors/${id}`, { method: 'PUT', body: payload, auth: true }),
  deleteDoctor: (id) => request(`/doctors/${id}`, { method: 'DELETE', auth: true }),

  createService: (payload) => request('/services', { method: 'POST', body: payload, auth: true }),
  updateService: (id, payload) => request(`/services/${id}`, { method: 'PUT', body: payload, auth: true }),
  deleteService: (id) => request(`/services/${id}`, { method: 'DELETE', auth: true }),

  createProduct: (payload) => request('/products', { method: 'POST', body: payload, auth: true }),
  updateProduct: (id, payload) => request(`/products/${id}`, { method: 'PUT', body: payload, auth: true }),
  deleteProduct: (id) => request(`/products/${id}`, { method: 'DELETE', auth: true })
};
