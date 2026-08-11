import axios from 'axios';
import toast from 'react-hot-toast';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000
});

// Request Interceptor: Attach JWT
// Add custom request interceptor handler for tokens
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add retry logic for connection refused / global interceptor
api.interceptors.response.use(
  response => response,
  error => {
    if (error.code === 'ERR_CONNECTION_REFUSED' || error.message === 'Network Error') {
      console.error('❌ Backend server is not running!');
      console.error('Please start Spring Boot backend on port 8080');
      
      // Show user-friendly message
      const customError = {
        ...error,
        message: 'Backend server is not running. Please ensure Spring Boot is started on port 8080.',
        isNetworkError: true
      };
      return Promise.reject(customError);
    }
    return Promise.reject(error);
  }
);

// Response Interceptor: Global Error Handling & Data Sanitization
api.interceptors.response.use(
  (response) => {
    // Recursively sanitize NaN values to 0 to prevent React render crashes
    const sanitize = (obj) => {
      if (typeof obj === 'number' && isNaN(obj)) return 0;
      if (Array.isArray(obj)) return obj.map(sanitize);
      if (obj && typeof obj === 'object') {
        Object.keys(obj).forEach(key => {
          obj[key] = sanitize(obj[key]);
        });
      }
      return obj;
    };
    
    if (response.data) {
      response.data = sanitize(response.data);
    }
    return response;
  },
  (error) => {
    const { response, config } = error;

    // Prevent infinite loops on auth endpoints
    const isAuthEndpoint = config?.url?.includes('/auth/');

    if (response) {
      switch (response.status) {
        case 401:
          if (!isAuthEndpoint) {
            toast.error('Session expired. Please login again.');
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            // Use subtle redirect to avoid harsh reloads if possible
            if (window.location.pathname !== '/login') {
              window.location.href = '/login';
            }
          }
          break;
        case 403:
          toast.error('Access Denied: You do not have permission for this action.');
          break;
        case 404:
          // Individual components should handle 404s for better UX (e.g. "Job not found")
          console.warn('Resource not found:', config.url);
          break;
        case 500:
          toast.error('Server error. Please try again later.');
          break;
        default:
          const message = response.data?.message || 'An unexpected error occurred';
          if (!isAuthEndpoint) toast.error(message);
      }
    } else if (error.request) {
      toast.error('Network error. Is the backend running?');
    }

    return Promise.reject(error);
  }
);

/**
 * Normalization Utilities
 */
const normalizeJob = (job) => ({
  ...job,
  applicationLink: job.applicationUrl || job.applicationLink, // Align with JobDTO.java
  postedByName: job.postedByName || 'Anonymous Alumni'
});

const normalizeEvent = (event) => ({
  ...event,
  organizerName: event.createdByName || 'Campus Admin'
});

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (data) => api.post('/auth/register', data) // Align with common backend routes
};

export const jobAPI = {
  getAll: (params) => api.get('/jobs', { params }).then(res => ({
    ...res,
    data: res.data.content ? { ...res.data, content: res.data.content.map(normalizeJob) } : res.data.map(normalizeJob)
  })),
  getById: (id) => api.get(`/jobs/${id}`).then(res => ({ ...res, data: normalizeJob(res.data) })),
  create: (data) => api.post('/jobs', data),
  delete: (id) => api.delete(`/jobs/${id}`),
  getRecommended: () => api.get('/jobs/recommended')
};

export const eventAPI = {
  getAll: () => api.get('/events').then(res => ({
    ...res,
    data: res.data.map(normalizeEvent)
  })),
  getUpcoming: () => api.get('/events/upcoming'),
  getById: (id) => api.get(`/events/${id}`).then(res => ({ ...res, data: normalizeEvent(res.data) })),
  create: (data) => api.post('/events', data),
  delete: (id) => api.delete(`/events/${id}`),
  join: (id) => api.post(`/events/${id}/join`)
};

export const alumniAPI = {
  getAll: (params) => api.get('/alumni', { params }),
  getById: (id) => api.get(`/alumni/${id}`)
};

export const connectionAPI = {
  getMyConnections: () => api.get('/connections').then(res => ({ ...res, data: res.data.data })),
  getPendingRequests: () => api.get('/connections/pending').then(res => ({ ...res, data: res.data.data })),
  sendRequest: (userId) => api.post('/connections/request', { userId }).then(res => ({ ...res, data: res.data.data })),
  acceptRequest: (requestId) => api.post(`/connections/${requestId}/accept`).then(res => ({ ...res, data: res.data.data })),
  rejectRequest: (requestId) => api.post(`/connections/${requestId}/reject`).then(res => ({ ...res, data: res.data.data })),
  removeConnection: (connectionId) => api.delete(`/connections/${connectionId}`).then(res => res.data)
};

export const adminAPI = {
  getPendingUsers: () => api.get('/admin/verification/pending'),
  verifyUser: (userId, approve) => api.post(`/admin/verification/${userId}/${approve ? 'approve' : 'reject'}`),
  getAlumni: () => api.get('/admin/alumni'),
  getStudents: () => api.get('/admin/students'),
  deleteUser: (userId) => api.delete(`/admin/users/${userId}`)
};

export const chatAPI = {
  getChats: () => api.get('/chats').then(res => ({ ...res, data: res.data.data })),
  getMessages: (chatId) => api.get(`/chats/${chatId}/messages`).then(res => ({ ...res, data: res.data.data })),
  sendMessage: (chatId, content) => api.post(`/chats/${chatId}/messages`, { chatId, content }).then(res => ({ ...res, data: res.data.data })),
  requestChat: (receiverId, initialMessage = '') => api.post('/chats/request', { receiverId, initialMessage }).then(res => ({ ...res, data: res.data.data }))
};

export const userAPI = {
  getProfileById: (userId) => api.get(`/users/${userId}`),
  getProfile: (userId) => api.get(`/users/${userId}`),
  getMe: () => api.get('/users/me'),
  updateMe: (data) => api.put('/users/me', data),
  updateProfile: (data) => api.put('/alumni/profile', data),
  getStats: () => api.get('/stats/sidebar')
};

export const notificationAPI = {
  getAll: (params) => api.get('/notifications', { params }),
  getUnread: () => api.get('/notifications/unread'),
  getUnreadCount: () => api.get('/notifications/unread-count').then(res => res.data.count),
  markAsRead: (id) => api.post(`/notifications/${id}/read`),
  markAllAsRead: () => api.post('/notifications/read-all')
};

export const aiInterviewAPI = {
  startInterview: (data) => api.post('/ai/interview/start', data),
  submitAnswer: (data) => api.post('/ai/interview/answer', data),
  finishInterview: (sessionId) => api.post(`/ai/interview/finish/${sessionId}`),
  getHistory: () => api.get('/ai/interview/history'),
};

export const chatbotAPI = {
  query: (query) => api.post('/chatbot/query', { query }).then(res => res.data)
};

export default api;
