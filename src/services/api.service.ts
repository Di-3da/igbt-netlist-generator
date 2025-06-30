// src/services/api.service.ts

import axios, { type AxiosInstance, type AxiosResponse, AxiosError, type AxiosRequestConfig } from 'axios';
import type { ApiResponse } from '@/types/app';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000';

class ApiService {
  private static instance: ApiService;
  private axiosInstance: AxiosInstance;

  private constructor() {
    this.axiosInstance = axios.create({
      baseURL: API_BASE,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // 请求拦截器
    this.axiosInstance.interceptors.request.use(config => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // 响应拦截器
    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse<ApiResponse<unknown>>) => {
        if (response.data && !response.data.success) {
          return Promise.reject(response.data.error || '请求失败');
        }
        return response;
      },
      (error: AxiosError) => {
        if (error.response) {
          const data = error.response.data as ApiResponse<unknown>;
          return Promise.reject(data.error || error.message);
        } else if (error.request) {
          return Promise.reject('网络错误，请检查连接');
        }
        return Promise.reject(error.message);
      }
    );
  }

  public static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService();
    }
    return ApiService.instance;
  }

  public async get<T = unknown>(url: string, params?: Record<string, unknown>): Promise<T> {
    const response = await this.axiosInstance.get<ApiResponse<T>>(url, { params });
    return response.data.data as T;
  }

  public async post<T = unknown>(url: string, data?: unknown): Promise<T> {
    const response = await this.axiosInstance.post<ApiResponse<T>>(url, data);
    return response.data.data as T;
  }

  public async put<T = unknown>(url: string, data?: unknown): Promise<T> {
    const response = await this.axiosInstance.put<ApiResponse<T>>(url, data);
    return response.data.data as T;
  }

  public async delete<T = unknown>(url: string, params?: Record<string, unknown>): Promise<T> {
    const response = await this.axiosInstance.delete<ApiResponse<T>>(url, { params });
    return response.data.data as T;
  }

  public async uploadFile<T = unknown>(
    url: string,
    file: File,
    sessionId: string,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await this.axiosInstance.post<T>(url, formData, {
      ...config,
      headers: {
        'Content-Type': 'multipart/form-data',
        'X-Session-Id': sessionId,
        ...(config?.headers || {})
      }
    });

    return response.data;
  }
  
  private handleError(error: AxiosError): never {
  // 添加401未授权处理
  if (error.response?.status === 401) {
    console.error('未授权访问');
    // 这里可以跳转到登录页面
  }

  // 添加任务相关错误处理
  if (error.config?.url?.includes('/current_task')) {
    console.error('获取任务状态失败', error);
    throw new Error('无法获取任务状态');
  }

  if (error.config?.url?.includes('/current_output')) {
    console.error('获取输出失败', error);
    throw new Error('无法获取电路输出');
  }

  // 通用错误处理
  if (error.response) {
    const data = error.response.data as ApiResponse<unknown>;
    throw new Error(data.error || error.message);
  } else if (error.request) {
    throw new Error('网络错误，请检查连接');
  }

  throw new Error(error.message);
}
}

export default ApiService.getInstance();
