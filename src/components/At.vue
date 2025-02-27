<script setup lang='ts'>
const props = defineProps<{
  name: string
  avatar?: string
  link?: string
}>()

function handleClick() {
  if (!props.link)
    return
  window.open(props.link, '_blank')
}
</script>

<template>
  <a
    inline-flex
    items-center
    gap-1
    :class="props.link ? ' hover:text-indigo-500 cursor-pointer' : ''"
    @click="handleClick"
    un-border
    p-1
    rounded
  >
  <img
  v-if="avatar"
  :src="avatar"
  aspect-ratio-square
  rounded-full
  w-6
  >
  <span>{{ name }}</span>
  </a>
</template>
