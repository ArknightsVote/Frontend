<script setup lang="ts">
defineProps<{
  items: Record<'text' | 'to', string>[]
}>()

function reverse(items: any[]) {
  return [...items].reverse()
}

// 移动端触摸处理
function handleNavClick(event: Event) {
  const target = event.target as HTMLElement
  if (target) {
    // 立即移除触摸样式
    target.style.transform = 'scale(1)'
    target.style.boxShadow = '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
  }
}
</script>

<template>
  <div class="flex flex-wrap gap-2 justify-center">
    <router-link
      v-for="n in reverse(items.slice(1))"
      :key="n.to"
      :to="n.to"
      class="px-3 py-1.5 bg-white/60 hover:bg-white/80 active:bg-white text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md shadow-sm hover:shadow-md active:shadow-inner transition-all duration-200 text-xs font-medium touch-manipulation"
      @click="handleNavClick"
      @touchstart="handleNavClick"
    >
      {{ n.text }}
    </router-link>
  </div>
</template>
