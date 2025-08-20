<script setup lang='ts'>
import { useMusicStore } from '@/stores/music'

const musicStore = useMusicStore()
const route = useRoute()

// 检测滚动位置，在页面底部时隐藏播放器
const isAtBottom = ref(false)
const scrollContainer = ref<HTMLElement | null>(null)

// 检测是否为移动端
const isMobile = ref(false)

function checkIsMobile() {
  isMobile.value = window.innerWidth <= 768 // md断点
}

// 判断是否需要隐藏播放器
const shouldHide = computed(() => {
  const isMatrixPage = route.path.includes('/tables/matrix')
  
  // 如果是matrix页面且不是手机端，则不隐藏
  if (isMatrixPage && !isMobile.value) {
    return false
  }
  
  return isAtBottom.value
})

function checkScrollPosition() {
  if (!scrollContainer.value) {
    return
  }
  
  const containerHeight = scrollContainer.value.clientHeight
  const scrollHeight = scrollContainer.value.scrollHeight
  const scrollTop = scrollContainer.value.scrollTop
  
  // 当滚动到距离底部100px以内时认为是在底部
  const threshold = 100
  const newIsAtBottom = (scrollTop + containerHeight + threshold) >= scrollHeight
  
  if (newIsAtBottom !== isAtBottom.value) {
    isAtBottom.value = newIsAtBottom
  }
}

function findScrollContainer() {
  // 直接通过类名查找滚动容器，更精准
  const element = document.querySelector('.main-scroll-container') as HTMLElement
  if (element) {
    // 移除之前的事件监听器（如果存在）
    if (scrollContainer.value) {
      scrollContainer.value.removeEventListener('scroll', checkScrollPosition)
    }
    
    scrollContainer.value = element
    
    // 添加新的事件监听器
    scrollContainer.value.addEventListener('scroll', checkScrollPosition, { passive: true })
    
    // 立即检查一次位置
    checkScrollPosition()
  } else {
    console.log('未找到滚动容器')
  }
}

onMounted(() => {
  // 初始检测移动端
  checkIsMobile()
  
  // 监听窗口大小变化
  window.addEventListener('resize', checkIsMobile, { passive: true })
  
  // 监听路由变化，重新查找容器
  watch(() => route.path, () => {
    // 路由变化后，等待新组件渲染完成
    nextTick(() => {
      setTimeout(() => {
        findScrollContainer()
      }, 10) // 给更多时间让数据加载
    })
  }, { immediate: false })
  
  // 定期检查容器是否可用（防止动态内容加载问题）
  const checkInterval = setInterval(() => {
    const element = document.querySelector('.main-scroll-container') as HTMLElement
    if (element && (!scrollContainer.value || scrollContainer.value !== element)) {
      findScrollContainer()
    }
  }, 1000)
  
  // 组件卸载时清理定时器
  onUnmounted(() => {
    clearInterval(checkInterval)
    window.removeEventListener('resize', checkIsMobile)
  })
})

onUnmounted(() => {
  if (scrollContainer.value) {
    scrollContainer.value.removeEventListener('scroll', checkScrollPosition)
  }
})
</script>

<template>
  <!-- 简化的音乐控制条 -->
  <div
    v-if="musicStore.currentTrack"
    fixed bottom-4 z-50
    bg="white/90" backdrop-blur-md border border-gray-200
    rounded-lg shadow-lg p-3
    flex items-center gap-3
    max-w-xs
    transition-all duration-300
    :class="shouldHide ? 'translate-x-full right-0' : 'translate-x-0 right-4'"
  >
    <!-- 歌曲信息 -->
    <div flex-1 min-w-0>
      <p text-sm font-medium text-gray-800 truncate mb-1>
        {{ musicStore.currentTrack.name }}
      </p>
      <div w-full bg-gray-200 rounded-full h-1>
        <div
          bg-indigo-600 h-1 rounded-full transition-all duration-300
          :style="{ width: `${musicStore.progress}%` }"
        />
      </div>
    </div>

    <!-- 控制按钮 -->
    <div flex items-center gap-1>
      <button
        bg="gray-100" hover="bg-gray-200" text-gray-600 p-1.5 rounded-full
        flex items-center justify-center transition-all duration-200
        title="上一首"
        @click="musicStore.previousTrack"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
        </svg>
      </button>

      <button
        bg-indigo-600 hover="bg-indigo-700" text-white p-2 rounded-full
        flex items-center justify-center transition-all duration-200
        :title="musicStore.isPlaying ? '暂停' : '播放'"
        @click="musicStore.togglePlay"
      >
        <svg v-if="!musicStore.isPlaying" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <path d="M8 5v14l11-7z" />
        </svg>
        <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
        </svg>
      </button>

      <button
        bg="gray-100" hover="bg-gray-200" text-gray-600 p-1.5 rounded-full
        flex items-center justify-center transition-all duration-200
        title="下一首"
        @click="musicStore.nextTrack"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
        </svg>
      </button>
    </div>
  </div>
</template>
