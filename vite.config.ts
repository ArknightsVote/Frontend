import { resolve } from 'node:path'
import vue from '@vitejs/plugin-vue'
import UnoCSS from 'unocss/vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import VueRouter from 'unplugin-vue-router/vite'
import { defineConfig } from 'vite'
import Inspect from 'vite-plugin-inspect'
import { viteMockServe } from 'vite-plugin-mock'

// https://vite.dev/config/
export default defineConfig((env) => {
  const isDev = env.command === 'serve'

  // const stringify = JSON.stringify

  return {
    define: {
      // __DEV__: stringify(isDev),
    },
    plugins: [
      VueRouter({
        routesFolder: 'src/pages',
        dts: 'src/auto-router.d.ts',
      }),
      vue(),
      UnoCSS({
        inspector: false,
      }),
      AutoImport({
        include: [
          /\.[tj]sx?$/,
          /\.vue$/,
        ],
        imports: [
          'vue',
          'vue-router',
          '@vueuse/core',
          {
            pinia: [
              'defineStore',
              'storeToRefs',
            ],
          },
        ],
        dts: 'src/auto-imports.d.ts',
        dirs: [
          './src/constants/**',
          './src/composables/**',
          './src/store/**',
          './src/shared/**',
          {
            glob: './src/types',
            types: true,
          },
        ],
        vueTemplate: true,
        dumpUnimportItems: true,
        viteOptimizeDeps: true,
      }),

      Components({
        dts: 'src/auto-components.d.ts',
      }),

      Inspect(),

      viteMockServe({
        mockPath: './mock',
        enable: isDev,
        // enable: false,
      }),
    ],
    resolve: {
      alias: [
        {
          find: '@/',
          replacement: `${resolve(__dirname, 'src')}/`,
        },
      ],
    },
    server: {
      proxy: {
        // 新的后端代理配置
        '/ballot/new': {
          target: 'http://api.vote.ltsc.vip',
          changeOrigin: true,
        },
        '/ballot/save': {
          target: 'http://api.vote.ltsc.vip',
          changeOrigin: true,
        },
        '/results/final_order': {
          target: 'http://api.vote.ltsc.vip',
          changeOrigin: true,
        },
        '/topic/candidate_pool': {
          target: 'http://api.vote.ltsc.vip',
          changeOrigin: true,
        },
        '/get_operators_1v1_matrix': {
          target: 'http://api.vote.ltsc.vip',
          changeOrigin: true,
        },
      },
    },
  }
})
