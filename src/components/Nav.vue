<script setup lang="ts">
const { currentTopicId } = useCurrentTopic()

// 导航链接携带当前 topic，保证跨页切换保持主题
const nav = computed(() => {
  const query = currentTopicId.value ? { topic: currentTopicId.value } : {}
  return [
    { text: '去投票', to: { path: '/', query } },
    { text: '总数据', to: { path: '/tables', query } },
    { text: '个人数据', to: { path: '/tables/individual', query } },
    { text: '1v1 矩阵', to: { path: '/tables/matrix', query } },
    { text: '趋势', to: { path: '/tables/timeline', query } },
  ]
})
</script>

<template>
  <NavPage :items="nav" />
</template>
