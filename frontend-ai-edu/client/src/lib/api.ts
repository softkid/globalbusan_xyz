// API Client for AI Education Platform
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://hub.globalbusan.xyz';

export const fetchApi = async (endpoint: string, options?: RequestInit) => {
  const url = `${API_BASE_URL}${endpoint}`;
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options?.headers || {}),
      },
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    if (!data.success) {
      throw new Error(data.error || 'Unknown API error');
    }
    
    return data.data;
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
    throw error;
  }
};

// API Endpoints
export const api = {
  courses: {
    getAll: () => fetchApi('/api/ai/courses'),
    getById: (id: string | number) => fetchApi(`/api/ai/courses/${id}`),
  },
  services: {
    getAll: () => fetchApi('/api/ai/services'),
    getById: (id: string | number) => fetchApi(`/api/ai/services/${id}`),
  },
  projects: {
    getAll: () => fetchApi('/api/ai/projects'),
    getById: (id: string | number) => fetchApi(`/api/ai/projects/${id}`),
  },
  news: {
    getAll: () => fetchApi('/api/ai/news'),
  },
  prompts: {
    getAll: () => fetchApi('/api/ai/prompts'),
  },
  community: {
    getPosts: () => fetchApi('/api/ai/community/posts'),
  }
};
