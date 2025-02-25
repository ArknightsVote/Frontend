/**
 * 是否为开发环境
 */
import 'vue-router'

declare const __DEV__: boolean

declare module '*.vue' {
  import type { DefineComponent } from 'vue'

  const component: DefineComponent<object, object, any>
  export default component
}

declare module 'vue-router' {
  interface RouteMeta {
    transition?: string
  }
}
