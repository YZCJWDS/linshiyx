<template>
  <div class="loading-spinner" :class="{ 'loading-spinner--overlay': overlay }">
    <div class="spinner-container">
      <div class="spinner" :style="{ width: size + 'px', height: size + 'px' }">
        <div class="spinner-ring"></div>
        <div class="spinner-ring"></div>
        <div class="spinner-ring"></div>
        <div class="spinner-ring"></div>
      </div>
      
      <div v-if="text" class="spinner-text">{{ text }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  size?: number
  text?: string
  overlay?: boolean
}

withDefaults(defineProps<Props>(), {
  size: 40,
  text: '',
  overlay: false
})
</script>

<style scoped>
.loading-spinner {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.loading-spinner--overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(2px);
  z-index: var(--z-index-modal);
}

[data-theme="dark"] .loading-spinner--overlay {
  background: rgba(0, 0, 0, 0.8);
}

.spinner-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.spinner {
  position: relative;
  display: inline-block;
}

.spinner-ring {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: 3px solid transparent;
  border-radius: 50%;
  animation: spin 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
}

.spinner-ring:nth-child(1) {
  border-top-color: var(--primary-color);
  animation-delay: -0.45s;
}

.spinner-ring:nth-child(2) {
  border-top-color: var(--primary-color);
  animation-delay: -0.3s;
  opacity: 0.7;
}

.spinner-ring:nth-child(3) {
  border-top-color: var(--primary-color);
  animation-delay: -0.15s;
  opacity: 0.5;
}

.spinner-ring:nth-child(4) {
  border-top-color: var(--primary-color);
  opacity: 0.3;
}

.spinner-text {
  color: var(--text-color-2);
  font-size: 14px;
  font-weight: 500;
  text-align: center;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* Alternative spinner styles */
.loading-spinner.pulse .spinner {
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.7;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.loading-spinner.dots .spinner {
  display: flex;
  gap: 4px;
}

.loading-spinner.dots .spinner-ring {
  position: static;
  width: 8px;
  height: 8px;
  border: none;
  background: var(--primary-color);
  border-radius: 50%;
  animation: dots 1.4s ease-in-out infinite both;
}

.loading-spinner.dots .spinner-ring:nth-child(1) {
  animation-delay: -0.32s;
}

.loading-spinner.dots .spinner-ring:nth-child(2) {
  animation-delay: -0.16s;
}

.loading-spinner.dots .spinner-ring:nth-child(3) {
  animation-delay: 0s;
}

@keyframes dots {
  0%, 80%, 100% {
    transform: scale(0);
    opacity: 0.5;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
}
</style>
