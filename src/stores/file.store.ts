// src/stores/file.store.ts

import { defineStore } from 'pinia';
import fileService from '@/services/file.service';
import { ref } from 'vue';
import type { FileInfo } from '@/types/app';
// 删除未使用的 formatFileSize 导入
// import { formatFileSize } from '@/utils/file'; // 这行被移除

export const useFileStore = defineStore('file', () => {
  const currentUploadedFiles = ref<FileInfo[]>([]);
  const sessionFiles = ref<FileInfo[]>([]);

  // 上传文件
  async function uploadFile(sessionId: string, file: File) {
    const fileInfo = await fileService.uploadFile(sessionId, file);
    currentUploadedFiles.value.push(fileInfo);
    return fileInfo;
  }

  // 移除文件
  function removeFile(fileId: string) {
    currentUploadedFiles.value = currentUploadedFiles.value.filter(file => file.id !== fileId);
  }

  // 清空上传文件
  function clearUploadedFiles() {
    currentUploadedFiles.value = [];
  }

  // 下载文件
  async function downloadFile(sessionId: string, file: FileInfo) {
    await fileService.downloadFile(sessionId, file.path, file.name);
  }

  // 快速下载网表
  async function quickDownloadNetlist(sessionId: string) {
    await fileService.quickDownloadNetlist(sessionId);
  }

  // 获取会话文件列表
  async function listSessionFiles(sessionId: string) {
    sessionFiles.value = await fileService.listSessionFiles(sessionId);
    return sessionFiles.value;
  }

  // 添加清理旧文件方法
  const cleanOldFiles = async (sessionId: string, days: number) => {
    try {
      const result = await fileService.cleanOldFiles(sessionId, days);
      return {
        success: true,
        cleanedFiles: result.cleanedFiles
      };
    } catch (error) {
      console.error('清理文件失败:', error);
      return {
        success: false,
        cleanedFiles: 0
      };
    }
  };

  return {
    currentUploadedFiles,
    sessionFiles,
    uploadFile,
    removeFile,
    clearUploadedFiles,
    downloadFile,
    quickDownloadNetlist,
    listSessionFiles,
    cleanOldFiles // 添加这个方法到返回对象
  };
});
