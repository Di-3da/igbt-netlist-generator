// src/types/app.d.ts

// 会话类型
export interface Session {
  id: string;
  created_at: string;
  last_activity: string;
  state: 'active' | 'inactive' | 'completed';
  tasks: Task[];
  turnId?: number; // 可选属性
}

// 任务类型
export interface Task {
  id: string;
  name: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  created_at: string;
}

// 文件类型
export interface FileInfo {
  id: string;
  name: string;
  size: number;
  path: string;
  uploaded: boolean;
  sessionId: string;
  createdAt: string;
}

// 消息类型
export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  attachments?: FileInfo[];
  sessionId: string;
}

// UI状态
export interface UIState {
  theme: 'light' | 'dark';
  autoScroll: boolean;
  streamMode: boolean;
  leftSidebarVisible: boolean;
  rightSidebarVisible: boolean;
}

// API响应 - 使用 unknown 代替 any
export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}
// 添加缺失的类型定义
export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

// 添加任务状态相关类型
export interface TaskStatus {
  id: string;
  name: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  created_at: string;
}

export interface SessionStatus {
  status: string;
  tasks: TaskStatus[];
}

export interface SessionOutput {
  output: string;
}
