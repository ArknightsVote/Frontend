<script setup lang='ts'>
import MatrixTransferGroup from './MatrixTransferGroup.vue'

interface ListItem {
  name: OperatorName
  index: number
}

function getInitListItems() {
  const list: ListItem[] = []
  getOperators().forEach(v => list.push({ name: v.name, index: v.index }))
  return list
}

const originList = getInitListItems()

const unselectedList = ref<ListItem[]>([...originList])
const selectedList = defineModel<ListItem[]>()

function clearSelectedList() {
  if (!selectedList.value?.length)
    return
  selectedList.value = []
  unselectedList.value = [...originList]
}

const search = ref('')

function filterUnselectedList() {
  unselectedList.value = originList.filter((v) => {
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
  <div h-full>
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
      <MatrixTransferGroup v-model="unselectedList" title="干员" />
      <MatrixTransferGroup v-model="selectedList" title="已选" bg />
    </div>
  </div>
</template>
