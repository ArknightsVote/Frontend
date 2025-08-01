<script setup lang='ts'>
defineProps<{
  title?: string
}>()
</script>

<template>
  <div class="bg-white/60 backdrop-blur-sm border border-gray-200 px-6 py-4 rounded-xl shadow-lg">
    <h2 v-if="title" class="text-xl font-bold text-gray-800 mb-3 pb-2 border-b border-gray-200">
      {{ title }}
    </h2>
    <section class="text-gray-700 leading-relaxed">
      <slot />
    </section>
  </div>
</template>

<style scoped>
</style>
