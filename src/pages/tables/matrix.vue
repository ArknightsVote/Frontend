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
    selectedList.value.forEach(({ name }) => {
      displayData[name] = selectedList.value.map(() => '0 (0次)')
    })
    return displayData
  }

  const matrixData = data.value.data
  const selected = selectedList.value
  
  selected.forEach(({ name: colName }) => {
    displayData[colName] = selected.map(({ name: rowName }) => {
      // 根据干员名称获取真实的干员ID
      const rowOperator = getOperator(rowName)
      const colOperator = getOperator(colName)
      
      if (!rowOperator || !colOperator) {
        return '0 (0次)'
      }
      
      const key1 = `${rowOperator.id}:${colOperator.id}`
      const key2 = `${colOperator.id}:${rowOperator.id}`
      
      let scoreData = matrixData[key1]
      let isReversed = false
      
      if (!scoreData) {
        scoreData = matrixData[key2]
        isReversed = true
      }
      
      if (!scoreData) {
        return '0 (0次)'
      }
      
      const score = isReversed ? -scoreData.score : scoreData.score
      const count = scoreData.count
      const displayScore = score / 100
      
      return `${displayScore} (${count}次)`
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
