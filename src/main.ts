import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import Antd, { ConfigProvider } from 'ant-design-vue'

// 使用 dayjs 替代 luxon
import dayjs from 'dayjs'

// 导入所有 dayjs 官方插件
import advancedFormat from 'dayjs/plugin/advancedFormat'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import localeData from 'dayjs/plugin/localeData'
import quarterOfYear from 'dayjs/plugin/quarterOfYear'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import weekYear from 'dayjs/plugin/weekYear'
import weekday from 'dayjs/plugin/weekday'

// 扩展 dayjs 插件
dayjs.extend(advancedFormat)
dayjs.extend(customParseFormat)
dayjs.extend(localeData)
dayjs.extend(quarterOfYear)
dayjs.extend(weekOfYear)
dayjs.extend(weekYear)
dayjs.extend(weekday)

import 'ant-design-vue/dist/antd.js';

const app = createApp(App)
const pinia = createPinia()

// 使用 Ant Design Vue 的 ConfigProvider 来启用 dayjs
app.use(ConfigProvider, {
  locale: 'en-US',
  dateLibrary: 'dayjs',
})

app.use(pinia)
app.use(router)
app.use(Antd)

app.mount('#app')

// 验证所有插件
console.log('Current quarter:', dayjs().quarter())
console.log('Current week:', dayjs().week())
console.log('Week year:', dayjs().weekYear())
console.log('Weekday:', dayjs().weekday())
