<script setup lang="ts">
const route = useRoute()

const isHome = computed(() => route.path === '/')

const nav = [
  { text: '去投票', to: '/' },
  { text: '总数据', to: '/tables' },
  { text: '个人数据', to: '/tables/individual' },
  { text: '1v1 矩阵', to: '/tables/matrix' },
]

function reverse(items: any[]) {
  return [...items].reverse()
}
</script>

<template>
  <div
    v-if="isHome"
    flex="~ gap-2 items-center"
  >
    <router-link
      v-for="n in reverse(nav.slice(1))"
      :key="n.to"
      :to="n.to"
      btn
    >
      {{ n.text }}
    </router-link>
  </div>

  <div
    v-else
    w-full
    h-14
    px-4
    sticky
    top-0
    b="b-1 b-gray-200"
    backdrop-blur
    flex
    justify-center
  >
    <div w-full flex="~ items-center justify-between" container>
      <router-link to="/" flex items-center gap-2>
        <img src="/favicon.ico" w-8 aspect-square rounded>
        <SiteTitle text-lg />
      </router-link>

      <div
        flex
        divide-x
        font-bold
        text-slate-800
      >
        <slot name="before" />
        <div flex>
          <router-link
            v-for="n in nav"
            :key="n.to"
            :to="n.to"
            px-4
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
