<script setup lang="ts">
import type { TopicStatus } from '@/composables/useTopicList'

const { currentTopicId, setTopic, clearTopic } = useCurrentTopic()
const { topics, load } = useTopicList()

const open = ref(false)
const root = ref<HTMLElement>()
onClickOutside(root, () => (open.value = false))

onMounted(() => load())

// 状态圆点（触发按钮）
const STATUS_DOT: Record<TopicStatus, string> = {
  '进行中': 'bg-green-500',
  '未开始': 'bg-blue-500',
  '已结束': 'bg-gray-400',
  '': 'bg-gray-300',
}

// 行左侧状态色条
const STATUS_BAR: Record<TopicStatus, string> = {
  '进行中': 'bg-green-500',
  '未开始': 'bg-blue-500',
  '已结束': 'bg-gray-400',
  '': 'bg-gray-300',
}

// 状态徽标
const STATUS_BADGE: Record<TopicStatus, string> = {
  '进行中': 'bg-green-100 text-green-700',
  '未开始': 'bg-blue-100 text-blue-700',
  '已结束': 'bg-gray-100 text-gray-500',
  '': 'bg-gray-100 text-gray-500',
}

const current = computed(() => topics.value.find(t => t.id === currentTopicId.value))
const currentName = computed(() => current.value?.name || '选择主题')
const currentDot = computed(() => current.value ? STATUS_DOT[current.value.status] : 'bg-gray-300')

function choose(id: string) {
  open.value = false
  if (id !== currentTopicId.value)
    setTopic(id)
}

function backToSelect() {
  open.value = false
  clearTopic()
}
</script>

<template>
  <div ref="root" class="relative">
    <!-- 触发按钮 -->
    <button
      class="flex items-center gap-2 pl-2.5 pr-2 py-1.5 rounded-lg bg-white/80 hover:bg-white border shadow-sm text-sm text-gray-800 transition-colors touch-manipulation"
      :class="open ? 'border-amber-400' : 'border-gray-200 hover:border-gray-300'"
      @click="open = !open"
    >
      <span class="w-1.5 h-1.5 rounded-full shrink-0" :class="currentDot" />
      <span class="max-w-36 truncate font-medium">{{ currentName }}</span>
      <svg
        class="w-4 h-4 text-gray-400 transition-transform duration-200"
        :class="{ 'rotate-180': open }"
        viewBox="0 0 20 20" fill="currentColor"
      >
        <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.06l3.71-3.83a.75.75 0 111.08 1.04l-4.25 4.38a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
      </svg>
    </button>

    <!-- 下拉面板 -->
    <transition
      enter-active-class="transition duration-150 ease-out"
      enter-from-class="opacity-0 -translate-y-1"
      leave-active-class="transition duration-100 ease-in"
      leave-to-class="opacity-0 -translate-y-1"
    >
      <div
        v-if="open"
        class="absolute right-0 mt-2 w-64 rounded-xl border border-gray-200 bg-white shadow-xl ring-1 ring-black/5 z-50 overflow-hidden"
      >
        <div class="px-4 py-2.5 border-b border-gray-100 text-xs font-semibold tracking-wide text-gray-500">
          切换作战
        </div>

        <div class="max-h-72 overflow-auto py-1">
          <button
            v-for="t in topics"
            :key="t.id"
            class="group relative w-full text-left pl-4 pr-3 py-2.5 flex items-center justify-between gap-2 transition-colors"
            :class="t.id === currentTopicId ? 'bg-amber-50' : 'hover:bg-gray-50'"
            @click="choose(t.id)"
          >
            <!-- 左侧状态色条 -->
            <span class="absolute left-0 top-0 h-full w-1" :class="STATUS_BAR[t.status]" />

            <span
              class="truncate text-sm font-semibold"
              :class="t.id === currentTopicId ? 'text-amber-700' : 'text-gray-800'"
            >
              {{ t.name }}
            </span>

            <span class="flex items-center gap-2 shrink-0">
              <span class="text-[11px] px-1.5 py-0.5 rounded-full" :class="STATUS_BADGE[t.status]">
                {{ t.status }}
              </span>
              <svg
                v-if="t.id === currentTopicId"
                class="w-4 h-4 text-amber-600" viewBox="0 0 20 20" fill="currentColor"
              >
                <path fill-rule="evenodd" d="M16.7 5.3a1 1 0 010 1.4l-7.5 7.5a1 1 0 01-1.4 0l-3.5-3.5a1 1 0 011.4-1.4l2.8 2.79 6.8-6.79a1 1 0 011.4 0z" clip-rule="evenodd" />
              </svg>
            </span>
          </button>

          <div v-if="!topics.length" class="px-4 py-3 text-sm text-gray-400">
            暂无可用主题
          </div>
        </div>

        <button
          class="w-full text-left px-4 py-2.5 border-t border-gray-100 text-sm text-gray-600 hover:bg-gray-50 hover:text-amber-700 flex items-center gap-2 transition-colors"
          @click="backToSelect"
        >
          <svg class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
            <path d="M3 5.75A2.75 2.75 0 015.75 3h2.5A2.75 2.75 0 0111 5.75v2.5A2.75 2.75 0 018.25 11h-2.5A2.75 2.75 0 013 8.25v-2.5zM9 14.75A2.75 2.75 0 0111.75 12h2.5A2.75 2.75 0 0117 14.75v.5A2.75 2.75 0 0114.25 18h-2.5A2.75 2.75 0 019 15.25v-.5z" />
          </svg>
          返回主题选择
        </button>
      </div>
    </transition>
  </div>
</template>
