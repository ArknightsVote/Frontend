<script setup lang="ts">
import type { TopicStatus } from '@/composables/useTopicList'

const { setTopic } = useCurrentTopic()
const { topics, isLoading, isLoaded, load } = useTopicList()

onMounted(() => load())

const STATUS_CLASS: Record<TopicStatus, string> = {
  '进行中': 'bg-green-100 text-green-700',
  '未开始': 'bg-blue-100 text-blue-700',
  '已结束': 'bg-gray-100 text-gray-500',
  '': 'bg-gray-100 text-gray-500',
}

// 卡片左侧状态色条
const STATUS_BAR: Record<TopicStatus, string> = {
  '进行中': 'bg-green-500',
  '未开始': 'bg-blue-500',
  '已结束': 'bg-gray-400',
  '': 'bg-gray-300',
}
</script>

<template>
  <div class="min-h-screen flex flex-col items-center justify-center p-4">
    <div class="w-full max-w-4xl mx-auto text-center">
      <h1 class="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 mb-2">
        选择投票主题
      </h1>
      <p class="text-gray-500 mb-10">
        选择一个投票活动，进行中的可参与投票，往期的可查看数据
      </p>

      <div v-if="isLoading && !isLoaded" class="py-12 text-lg text-gray-500">
        载入中 ...
      </div>

      <div v-else-if="!topics.length" class="py-12">
        <p class="text-lg text-gray-600">
          暂无可用的投票主题
        </p>
      </div>

      <div v-else class="flex flex-wrap justify-center gap-5">
        <button
          v-for="t in topics"
          :key="t.id"
          class="group relative overflow-hidden w-full sm:w-72 text-left p-5 pl-6 rounded-xl border border-gray-200 bg-white/80 hover:bg-white hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 touch-manipulation"
          @click="setTopic(t.id)"
        >
          <!-- 左侧状态色条 -->
          <span class="absolute left-0 top-0 h-full w-1" :class="STATUS_BAR[t.status]" />

          <div class="flex items-center justify-between gap-2 mb-2">
            <h2 class="text-lg font-bold text-gray-800 group-hover:text-indigo-600 truncate">
              {{ t.name }}
            </h2>
            <span class="shrink-0 text-xs px-2 py-0.5 rounded-full" :class="STATUS_CLASS[t.status]">
              {{ t.status }}
            </span>
          </div>
          <p class="text-sm text-gray-500 truncate mb-3">
            {{ t.title || t.description }}
          </p>
          <p class="text-xs text-gray-400">
            {{ new Date(t.open_time).toLocaleDateString('zh-CN') }}
            ~
            {{ new Date(t.close_time).toLocaleDateString('zh-CN') }}
          </p>
        </button>
      </div>
    </div>
  </div>
</template>
