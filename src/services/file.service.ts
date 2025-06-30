// src/services/file.service.ts

import apiService from './api.service';
import type { FileInfo } from '@/types/app';

class FileService {
  async uploadFile(sessionId: string, file: File): Promise<FileInfo> {
    const response = await apiService.uploadFile<{ id: string; path: string }>(
      `/api/session/${sessionId}/upload_file`,
      file,
      sessionId
    );

    return {
      id: response.id,
      name: file.name,
      size: file.size,
      path: response.path,
      uploaded: true,
      sessionId,
      createdAt: new Date().toISOString()
    };
  }

  async listSessionFiles(sessionId: string): Promise<FileInfo[]> {
    return apiService.get<FileInfo[]>(`/api/session/${sessionId}/files`);
  }

  async downloadFile(sessionId: string, filePath: string, fileName: string): Promise<void> {
    const response = await apiService.get<Blob>(
      `/api/session/${sessionId}/download/${encodeURIComponent(filePath)}`,
      {
        responseType: 'blob'
      }
    );

    const url = window.URL.createObjectURL(new Blob([response]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  async quickDownloadNetlist(sessionId: string): Promise<void> {
    const files = await this.listSessionFiles(sessionId);
    const netlistFile = files.find(file =>
      file.name.match(/\.(net|cir|sp|spice)$/i)
    );

    if (netlistFile) {
      await this.downloadFile(sessionId, netlistFile.path, netlistFile.name);
    } else {
      throw new Error('未找到网表文件');
    }
  }

  // 清理旧文件功能
  async cleanOldFiles(sessionId: string, days: number): Promise<{ success: boolean; cleanedFiles: number }> {
    try {
      const response = await apiService.post<{ success: boolean; cleaned_files: number }>(
        `/api/session/${sessionId}/clean_old_files`,
        { days }
      );

      return {
        success: response.success,
        cleanedFiles: response.cleaned_files
      };
    } catch (error) {
      console.error('清理文件失败:', error);
      return {
        success: false,
        cleanedFiles: 0
      };
    }
  }
}

export default new FileService();
