<script setup lang='ts'>
import { getOperators1v1Matrix } from '@/api'
import { getOperator } from '@/shared/operator'

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

  if (!data.value?.data) {
    return displayData
  }

  const matrixData = data.value.data
  const selected = selectedList.value
  
  selected.forEach(({ name }) => {
    displayData[name] = selected.map(({ name: rowName }) => {
      // 根据干员名称获取真实的干员ID
      const rowOperator = getOperator(rowName)
      const colOperator = getOperator(name)
      
      if (!rowOperator || !colOperator) {
        return 0
      }
      
      const rowOperatorId = rowOperator.id
      const colOperatorId = colOperator.id
      
      // 尝试两种可能的键名组合
      const key1 = `${rowOperatorId}:${colOperatorId}`
      const key2 = `${colOperatorId}:${rowOperatorId}`
      
      let value = matrixData[key1]
      if (value === undefined) {
        // 如果第一种组合不存在，尝试第二种组合并取负值
        value = matrixData[key2] ? -matrixData[key2] : 0
      }
      
      return value / 100
    })
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
