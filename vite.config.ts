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
          target: 'http://210.16.166.179:3000',
          changeOrigin: true,
        },
        '/ballot/save': {
          target: 'http://210.16.166.179:3000',
          changeOrigin: true,
        },
        '/results/final_order': {
          target: 'http://210.16.166.179:3000',
          changeOrigin: true,
        },
        '/topic/candidate_pool': {
          target: 'http://210.16.166.179:3000',
          changeOrigin: true,
        },
        '/get_operators_1v1_matrix': {
          target: 'http://210.16.166.179:3000',
          changeOrigin: true,
        },

        // 兼容旧路径的代理配置
        '/view_final_order': {
          target: 'http://210.16.166.179:3000',
          changeOrigin: true,
        },

        // 兼容旧路径的代理配置
        '/new_compare': {
          target: 'http://210.16.166.179:3000',
          changeOrigin: true,
        },
        '/save_score': {
          target: 'http://210.16.166.179:3000',
          changeOrigin: true,
        },

        // 原来的后端代理配置，注释保留以便切换
        // '/ballot/new': {
        //   target: 'https://vote.ltsc.vip',
        //   changeOrigin: true,
        // },
        // '/ballot/save': {
        //   target: 'https://vote.ltsc.vip',
        //   changeOrigin: true,
        // },
        // '/new_compare': {
        //   target: 'https://vote.ltsc.vip',
        //   changeOrigin: true,
        // },
        // '/save_score': {
        //   target: 'https://vote.ltsc.vip',
        //   changeOrigin: true,
        // },
        // '/view_final_order': {
        //   target: 'https://vote.ltsc.vip',
        //   changeOrigin: true,
        // },
        // '/get_operators_1v1_matrix': {
        //   target: 'https://vote.ltsc.vip',
        //   changeOrigin: true,
        // },
      },
    },
  }
})
