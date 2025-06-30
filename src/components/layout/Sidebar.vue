<!-- eslint-disable vue/multi-word-component-names -->
// eslint-disable-next-line vue/multi-word-component-names // eslint-disable-next-line
vue/multi-word-component-names // eslint-disable-next-line vue/multi-word-component-names
<!-- src/components/layout/Sidebar.vue -->
<template>
  <a-layout-sider
    :collapsed="isCollapsed"
    :collapsed-width="80"
    width="250"
    class="app-sidebar"
    @collapse="toggleCollapse"
  >
    <a-menu theme="dark" mode="inline" :default-selected-keys="[selectedKey]">
      <a-menu-item key="1" @click="handleMenuClick('1')">
        <home-outlined />
        <span>首页</span>
      </a-menu-item>
      <a-menu-item key="2" @click="handleMenuClick('2')">
        <appstore-add-outlined />
        <span>文件管理</span>
      </a-menu-item>
      <a-menu-item key="3" @click="handleMenuClick('3')">
        <unordered-list-outlined />
        <span>会话管理</span>
      </a-menu-item>
      <a-menu-item key="4" @click="handleMenuClick('4')">
        <setting-outlined />
        <span>系统设置</span>
      </a-menu-item>
    </a-menu>
  </a-layout-sider>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import {
  HomeOutlined,
  AppstoreAddOutlined,
  UnorderedListOutlined,
  SettingOutlined,
} from '@ant-design/icons-vue'
import router from '@/router'
import { useRoute } from 'vue-router'

const route = useRoute()
const isCollapsed = ref(false)
const selectedKey = ref('1')

// 根据当前路由更新选中的菜单项
watch(
  () => route.name,
  (newRouteName) => {
    switch (newRouteName) {
      case 'home':
        selectedKey.value = '1'
        break
      case 'files':
        selectedKey.value = '2'
        break
      case 'sessions':
        selectedKey.value = '3'
        break
      case 'settings':
        selectedKey.value = '4'
        break
      default:
        selectedKey.value = '1'
    }
  },
  { immediate: true },
)

// 菜单点击事件处理
const handleMenuClick = (key: string) => {
  selectedKey.value = key
  switch (key) {
    case '1':
      router.push({ name: 'home' })
      break
    case '2':
      router.push({ name: 'files' })
      break
    case '3':
      router.push({ name: 'sessions' })
      break
    case '4':
      router.push({ name: 'settings' })
      break
  }
}

// 切换收缩状态
const toggleCollapse = (collapsed: boolean) => {
  isCollapsed.value = collapsed
}
</script>

<style scoped lang="scss">
@use '@/assets/styles/variables' as *;

.app-sidebar {
  background-color: $bg-primary;
  box-shadow: $shadow-light;
  height: 100vh;
  z-index: 10; /* 确保侧边栏在其他内容之上 */

  .ant-layout-sider-children {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .ant-menu-item {
    font-size: $font-size-base;
    padding: $spacing-sm $spacing-md;
    display: flex;
    align-items: center;
    transition: all 0.3s ease;

    svg {
      font-size: 20px;
      margin-right: 12px;
      transition: transform 0.3s ease;
    }

    span {
      font-size: $font-size-base;
      transition: opacity 0.3s ease;
    }

    &:hover {
      background-color: rgba($primary-color, 0.1) !important;
      transform: translateX(5px);

      svg {
        transform: scale(1.1);
      }
    }
  }

  .ant-menu-item-selected {
    background-color: $primary-color !important;
    color: white !important;
    font-weight: bold;

    &:hover {
      background-color: darken($primary-color, 10%) !important;
    }
  }

  /* 折叠状态下的样式 */
  &.ant-layout-sider-collapsed {
    .ant-menu-item {
      padding: 0;
      justify-content: center;

      span {
        opacity: 0;
        width: 0;
      }

      svg {
        margin-right: 0;
        font-size: 24px;
      }
    }
  }
}
</style>
