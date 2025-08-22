<script setup lang="ts">
import type { ViewFinalOrderItem } from '@/types/api'
import { viewFinalOrder } from '@/api'

const { data: rawData } = viewFinalOrder()

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
      <div>
        <h2>
          {{ title }}
        </h2>
        <p class="text-sm text-gray-600 mt-2">
          总投票数：{{ totalVotes.toLocaleString() }} 票
        </p>
      </div>
    </template>
  </TableVote>
</template>
