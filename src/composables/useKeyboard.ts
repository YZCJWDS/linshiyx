import { onMounted, onUnmounted } from 'vue'

export interface KeyboardShortcut {
  key: string
  ctrl?: boolean
  alt?: boolean
  shift?: boolean
  meta?: boolean
  handler: (event: KeyboardEvent) => void
  description?: string
}

export function useKeyboard(shortcuts: KeyboardShortcut[]) {
  const handleKeydown = (event: KeyboardEvent) => {
    for (const shortcut of shortcuts) {
      const keyMatch = event.key.toLowerCase() === shortcut.key.toLowerCase()
      const ctrlMatch = !!shortcut.ctrl === event.ctrlKey
      const altMatch = !!shortcut.alt === event.altKey
      const shiftMatch = !!shortcut.shift === event.shiftKey
      const metaMatch = !!shortcut.meta === event.metaKey

      if (keyMatch && ctrlMatch && altMatch && shiftMatch && metaMatch) {
        event.preventDefault()
        shortcut.handler(event)
        break
      }
    }
  }

  onMounted(() => {
    document.addEventListener('keydown', handleKeydown)
  })

  onUnmounted(() => {
    document.removeEventListener('keydown', handleKeydown)
  })

  return {
    shortcuts
  }
}

// Common keyboard shortcuts
export const commonShortcuts = {
  refresh: { key: 'F5', description: '刷新' },
  refreshCtrl: { key: 'r', ctrl: true, description: '刷新 (Ctrl+R)' },
  copy: { key: 'c', ctrl: true, description: '复制 (Ctrl+C)' },
  selectAll: { key: 'a', ctrl: true, description: '全选 (Ctrl+A)' },
  delete: { key: 'Delete', description: '删除' },
  escape: { key: 'Escape', description: '取消/关闭' },
  enter: { key: 'Enter', description: '确认' },
  search: { key: 'f', ctrl: true, description: '搜索 (Ctrl+F)' },
  newItem: { key: 'n', ctrl: true, description: '新建 (Ctrl+N)' }
}
