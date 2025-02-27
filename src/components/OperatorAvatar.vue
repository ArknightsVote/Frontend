<script setup lang="ts">
const { target } = defineProps<{
  target?: OperatorTarget
}>()

const operator = computed(() => target ? findOperator(target) : undefined)
</script>

<template>
  <div class="w-[180px] aspect-[1/2] relative ark-apter">
    <img
      v-if="operator"
      size-full
      :src="operator.avatar"
    >
    <div
      absolute
      z-1
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

<style scoped>
.ark-apter {
    --ark-from: rgba(245,158,11, 1);
    --ark-to: rgba(245,158,11, 0);

    position: relative;
}

.ark-apter::before {
    content: '';
    display: block;
    position: absolute;
    inset: 0;
    /* z-index: -1; */
    width: 100%;
    height: 100%;

    background-image: linear-gradient(-30deg, var(--ark-from), var(--ark-to) 72%);
    transition: opacity .5s;
    opacity: 0;
}

.ark-apter:hover::before {
    opacity: 1;
}
</style>
