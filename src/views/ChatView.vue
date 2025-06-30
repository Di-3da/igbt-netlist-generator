<!-- src/views/ChatView.vue -->
<template>
  <a-layout-content class="chat-view">
    <a-row :gutter="16">
      <a-col :span="6">
        <SessionsView @session-selected="handleSessionSelected" />
      </a-col>

      <a-col :span="12">
        <div class="chat-container">
          <a-page-header title="💬 智能对话生成" />

          <!-- 任务状态监控 -->
          <TaskStatusCard
            v-if="sessionStore.currentSessionId && sessionStore.currentTask"
            :task="{
              ...sessionStore.currentTask,
              error: sessionStore.currentTask.error ?? ''
            }"
            :progress="sessionStore.taskProgress"
            :status-color="sessionStore.taskStatusColor"
            class="task-status-card"
          />

          <!-- 电路输出视图 -->
          <CircuitOutputCard
            v-if="sessionStore.currentSessionId && sessionStore.currentOutput"
            :output="sessionStore.currentOutput.output"
            class="output-card"
          />

          <!-- 聊天消息区域 -->
          <template v-if="sessionStore.currentSessionId">
            <ChatMessages
              :messages="messageStore.messages"
              :session-id="sessionStore.currentSessionId"
            />

            <ChatInput
              :session-id="sessionStore.currentSessionId"
              @send="handleSendMessage"
            />
          </template>
          <div v-else class="no-session">
            <a-empty description="请先创建或选择会话" />
          </div>
        </div>
      </a-col>

      <a-col :span="6">
        <!-- 文件管理区域 -->
        <FilesView v-if="sessionStore.currentSessionId" :session-id="sessionStore.currentSessionId" />
        <div v-else class="no-session">
          <a-empty description="请先创建或选择会话" />
        </div>
      </a-col>
    </a-row>
  </a-layout-content>
</template>

<script setup lang="ts">
import { watch } from 'vue'; // 添加 watch
import SessionsView from './SessionsView.vue';
import FilesView from './FilesView.vue';
import ChatMessages from '@/components/chat/ChatMessages.vue';
import ChatInput from '@/components/chat/ChatInput.vue';
import TaskStatusCard from '@/components/task/TaskStatusCard.vue'; // 新增任务状态卡片
import CircuitOutputCard from '@/components/circuit/CircuitOutputCard.vue'; // 新增电路输出卡片
import { useSessionStore } from '@/stores/session.store';
import { useMessageStore } from '@/stores/message.store';
import type { FileInfo } from '@/types/app';

const sessionStore = useSessionStore();
const messageStore = useMessageStore();

// 监听任务状态变化
watch(() => sessionStore.currentTask, (newTask) => {
  if (!newTask) return; // 处理可能为 undefined 的情况

  if (newTask.status === 'completed') {
    // ...处理完成逻辑...
  } else if (newTask.status === 'failed') {
    // 使用可选链安全访问 error
    const errorMsg = newTask.error || '未知错误';
    console.error('任务失败:', errorMsg);

    messageStore.addSystemMessage(
      sessionStore.currentSessionId || '',
      `任务失败: ${errorMsg}`
    );
  }
});

const handleSessionSelected = (sessionId: string) => {
  sessionStore.switchSession(sessionId);
  messageStore.clearMessages();

  // 获取当前任务状态
  if (sessionId) {
    sessionStore.fetchCurrentTaskStatus(sessionId);
  }
};

// 发送消息处理
const handleSendMessage = async (content: string, files: FileInfo[]) => {
  if (!sessionStore.currentSessionId) return;

  try {
    // 发送消息
    await messageStore.sendMessage(sessionStore.currentSessionId, content, files);

    // 发送消息后开始监控任务状态
    sessionStore.fetchCurrentTaskStatus(sessionStore.currentSessionId);

    // 更新统计信息（发送消息）
    sessionStore.updateStats(true);
  } catch (error) {
    console.error('发送消息失败:', error);
    messageStore.addSystemMessage(
      sessionStore.currentSessionId || '',
      '消息发送失败，请重试'
    );
  }
};

</script>

<style scoped lang="scss">
.chat-view {
  padding: 16px;
  height: calc(100vh - 64px);

  .chat-container {
    display: flex;
    flex-direction: column;
    height: 100%;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.09);
    overflow: hidden;
    gap: 16px; // 添加组件间距
  }

  .no-session {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
  }

  .task-status-card, .output-card {
    margin-bottom: 16px;
  }
}
</style>
