<!-- eslint-disable vue/multi-word-component-names -->
// eslint-disable-next-line vue/multi-word-component-names
<template>
  <a-layout-sider
    :collapsed="isCollapsed"
    :collapsed-width="80"
    width="250"
    class="app-sidebar"
    @collapse="toggleCollapse"
  >
    <a-menu
      theme="dark"
      mode="inline"
      :default-selected-keys="[selectedKey]"
    >
      <a-menu-item key="1" @click="handleMenuClick('1')">
        <home-outlined />
        <span>首页</span>
      </a-menu-item>
      <a-menu-item key="2" @click="handleMenuClick('2')">
        <appstore-add-outlined />
        <span>文件管理</span>
      </a-menu-item>
      <a-menu-item key="3" @click="handleMenuClick('3')">
        <setting-outlined />
        <span>设置</span>
      </a-menu-item>
    </a-menu>
  </a-layout-sider>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { HomeOutlined, AppstoreAddOutlined, SettingOutlined } from '@ant-design/icons-vue';
import router from '@/router';

// 状态：是否收缩
const isCollapsed = ref(false);

// 当前选中的菜单项
const selectedKey = ref('1');

// 菜单点击事件处理
const handleMenuClick = (key: string) => {
  selectedKey.value = key;
  switch (key) {
    case '1':
      router.push({ name: 'home' });
      break;
    case '2':
      router.push({ name: 'files' });
      break;
    case '3':
      router.push({ name: 'sessions' });
      break;
  }
};

// 切换收缩状态
const toggleCollapse = (collapsed: boolean) => {
  isCollapsed.value = collapsed;
};
</script>

<style scoped lang="scss">
@use '@/assets/styles/variables' as *;

.app-sidebar {
  background-color: $bg-primary;
  box-shadow: $shadow-light;
  height: 100vh;

  .ant-layout-sider-children {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .ant-menu-item {
    font-size: $font-size-base;
    padding: $spacing-sm $spacing-md;

    svg {
      font-size: 20px;
      margin-right: 12px;
    }

    span {
      font-size: $font-size-base;
    }
  }

  .ant-menu-item-selected {
    background-color: $primary-color !important;
  }
}
</style>
