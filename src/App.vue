<script setup lang="ts">
const route = useRoute()
const { currentTopicId } = useCurrentTopic()

// 落地选择页（/ 且未选主题）不显示顶部导航；其余页面（含带主题的投票首页）都显示
const isTopicPicker = computed(() => route.path === '/' && !currentTopicId.value)
const showHeader = computed(() => !isTopicPicker.value)
// 音乐控制条只在数据页显示（投票首页自带音乐区块，避免重复）
const showMusicBar = computed(() => route.path !== '/')

// 候选人池随当前主题加载/切换
watch(
  currentTopicId,
  (id) => {
    if (id)
      ensureOperatorPool(id)
  },
  { immediate: true },
)
</script>

<template>
  <FixedCG z--1 />
  <MouseFollower />
  
  <!-- 全局音频组件 -->
  <GlobalAudio />
  
  <!-- 音乐控制条（数据页显示） -->
  <MusicControlBar v-if="showMusicBar" />

  <Nav v-if="showHeader" />

  <router-view v-slot="{ Component }">
    <transition name="slide" mode="out-in">
      <div
        :key="route.fullPath"
        :style="{ height: showHeader ? 'calc(100% - 3.5rem)' : '100%' }"
        overflow-y-auto
        px-2
        relative
        z-1
      >
        <div container h-full mx-auto>
          <keep-alive>
            <component :is="Component" :key="route.fullPath" />
          </keep-alive>
        </div>
      </div>
    </transition>
  </router-view>
</template>

<style>
body {
    background: url('@/assets/images/bg.png') center no-repeat;
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
