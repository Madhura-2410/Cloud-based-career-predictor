import axios, { AxiosInstance } from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

interface ApiConfig {
  token?: string;
}

class ApiClient {
  private client: AxiosInstance;
  private token: string | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 20000,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // Request interceptor to add token
    this.client.interceptors.request.use((config) => {
      if (this.token) {
        config.headers.Authorization = `Bearer ${this.token}`;
      }
      return config;
    });

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Token expired, redirect to login
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  setToken(token: string) {
    this.token = token;
  }

  // Users endpoints
  getProfile() {
    return this.client.get('/api/users/profile');
  }

  updateProfile(data: any) {
    return this.client.put('/api/users/profile', data);
  }

  getDashboard(userId: string) {
    return this.client.get(`/api/users/${userId}/dashboard`);
  }

  // Skills endpoints
  listSkills(category?: string) {
    return this.client.get('/api/skills', { params: { category } });
  }

  getUserSkills(userId: string) {
    return this.client.get(`/skills/user/${userId}`);
  }

  getTrendingSkills(days: number = 90, limit: number = 20) {
    return this.client.get('/skills/trending', { params: { days, limit } });
  }

  // Job trends
  getJobTrends(industry?: string, limit: number = 10) {
    return this.client.get('/jobs/trends', { params: { industry, limit } });
  }

  // Resume analysis
  analyzeResume(resumeText: string) {
    return this.client.post('/resume/analyze', { resume_text: resumeText });
  }

  // Predictions endpoints
  predictNextRole(userId: string) {
    return this.client.get(`/api/predictions/${userId}/role`);
  }

  getROIEstimates(userId: string) {
    return this.client.get(`/api/predictions/${userId}/roi`);
  }

  getUserPredictions(userId: string) {
    return this.client.get(`/api/predictions/${userId}/all`);
  }

  // Mentor endpoints
  getMentorGuidance(userId: string) {
    return this.client.get(`/mentor/${userId}/guidance`);
  }

  // Health check
  getHealth() {
    return this.client.get('/health');
  }
}

export default new ApiClient();
