// src/services/file.service.ts

import apiService from './api.service';
import type { FileInfo } from '@/types/app';
// 移除未使用的 formatFileSize 导入
// import { formatFileSize } from '@/utils/file';

class FileService {
  async uploadFile(sessionId: string, file: File): Promise<FileInfo> {
    // 添加类型断言
    const response = await apiService.uploadFile<{ id: string; path: string }>(
      `/api/session/${sessionId}/upload_file`,
      file,
      sessionId
    );

    return {
      id: response.id, // 直接访问 id
      name: file.name,
      size: file.size,
      path: response.path, // 直接访问 path
      uploaded: true,
      sessionId,
      createdAt: new Date().toISOString()
    };
  }

  async listSessionFiles(sessionId: string): Promise<FileInfo[]> {
    return apiService.get<FileInfo[]>(`/api/session/${sessionId}/files`);
  }

  async downloadFile(sessionId: string, filePath: string, fileName: string): Promise<void> {
    // 明确指定响应类型为 Blob
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
}

export default new FileService();
