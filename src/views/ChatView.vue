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

          <!-- 添加条件渲染 -->
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
        <!-- 添加条件渲染 -->
        <FilesView v-if="sessionStore.currentSessionId" :session-id="sessionStore.currentSessionId" />
        <div v-else class="no-session">
          <a-empty description="请先创建或选择会话" />
        </div>
      </a-col>
    </a-row>
  </a-layout-content>
</template>

<script setup lang="ts">
import SessionsView from './SessionsView.vue';
import FilesView from './FilesView.vue';
import ChatMessages from '@/components/chat/ChatMessages.vue';
import ChatInput from '@/components/chat/ChatInput.vue';
import { useSessionStore } from '@/stores/session.store';
import { useMessageStore } from '@/stores/message.store';
import type { FileInfo } from '@/types/app'; // 导入 FileInfo 类型

const sessionStore = useSessionStore();
const messageStore = useMessageStore();

const handleSessionSelected = (sessionId: string) => {
  sessionStore.switchSession(sessionId);
  messageStore.clearMessages();
};

// 使用 FileInfo[] 替代 any[]
const handleSendMessage = (content: string, files: FileInfo[]) => {
  if (!sessionStore.currentSessionId) return;

  messageStore.sendMessage(sessionStore.currentSessionId, content, files);
  // 这里会触发AI生成逻辑
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
  }

  .no-session {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
  }
}
</style>
