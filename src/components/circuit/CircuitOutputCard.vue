<!-- src/components/circuit/CircuitOutputCard.vue -->
<template>
  <a-card title="🔌 电路输出" class="circuit-output-card">
    <div class="output-actions">
      <a-button type="primary" @click="copyOutput">
        <copy-outlined />
        复制输出
      </a-button>
      <a-button @click="downloadOutput">
        <download-outlined />
        下载网表
      </a-button>
    </div>

    <pre ref="outputContainer" class="circuit-output">{{ output }}</pre>
  </a-card>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue';
import { CopyOutlined, DownloadOutlined } from '@ant-design/icons-vue';
import { useSessionStore } from '@/stores/session.store';
import { message } from 'ant-design-vue';

const sessionStore = useSessionStore();
const outputContainer = ref<HTMLElement | null>(null);

const props = defineProps({
  output: {
    type: String,
    required: true
  }
});

// 当有新输出时自动滚动到底部
watch(() => props.output, (newOutput) => {
  if (newOutput) {
    nextTick(() => {
      if (outputContainer.value) {
        outputContainer.value.scrollTop = outputContainer.value.scrollHeight;
      }
    });
  }
});

// 复制输出内容
const copyOutput = () => {
  navigator.clipboard.writeText(props.output)
    .then(() => {
      message.success('电路输出已复制到剪贴板');
    })
    .catch(err => {
      console.error('复制失败:', err);
      message.error('复制失败');
    });
};

// 下载输出为网表文件
const downloadOutput = async () => {
  if (sessionStore.currentSessionId) {
    try {
      // 创建Blob对象
      const blob = new Blob([props.output], { type: 'text/plain' });

      // 创建下载链接
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `igbt_circuit_${sessionStore.currentSessionId.substring(0, 8)}.sp`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      message.success('网表文件下载成功');
    } catch (error) {
      console.error('下载失败:', error);
      message.error('网表文件下载失败');
    }
  }
};
</script>

<style scoped lang="scss">
.circuit-output-card {
  .output-actions {
    display: flex;
    gap: 8px;
    margin-bottom: 12px;
  }

  .circuit-output {
    max-height: 300px;
    overflow: auto;
    background: #f9f9f9;
    padding: 12px;
    border-radius: 4px;
    font-family: monospace;
    white-space: pre-wrap;
    line-height: 1.5;
    scroll-behavior: smooth; /* 添加平滑滚动效果 */
  }
}
</style>
