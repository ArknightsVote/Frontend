<script setup lang="ts">
// const route = useRoute()
// const isHome = computed(() => route.path === '/')

const { isVotingOpen } = useTopicInfo()

// 根据投票是否开放来过滤导航项
const nav = computed(() => {
  const allNav = [
    { text: '去投票', to: '/' },
    { text: '总数据', to: '/tables' },
    { text: '个人数据', to: '/tables/individual' },
    { text: '1v1 矩阵', to: '/tables/matrix' },
  ]
  
  // 如果投票还未开放，只显示总数据相关的导航项，隐藏投票页面
  if (!isVotingOpen.value) {
    return []
  }
  
  return allNav
})
</script>

<template>
  <!-- 原来的条件渲染逻辑（已注释）：
  <NavHome
    v-if="isHome"
    :items="nav"
    flex="~ gap-2 items-center"
  />
  <NavPage v-else :items="nav" />
  -->
  
  <!-- 所有页面都使用统一的 NavPage 样式 -->
  <NavPage :items="nav" />
</template>
