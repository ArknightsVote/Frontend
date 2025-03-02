<script setup lang="ts">
defineProps<{
  items: Record<'text' | 'to', string>[]
}>()

function reverse(items: any[]) {
  return [...items].reverse()
}
</script>

<template>
  <div
    flex="~ gap-2 items-center"
  >
    <router-link
      v-for="n in reverse(items.slice(1))"
      :key="n.to"
      :to="n.to"
      btn-outline
    >
      {{ n.text }}
    </router-link>
  </div>
</template>
