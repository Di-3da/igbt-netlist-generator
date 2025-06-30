<!-- src/components/chat/ChatMessages.vue -->
<template>
  <a-card class="chat-messages" v-if="messages.length > 0">
    <a-card-meta>
      <template #title>
        <h3>聊天记录</h3>
      </template>
    </a-card-meta>

    <div class="message-list">
      <div v-for="message in messages" :key="message.id" :class="['message-item', message.role]">
        <div class="message-content">
          <div v-if="message.role === 'user'" class="user-message">
            <span class="message-role">用户：</span>{{ message.content }}
          </div>
          <div v-if="message.role === 'assistant'" class="assistant-message">
            <span class="message-role">助手：</span>{{ message.content }}
          </div>
          <div v-if="message.role === 'system'" class="system-message">
            <span class="message-role">系统：</span>{{ message.content }}
          </div>
        </div>
      </div>
    </div>
  </a-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useMessageStore } from '@/stores/message.store'

const messageStore = useMessageStore()

const messages = computed(() => messageStore.messages)
</script>

<style scoped lang="scss">
@use '@/assets/styles/variables' as *; // 替换 @import

.chat-messages {
  margin-top: 16px;
  padding: 16px;
  background-color: $bg-primary;
  border-radius: $border-radius;
  box-shadow: $shadow-light;

  .message-list {
    max-height: 400px;
    overflow-y: auto;
  }

  .message-item {
    padding: 8px;
    margin-bottom: 12px;
    border-radius: $border-radius;
    background-color: $bg-secondary;

    &.user {
      background-color: $primary-color;
      color: white;
    }

    &.assistant {
      background-color: #f0f0f0;
      color: $text-primary;
    }

    &.system {
      background-color: #e6f7ff;
      color: $text-secondary;
    }

    .message-content {
      font-size: $font-size-base;

      .message-role {
        font-weight: bold;
      }
    }
  }
}
</style>
