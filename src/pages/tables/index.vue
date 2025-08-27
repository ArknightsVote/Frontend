<script setup lang="ts">
import type { ViewFinalOrderItem } from '@/types/api'
import { viewFinalOrder } from '@/api'

const { data: rawData, execute, isFetching } = viewFinalOrder()

// 刷新数据函数
const refreshData = async () => {
  await execute()
}

// 将接口数据转换为期望格式
const data = computed(() => {
  if (!rawData.value?.data?.items) return null
  
  const items = rawData.value.data.items
  const count = rawData.value.data.count
  
  // 提取数据数组
  const name: string[] = []
  const score: string[] = []
  const rate: string[] = []
  
  // 遍历数据项，按顺序填充数组
  items.forEach((item: ViewFinalOrderItem) => {
    name.push(item.name)
    score.push(item.score)
    rate.push(item.rate)
  })
  
  return {
    name,
    score,
    rate,
    count: `已收集数据 ${count} 条`
  } as Record<string, any>
})

const labels = [
  { text: '干员代号', key: 'name' },
  { text: '胜率', key: 'rate' },
  { text: '得分', key: 'score' },
]

const title = '明日方舟六星强度总数据'

// 总投票数
const totalVotes = computed(() => {
  return rawData.value?.data?.count || 0
})
</script>

<template>
  <TableVote
    v-if="data"
    id-key="name"
    :data="data"
    :labels="labels"
    :export-table="title"
    cluster-key="rate"
  >
    <template #caption>
      <div class="bg-white/60 px-4 py-3 rounded-lg -mx-2 -my-2">
        <div class="flex items-center justify-between">
          <div class="flex-1">
            <h2>
              {{ title }}
            </h2>
            <p class="text-sm text-gray-600 mt-2">
              总投票数：{{ totalVotes.toLocaleString() }} 票
            </p>
          </div>
          
          <!-- 刷新按钮 -->
          <button
            class="ml-4 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white font-medium py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2"
            :disabled="isFetching"
            @click="refreshData"
          >
            <svg 
              v-if="!isFetching"
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="currentColor"
              class="transition-transform duration-200"
            >
              <path d="M17.65,6.35C16.2,4.9 14.21,4 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20C15.73,20 18.84,17.45 19.73,14H17.65C16.83,16.33 14.61,18 12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6C13.66,6 15.14,6.69 16.22,7.78L13,11H20V4L17.65,6.35Z"/>
            </svg>
            <svg 
              v-else
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="currentColor"
              class="animate-spin"
            >
              <path d="M12,4V2A10,10 0 0,0 2,12H4A8,8 0 0,1 12,4Z"/>
            </svg>
            {{ isFetching ? '刷新中...' : '刷新' }}
          </button>
        </div>
      </div>
    </template>
  </TableVote>
</template>
