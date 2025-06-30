// src/shims-vue.d.ts

declare module '*.vue' {
  import type { DefineComponent } from 'vue';

  // 使用更精确的类型定义
  const component: DefineComponent<
    Record<string, unknown>,  // Props 类型
    Record<string, unknown>,  // State 类型
    unknown                   // 实例类型
  >;

  export default component;
}
