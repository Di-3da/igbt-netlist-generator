// src/services/session.service.ts

import apiService from './api.service';
import type { Session, Task, SessionOutput } from '@/types/app';

class SessionService {
  async checkHealth(): Promise<boolean> {
    try {
      const response = await apiService.get<{ status: string }>('/api/health');
      return response.status === 'ok'; // 确保返回布尔值
    } catch {
      return false;
    }
  }

  async createSession(): Promise<Session> {
    return apiService.post<Session>('/api/session/create');
  }

  async getSession(sessionId: string): Promise<Session> {
    return apiService.get<Session>(`/api/session/${sessionId}`);
  }

  async listSessions(): Promise<Session[]> {
    return apiService.get<Session[]>('/api/sessions');
  }

  async deleteSession(sessionId: string): Promise<{ success: boolean }> {
    return apiService.delete<{ success: boolean }>(`/api/session/${sessionId}`);
  }

  // 获取当前任务
  async getCurrentTask(sessionId: string): Promise<Task> {
    return apiService.get<Task>(`/api/session/${sessionId}/current_task`);
  }

  // 获取当前输出
  async getCurrentOutput(sessionId: string): Promise<SessionOutput> {
    return apiService.get<SessionOutput>(`/api/session/${sessionId}/current_output`);
  }
}

export default new SessionService();
