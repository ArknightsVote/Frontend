<script setup lang="ts">
defineProps<{
  items: Record<'text' | 'to', string>[]
}>()

const route = useRoute()
</script>

<template>
  <div
    w-full
    h-14
    sticky
    top-0
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

      <div
        flex
        divide-x
        font-bold
        text-slate-800
      >
        <slot name="before" />
        <div flex gap-4 md="flex-row gap-6">
          <router-link
            v-for="n in items"
            :key="n.to"
            :to="n.to"
            hover="text-indigo-600"
            :class="{ 'text-indigo-500': route.path === n.to }"
          >
            {{ n.text }}
          </router-link>
        </div>
        <slot name="after" />
      </div>
    </div>
  </div>
</template>
