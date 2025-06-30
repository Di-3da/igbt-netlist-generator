<!-- src/views/SessionsView.vue -->
<template>
  <a-card title="📋 会话管理" class="sessions-view">
    <a-button type="primary" block @click="createNewSession">
      <template #icon><plus-outlined /></template>
      创建新会话
    </a-button>

    <a-divider />

    <a-list
      :data-source="sessionStore.sessions"
      :loading="loading"
      class="session-list"
    >
      <template #header>
        <div class="list-header">会话列表</div>
      </template>

      <template #renderItem="{ item }">
        <a-list-item
          :class="{ 'active-session': item.id === sessionStore.currentSessionId }"
          @click="selectSession(item.id)"
        >
          <a-list-item-meta>
            <template #title>
              <span class="session-id">{{ truncateSessionId(item.id) }}</span>
            </template>
            <template #description>
              <div class="session-info">
                <span>创建: {{ formatDate(item.created_at) }}</span>
                <span>任务: {{ item.tasks.length }}</span>
              </div>
            </template>
          </a-list-item-meta>

          <template #actions>
            <a-button type="link" danger @click.stop="deleteSession(item.id)">
              <delete-outlined />
            </a-button>
          </template>
        </a-list-item>
      </template>
    </a-list>

    <a-divider />

    <div class="session-stats">
      <h4>📊 会话统计</h4>
      <div class="stats-grid">
        <div class="stat-item">
          <div class="stat-value">{{ sessionStore.sessionStats.messageCount }}</div>
          <div class="stat-label">消息</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">{{ sessionStore.sessionStats.generationCount }}</div>
          <div class="stat-label">生成</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">{{ sessionStore.successRate }}%</div>
          <div class="stat-label">成功率</div>
        </div>
      </div>
    </div>
  </a-card>
</template>

<script setup lang="ts">
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons-vue';
import { useSessionStore } from '@/stores/session.store';
import { ref } from 'vue';
import { message } from 'ant-design-vue';

const sessionStore = useSessionStore();
const loading = ref(false);

const truncateSessionId = (id: string) => {
  return id.substring(0, 8) + '...';
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString();
};

const createNewSession = async () => {
  try {
    loading.value = true;
    await sessionStore.createNewSession();
    message.success('新会话已创建');
  } catch (error) {
    console.error('创建会话失败:', error); // 记录错误详情
    message.error('创建会话失败');
  } finally {
    loading.value = false;
  }
};
const selectSession = (sessionId: string) => {
  sessionStore.switchSession(sessionId);
};

const deleteSession = async (sessionId: string) => {
  try {
    loading.value = true;
    await sessionStore.deleteSession(sessionId);
    message.success('会话已删除');
  } catch {
    message.error('删除会话失败');
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped lang="scss">
@use '@/assets/styles/variables' as *; 

.sessions-view {
  height: 100%;

  .session-list {
    max-height: 400px;
    overflow-y: auto;

    .active-session {
      background-color: $bg-tertiary;
      border-left: 3px solid $primary-color;
    }

    .session-id {
      font-weight: 500;
    }

    .session-info {
      display: flex;
      justify-content: space-between;
      font-size: 12px;
      color: $text-secondary;
    }
  }

  .session-stats {
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 8px;

      .stat-item {
        text-align: center;
        padding: 8px;
        background: $bg-secondary;
        border-radius: $border-radius;

        .stat-value {
          font-size: 18px;
          font-weight: bold;
        }

        .stat-label {
          font-size: 12px;
          color: $text-secondary;
        }
      }
    }
  }
}
</style>
