<script setup>
defineProps(['tbodyStyle', 'title'])

const { getSortedData } = useLocalVote()

const labels = [
  { text: '干员代号', key: 'name' },
  { text: '胜率', key: 'rate' },
  { text: '得分', key: 'score' },
]
</script>

<template>
  <TableVote
    :data="getSortedData()"
    :labels="labels"
    cluster-key="rate"
  >
    <template #caption>
      <h2>
        明日方舟六星强度个人数据
      </h2>
    </template>
  </TableVote>
</template>
