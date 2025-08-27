<script setup lang='ts'>
const imgURL = 'https://ae01.alicdn.com/kf/A32905af28006419081a46bda3baff41cR.png'
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
