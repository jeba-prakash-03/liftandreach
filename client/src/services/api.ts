import axios from 'axios';
import { Category, Product, HeroSlide, SettingsMap, Enquiry } from '../types';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true
});

export const getCategories = async (): Promise<Category[]> => {
  const { data } = await api.get('/categories');
  return data;
};

export const getProducts = async (params?: { category?: string; q?: string; industry?: string }): Promise<Product[]> => {
  const { data } = await api.get('/products', { params });
  return data;
};

export const getProductBySlug = async (slug: string): Promise<Product> => {
  const { data } = await api.get(`/products/${slug}`);
  return data;
};

export const getSettings = async (): Promise<SettingsMap> => {
  const { data } = await api.get('/settings');
  return data;
};

export const getHeroSlides = async (): Promise<HeroSlide[]> => {
  const { data } = await api.get('/hero-slides');
  return data;
};

export const getPage = async (slug: string): Promise<any> => {
  const { data } = await api.get(`/pages/${slug}`);
  return data;
};

export const getCaptcha = async (): Promise<{ token: string; question: string }> => {
  const { data } = await api.get('/captcha');
  return data;
};

export const submitEnquiry = async (payload: {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  productId?: number | null;
  productIds?: number[];
  captchaToken: string;
  captchaAnswer: string | number;
}) => {
  const { data } = await api.post('/enquiries', payload);
  return data;
};

// Admin Endpoints
export const adminLogin = async (credentials: { email: string; password: string }) => {
  const { data } = await api.post('/admin/auth/login', credentials);
  return data;
};

export const adminLogout = async () => {
  const { data } = await api.post('/admin/auth/logout');
  return data;
};

export const adminGetMe = async () => {
  const { data } = await api.get('/admin/auth/me');
  return data;
};

export const adminGetEnquiries = async (params?: { status?: string; search?: string }): Promise<Enquiry[]> => {
  const { data } = await api.get('/admin/enquiries', { params });
  return data;
};

export const adminUpdateEnquiryStatus = async (id: number, status: 'NEW' | 'CONTACTED' | 'CLOSED') => {
  const { data } = await api.put(`/admin/enquiries/${id}/status`, { status });
  return data;
};

export const adminDeleteEnquiry = async (id: number) => {
  const { data } = await api.delete(`/admin/enquiries/${id}`);
  return data;
};

export const adminGetProducts = async (): Promise<Product[]> => {
  const { data } = await api.get('/admin/products');
  return data;
};

export const adminSaveProduct = async (product: Partial<Product>) => {
  if (product.id) {
    const { data } = await api.put(`/admin/products/${product.id}`, product);
    return data;
  }
  const { data } = await api.post('/admin/products', product);
  return data;
};

export const adminDeleteProduct = async (id: number) => {
  const { data } = await api.delete(`/admin/products/${id}`);
  return data;
};

export const adminUpdateSettings = async (settings: SettingsMap) => {
  const { data } = await api.put('/admin/settings', settings);
  return data;
};

export const adminUploadImage = async (file: File) => {
  const formData = new FormData();
  formData.append('image', file);
  const { data } = await api.post('/admin/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return data;
};

export default api;
