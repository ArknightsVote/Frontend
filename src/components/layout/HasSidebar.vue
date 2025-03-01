<script setup lang='ts'>
</script>

<template>
  <div flex full-size>
    <div flex-1 h-full sticky top-0>
      <slot name="sidebar" />
    </div>
    <div flex-3 h-full>
      <slot name="main" />
    </div>
  </div>
</template>

<style scoped>
</style>
