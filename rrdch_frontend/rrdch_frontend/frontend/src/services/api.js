import axios from 'axios';

const FALLBACK_ERROR_MESSAGE = 'Something went wrong. Please try again later.';

const BASE_URL = 'http://localhost:5000/api';
console.log('--- RRDCH FRONTEND API INITIALIZED ---');
console.log('TARGET BASE_URL:', BASE_URL);

// Create axios instance
export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});


// Request Interceptor: Logging
api.interceptors.request.use(
  (config) => {
    console.log(`[API Request] ${config.method.toUpperCase()} ${config.url}`, config.data || '');
    return config;
  },
  (error) => {
    console.error('[API Request Error]', error);
    return Promise.reject({
      success: false,
      message: FALLBACK_ERROR_MESSAGE,
      error
    });
  }
);

// Response Interceptor: Logging & Error Handling
api.interceptors.response.use(
  (response) => {
    console.log(`[API Response] ${response.status} ${response.config.url}`, response.data);
    return response.data;
  },
  (error) => {
    const { response } = error;
    
    // Log errors
    if (response) {
      console.error(`[API Response Error] STATUS: ${response.status} | URL: ${error.config.url}`, response.data);
    } else {
      console.error('[API Network Error] Check if backend is running on port 5000', error.message);
    }


    // Return consistent error format with fallback message
    return Promise.reject({
      success: false,
      message: FALLBACK_ERROR_MESSAGE,
      error: response ? response.data : error.message
    });
  }
);

/**
 * API Service Modules
 */
const apiService = {
  // APPOINTMENTS
  appointments: {
    getAll: () => api.get('/appointments'),
    create: (data) => api.post('/appointments', data),
    unifiedBook: (data) => api.post('/appointments', data),
    getByPhone: (phone) => api.get(`/appointments/${phone}`),
    getQueue: (doctorId) => api.get(`/appointments/queue?doctor_id=${doctorId}`),

    updateStatus: (id, status) => api.put(`/appointments/${id}`, { status }),
  },

  // COMPLAINTS
  complaints: {
    getAll: () => api.get('/complaints'),
    create: (data) => api.post('/complaints', data),
    getByPhone: (phone) => api.get(`/complaints/phone/${phone}`),
    updateStatus: (id, status) => api.put(`/complaints/${id}`, { status }),
  },

  // DEPARTMENTS
  departments: {
    getAll: () => api.get('/departments'),
    getById: (id) => api.get(`/departments/${id}`),
  },

  // EVENTS
  events: {
    getAll: () => api.get('/events'),
    getByMonth: (month) => api.get(`/events/month/${month}`),
  },

  // FEEDBACK
  feedback: {
    submit: (data) => api.post('/feedback', data),
  },

  // ACADEMICS
  academics: {
    getAll: () => api.get('/academics'),
  },
};

export default apiService;
