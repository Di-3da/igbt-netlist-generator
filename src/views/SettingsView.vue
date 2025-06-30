<!-- src/views/SettingsView.vue -->
<template>
  <a-card title="⚙️ 系统设置" class="settings-view">
    <a-form layout="vertical">
      <!-- 主题设置 -->
      <a-form-item label="主题设置">
        <a-radio-group v-model:value="theme">
          <a-radio-button value="light">浅色模式</a-radio-button>
          <a-radio-button value="dark">深色模式</a-radio-button>
        </a-radio-group>
      </a-form-item>

      <a-form-item label="启用流式模式">
        <a-switch v-model:checked="uiStore.streamMode" @change="uiStore.setStreamMode" />
        <div class="setting-description">
          启用后消息将逐步显示，提供更流畅的体验
        </div>
      </a-form-item>

      <a-form-item label="自动启动会话">
        <a-switch v-model:checked="autoStart" @change="handleAutoStartChange" />
        <div class="setting-description">
          应用启动时自动恢复上次会话
        </div>
      </a-form-item>

      <a-form-item label="自动清理文件">
        <div class="cleanup-setting">
          <a-input-number v-model:value="cleanupDays" :min="1" :max="30" />
          <span class="suffix">天前的文件</span>
          <a-button type="primary" @click="applyCleanupSetting">应用</a-button>
        </div>
        <div class="setting-description">
          设置自动清理多少天前的临时文件
        </div>
      </a-form-item>
    </a-form>
  </a-card>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useUIStore } from '@/stores/ui.store';
import { message } from 'ant-design-vue';

const uiStore = useUIStore();

const autoStart = ref(true);
const cleanupDays = ref(7);
const theme = ref('light');

onMounted(() => {
  // 初始化设置值
  const savedAutoStart = localStorage.getItem('autoStart');
  autoStart.value = savedAutoStart !== null ? JSON.parse(savedAutoStart) : true;

  const savedCleanupDays = localStorage.getItem('cleanupDays');
  cleanupDays.value = savedCleanupDays ? parseInt(savedCleanupDays) : 7;

  theme.value = uiStore.theme;
});

// 监听主题变化
watch(theme, (newTheme) => {
  uiStore.toggleTheme(newTheme);
});

const handleAutoStartChange = (value: boolean) => {
  autoStart.value = value;
  localStorage.setItem('autoStart', JSON.stringify(value));
};

const applyCleanupSetting = () => {
  localStorage.setItem('cleanupDays', cleanupDays.value.toString());
  message.success('清理设置已保存');
};
</script>

<style scoped lang="scss">
@use '@/assets/styles/variables' as *;

.settings-view {
  padding: 24px;

  .setting-description {
    color: $text-secondary;
    font-size: $font-size-sm;
    margin-top: 4px;
  }

  .suffix {
    margin: 0 8px;
    color: $text-secondary;
  }

  .ant-input-number {
    width: 80px;
  }

  .cleanup-setting {
    display: flex;
    align-items: center;
    gap: 8px;
  }
}
</style>
