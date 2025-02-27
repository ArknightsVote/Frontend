<script setup lang="ts">
import { viewFinalOrder } from '@/api'

const { data } = viewFinalOrder()

const labels = [
  { text: '干员代号', key: 'name' },
  { text: '胜率', key: 'rate' },
  { text: '得分', key: 'score' },
]

const title = '明日方舟六星强度总数据'
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
      <h2>
        {{ title }}
      </h2>
    </template>
  </TableVote>
</template>
