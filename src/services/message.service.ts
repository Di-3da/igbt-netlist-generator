// src/services/message.service.ts

import apiService from './api.service';
import type { FileInfo, Message } from '@/types/app';

interface SendMessagePayload {
  session_id: string;
  query: string;
  file_data: FileInfo[];
}

class MessageService {
  async sendMessage(sessionId: string, message: string, files: FileInfo[] = []): Promise<Message> {
    const payload: SendMessagePayload = {
      session_id: sessionId,
      query: message,
      file_data: files
    };

    const response = await apiService.post<Message>('/api/task/process', payload);
    return response;
  }

  async stopGeneration(sessionId: string, turnId: string): Promise<boolean> {
    try {
      await apiService.post(`/api/session/${sessionId}/stop?turn_id=${turnId}`);
      return true;
    } catch (error) {
      console.error('停止生成失败:', error);
      return false;
    }
  }

  async getStreamData(sessionId: string): Promise<Message> {
    return apiService.get<Message>(`/api/session/${sessionId}/stream`);
  }
}

export default new MessageService();
