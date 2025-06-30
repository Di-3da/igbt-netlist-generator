<!-- src/views/FilesView.vue -->
<template>
  <a-card title="📁 文件管理" class="files-view">
    <a-button type="primary" block @click="handleDownloadNetlist">
      <template #icon><download-outlined /></template>
      下载网表文件
    </a-button>

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
import { DownloadOutlined } from '@ant-design/icons-vue';
import { ref, watch } from 'vue';
import { useFileStore } from '@/stores/file.store';
import { formatFileSize } from '@/utils/file';
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

watch(() => props.sessionId, async (newSessionId) => {
  if (newSessionId) {
    loading.value = true;
    files.value = await fileStore.listSessionFiles(newSessionId);
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
</script>

<style scoped lang="scss">
@use '@/assets/styles/variables' as *;

.files-view {
  height: 100%;

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
