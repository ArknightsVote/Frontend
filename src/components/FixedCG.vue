<script setup lang='ts'>
import imgURL from '@/assets/images/keobeCG.png'
</script>

<template>
  <div
    fixed
    bottom-0
    right-0
    aspect-square
    w-48
    bg="cover center"
    :style="{
      backgroundImage: `url(${imgURL})`,
    }"
  />
</template>
