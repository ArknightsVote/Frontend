<script setup lang="ts">
const { target } = defineProps<{
  target?: OperatorTarget
}>()

const operator = computed(() => target ? findOperator(target) : undefined)
</script>

<template>
  <div class="w-[140px] sm:w-[160px] lg:w-[200px] aspect-[1/2] relative ark-apter touch-manipulation">
    <img
      v-if="operator"
      class="w-full h-full object-cover rounded-lg"
      :src="operator.avatar"
      :alt="operator.name"
    >
    <div
      class="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 to-transparent text-white text-right p-3 rounded-b-lg"
    >
      <div class="text-sm sm:text-base font-bold truncate">
        {{ operator?.name }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.ark-apter {
    --ark-from: rgba(245,158,11, 1);
    --ark-to: rgba(245,158,11, 0);

    position: relative;
    -webkit-tap-highlight-color: transparent;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    user-select: none;
}

.ark-apter::before {
    content: '';
    display: block;
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    background-image: linear-gradient(-30deg, var(--ark-from), var(--ark-to) 72%);
    transition: opacity .3s ease;
    opacity: 0;
    border-radius: 0.5rem;
    pointer-events: none;
}

.ark-apter:hover::before {
    opacity: 1;
}

/* 移动端触摸优化 */
@media (hover: none) and (pointer: coarse) {
    .ark-apter::before {
        transition: opacity .1s ease;
    }

    .ark-apter:active::before {
        opacity: 0;
    }
}
</style>
