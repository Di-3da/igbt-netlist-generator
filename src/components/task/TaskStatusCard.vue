<!-- src/components/task/TaskStatusCard.vue -->
<template>
  <a-card title="🔄 当前任务状态" class="task-status-card">
    <a-descriptions bordered size="small">
      <a-descriptions-item label="任务ID" :span="3">
        {{ task.id }}
      </a-descriptions-item>
      <a-descriptions-item label="任务名称" :span="3">
        {{ task.name }}
      </a-descriptions-item>
      <a-descriptions-item label="状态" :span="3">
        <a-tag :color="statusColor">
          {{ task.status }}
        </a-tag>
      </a-descriptions-item>
      <a-descriptions-item label="创建时间" :span="3">
        {{ new Date(task.created_at).toLocaleString() }}
      </a-descriptions-item>
    </a-descriptions>

    <a-progress
      v-if="task.status === 'processing'"
      :percent="progress"
      status="active"
      class="task-progress"
    />

    <a-result
      v-if="task.status === 'completed'"
      status="success"
      title="任务完成"
      sub-title="电路生成成功"
    />

    <a-result
      v-if="task.status === 'failed'"
      status="error"
      title="任务失败"
      :sub-title="task.error || '电路生成过程中发生错误'"
    />
  </a-card>
</template>

<script setup lang="ts">
import { watch, defineProps } from 'vue';
import type { Task } from '@/types/app';

// 将defineProps返回值赋给props变量
const props = defineProps({
  task: {
    type: Object as () => Task,
    required: true
  },
  progress: {
    type: Number,
    default: 0
  },
  statusColor: {
    type: String,
    default: 'blue'
  }
});

// 正确使用props变量监听状态变化
watch(() => props.task.status, (newStatus) => {
  if (newStatus === 'completed') {
    console.log('任务完成，显示结果');
    // 这里可以添加任务完成时的UI效果，如动画
  } else if (newStatus === 'failed') {
    console.error('任务失败，显示错误');
    // 这里可以添加任务失败时的UI效果
  }
});
</script>

<style scoped lang="scss">
.task-status-card {
  margin-bottom: 16px;

  .task-progress {
    margin-top: 16px;
  }
}
</style>
