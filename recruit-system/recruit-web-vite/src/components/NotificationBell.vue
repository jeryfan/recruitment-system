<template>
  <el-popover
    placement="bottom-end"
    :width="360"
    trigger="click"
    popper-class="notification-popover"
    @show="fetchNotifications"
  >
    <template #reference>
      <el-badge :value="unreadCount || ''" :hidden="unreadCount === 0" class="bell-badge">
        <el-button circle text class="bell-btn">
          <el-icon size="20"><Bell /></el-icon>
        </el-button>
      </el-badge>
    </template>

    <div class="notification-panel">
      <div class="panel-header">
        <span class="panel-title">消息通知</span>
        <el-button
          v-if="unreadCount > 0"
          text
          type="primary"
          size="small"
          @click="markAllRead"
        >
          全部已读
        </el-button>
      </div>

      <div class="notification-list" v-loading="loading">
        <template v-if="notifications.length > 0">
          <div
            v-for="item in notifications"
            :key="item.id"
            class="notification-item"
            :class="{ unread: item.is_read === '0' }"
          >
            <div class="notif-dot" v-if="item.is_read === '0'"></div>
            <div class="notif-content">
              <p class="notif-text">{{ item.content }}</p>
              <span class="notif-time">{{ formatTime(item.create_time) }}</span>
            </div>
          </div>
        </template>
        <el-empty v-else description="暂无通知" :image-size="60" />
      </div>
    </div>
  </el-popover>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { Bell } from '@element-plus/icons-vue'
import { ElNotification } from 'element-plus'
import { useUserStore } from '@/stores/user'
import request from '@/utils/request'
import moment from 'moment'

const userStore = useUserStore()

const loading = ref(false)
const notifications = ref<any[]>([])
const unreadCount = ref(0)

let ws: WebSocket | null = null
let wsReconnectTimer: ReturnType<typeof setTimeout> | null = null

const fetchNotifications = async () => {
  const username = userStore.userInfo?.username
  if (!username) return

  loading.value = true
  try {
    const res = await request.get<any[]>('/recruit/notify/all', {
      params: { userName: username }
    })
    notifications.value = Array.isArray(res) ? res : []
    unreadCount.value = notifications.value.filter(n => n.is_read === '0').length
  } catch {
    // ignore
  } finally {
    loading.value = false
  }
}

const fetchUnreadCount = async () => {
  const username = userStore.userInfo?.username
  if (!username) return
  try {
    const res = await request.get<any[]>('/recruit/notify', {
      params: { userName: username, isRead: '0' }
    })
    unreadCount.value = Array.isArray(res) ? res.length : 0
  } catch {
    // ignore
  }
}

const markAllRead = async () => {
  const username = userStore.userInfo?.username
  if (!username) return
  try {
    await request.put('/recruit/notify', null, { params: { userName: username } })
    notifications.value = notifications.value.map(n => ({ ...n, is_read: '1' }))
    unreadCount.value = 0
  } catch {
    // ignore
  }
}

const formatTime = (time: string) => {
  if (!time) return ''
  return moment(time).fromNow()
}

// ---- WebSocket 实时通知 ----
const connectWebSocket = () => {
  const token = userStore.token
  if (!token || !userStore.isLoggedIn) return
  // 通过 nginx 代理连接 WebSocket
  const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws'
  const wsUrl = `${protocol}://${window.location.host}/ws/message?token=${token}`

  ws = new WebSocket(wsUrl)

  ws.onopen = () => {
    console.log('[WS] Connected to notification service')
  }

  ws.onmessage = (event) => {
    try {
      const msg = JSON.parse(event.data)
      if (msg.type === 'APPLICATION_UPDATE') {
        // 顶部弹出通知
        const notifType = msg.state === 1 ? 'success' : msg.state === 2 ? 'error' : 'info'
        ElNotification({
          title: msg.title || '申请状态通知',
          message: msg.content || '您的申请状态已更新',
          type: notifType,
          duration: 5000,
          position: 'top-right'
        })
        // 更新未读数
        unreadCount.value += 1
      }
    } catch {
      // ignore non-JSON messages
    }
  }

  ws.onclose = () => {
    console.log('[WS] Connection closed, reconnecting in 5s...')
    // 5秒后自动重连
    wsReconnectTimer = setTimeout(() => {
      if (userStore.isLoggedIn) connectWebSocket()
    }, 5000)
  }

  ws.onerror = () => {
    ws?.close()
  }
}

const disconnectWebSocket = () => {
  if (wsReconnectTimer) clearTimeout(wsReconnectTimer)
  if (ws) {
    ws.onclose = null // 防止触发重连
    ws.close()
    ws = null
  }
}

onMounted(() => {
  fetchUnreadCount()
  connectWebSocket()
})

onUnmounted(() => {
  disconnectWebSocket()
})
</script>

<style scoped lang="scss">
.bell-badge {
  :deep(.el-badge__content) {
    top: 4px;
    right: 4px;
  }
}

.bell-btn {
  width: 36px;
  height: 36px;
  color: #606266;

  &:hover {
    color: #409EFF;
    background-color: #f5f7fa;
  }
}

.notification-panel {
  .panel-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    border-bottom: 1px solid #f0f0f0;

    .panel-title {
      font-size: 15px;
      font-weight: 600;
      color: #303133;
    }
  }

  .notification-list {
    max-height: 360px;
    overflow-y: auto;
    min-height: 80px;

    .notification-item {
      display: flex;
      align-items: flex-start;
      gap: 10px;
      padding: 12px 16px;
      border-bottom: 1px solid #f5f5f5;
      transition: background-color 0.2s;

      &:last-child {
        border-bottom: none;
      }

      &:hover {
        background-color: #fafafa;
      }

      &.unread {
        background-color: #f0f7ff;
      }

      .notif-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background-color: #409EFF;
        flex-shrink: 0;
        margin-top: 6px;
      }

      .notif-content {
        flex: 1;

        .notif-text {
          font-size: 13px;
          color: #303133;
          line-height: 1.6;
          margin: 0 0 4px;
        }

        .notif-time {
          font-size: 12px;
          color: #c0c4cc;
        }
      }
    }
  }
}
</style>
