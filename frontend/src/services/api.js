import axios from 'axios';

const FALLBACK_ERROR_MESSAGE = 'Something went wrong. Please try again later.';

// Create axios instance
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
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
      console.error(`[API Response Error] ${response.status} ${error.config.url}`, response.data);
      
      // Handle 401 and 403
      if (response.status === 401) {
        console.warn('Unauthorized access - potential session expiry.');
        // Add logic here for logout or redirect if needed
      } else if (response.status === 403) {
        console.warn('Forbidden access - insufficient permissions.');
      }
    } else {
      console.error('[API Network Error]', error.message);
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
    getAll: async () => api.get('/appointments'),
    create: async (data) => api.post('/appointments', data),
    getByPhone: async (phone) => api.get(`/appointments/phone/${phone}`),
    getById: async (id) => api.get(`/appointments/${id}`),
    updateStatus: async (id, status) => api.put(`/appointments/${id}`, { status }),
  },

  // COMPLAINTS
  complaints: {
    getAll: async () => api.get('/complaints'),
    create: async (data) => api.post('/complaints', data),
    getByPhone: async (phone) => api.get(`/complaints/phone/${phone}`),
    updateStatus: async (id, status) => api.put(`/complaints/${id}`, { status }),
  },

  // DEPARTMENTS
  departments: {
    getAll: async () => api.get('/departments'),
    getById: async (id) => api.get(`/departments/${id}`),
  },

  // EVENTS
  events: {
    getAll: async () => api.get('/events'),
    getByMonth: async (month) => api.get(`/events/month/${month}`),
  },

  // FEEDBACK
  feedback: {
    submit: async (data) => api.post('/feedback', data),
  },

  // DOCTORS
  doctors: {
    getAll: async () => api.get('/doctors'),
    getByDepartment: async (id) => api.get(`/doctors/department/${id}`),
    updateQueue: async (id, count) => api.put(`/doctors/${id}/queue`, { count }),
  },
};

export default apiService;
