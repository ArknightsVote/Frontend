<template>
  <FixedCG z--1 />

  <MouseFollower />
  <router-view v-slot="{ Component }">
    <keep-alive>
      <component :is="Component" />
    </keep-alive>
  </router-view>
</template>

<style>
body {
    background: url('@/assets/images/bg.png') center no-repeat;
    background-size: cover;
    background-attachment: fixed;
    min-height: 100vh;
}

#app {
    height: 100vh;
    overflow: auto;
    scrollbar-color: gray #00000000;
    position: relative;
}
</style>
