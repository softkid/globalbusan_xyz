const API_BASE = import.meta.env.VITE_API_URL || 'https://globalbusan-backend.softkid.workers.dev';

async function request<T>(path: string, options?: RequestInit): Promise<{ success: boolean; data: T; error?: string }> {
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });
    return await res.json();
  } catch {
    return { success: false, data: null as T, error: 'Network error' };
  }
}

// Courses
export const getCourses = () => request<any[]>('/api/ai/courses');
export const getCourse = (id: string) => request<any>(`/api/ai/courses/${id}`);

// Community
export const getCommunityPosts = () => request<any[]>('/api/ai/community/posts');

// Projects
export const getProjects = () => request<any[]>('/api/ai/projects');
export const getProject = (id: string) => request<any>(`/api/ai/projects/${id}`);

// News
export const getNews = () => request<any[]>('/api/ai/news');

// Prompts
export const getPrompts = () => request<any[]>('/api/ai/prompts');

// Services
export const getServices = () => request<any[]>('/api/ai/services');

// ===== V2 APIs =====

// Events
export const reserveEvent = (data: any) =>
  request<any>('/api/ai/events/reserve', { method: 'POST', body: JSON.stringify(data) });

export const getEventStats = () => request<any>('/api/ai/events/stats');

// Challenges
export const getChallenges = () => request<any[]>('/api/ai/challenges');
export const submitChallenge = (id: number, data: any) =>
  request<any>(`/api/ai/challenges/${id}/submit`, { method: 'POST', body: JSON.stringify(data) });

// Experts
export const getExperts = (region?: string) =>
  request<any[]>(`/api/ai/experts${region ? `?region=${region}` : ''}`);
export const getExpert = (id: string) => request<any>(`/api/ai/experts/${id}`);

// Marketplace
export const submitMarketplaceRequest = (data: any) =>
  request<any>('/api/ai/marketplace/request', { method: 'POST', body: JSON.stringify(data) });
export const getMarketplaceRequests = () => request<any[]>('/api/ai/marketplace/requests');
