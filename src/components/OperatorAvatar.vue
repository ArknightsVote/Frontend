<script setup lang="ts">
const { target } = defineProps<{
  target?: OperatorTarget
}>()

const operator = computed(() => target ? findOperator(target) : undefined)
</script>

<template>
  <div class="w-[180px] aspect-[1/2] relative">
    <div class="size-full">
      <img
        v-if="operator"
        class="size-full"
        :src="operator.avatar"
      >
    </div>
    <div
      absolute
      bottom-0
      left-0
      w-full
      bg-gradient-to-l
      from-amber-500
      text=" white right"
      p="r-3 y-2"
    >
      {{ operator?.name }}
    </div>
  </div>
</template>
