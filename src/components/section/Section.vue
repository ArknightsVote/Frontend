<script setup lang='ts'>
defineProps<{
  title?: string
}>()
</script>

<template>
  <div class="bg-white/70" px-4 py-2 rounded shadow-md font-bold>
    <h2 v-if="title" text-xl font-bold pt-2>
      {{ title }}
    </h2>
    <section class="*:my-2 indent-lg">
      <slot />
    </section>
  </div>
</template>

<style scoped>
</style>
