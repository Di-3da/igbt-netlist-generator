// src/stores/message.store.ts

import { defineStore } from 'pinia';
import messageService from '@/services/message.service';
import { ref } from 'vue';
import type { Message, FileInfo } from '@/types/app'; // 导入 FileInfo 类型

export const useMessageStore = defineStore('message', () => {
  const messages = ref<Message[]>([]);
  const isGenerating = ref(false);

  // 发送消息 - 使用 FileInfo[] 替代 any[]
  async function sendMessage(sessionId: string, content: string, files: FileInfo[] = []) {
    const message = await messageService.sendMessage(sessionId, content, files);
    messages.value.push(message);
    return message;
  }

  // 停止生成
  async function stopGeneration(sessionId: string, turnId: string) {
    const success = await messageService.stopGeneration(sessionId, turnId);
    if (success) {
      isGenerating.value = false;
    }
    return success;
  }

  // 添加系统消息
  function addSystemMessage(sessionId: string, content: string) {
    const message: Message = {
      id: `sys_${Date.now()}`,
      role: 'system',
      content,
      timestamp: new Date().toISOString(),
      sessionId
    };
    messages.value.push(message);
    return message;
  }

  // 添加助手消息
  function addAssistantMessage(sessionId: string, content: string) {
    const message: Message = {
      id: `ass_${Date.now()}`,
      role: 'assistant',
      content,
      timestamp: new Date().toISOString(),
      sessionId
    };
    messages.value.push(message);
    return message;
  }

  // 清空消息
  function clearMessages() {
    messages.value = [];
  }

  return {
    messages,
    isGenerating,
    sendMessage,
    stopGeneration,
    addSystemMessage,
    addAssistantMessage,
    clearMessages
  };
});
