// src/utils/file.ts

/**
 * 格式化文件大小显示
 * @param bytes 文件大小（字节）
 * @returns 格式化的文件大小字符串
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

/**
 * 截断文件名
 * @param name 原始文件名
 * @param maxLength 最大显示长度
 * @returns 截断后的文件名
 */
export const truncateFileName = (name: string, maxLength = 15): string => {
  if (name.length <= maxLength) return name;
  return name.substring(0, maxLength - 3) + '...';
};

/**
 * 生成唯一文件ID
 * @returns 唯一文件ID
 */
export const generateFileId = (): string => {
  return 'file_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
};

/**
 * 获取文件扩展名
 * @param fileName 文件名
 * @returns 文件扩展名（小写）
 */
export const getFileExtension = (fileName: string): string => {
  const parts = fileName.split('.');
  if (parts.length === 1) return '';
  return parts.pop()?.toLowerCase() || '';
};

/**
 * 检查文件类型是否为允许的类型
 * @param file 文件对象
 * @param allowedTypes 允许的文件类型数组
 * @returns 是否允许
 */
export const isAllowedFileType = (
  file: File,
  allowedTypes: string[] = ['txt', 'sp', 'cir', 'net', 'json', 'csv', 'py']
): boolean => {
  const extension = getFileExtension(file.name);
  return allowedTypes.includes(extension);
};

/**
 * 检查文件大小是否在限制内
 * @param file 文件对象
 * @param maxSizeMB 最大允许大小（MB）
 * @returns 是否在限制内
 */
export const isFileSizeValid = (file: File, maxSizeMB = 10): boolean => {
  return file.size <= maxSizeMB * 1024 * 1024;
};

/**
 * 创建文件对象URL
 * @param file 文件对象
 * @returns 对象URL
 */
export const createObjectURL = (file: File): string => {
  return URL.createObjectURL(file);
};

/**
 * 释放对象URL
 * @param url 对象URL
 */
export const revokeObjectURL = (url: string): void => {
  URL.revokeObjectURL(url);
};
