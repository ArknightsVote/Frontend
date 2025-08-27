<script setup lang="ts">
const { isVotingOpen, topicInfo } = useTopicInfo()

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
      class="min-h-screen page flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8 relative pt-20"
    >
      <div class="w-full max-w-5xl mx-auto">
        <!-- 标题区域 -->
        <div class="text-center mb-12 lg:mb-16">
          <SiteTitle
            class="text-3xl sm:text-4xl lg:text-6xl font-bold text-gray-800 mb-4"
            mx-auto
          />
        </div>

        <!-- 投票区域 - 根据投票开放状态显示不同内容 -->
        <div class="mb-8">
          <!-- 投票已开放时显示投票组件 -->
          <OperatorVote v-if="isVotingOpen" />
          
          <!-- 投票未开放时显示提示信息 -->
          <div v-else class="text-center py-12 px-6">
            <div class="max-w-4xl mx-auto relative">
              <!-- 主要提示信息 -->
              <div class="mb-8">
                <h2 class="text-2xl font-bold text-gray-700 mb-4">
                  {{ topicInfo?.title || '投票活动' }} 投票尚未开放
                </h2>
              </div>
              
              <!-- 个性化文字布局 -->
              <div class="relative py-8">
                <!-- 顶部个性化文字 -->
                <div class="text-center mb-12 relative">
                  <div class="text-lg sm:text-xl font-bold text-indigo-600 mb-4 animate-pulse">
                    "别急，让我先急"
                  </div>
                  <div class="text-xl sm:text-2xl font-bold text-red-500 bg-yellow-100/80 px-4 py-2 rounded-lg inline-block border-2 border-yellow-300 shadow-md">
                    🎉 8月28日5:00准时开门 🎉
                  </div>
                </div>
                
                <!-- 左右两边的对话框 -->
                <div class="flex justify-between items-center max-w-3xl mx-auto">
                  <!-- 左侧对话框 -->
                  <div class="relative">
                    <div class="bg-blue-100/80 text-blue-700 px-4 py-3 rounded-2xl rounded-bl-none shadow-lg border border-blue-200 max-w-xs">
                      <div class="text-sm font-medium">
                        "我寻思这边能行"
                      </div>
                      <!-- 对话框尾巴 -->
                      <div class="absolute -bottom-2 left-4 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-blue-100"></div>
                    </div>
                    <!-- 小人物图标 -->
                    <div class="text-2xl mt-2 text-blue-600">🤔</div>
                  </div>
                  
                  <!-- 中间分隔符 -->
                  <div class="text-3xl text-gray-400 animate-bounce">
                    ⚔️
                  </div>
                  
                  <!-- 右侧对话框 -->
                  <div class="relative">
                    <div class="bg-green-100/80 text-green-700 px-4 py-3 rounded-2xl rounded-br-none shadow-lg border border-green-200 max-w-xs">
                      <div class="text-sm font-medium">
                        "显然是这边厉害"
                      </div>
                      <!-- 对话框尾巴 -->
                      <div class="absolute -bottom-2 right-4 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-green-100"></div>
                    </div>
                    <!-- 小人物图标 -->
                    <div class="text-2xl mt-2 text-green-600">😏</div>
                  </div>
                </div>
                
                <!-- 底部装饰 -->
                <div class="mt-8 text-center">
                  <div class="text-sm text-gray-500 italic">
                    敬请期待激烈的对决！
                  </div>
                </div>
              </div>
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
