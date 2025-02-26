<script setup lang='ts'>
import draggable from 'vuedraggable'

interface ListItem {
  name: OperatorName
  index: number
}

defineProps<{
  title: string
  bg?: boolean
}>()

const list = defineModel<ListItem[]>()

const el = templateRef('el')
const { height } = useElementSize(el)
</script>

<template>
  <div h-full flex="~ 0 col w-36 select-none">
    <h3 font-bold text-right py-2 pr-2 text-lg>
      {{ title }}
    </h3>
    <div
      ref="el"
      w-48
      flex-1
      overflow-auto

      text-right
      select-none
    >
      <draggable
        :list="list"
        :animation="300"
        group="opter"
        item-key="index"
        :style="{ height: `${height}px` }"
      >
        <template #item="{ element }">
          <div
            py-2
            pr-6
            font-bold
            cursor-pointer
            bg-gradient-to-l
            :class="{
              'from-amber-500 text-white': bg,
            }"
            hover="text-indigo-500"
            transition-color
          >
            {{ element.name }}
          </div>
        </template>
      </draggable>
    </div>
  </div>
</template>

<style scoped>
</style>
