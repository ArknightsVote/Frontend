<script setup lang="ts">
const navItems = [
  { text: '总数据', to: '/tables' },
  { text: '个人数据', to: '/tables/individual' },
  { text: '1v1 矩阵', to: '/tables/matrix' },
]

// 滚动到下一页功能
function scrollToNextPage() {
  const nextPage = document.querySelector('.min-h-screen:nth-child(2)')
  if (nextPage) {
    nextPage.scrollIntoView({ behavior: 'smooth' })
  }
}
</script>

<template>
  <div class="min-h-screen">
    <!-- 投票区域 - 第一页 -->
    <div class="min-h-screen flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8 relative">
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

      <!-- 左下角数据导航 -->
      <div class="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 flex flex-col gap-1 sm:gap-2 z-10">
        <router-link
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="px-2 sm:px-3 py-1 sm:py-1.5 bg-white/70 hover:bg-white/90 active:bg-white text-gray-700 hover:text-gray-900 border border-gray-300/50 rounded-md shadow-sm hover:shadow-md active:shadow-inner transition-all duration-200 text-xs font-medium touch-manipulation backdrop-blur-sm"
        >
          {{ item.text }}
        </router-link>
      </div>

      <!-- 右下角滚动提示 -->
      <div
        class="absolute bottom-2 sm:bottom-4 right-2 sm:right-4 text-gray-400 text-xs sm:text-sm flex items-center gap-1 bg-white/30 px-3 py-2 rounded-full backdrop-blur-sm cursor-pointer hover:bg-white/50 hover:text-gray-600 transition-all duration-200 touch-manipulation"
        @click="scrollToNextPage"
        @touchstart="scrollToNextPage"
      >
        <span class="opacity-70">向下滚动</span>
        <span class="text-xs animate-pulse">↓</span>
      </div>
    </div>

    <!-- 说明区域 - 第二页 -->
    <div class="min-h-screen">
      <div class="max-w-4xl mx-auto p-4 lg:p-8 pt-16">
        <!-- 重要信息 -->
        <div class="mb-8">
          <SectionImportant />
        </div>

        <!-- 音乐播放器 -->
        <div class="mb-8">
          <MusicPlayer />
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
  </div>
</template>
