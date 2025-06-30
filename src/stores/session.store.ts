// src/stores/session.store.ts

import { defineStore } from 'pinia';
import sessionService from '@/services/session.service';
import { ref, computed } from 'vue';
import type { Session, Task, SessionOutput } from '@/types/app';

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

  // 任务状态相关状态
  const currentTask = ref<Task | null>(null);
  const currentOutput = ref<SessionOutput | null>(null);
  const taskProgress = ref(0); // 任务进度百分比
  const isPollingTaskStatus = ref(false); // 是否正在轮询任务状态
  let pollingInterval: number | null = null; // 轮询间隔ID

  // 计算成功率
  const successRate = computed(() => {
    return sessionStats.value.generationCount > 0
      ? Math.round((sessionStats.value.successCount / sessionStats.value.generationCount) * 100)
      : 0;
  });

  // 任务状态颜色映射
  const taskStatusColor = computed(() => {
    if (!currentTask.value) return 'default';
    switch (currentTask.value.status) {
      case 'pending': return 'blue';
      case 'processing': return 'gold';
      case 'completed': return 'green';
      case 'failed': return 'red';
      default: return 'default';
    }
  });

  // 检查连接状态
  async function checkConnectionStatus() {
    try {
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
      currentTurnId.value = session.turnId ?? null;
      isConnected.value = true;

      // 重置任务状态
      resetTaskStatus();

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

    try {
      const session = await sessionService.getSession(sessionId);
      currentSessionId.value = sessionId;

      // 重置任务状态
      resetTaskStatus();

      // 获取当前任务状态
      await fetchCurrentTaskStatus(sessionId);

      return session;
    } catch (error) {
      console.error('切换会话失败:', error);
      throw error;
    }
  }

  // 删除会话
  async function deleteSession(sessionId: string) {
    try {
      await sessionService.deleteSession(sessionId);

      if (sessionId === currentSessionId.value) {
        currentSessionId.value = null;
        resetTaskStatus(); // 重置任务状态
      }

      await refreshSessionList();
    } catch (error) {
      console.error('删除会话失败:', error);
      throw error;
    }
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

  // 获取当前任务状态
  async function fetchCurrentTaskStatus(sessionId: string) {
    if (!sessionId) return;

    try {
      const task = await sessionService.getCurrentTask(sessionId);
      currentTask.value = task;
      taskProgress.value = 0; // 重置进度

      // 如果任务正在处理中，开始轮询状态
      if (task.status === 'processing' && !isPollingTaskStatus.value) {
        startTaskStatusPolling(sessionId);
      }

      // 如果任务已完成，获取输出
      if (task.status === 'completed') {
        await fetchCurrentOutput(sessionId);
      }
    } catch (error) {
      console.error('获取任务状态失败:', error);
      currentTask.value = null;
    }
  }

  // 获取当前输出
  async function fetchCurrentOutput(sessionId: string) {
    if (!sessionId) return;

    try {
      const output = await sessionService.getCurrentOutput(sessionId);
      currentOutput.value = output;
    } catch (error) {
      console.error('获取输出失败:', error);
      currentOutput.value = null;
    }
  }

  // 开始轮询任务状态
  function startTaskStatusPolling(sessionId: string) {
    if (isPollingTaskStatus.value || !sessionId) return;

    isPollingTaskStatus.value = true;
    taskProgress.value = 0; // 重置进度

    // 清除已有轮询
    if (pollingInterval) {
      clearInterval(pollingInterval);
      pollingInterval = null;
    }

    // 启动新轮询
    pollingInterval = window.setInterval(async () => {
      if (!currentSessionId.value || currentSessionId.value !== sessionId) {
        stopTaskStatusPolling();
        return;
      }

      try {
        const task = await sessionService.getCurrentTask(sessionId);
        currentTask.value = task;

        // 更新进度（模拟）
        if (task.status === 'processing') {
          taskProgress.value = Math.min(taskProgress.value + 10, 95);
        }

        // 如果任务完成或失败，停止轮询
        if (task.status === 'completed' || task.status === 'failed') {
          stopTaskStatusPolling();
          taskProgress.value = 100;

          // 任务完成后获取输出
          if (task.status === 'completed') {
            await fetchCurrentOutput(sessionId);
          }
        }
      } catch (error) {
        console.error('轮询任务状态失败:', error);
        stopTaskStatusPolling();
      }
    }, 3000); // 每3秒轮询一次
  }

  // 停止任务状态轮询
  function stopTaskStatusPolling() {
    if (pollingInterval) {
      clearInterval(pollingInterval);
      pollingInterval = null;
    }
    isPollingTaskStatus.value = false;
  }

  // 重置任务状态
  function resetTaskStatus() {
    stopTaskStatusPolling();
    currentTask.value = null;
    currentOutput.value = null;
    taskProgress.value = 0;
  }

  return {
    // 状态
    currentSessionId,
    currentTurnId,
    isConnected,
    sessions,
    sessionStats,
    currentTask,
    currentOutput,
    taskProgress,

    // 计算属性
    taskStatusColor,
    successRate,

    // 方法
    checkConnectionStatus,
    createNewSession,
    refreshSessionList,
    switchSession,
    deleteSession,
    updateStats,
    fetchCurrentTaskStatus,
    fetchCurrentOutput,
    resetTaskStatus
  };
});
