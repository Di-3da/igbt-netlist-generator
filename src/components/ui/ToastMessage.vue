<template>
  <a-notification
    v-if="isVisible"
    :message="message"
    :description="description"
    :duration="duration"
    :type="type"
    @close="handleClose"
    class="toast-message"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue';

const isVisible = ref(true);  // 控制 Toast 消息是否显示
const message = ref('通知标题');  // Toast 标题
const description = ref('这是 Toast 的描述信息');  // Toast 描述信息
const duration = ref(3);  // Toast 显示的持续时间，单位是秒
const type = ref('success');  // Toast 类型，success, error, info, warning

// 显示 Toast 消息
const showToast = (msg: string, desc: string, toastType: string) => {
  message.value = msg;
  description.value = desc;
  type.value = toastType;
  isVisible.value = true;

  setTimeout(() => {
    isVisible.value = false;
  }, duration.value * 1000);
};

// 关闭 Toast 消息
const handleClose = () => {
  isVisible.value = false;
};

defineExpose({
  showToast,  // 让父组件可以调用显示消息
});
</script>

<style scoped lang="scss">
.toast-message {
  .ant-notification-notice {
    border-radius: 4px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
}
</style>
