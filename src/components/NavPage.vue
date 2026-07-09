<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router'

defineProps<{
  items: { text: string, to: RouteLocationRaw }[]
}>()

const route = useRoute()

function toPath(to: RouteLocationRaw): string {
  return typeof to === 'string' ? to : ((to as any).path ?? '')
}
</script>

<template>
  <div
    w-full
    h-14
    sticky
    top-0
    z-30
    b="b-1 b-gray-200"
    backdrop-blur
    flex
    justify-center
  >
    <div w-full px-2 flex="~ items-center justify-between" container>
      <router-link to="/" flex items-center gap-2>
        <img src="/favicon.ico" w-8 aspect-square rounded>
        <SiteTitle class="hidden md:block" />
      </router-link>

      <div flex items-center gap-3 md="gap-4">
        <TopicSwitcher />

        <div
          flex
          divide-x
          font-bold
          text-slate-800
          items-center
        >
          <slot name="before" />
          <div flex gap-4 md="flex-row gap-6" px-3>
            <router-link
              v-for="n in items"
              :key="n.text"
              :to="n.to"
              hover="text-indigo-600"
              :class="{ 'text-indigo-500': route.path === toPath(n.to) }"
            >
              {{ n.text }}
            </router-link>
          </div>
          <slot name="after" />
        </div>
      </div>
    </div>
  </div>
</template>
