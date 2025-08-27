<script setup lang="ts">
import { useOperatorPool } from '@/shared/operator'

const route = useRoute()
const isHome = computed(() => route.path === '/')

// 初始化候选人池数据
onMounted(() => {
  // 应用启动时加载候选人池数据
  useOperatorPool()
})
</script>

<template>
  <FixedCG z--1 />
  <MouseFollower />
  
  <!-- 全局音频组件 -->
  <GlobalAudio />
  
  <!-- 音乐控制条（非首页显示） -->
  <MusicControlBar v-if="!isHome" />

  <!-- 导航栏（所有页面都显示） -->
  <Nav />

  <router-view v-slot="{ Component }">
    <transition name="slide" mode="out-in">
      <div
        :key="route.path"
        :style="{ height: 'calc(100% - 3.5rem)' }"
        overflow-y-auto
        px-2
        relative
        z-1
        class="main-scroll-container"
      >
        <div container h-full mx-auto>
          <keep-alive>
            <component :is="Component" :key="route.path" />
          </keep-alive>
        </div>
      </div>
    </transition>
  </router-view>
</template>

<style>
body {
    background: url('https://ae01.alicdn.com/kf/A12a6acef3d954aaabb58bb289be8ebd8C.png') center no-repeat;
    background-size: cover;
    background-attachment: fixed;
    min-height: 100vh;
}

#app {
    height: 100vh;
    overflow: hidden;
    scrollbar-color: gray #00000000;
    position: relative;
}

.fade-enter-active {
  transition: all 0.5s;
}

.fade-enter-from {
  opacity: 0;
}

.slide-enter-active {
  transition: all 0.5s;
}

.slide-enter-from {
  transform: translateY(10px);
  opacity: 0;
}
</style>
