<script setup lang='ts'>
import type { PropType } from 'vue'

interface ListItem {
  name: OperatorName
  index: number
}

function getInitListItems() {
  const list: ListItem[] = []
  getOperators().forEach(v => list.push({ name: v.name, index: v.index }))
  return list
}

const selectedList = defineModel<ListItem[]>({
  type: Array as PropType<ListItem[]>,
  default: () => [],
})

const originList = ref<ListItem[]>(getInitListItems())
const unselectedList = ref<ListItem[]>(
  originList.value.filter(o => !selectedList.value?.some(s => s.name === o.name)),
)

// 干员池异步加载：首次为空时，加载完成后补齐列表（含已持久化的选择）
watch(() => getOperatorsTotal(), (total) => {
  if (total && !originList.value.length) {
    originList.value = getInitListItems()
    unselectedList.value = originList.value.filter(
      o => !selectedList.value?.some(s => s.name === o.name),
    )
  }
})

function clearSelectedList() {
  if (!selectedList.value?.length)
    return
  selectedList.value = []
  unselectedList.value = [...originList.value]
}

const search = ref('')

function filterUnselectedList() {
  unselectedList.value = originList.value.filter((v) => {
    const name = v.name.includes(search.value)
    return selectedList.value?.includes(v) ? false : name
  })
}

const filterUnselectedListDebounce = useDebounceFn(filterUnselectedList, 200)

function clearSearch() {
  search.value = ''
  filterUnselectedList()
}
</script>

<template>
  <div h-full md="w-80" lg="w-108">
    <div h-8 flex gap-2>
      <input
        v-model="search"
        type="text"
        placeholder="搜索"
        class="border"
        h-8
        px-2
        rounded
        bg-transparent
        outline-none
        b="~ slate-500"
        @input="filterUnselectedListDebounce"
      >
      <button
        v-show="!!search"
        btn
        @click="clearSearch"
      >
        取消
      </button>
      <div flex-1 />
      <button btn @click="clearSelectedList">
        重置
      </button>
    </div>
    <div
      flex
      style="height: calc(100% - 3rem);"
    >
      <MatrixTransferGroup v-model="unselectedList" class="flex-1" title="干员" />
      <MatrixTransferGroup v-model="selectedList" class="flex-1" title="已选" bg />
    </div>
  </div>
</template>
