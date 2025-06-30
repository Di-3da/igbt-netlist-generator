// src/stores/ui.store.ts

import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useUIStore = defineStore('ui', () => {
  const theme = ref<'light' | 'dark'>('light');
  const autoScroll = ref(true);
  const streamMode = ref(true);
  const leftSidebarVisible = ref(true);
  const rightSidebarVisible = ref(true);

  // 初始化UI设置
  function initializeUISettings() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light' || savedTheme === 'dark') {
      theme.value = savedTheme;
    }

    const savedAutoScroll = localStorage.getItem('autoScroll');
    if (savedAutoScroll !== null) {
      autoScroll.value = savedAutoScroll === 'true';
    }

    const savedStreamMode = localStorage.getItem('streamMode');
    if (savedStreamMode !== null) {
      streamMode.value = savedStreamMode === 'true';
    }
  }

  // 切换主题
  function toggleTheme(newTheme: string) {
    theme.value = theme.value === 'light' ? 'dark' : 'light';
    localStorage.setItem('theme', theme.value);
  }

  // 设置自动滚动
  function setAutoScroll(value: boolean) {
    autoScroll.value = value;
    localStorage.setItem('autoScroll', value.toString());
  }

  // 设置流模式
  function setStreamMode(value: boolean) {
    streamMode.value = value;
    localStorage.setItem('streamMode', value.toString());
  }

  // 切换左侧边栏
  function toggleLeftSidebar() {
    leftSidebarVisible.value = !leftSidebarVisible.value;
  }

  // 切换右侧边栏
  function toggleRightSidebar() {
    rightSidebarVisible.value = !rightSidebarVisible.value;
  }

  return {
    theme,
    autoScroll,
    streamMode,
    leftSidebarVisible,
    rightSidebarVisible,
    initializeUISettings,
    toggleTheme,
    setAutoScroll,
    setStreamMode,
    toggleLeftSidebar,
    toggleRightSidebar
  };
});
