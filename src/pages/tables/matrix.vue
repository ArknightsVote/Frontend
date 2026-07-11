<script setup lang='ts'>
import type { CellWithSub } from '@/components/Table.vue'
import { getOperators1v1Matrix } from '@/api'
import { getOperator } from '@/shared/operator'

const { currentTopicId } = useCurrentTopic()
const { topicInfo } = useTopicInfo(currentTopicId)

interface ListItem {
  name: OperatorName
  index: number
}
// 按主题持久化已选干员，切换/刷新不丢（与 timeline 页一致）
const selectedList = useStorage<ListItem[]>(`matrix:ops:${currentTopicId.value}`, [])
const { data } = getOperators1v1Matrix(currentTopicId)

const tableTitle = computed(() => `${topicInfo.value?.name ?? '明日方舟六星强度'} 1v1 矩阵`)

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
  const displayData: Record<string, (string | CellWithSub)[]> = {
    names: selectedList.value.map(el => el.name),
  }

  if (!data.value?.data) {
    return displayData
  }

  const matrixData = data.value.data
  const selected = selectedList.value
  
  selected.forEach(({ name }) => {
    displayData[name] = selected.map(({ name: rowName }): CellWithSub => {
      // 根据干员名称获取真实的干员ID
      const rowOperator = getOperator(rowName)
      const colOperator = getOperator(name)
      
      if (!rowOperator || !colOperator) {
        return { v: 0 }
      }
      
      const rowOperatorId = rowOperator.id
      const colOperatorId = colOperator.id
      
      // 尝试两种可能的键名组合
      const key1 = `${rowOperatorId}:${colOperatorId}`
      const key2 = `${colOperatorId}:${rowOperatorId}`

      // 后端同时写入两个方向（a:b 为 +score，b:a 为 -score），
      // 且每条记录都带有同一对的 count，故 key2 回退分支基本冗余，保留以防万一
      const item = matrixData[key1]
      let score: number
      let count: number
      if (item !== undefined) {
        score = item.score
        count = item.count
      }
      else {
        const rev = matrixData[key2]
        if (rev === undefined) {
          // 对角线或无数据
          return { v: 0 }
        }
        score = -rev.score
        count = rev.count
      }

      // 主值 score/100 显示为主行，对局数 count 以小灰字放到第二行
      return { v: score / 100, sub: String(count) }
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
        :title="tableTitle"
      />
    </div>
  </div>
</template>
