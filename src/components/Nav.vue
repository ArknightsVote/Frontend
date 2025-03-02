<script setup lang="ts">
const route = useRoute()

const isHome = computed(() => route.path === '/')

const nav = [
  { text: '去投票', to: '/' },
  { text: '总数据', to: '/tables' },
  { text: '个人数据', to: '/tables/individual' },
  { text: '1v1 矩阵', to: '/tables/matrix' },
]
</script>

<template>
  <NavHome
    v-if="isHome"
    :items="nav"
    flex="~ gap-2 items-center"
  />

  <NavPage v-else :items="nav" />
</template>
