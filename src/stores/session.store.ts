// src/stores/session.store.ts

import { defineStore } from 'pinia';
import sessionService from '@/services/session.service';
import { ref, computed } from 'vue';
import type { Session } from '@/types/app';

export const useSessionStore = defineStore('session', () => {
  const currentSessionId = ref<string | null>(null);
  const currentTurnId = ref<number | null>(null);
  const isConnected = ref(false);
  const sessions = ref<Session[]>([]);
  const sessionStats = ref({
    messageCount: 0,
    generationCount: 0,
    successCount: 0
  });

  const successRate = computed(() => {
    return sessionStats.value.generationCount > 0
      ? Math.round((sessionStats.value.successCount / sessionStats.value.generationCount) * 100)
      : 0;
  });

  // 检查连接状态
  async function checkConnectionStatus() {
    try {
      // 确保返回的是 boolean 类型
      const connected = await sessionService.checkHealth();
      isConnected.value = connected;
      return connected;
    } catch {
      isConnected.value = false;
      return false;
    }
  }

  // 创建新会话
  async function createNewSession() {
    try {
      const session = await sessionService.createSession();
      currentSessionId.value = session.id;

      // 处理可能的未定义 turnId
      currentTurnId.value = session.turnId ?? null;

      isConnected.value = true;
      await refreshSessionList();
      return session;
    } catch (error) {
      isConnected.value = false;
      throw error;
    }
  }

  // 刷新会话列表
  async function refreshSessionList() {
    sessions.value = await sessionService.listSessions();
  }

  // 切换会话
  async function switchSession(sessionId: string) {
    if (sessionId === currentSessionId.value) return;

    const session = await sessionService.getSession(sessionId);
    currentSessionId.value = sessionId;
    return session;
  }

  // 删除会话
  async function deleteSession(sessionId: string) {
    await sessionService.deleteSession(sessionId);
    if (sessionId === currentSessionId.value) {
      currentSessionId.value = null;
    }
    await refreshSessionList();
  }

  // 更新统计信息
  function updateStats(messageSent = false, generationSuccess = false) {
    if (messageSent) {
      sessionStats.value.messageCount++;
    }

    if (generationSuccess !== undefined) {
      sessionStats.value.generationCount++;
      if (generationSuccess) {
        sessionStats.value.successCount++;
      }
    }
  }

  return {
    currentSessionId,
    currentTurnId,
    isConnected,
    sessions,
    sessionStats,
    successRate,
    checkConnectionStatus,
    createNewSession,
    refreshSessionList,
    switchSession,
    deleteSession,
    updateStats
  };
});
