<template>
  <div class="notification-provider">
    <transition-group name="notification" tag="div" class="notification-container">
      <div
        v-for="notification in uiStore.notifications"
        :key="notification.title + notification.content"
        class="notification-item"
        :class="`notification-item--${notification.type}`"
        @click="removeNotification(notification)"
      >
        <div class="notification-icon">
          <n-icon size="20">
            <CheckCircleIcon v-if="notification.type === 'success'" />
            <CloseCircleIcon v-else-if="notification.type === 'error'" />
            <WarningIcon v-else-if="notification.type === 'warning'" />
            <InformationCircleIcon v-else />
          </n-icon>
        </div>
        
        <div class="notification-content">
          <div class="notification-title">{{ notification.title }}</div>
          <div v-if="notification.content" class="notification-text">
            {{ notification.content }}
          </div>
        </div>
        
        <button class="notification-close" @click.stop="removeNotification(notification)">
          <n-icon size="16">
            <CloseIcon />
          </n-icon>
        </button>
      </div>
    </transition-group>
  </div>
</template>

<script setup lang="ts">
import { NIcon } from 'naive-ui'
import {
  CheckmarkCircle as CheckCircleIcon,
  CloseCircle as CloseCircleIcon,
  Warning as WarningIcon,
  InformationCircle as InformationCircleIcon,
  Close as CloseIcon
} from '@vicons/ionicons5'
import { useUiStore } from '@/stores'
import type { NotificationMessage } from '@/types'

const uiStore = useUiStore()

function removeNotification(notification: NotificationMessage) {
  uiStore.removeNotification(notification)
}
</script>

<style scoped>
.notification-provider {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: var(--z-index-notification);
  pointer-events: none;
}

.notification-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-width: 400px;
}

.notification-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  background: var(--card-color);
  border-radius: var(--border-radius-md);
  box-shadow: var(--box-shadow-2);
  border-left: 4px solid;
  cursor: pointer;
  pointer-events: auto;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.notification-item:hover {
  transform: translateX(-4px);
  box-shadow: var(--box-shadow-3);
}

.notification-item--success {
  border-left-color: var(--success-color);
}

.notification-item--error {
  border-left-color: var(--error-color);
}

.notification-item--warning {
  border-left-color: var(--warning-color);
}

.notification-item--info {
  border-left-color: var(--info-color);
}

.notification-icon {
  flex-shrink: 0;
  margin-top: 2px;
}

.notification-item--success .notification-icon {
  color: var(--success-color);
}

.notification-item--error .notification-icon {
  color: var(--error-color);
}

.notification-item--warning .notification-icon {
  color: var(--warning-color);
}

.notification-item--info .notification-icon {
  color: var(--info-color);
}

.notification-content {
  flex: 1;
  min-width: 0;
}

.notification-title {
  font-weight: 600;
  color: var(--text-color);
  font-size: 14px;
  line-height: 1.4;
  margin-bottom: 4px;
}

.notification-text {
  color: var(--text-color-2);
  font-size: 13px;
  line-height: 1.4;
  word-break: break-word;
}

.notification-close {
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: transparent;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-color-3);
  transition: all 0.2s ease;
}

.notification-close:hover {
  background: var(--border-color);
  color: var(--text-color);
}

/* Animations */
.notification-enter-active {
  transition: all 0.3s ease;
}

.notification-leave-active {
  transition: all 0.3s ease;
}

.notification-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.notification-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

.notification-move {
  transition: transform 0.3s ease;
}

/* Progress bar for auto-dismiss */
.notification-item::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  height: 2px;
  background: currentColor;
  opacity: 0.3;
  animation: progress 4s linear;
}

@keyframes progress {
  from {
    width: 100%;
  }
  to {
    width: 0%;
  }
}

/* Responsive */
@media (max-width: 768px) {
  .notification-provider {
    top: 10px;
    right: 10px;
    left: 10px;
  }
  
  .notification-container {
    max-width: none;
  }
  
  .notification-item {
    padding: 12px;
  }
  
  .notification-title {
    font-size: 13px;
  }
  
  .notification-text {
    font-size: 12px;
  }
}
</style>
