<script setup lang='ts'>
import { getOperators1v1Matrix } from '@/api'

interface ListItem {
  name: OperatorName
  index: number
}
const selectedList = ref<ListItem[]>([])
const { data } = getOperators1v1Matrix()

const labels = computed(() => {
  return [
    {
      text: '',
      key: 'names',
      style: {
        fontWeight: 'bold',
      },
    },
    ...selectedList.value.map((el) => {
      return {
        text: el.name,
        key: el.name,
      }
    }),
  ]
})

const showData = computed(() => {
  const displayData: Record<string, (number | string)[]> = {
    names: selectedList.value.map(el => el.name),
  }

  if (!data.value) {
    return displayData
  }

  const selected = selectedList.value
  selected.forEach(({ name, index: col }) => {
    displayData[name] = selected.map(({ index: row }) => data.value[row][col] / 100)
  })

  return displayData
})
</script>

<template>
  <div
    size-full
    flex
    flex-col
    md="flex-row"
    py-4
    gap-4
  >
    <MatrixTransfer
      v-model="selectedList"
      class="card grow-0"
    />

    <div
      md="flex-1 h-full"
      overflow-auto
      p-0
    >
      <div v-show="!selectedList.length" size-full flex flex-col items-center justify-center>
        <p text="xl" font-bold>
          还未选择干员~
        </p>
        <p text="sm" text-slate-600>
          您可以将干员名拖动到已选区域
        </p>
      </div>
      <Table
        v-show="selectedList.length"
        :labels="labels"
        :data="showData"
        :fix-index="true"
        idkey="names"
        title="1v1 矩阵"
      />
    </div>
  </div>
</template>
