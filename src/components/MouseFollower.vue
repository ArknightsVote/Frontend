<script setup lang=ts>
const { width: screenWidth, height: screenHeight } = useWindowSize()
const { x, y } = usePointer()

const style = shallowRef({})

const threshold = 21
const size = 60

const update = useThrottleFn(() => {
  const _x = x.value + threshold
  const _y = y.value + threshold

  const left = _x + size > screenWidth.value ? x.value - size - threshold : _x
  const top = _y + size > screenHeight.value ? y.value - size - threshold : _y

  style.value = {
    left: `${left}px`,
    top: `${top}px`,
  }
}, 60)

watch([x, y], update)
</script>

<template>
  <img
    class="mouse-follower"
    src="../assets/images/夕trans.gif"
    :style="style"
  >
</template>

<style scoped>
.mouse-follower {
    position: fixed;
    z-index: 9999;
    vertical-align: middle;
    transition: left .15s ease, top .15s ease;
    user-select: none;
    pointer-events: none;

    object-fit: cover;
    width: 60px;
    aspect-ratio: 1;

}
</style>
