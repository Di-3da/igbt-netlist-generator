<!-- src/views/FilesView.vue -->
<template>
  <a-card title="📁 文件管理" class="files-view">
    <div class="actions">
      <a-button type="primary" @click="handleDownloadNetlist">
        <template #icon><download-outlined /></template>
        下载网表文件
      </a-button>

      <a-popconfirm
        title="确定要清理旧文件吗？"
        ok-text="确定"
        cancel-text="取消"
        @confirm="cleanOldFiles"
      >
        <a-button danger>
          <template #icon><delete-outlined /></template>
          清理旧文件
        </a-button>
      </a-popconfirm>
    </div>

    <a-divider />

    <a-list
      :data-source="files"
      :loading="loading"
      class="file-list"
    >
      <template #header>
        <div class="list-header">会话文件</div>
      </template>

      <template #renderItem="{ item }">
        <a-list-item>
          <a-list-item-meta>
            <template #title>
              <span class="file-name">{{ item.name }}</span>
            </template>
            <template #description>
              <div class="file-info">
                <span>大小: {{ formatFileSize(item.size) }}</span>
                <span>上传: {{ formatDate(item.createdAt) }}</span>
              </div>
            </template>
          </a-list-item-meta>

          <template #actions>
            <a-button type="link" @click="downloadFile(item)">
              <download-outlined />
            </a-button>
          </template>
        </a-list-item>
      </template>
    </a-list>
  </a-card>
</template>

<script setup lang="ts">
import { DownloadOutlined, DeleteOutlined } from '@ant-design/icons-vue';
import { ref, watch } from 'vue';
import { useFileStore } from '@/stores/file.store';
import { formatFileSize } from '@/utils/file';
import { message } from 'ant-design-vue';
import type { FileInfo } from '@/types/app';

const fileStore = useFileStore();
const files = ref<FileInfo[]>([]);
const loading = ref(false);

const props = defineProps<{
  sessionId: string | null;
}>();

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString();
};

watch(() => props.sessionId, async (newVal) => {
  if (newVal) {
    loading.value = true;
    files.value = await fileStore.listSessionFiles(newVal);
    loading.value = false;
  }
}, { immediate: true });

const downloadFile = (file: FileInfo) => {
  if (props.sessionId) {
    fileStore.downloadFile(props.sessionId, file);
  }
};

const handleDownloadNetlist = () => {
  if (props.sessionId) {
    fileStore.quickDownloadNetlist(props.sessionId);
  }
};

// 清理旧文件功能
const cleanOldFiles = async () => {
  if (props.sessionId) {
    try {
      loading.value = true;

      // 调用清理方法，清理7天前的文件
      const result = await fileStore.cleanOldFiles(
        props.sessionId,
        7 // 清理7天前的文件
      );

      if (result.success) {
        message.success(`成功清理 ${result.cleanedFiles} 个旧文件`);
        // 刷新文件列表
        files.value = await fileStore.listSessionFiles(props.sessionId);
      } else {
        message.error('清理文件失败');
      }
    } catch (error) {
      console.error('清理文件出错:', error);
      message.error('清理文件出错');
    } finally {
      loading.value = false;
    }
  } else {
    message.warning('请先选择会话');
  }
};
</script>

<style scoped lang="scss">
@use '@/assets/styles/variables' as *;

.files-view {
  height: 100%;

  .actions {
    display: flex;
    gap: 8px;
    margin-bottom: 12px;

    button {
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }

  .file-list {
    max-height: 70vh;
    overflow-y: auto;

    .file-name {
      font-weight: 500;
    }

    .file-info {
      display: flex;
      justify-content: space-between;
      font-size: 12px;
      color: $text-secondary;
    }
  }
}
</style>
