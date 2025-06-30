// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/ChatView.vue')  // 动态导入 ChatView.vue
  },
  {
    path: '/chat',
    name: 'chat',
    component: () => import('@/views/ChatView.vue')  // 动态导入 ChatView.vue
  },
  {
    path: '/files',
    name: 'files',
    component: () => import('@/views/FilesView.vue')
  },
  {
    path: '/sessions',
    name: 'sessions',
    component: () => import('@/views/SessionsView.vue')
  },
  {
    path: '/settings',
    name: 'settings',
    component: () => import('@/views/SettingsView.vue')
  }

];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

export default router;
