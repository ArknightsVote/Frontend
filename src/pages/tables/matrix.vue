<script setup lang='ts'>
interface ListItem {
  name: OperatorName
  index: number
}
const selectedList = ref<ListItem[]>([])
const { data } = useApi<number[][]>('/get_operators_1v1_matrix').post().json()

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
  <div size-full flex py-4 gap-4>
    <MatrixTransfer
      v-model="selectedList"
      un-border="~ slate-400"
      class="bg-white/70 p-4 rounded"
    />

    <div
      flex-1
      overflow-auto
      h-full
      rounded
      un-border="~ slate-400"
      class="bg-white/70"
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
        idkey="names"
        title="1v1 矩阵"
        :fix-index="true"
      />
    </div>
  </div>
</template>
