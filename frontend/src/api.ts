import axios from 'axios';

export const api = axios.create({ baseURL: '/api' });

// Attach JWT from localStorage to every request.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('aihub_token');
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface Category {
  id: number;
  name: string;
  description?: string | null;
}

export interface Tag {
  id: number;
  name: string;
}

export interface Poc {
  id: number;
  name: string;
  role?: string | null;
  email: string;
  avatarUrl?: string | null;
}

export interface TrainingDoc {
  id: number;
  title: string;
  type: string;
  url: string;
}

export interface Faq {
  id: number;
  toolId: number | null;
  question: string;
  answer: string;
  order: number;
}

export interface Tool {
  id: number;
  name: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  url: string;
  logoUrl?: string | null;
  status: string;
  publishState: string;
  clickCount: number;
  category?: Category | null;
  categoryId?: number | null;
  tags: Tag[];
  pocs: Poc[];
  trainingDocs: TrainingDoc[];
  faqs: Faq[];
  updatedAt: string;
}

export interface TrainingRequest {
  id: number;
  toolId: number;
  requesterName: string;
  requesterEmail: string;
  preferredDates?: string | null;
  requestedSlot?: string | null;
  durationMins?: number;
  notes?: string | null;
  status: string;
  createdAt: string;
  tool?: { id: number; name: string; slug: string };
}

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: string;
}
