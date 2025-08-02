<script setup lang="ts">
const navItems = [
  { text: '总数据', to: '/tables' },
  { text: '个人数据', to: '/tables/individual' },
  { text: '1v1 矩阵', to: '/tables/matrix' },
]

// 滚动到下一页功能
function scrollToNextPage() {
  const nextPage = document.querySelector('.page:nth-child(2)')
  if (nextPage) {
    nextPage.scrollIntoView({ behavior: 'smooth' })
  }
}

// 滚动到投票区域功能
function scrollToVotePage() {
  const firstPage = document.querySelector('.page:first-child')
  if (firstPage) {
    firstPage.scrollIntoView({ behavior: 'smooth' })
  }
}

// 检测是否在投票页面
const isVotingPage = ref(true)

onMounted(() => {
  const firstPage = document.querySelector('.page:first-child')
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        // 如果第一页不可见，说明已经滚动到第二页
        isVotingPage.value = entry.isIntersecting
      })
    },
    {
      threshold: 0.1, // 当10%可见时认为在第一页
      rootMargin: '-50px 0px 0px 0px', // 稍微提前触发
    },
  )

  if (firstPage) {
    observer.observe(firstPage)
  }

  onUnmounted(() => {
    observer.disconnect()
  })
})
</script>

<template>
  <div class="min-h-screen">
    <!-- 投票区域 - 第一页 -->
    <div class="min-h-screen page flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8 relative">
      <div class="w-full max-w-5xl mx-auto">
        <!-- 标题区域 -->
        <div class="text-center mb-12 lg:mb-16">
          <SiteTitle
            class="text-3xl sm:text-4xl lg:text-6xl font-bold text-gray-800 mb-4"
            mx-auto
          />
        </div>

        <!-- 投票区域 - 直接显示，无卡片包装 -->
        <div class="mb-8">
          <OperatorVote />
        </div>
      </div>
    </div>

    <!-- 说明区域 - 第二页 -->
    <div class="min-h-screen page">
      <div class="max-w-4xl mx-auto p-4 lg:p-8 pt-16">
        <!-- 重要信息 -->
        <div class="mb-8">
          <SectionImportant />
        </div>

        <!-- 音乐播放器 -->
        <div class="mb-8">
          <SectionMusicPlayer />
        </div>

        <!-- 规则说明 -->
        <div class="mb-8">
          <SectionRule />
        </div>

        <!-- 警告信息 -->
        <div class="mb-8">
          <SectionWarning />
        </div>

        <!-- 其他信息 -->
        <div class="grid gap-6 lg:grid-cols-2">
          <div>
            <SectionAdditional />
          </div>
          <div>
            <SectionHistory />
          </div>
        </div>

        <!-- 感谢信息 -->
        <div class="mt-8">
          <SectionThanks />
        </div>
      </div>
    </div>

    <!-- 固定导航 - 左下角数据导航 -->
    <div class="fixed bottom-6 sm:bottom-8 lg:bottom-12 left-4 sm:left-6 lg:left-8 xl:left-12 flex flex-col gap-2 sm:gap-3 z-20">
      <router-link
        v-for="item in navItems"
        :key="item.to"
        :to="item.to"
        class="px-3 sm:px-4 lg:px-6 py-2 sm:py-2.5 lg:py-3 bg-white/70 hover:bg-white/90 active:bg-white text-gray-700 hover:text-gray-900 border border-gray-300/50 rounded-md shadow-sm hover:shadow-md active:shadow-inner transition-all duration-200 text-xs sm:text-sm lg:text-base font-medium touch-manipulation backdrop-blur-sm"
      >
        {{ item.text }}
      </router-link>
    </div>

    <!-- 固定导航 - 右下角页面切换 -->
    <div class="fixed bottom-6 sm:bottom-8 lg:bottom-12 right-4 sm:right-6 lg:right-8 xl:right-12 z-20">
      <div
        v-if="isVotingPage"
        class="text-gray-400 text-xs sm:text-sm lg:text-base flex items-center gap-1 bg-white/30 px-3 sm:px-4 lg:px-6 py-2 sm:py-2.5 lg:py-3 rounded-full backdrop-blur-sm cursor-pointer hover:bg-white/50 hover:text-gray-600 transition-all duration-200 touch-manipulation"
        @click="scrollToNextPage"
        @touchstart="scrollToNextPage"
      >
        <span class="opacity-70">查看说明</span>
        <span class="text-xs lg:text-sm animate-pulse">↓</span>
      </div>

      <div
        v-else
        class="text-gray-400 text-xs sm:text-sm lg:text-base flex items-center gap-1 bg-white/30 px-3 sm:px-4 lg:px-6 py-2 sm:py-2.5 lg:py-3 rounded-full backdrop-blur-sm cursor-pointer hover:bg-white/50 hover:text-gray-600 transition-all duration-200 touch-manipulation"
        @click="scrollToVotePage"
        @touchstart="scrollToVotePage"
      >
        <span class="opacity-70">去投票</span>
        <span class="text-xs lg:text-sm">↑</span>
      </div>
    </div>
  </div>
</template>
