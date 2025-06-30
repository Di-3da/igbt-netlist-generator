// src/stores/message.store.ts

import { defineStore } from 'pinia';
import messageService from '@/services/message.service';
import { ref } from 'vue';
import type { Message, FileInfo } from '@/types/app'; // 导入 FileInfo 类型
// 现在可以安全地导入 saveAs
import { saveAs } from 'file-saver';


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

  // 导出对话历史
  function exportHistory(sessionId: string) {
    // 过滤出当前会话的消息
    const sessionMessages = messages.value.filter(
      msg => msg.sessionId === sessionId
    );

    // 创建消息历史的 JSON 数据
    const historyData = {
      sessionId,
      timestamp: new Date().toISOString(),
      messageCount: sessionMessages.length,
      messages: sessionMessages
    };

    // 创建 Blob 对象并保存文件
    const blob = new Blob(
      [JSON.stringify(historyData, null, 2)],
      { type: 'application/json' }
    );

    // 生成文件名
    const fileName = `igbt_chat_history_${sessionId.substring(0, 8)}.json`;

    // 使用 file-saver 保存文件
    saveAs(blob, fileName);

    return fileName;
  }

  return {
    messages,
    isGenerating,
    sendMessage,
    stopGeneration,
    addSystemMessage,
    addAssistantMessage,
    clearMessages,
    exportHistory // 导出新添加的函数
  };
});
