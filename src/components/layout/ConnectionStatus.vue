<!-- src/components/layout/ConnectionStatus.vue -->
<template>
  <div class="connection-status">
    <a-space>
      <span class="status-dot" :class="statusClass"></span>
      <span>{{ statusText }}</span>
    </a-space>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useSessionStore } from '@/stores/session.store';

const sessionStore = useSessionStore();

const statusClass = computed(() => {
  return {
    'connected': sessionStore.isConnected,
    'disconnected': !sessionStore.isConnected
  };
});

const statusText = computed(() => {
  return sessionStore.isConnected ? '已连接' : '未连接';
});
</script>

<style scoped lang="scss">
@use '@/assets/styles/variables' as *;

.connection-status {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;

  .status-dot {
    display: inline-block;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    margin-right: 4px;

    &.connected {
      background: $success-color;
    }

    &.disconnected {
      background: $error-color;
    }
  }
}
</style>
