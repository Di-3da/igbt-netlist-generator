// src/stores/setting.store.ts
import { defineStore } from 'pinia'

export const useSettingStore = defineStore('setting', {
  state: () => ({
    theme: (localStorage.getItem('theme') as 'light' | 'dark') || 'light',
    streamMode: localStorage.getItem('streamMode') === 'true',
    autoStartSession: localStorage.getItem('autoStartSession') === 'true',
    autoCleanFiles: true,
    cleanFilesDays: parseInt(localStorage.getItem('cleanFilesDays') || '7', 10),
  }),
  actions: {
    setTheme(theme: 'light' | 'dark') {
      this.theme = theme
      localStorage.setItem('theme', theme)
    },
    toggleStreamMode() {
      this.streamMode = !this.streamMode
      localStorage.setItem('streamMode', String(this.streamMode))
    },
    toggleAutoStartSession() {
      this.autoStartSession = !this.autoStartSession
      localStorage.setItem('autoStartSession', String(this.autoStartSession))
    },
    setCleanFilesDays(days: number) {
      this.cleanFilesDays = days
      localStorage.setItem('cleanFilesDays', String(days))
    },
  },
})
