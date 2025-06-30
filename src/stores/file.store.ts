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

  return {
    currentUploadedFiles,
    sessionFiles,
    uploadFile,
    removeFile,
    clearUploadedFiles,
    downloadFile,
    quickDownloadNetlist,
    listSessionFiles
  };
});
