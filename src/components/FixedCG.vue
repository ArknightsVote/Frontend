<script setup lang='ts'>
import imgURL from '@/assets/images/keobeCG.png'
</script>

<template>
  <div
    class="fixed bottom-0 right-0 aspect-square w-48"
    un-bg="cover center"
    :style="{
      backgroundImage: `url(${imgURL})`,
    }"
  />
</template>
