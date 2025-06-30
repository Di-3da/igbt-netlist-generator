<template>
  <a-modal
    v-model:visible="isVisible"
    :title="modalTitle"
    :footer="null"
    width="400px"
    class="floating-modal"
  >
    <p>{{ modalContent }}</p>
    <a-button type="primary" @click="handleClose">关闭</a-button>
  </a-modal>
</template>

<script setup lang="ts">
import { ref } from 'vue';
const isVisible = ref(false);  // 控制模态框的可见性
const modalTitle = ref('提示');  // 模态框标题
const modalContent = ref('这是一个浮动的模态框内容');  // 模态框内容

// 打开模态框
const showModal = (title: string, content: string) => {
  modalTitle.value = title;
  modalContent.value = content;
  isVisible.value = true;
};

// 关闭模态框
const handleClose = () => {
  isVisible.value = false;
};

defineExpose({
  showModal,  // 让父组件能够控制这个模态框的显示
});
</script>

<style scoped lang="scss">
.floating-modal {
  .ant-modal-header {
    background-color: #1890ff;
    color: white;
  }

  .ant-modal-body {
    font-size: 14px;
    color: #333;
  }

  .ant-btn-primary {
    background-color: #1890ff;
    border-color: #1890ff;
  }
}
</style>
