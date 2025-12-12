import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000/api' });

// Add token to requests
API.interceptors.request.use((req) => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user?.token) {
    req.headers.Authorization = `Bearer ${user.token}`;
  }
  return req;
});

// Add response interceptor to handle token expiration
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (email, password) => API.post('/auth/login', { email, password }),
  register: (userData) => API.post('/auth/register', userData),
  getProfile: () => API.get('/auth/profile'),
  updateProfile: (userData) => API.put('/auth/profile', userData)
};

export const stationsAPI = {
  getAll: () => API.get('/stations'),
  create: (stationData) => API.post('/stations', stationData),
  update: (id, stationData) => API.put('/stations/' + id, stationData),
  delete: (id) => API.delete('/stations/' + id)
};

export const umbrellasAPI = {
  getByStation: (stationId) => API.get('/umbrellas/station/' + stationId),
  create: (umbrellaData) => API.post('/umbrellas', umbrellaData),
  update: (id, umbrellaData) => API.put('/umbrellas/' + id, umbrellaData),
  delete: (id) => API.delete('/umbrellas/' + id)
};

export const borrowAPI = {
  borrow: (umbrellaId, stationId) => API.post('/borrow/borrow', { umbrellaId, stationId }),
  return: (umbrellaId, stationId) => API.post('/borrow/return', { umbrellaId, stationId }),
  getCurrent: () => API.get('/borrow/current'),
  getHistory: () => API.get('/borrow/history')
};

export const adminAPI = {
  getAllStations: () => API.get('/admin/stations'),
  getAllUsers: () => API.get('/admin/users'),
  getBorrowRecords: () => API.get('/admin/borrow-records'),
  getActiveBorrows: () => API.get('/admin/active-borrows'),
  createStation: (stationData) => API.post('/admin/stations', stationData),
  resetUser: (userId) => API.patch('/admin/users/' + userId + '/reset'),
  getAllUmbrellas: () => API.get('/admin/umbrellas'),
  createUmbrella: (umbrellaData) => API.post('/admin/umbrellas', umbrellaData),
  updateUmbrella: (id, umbrellaData) => API.put('/admin/umbrellas/' + id, umbrellaData),
  initializeData: () => API.post('/admin/initialize')
};

export default API;