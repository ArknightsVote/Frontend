<script setup lang="ts">
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
        <h2>
          {{ title }}
        </h2>
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
