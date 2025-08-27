<script setup lang="ts">
import { STORAGE_KEYS } from '@/constants/storage'

const labels = [
  { text: '干员代号', key: 'name' },
  { text: '胜率', key: 'rate' },
  { text: '得分', key: 'score' },
]

const { data } = useLocalVote()

const showData = shallowRef<Record<string, any[]> | null>(null)

function getSortedData(data: Record<string, { win_rate: number, scores: number }>) {
  const name: OperatorName[] = []
  const rate: string[] = []
  const score: number[] = []

  const entries = Object.entries(data)
    .map(([opterName, { win_rate, scores }]) => ({ name: opterName, rate: win_rate, score: scores }))
    .sort((a, b) => b.rate - a.rate)

  entries.forEach((d) => {
    name.push(d.name as OperatorName)
    rate.push(`${d.rate}%`)
    score.push(d.score)
  })

  return { name, rate, score }
}

//
// 由路由更新
// 外部可能使用了 keep-alive
// -----------------------------------------

onActivated(() => {
  showData.value = getSortedData(data.value)
})

const title = '明日方舟六星强度个人数据'

// 获取前端记录的总投票数
const totalVotes = useStorage(STORAGE_KEYS.VOTE_TIMES, 0)
</script>

<template>
  <div size-full>
    <TableVote
      v-if="showData?.name.length"
      :data="showData"
      :labels="labels"
      :export-table="title"
      id-key="name"
      cluster-key="rate"
    >
      <template #caption>
        <div class="bg-white/60 px-4 py-3 rounded-lg -mx-2 -my-2">
          <h2>
            {{ title }}
          </h2>
          <p class="text-sm text-gray-600 mt-2">
            总投票数：{{ totalVotes.toLocaleString() }} 票
          </p>
          <p class="text-xs text-gray-500 mt-1 italic">
            排序优先级为胜率，得分，获胜次数
          </p>
        </div>
      </template>
    </TableVote>
    <div v-else size-full text-center pt-8>
      <p v-if="!showData" text-lg>
        载入中 ...
      </p>
      <div v-else>
        <p pb-2 text-lg>
          还没有数据~
        </p>
        <router-link class="btn" to="/">
          去投票
        </router-link>
      </div>
    </div>
  </div>
</template>
