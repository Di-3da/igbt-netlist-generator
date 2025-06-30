<template>
  <div :class="['message-item', message.role]">
    <div class="message-content">
      <span class="message-role">{{ roleLabel }}：</span>{{ message.content }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, defineProps } from 'vue';

const props = defineProps({
  message: {
    type: Object,
    required: true
  }
});

const roleLabel = computed(() => {
  switch (props.message.role) {
    case 'user': return '用户';
    case 'assistant': return '助手';
    case 'system': return '系统';
    default: return '';
  }
});
</script>

<style scoped lang="scss">
@import '@/assets/styles/variables';

.message-item {
  padding: 8px;
  margin-bottom: 8px;
  border-radius: $border-radius;
  background-color: $bg-secondary;

  &.user {
    background-color: $primary-color;
    color: white;
  }

  &.assistant {
    background-color: #f0f0f0;
    color: $text-primary;
  }

  &.system {
    background-color: #e6f7ff;
    color: $text-secondary;
  }

  .message-content {
    font-size: $font-size-base;

    .message-role {
      font-weight: bold;
      margin-right: 4px;
    }
  }
}
</style>
