<script setup lang="ts">
defineProps(['tbodyStyle', 'title'])

const { data } = useApi('/view_final_order').get().json()

const labels = [
  { text: '干员代号', key: 'name' },
  { text: '胜率', key: 'rate' },
  { text: '得分', key: 'score' },
]
</script>

<template>
  <TableVote
    v-if="data"
    :data="data"
    :labels="labels"
    cluster-key="rate"
  >
    <template #caption>
      <h2>
        明日方舟六星强度总数据
      </h2>
    </template>
  </TableVote>
</template>
