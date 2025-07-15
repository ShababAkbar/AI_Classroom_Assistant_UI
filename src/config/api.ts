// API Configuration
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

export const API_ENDPOINTS = {
  // Authentication
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',
  REFRESH_TOKEN: '/auth/refresh',
  
  // Assignments
  ASSIGNMENTS: '/assignments',
  ASSIGNMENT_BY_ID: '/assignments/:id',
  UPDATE_ASSIGNMENT_STATUS: '/assignments/:id/status',
  
  // Progress
  PROGRESS_STATS: '/progress/stats',
  
  // Notifications
  NOTIFICATIONS: '/notifications',
  SEND_TEST_NOTIFICATION: '/notifications/test',
  
  // Marks
  MARKS: '/marks',
  MARKS_BY_COURSE: '/marks/course/:courseId',
  ADD_MARKS: '/marks',
  UPDATE_MARKS: '/marks/:id',
  DELETE_MARKS: '/marks/:id',
  
  // Courses
  COURSES: '/courses',
  
  // Settings
  USER_SETTINGS: '/settings',
  UPDATE_SETTINGS: '/settings',
  
  // Google Classroom Integration
  SYNC_CLASSROOM: '/classroom/sync',
  CLASSROOM_STATUS: '/classroom/status'
};

// HTTP Client Configuration
export const httpClient = {
  get: async (url: string, options?: RequestInit) => {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${API_BASE_URL}${url}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
        ...options?.headers,
      },
      ...options,
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  },
  
  post: async (url: string, data?: any, options?: RequestInit) => {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${API_BASE_URL}${url}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
        ...options?.headers,
      },
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  },
  
  put: async (url: string, data?: any, options?: RequestInit) => {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${API_BASE_URL}${url}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
        ...options?.headers,
      },
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  },
  
  delete: async (url: string, options?: RequestInit) => {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${API_BASE_URL}${url}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
        ...options?.headers,
      },
      ...options,
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  }
};