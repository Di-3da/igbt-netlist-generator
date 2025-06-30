<!-- src/components/ui/FileCard.vue -->
<template>
  <a-card class="file-card" hoverable>
    <template #cover>
      <div class="file-icon">
        <file-outlined />
        <span v-if="file.uploaded" class="upload-status">✓</span>
      </div>
    </template>

    <a-card-meta>
      <template #title>
        <a-tooltip :title="file.name">
          <div class="file-name">{{ truncateFileName(file.name) }}</div>
        </a-tooltip>
      </template>

      <template #description>
        <div class="file-size">{{ formatFileSize(file.size) }}</div>
      </template>
    </a-card-meta>

    <template #actions>
      <a-button type="link" @click="handleDownload">
        <download-outlined />
      </a-button>
      <a-button type="link" danger @click="handleRemove">
        <delete-outlined />
      </a-button>
    </template>
  </a-card>
</template>

<script setup lang="ts">
import { FileOutlined, DownloadOutlined, DeleteOutlined } from '@ant-design/icons-vue'
import { formatFileSize, truncateFileName } from '@/utils/file'
import { defineProps } from 'vue'

const props = defineProps({
  file: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['download', 'remove'])

const handleDownload = () => {
  emit('download', props.file)
}

const handleRemove = () => {
  emit('remove', props.file.id)
}
</script>

<style scoped lang="scss">
@use '@/assets/styles/variables' as *;

.file-card {
  width: 120px;
  margin-bottom: 16px;

  :deep(.ant-card-cover) {
    padding: 16px;
    text-align: center;
    position: relative;
  }

  .file-icon {
    font-size: 32px;
    color: $primary-color;
    position: relative;
  }

  .upload-status {
    position: absolute;
    top: -4px;
    right: -4px;
    background: $success-color;
    color: white;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    font-size: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .file-name {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 12px;
  }

  .file-size {
    font-size: 10px;
    color: $text-secondary;
  }

  :deep(.ant-card-actions) {
    padding: 0;

    li {
      margin: 0;
      width: 50%;
    }
  }
}
</style>
