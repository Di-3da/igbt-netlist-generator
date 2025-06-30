<!-- src/components/chat/ChatInput.vue -->
<template>
  <div class="chat-input-container">
    <div v-if="uploadedFiles.length > 0" class="uploaded-files">
      <FileCard
        v-for="file in uploadedFiles"
        :key="file.id"
        :file="file"
        @remove="handleRemoveFile"
        @download="handleDownloadFile"
      />
    </div>

    <div class="input-area">
      <a-upload
        :before-upload="beforeUpload"
        :show-upload-list="false"
        accept=".txt,.sp,.cir,.net,.json,.csv,.py"
      >
        <a-button type="text" class="attachment-btn">
          <paper-clip-outlined />
        </a-button>
      </a-upload>

      <a-textarea
        v-model:value="message"
        placeholder="请详细描述您需要的IGBT电路..."
        :auto-size="{ minRows: 1, maxRows: 4 }"
        @keydown.enter="handleEnter"
      />

      <a-button
        type="primary"
        @click="sendMessage"
        :loading="isSending"
        :disabled="!message.trim()"
      >
        <template #icon>
          <send-outlined />
        </template>
      </a-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { PaperClipOutlined, SendOutlined } from '@ant-design/icons-vue';
import FileCard from '@/components/ui/FileCard.vue';
import { useFileStore } from '@/stores/file.store';
import { useSessionStore } from '@/stores/session.store';
import { isAllowedFileType, isFileSizeValid } from '@/utils/file';
import { computed } from 'vue';
import type { FileInfo } from '@/types/app';

const props = defineProps({
  sessionId: {
    type: String,
    required: true
  }
});

const emit = defineEmits(['send']);

const fileStore = useFileStore();
const sessionStore = useSessionStore();

const message = ref('');
const isSending = ref(false);
const uploadedFiles = computed(() => fileStore.currentUploadedFiles);

const handleEnter = (e: KeyboardEvent) => {
  if (e.shiftKey) return;
  e.preventDefault();
  sendMessage();
};

const beforeUpload = (file: File) => {
  if (!isAllowedFileType(file)) {
    console.error('不支持的文件类型');
    return false;
  }

  if (!isFileSizeValid(file, 5)) {
    console.error('文件大小超过限制');
    return false;
  }

  fileStore.uploadFile(props.sessionId, file);
  return false; // 阻止自动上传
};

const handleRemoveFile = (fileId: string) => {
  fileStore.removeFile(fileId);
};

const handleDownloadFile = (file: FileInfo) => {
  fileStore.downloadFile(props.sessionId, file);
};
const sendMessage = async () => {
  if (!message.value.trim()) return;

  isSending.value = true;
  try {
    emit('send', message.value, uploadedFiles.value);
    message.value = '';
    fileStore.clearUploadedFiles();
    sessionStore.updateStats(true);
  } catch (error) {
    console.error('发送消息失败:', error);
  } finally {
    isSending.value = false;
  }
};
</script>

<style scoped lang="scss">
@use '@/assets/styles/variables' as *;

.chat-input-container {
  border-top: 1px solid $border-color;
  padding: 16px;
  background: $bg-primary;

  .uploaded-files {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 12px;
  }

  .input-area {
    display: flex;
    gap: 8px;
    align-items: flex-end;

    .attachment-btn {
      height: 40px;
      font-size: 18px;
    }

    .ant-textarea {
      flex: 1;
    }
  }
}
</style>
