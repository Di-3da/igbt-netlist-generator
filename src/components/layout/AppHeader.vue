<!-- src/components/layout/AppHeader.vue -->
<template>
  <a-layout-header class="app-header">
    <div class="header-left">
      <h1>🚀 IGBT网表生成器</h1>
      <a-tag :color="isConnected ? 'success' : 'error'">
        {{ isConnected ? '已连接' : '未连接' }}
      </a-tag>
    </div>

    <div class="header-right">
      <a-space>
        <a-tag :color="isGenerating ? 'processing' : 'success'">
          <a-space>
            <span class="status-dot" :class="statusDotClass"></span>
            <span>{{ statusText }}</span>
          </a-space>
        </a-tag>

        <a-button type="text" @click="toggleTheme" class="theme-toggle">
          <template #icon>
            <bulb-filled v-if="theme === 'dark'" />
            <bulb-outlined v-else />
          </template>
        </a-button>
      </a-space>
    </div>
  </a-layout-header>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { BulbOutlined, BulbFilled } from '@ant-design/icons-vue'; // 修改导入的图标
import { useSessionStore } from '@/stores/session.store';
import { useMessageStore } from '@/stores/message.store';
import { useUIStore } from '@/stores/ui.store';

const sessionStore = useSessionStore();
const messageStore = useMessageStore();
const uiStore = useUIStore();

const isConnected = computed(() => sessionStore.isConnected);
const isGenerating = computed(() => messageStore.isGenerating);
const theme = computed(() => uiStore.theme);

const statusDotClass = computed(() => {
  return {
    'dot-connected': isConnected.value && !isGenerating.value,
    'dot-generating': isGenerating.value,
    'dot-disconnected': !isConnected.value
  };
});

const statusText = computed(() => {
  if (isGenerating.value) return '生成中...';
  return isConnected.value ? '就绪' : '未连接';
});

const toggleTheme = () => {
  uiStore.toggleTheme();
};
</script>

<style scoped lang="scss">
@use '@/assets/styles/variables' as *; 

.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: $bg-primary;
  border-bottom: 1px solid $border-color;
  padding: 0 24px;
  height: 64px;
  box-shadow: $shadow-light;
  z-index: 1;

  .header-left {
    display: flex;
    align-items: center;
    gap: 16px;

    h1 {
      margin: 0;
      font-size: 18px;
      font-weight: bold;
    }
  }

  .theme-toggle {
    font-size: 18px;
    color: $text-primary;
  }

  .status-dot {
    display: inline-block;
    width: 8px;
    height: 8px;
    border-radius: 50%;

    &.dot-connected {
      background: $success-color;
    }

    &.dot-generating {
      background: $warning-color;
      animation: pulse 1.5s infinite;
    }

    &.dot-disconnected {
      background: $error-color;
    }
  }
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
</style>
