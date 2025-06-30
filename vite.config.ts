import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'

export default defineConfig({
  plugins: [vue(), vueJsx(), vueDevTools()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      // 添加 dayjs 插件别名映射
      'dayjs_plugin_advancedFormat': 'dayjs/plugin/advancedFormat',
      'dayjs_plugin_customParseFormat': 'dayjs/plugin/customParseFormat',
      'dayjs_plugin_localeData': 'dayjs/plugin/localeData',
      'dayjs_plugin_quarterOfYear': 'dayjs/plugin/quarterOfYear',
      'dayjs_plugin_weekOfYear': 'dayjs/plugin/weekOfYear',
      'dayjs_plugin_weekYear': 'dayjs/plugin/weekYear',
      'dayjs_plugin_weekday': 'dayjs/plugin/weekday',
    },
  },
  optimizeDeps: {
    include: ['dayjs'],
  },
})
