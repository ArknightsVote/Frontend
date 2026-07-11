<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router'

defineProps<{
  items: { text: string, to: RouteLocationRaw }[]
}>()

const route = useRoute()

// 移动端汉堡菜单：窄屏放不下 5 个导航链接，收进下拉菜单
const open = ref(false)
const menuRoot = ref<HTMLElement>()
onClickOutside(menuRoot, () => (open.value = false))
// 路由变化后自动收起（点击同一路由也会收起）
watch(() => route.path, () => (open.value = false))

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
      <router-link to="/" flex items-center gap-2 shrink-0>
        <img src="/favicon.ico" w-8 aspect-square rounded>
        <!-- 大标题占位较宽，留到 lg 才显示；nowrap 避免换行撑高顶栏 -->
        <SiteTitle class="hidden lg:block whitespace-nowrap" />
      </router-link>

      <div flex items-center gap-3 md="gap-4">
        <TopicSwitcher />

        <!-- 桌面端：横排链接（nowrap + shrink-0，避免窄屏被压成竖排单字） -->
        <div class="hidden md:flex items-center gap-6 font-bold text-slate-800 whitespace-nowrap shrink-0">
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

        <!-- 移动端：汉堡菜单 -->
        <div ref="menuRoot" class="relative md:hidden">
          <button
            class="flex items-center justify-center w-9 h-9 rounded-lg bg-white/80 hover:bg-white border shadow-sm text-gray-700 transition-colors touch-manipulation"
            :class="open ? 'border-amber-400' : 'border-gray-200 hover:border-gray-300'"
            aria-label="导航菜单"
            :aria-expanded="open"
            @click="open = !open"
          >
            <svg
              class="w-5 h-5" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round"
            >
              <path v-if="!open" d="M4 6h16M4 12h16M4 18h16" />
              <path v-else d="M6 6l12 12M18 6l-12 12" />
            </svg>
          </button>

          <transition
            enter-active-class="transition duration-150 ease-out"
            enter-from-class="opacity-0 -translate-y-1"
            leave-active-class="transition duration-100 ease-in"
            leave-to-class="opacity-0 -translate-y-1"
          >
            <div
              v-if="open"
              class="absolute right-0 mt-2 w-40 rounded-xl border border-gray-200 bg-white shadow-xl ring-1 ring-black/5 z-50 overflow-hidden py-1"
            >
              <router-link
                v-for="n in items"
                :key="n.text"
                :to="n.to"
                class="block px-4 py-2.5 text-sm font-semibold transition-colors"
                :class="route.path === toPath(n.to)
                  ? 'text-indigo-600 bg-indigo-50'
                  : 'text-slate-800 hover:bg-gray-50'"
                @click="open = false"
              >
                {{ n.text }}
              </router-link>
            </div>
          </transition>
        </div>
      </div>
    </div>
  </div>
</template>
