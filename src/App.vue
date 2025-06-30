<template>
  <a-config-provider :theme="themeConfig">
    <a-layout class="app-layout" :class="theme">
      <!-- 引入 Sidebar 组件 -->
      <Sidebar />

      <!-- 主体内容区域 -->
      <a-layout class="main-layout">
        <!-- 顶部 Header -->
        <AppHeader />

        <!-- 内容区域 -->
        <a-layout-content class="main-content">
          <!-- 路由视图，动态加载不同页面 -->
          <router-view />
        </a-layout-content>
      </a-layout>
    </a-layout>
  </a-config-provider>

  <!-- Toast 消息组件 -->
  <ToastMessage ref="toastMessage" />

  <!-- 浮动模态框组件 -->
  <FloatingModal ref="floatingModal" />
</template>

<script setup lang="ts">
import { onMounted, ref, computed, watch } from 'vue';
import AppHeader from '@/components/layout/AppHeader.vue';  // 引入 Header 组件
import Sidebar from '@/components/layout/Sidebar.vue';   // 引入 Sidebar 组件
import ToastMessage from '@/components/ui/ToastMessage.vue';  // 引入 ToastMessage 组件
import FloatingModal from '@/components/ui/FloatingModal.vue';  // 引入 FloatingModal 组件
import { useSessionStore } from '@/stores/session.store';  // 引入 session 状态管理
import { useUIStore } from '@/stores/ui.store';  // 引入 UI 状态管理
import { useSettingStore } from '@/stores/setting.store'; // 引入设置存储
import theme from 'ant-design-vue/es/theme'; // 引入 Ant Design 主题算法

const sessionStore = useSessionStore();
const uiStore = useUIStore();
const settingStore = useSettingStore();

// 当前主题
const currentTheme = ref<'light' | 'dark'>(settingStore.theme);

// 监听主题变化
watch(() => settingStore.theme, (newTheme) => {
  currentTheme.value = newTheme;
  // 更新文档根元素的 data-theme 属性
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
});

// Ant Design 主题配置
const themeConfig = computed(() => ({
  algorithm: currentTheme.value === 'dark' ? theme.darkAlgorithm : theme.defaultAlgorithm,
}));

// 控制 Toast 消息的显示
const toastMessage = ref<InstanceType<typeof ToastMessage> | null>(null);  // 明确类型为 ToastMessage 实例或 null

const showToastMessage = () => {
  if (toastMessage.value) {
    toastMessage.value.showToast('成功', '这是一个示例通知', 'success');
  }
};

// 控制浮动模态框的显示
const floatingModal = ref<InstanceType<typeof FloatingModal> | null>(null);  // 明确类型为 FloatingModal 实例或 null

const showFloatingModal = () => {
  if (floatingModal.value) {
    floatingModal.value.showModal('标题', '这是浮动模态框的内容');
  }
};

// 组件挂载后执行的操作
onMounted(() => {
  // 初始化主题
  document.documentElement.setAttribute('data-theme', currentTheme.value);

  // 初始化 UI 设置
  uiStore.initializeUISettings();

  // 检查连接状态
  sessionStore.checkConnectionStatus();

  // 如果没有会话ID，则创建一个新的会话
  if (!sessionStore.currentSessionId) {
    sessionStore.createNewSession();
  }

  // 调用 showToastMessage 显示一个 Toast 消息
  showToastMessage();

  // 调用 showFloatingModal 显示浮动模态框
  showFloatingModal();
});
</script>

<style scoped lang="scss">
.app-layout {
  min-height: 100vh;
  display: flex;
  background-color: var(--bg-color);
  transition: background-color 0.3s;
}

.main-layout {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 24px;
  background: var(--bg-color);
}

.main-content {
  flex: 1;
  background: var(--card-bg);
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 2px 8px var(--shadow-color);
  border: 1px solid var(--border-color);
  transition: background-color 0.3s, box-shadow 0.3s, border-color 0.3s;
}
</style>
