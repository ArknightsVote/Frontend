<script setup lang="ts">
import { topicStatusText } from '@/utils/topicStatus'

const { currentTopicId } = useCurrentTopic()
const { topicInfo, votingPeriod, isVotingActive } = useTopicInfo(currentTopicId)

// 主题信息是否已加载完成（用于区分"载入中"与"已结束/未开始"）
const topicLoaded = computed(() => !!topicInfo.value)
const status = computed(() => topicStatusText(topicInfo.value))

// 使用模板引用
const firstPageRef = ref<HTMLElement>()
const secondPageRef = ref<HTMLElement>()

// 检测是否在投票页面
const isVotingPage = ref(true)

// 滚动到下一页功能
function scrollToNextPage() {
  if (secondPageRef.value) {
    secondPageRef.value.scrollIntoView({ behavior: 'smooth' })
  }
}

// 滚动到投票区域功能
function scrollToVotePage() {
  if (firstPageRef.value) {
    firstPageRef.value.scrollIntoView({ behavior: 'smooth' })
  }
}

onMounted(() => {
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

  if (firstPageRef.value) {
    observer.observe(firstPageRef.value)
  }

  onUnmounted(() => {
    observer.disconnect()
  })
})

function handleClick() {
  isVotingPage.value
    ? scrollToNextPage()
    : scrollToVotePage()
}
</script>

<template>
  <div class="min-h-screen">
    <!-- 投票区域 - 第一页 -->
    <div
      ref="firstPageRef"
      class="min-h-screen page flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8 relative"
    >
      <div class="w-full max-w-5xl mx-auto">
        <!-- 标题区域 -->
        <div class="text-center mb-12 lg:mb-16">
          <SiteTitle
            class="text-3xl sm:text-4xl lg:text-6xl font-bold text-gray-800 mb-4"
            mx-auto
          />
          <p v-if="topicInfo" class="text-lg text-gray-500 mt-2">
            {{ topicInfo.name }}
          </p>
        </div>

        <!-- 投票区域 - 仅进行中的主题可投票，往期/未开始的主题仅供查看数据 -->
        <div class="mb-8">
          <div v-if="!topicLoaded" class="text-center text-gray-500 py-8">
            载入中 ...
          </div>

          <OperatorVote v-else-if="isVotingActive" />

          <div v-else class="text-center space-y-4 py-6">
            <div class="inline-block px-4 py-3 rounded-lg bg-yellow-500/90 text-white font-bold shadow-md">
              {{ status === '未开始' ? '本次投票尚未开始' : '本次投票已结束' }}
            </div>
            <p class="text-sm text-gray-500">
              投票时间 {{ votingPeriod }}
            </p>
            <div class="flex items-center justify-center gap-3">
              <router-link class="btn" :to="{ path: '/tables', query: { topic: currentTopicId } }">
                查看总数据
              </router-link>
              <router-link class="btn" :to="{ path: '/tables/matrix', query: { topic: currentTopicId } }">
                1v1 矩阵
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 说明区域 - 第二页 -->
    <div
      ref="secondPageRef"
      class="min-h-screen page"
    >
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

        <!-- 投票说明 -->
        <div class="mb-8">
          <SectionVoteExplain />
        </div>

        <!-- 相关链接 + 历届结果 -->
        <div class="grid gap-6 lg:grid-cols-2 items-stretch">
          <SectionRelatedLinks />
          <SectionHistory />
        </div>

        <!-- 友情链接 · 终末地 Wiki -->
        <div class="mt-8">
          <SectionEndfield />
        </div>

        <!-- 感谢信息 -->
        <div class="mt-8">
          <SectionThanks />
        </div>
      </div>
    </div>

    <!-- 固定导航 - 右下角页面切换 -->
    <div
      class="fixed bottom-6 right-4 z-20"
      sm="bottom-8 right-6"
      lg="bottom-12 right-8"
      xl="right-12"
    >
      <div
        class="text-xs flex items-center gap-1 bg-white/30 px-3  py-2 rounded-full backdrop-blur-sm cursor-pointer hover:bg-white/50 hover:text-gray-600 transition-all duration-200 touch-manipulation"
        sm="text-sm px-4 py-2.5"
        lg="text-base"
        @click="handleClick"
      >
        <span class="opacity-70">{{ isVotingPage ? '说明' : '投票' }}</span>
        <span class="text-xs lg:text-sm animate-pulse">{{ isVotingPage ? '↓' : '↑' }}</span>
      </div>
    </div>
  </div>
</template>
