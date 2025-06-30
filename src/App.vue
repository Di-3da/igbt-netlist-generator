<template>
  <a-layout class="app-layout">
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

  <!-- Toast 消息组件 -->
  <ToastMessage ref="toastMessage" />

  <!-- 浮动模态框组件 -->
  <FloatingModal ref="floatingModal" />
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import AppHeader from '@/components/layout/AppHeader.vue';  // 引入 Header 组件
import Sidebar from '@/components/layout/Sidebar.vue';   // 引入 Sidebar 组件
import ToastMessage from '@/components/ui/ToastMessage.vue';  // 引入 ToastMessage 组件
import FloatingModal from '@/components/ui/FloatingModal.vue';  // 引入 FloatingModal 组件
import { useSessionStore } from '@/stores/session.store';  // 引入 session 状态管理
import { useUIStore } from '@/stores/ui.store';  // 引入 UI 状态管理

const sessionStore = useSessionStore();
const uiStore = useUIStore();

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
}

.main-layout {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 24px;
  background: #f0f2f5;
}

.main-content {
  flex: 1;
  background: #fff;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.09);
}
</style>
