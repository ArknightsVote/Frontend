<script setup lang="ts">
const route = useRoute()

const isHome = computed(() => route.path === '/')
</script>

<template>
  <FixedCG z--1 />
  <MouseFollower />

  <Nav v-if="!isHome" />

  <router-view v-slot="{ Component }">
    <transition name="slide" mode="out-in">
      <div
        :key="route.path"
        :style="{ height: isHome ? '100%' : 'calc(100% - 3.5rem)' }"
        overflow-y-auto
        px-2
        relative
        z-1
      >
        <div container h-full mx-auto>
          <keep-alive>
            <component :is="Component" :key="route.path" />
          </keep-alive>
        </div>
      </div>
    </transition>
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
    overflow: hidden;
    scrollbar-color: gray #00000000;
    position: relative;
}

.fade-enter-active {
  transition: all 0.5s;
}

.fade-enter-from {
  opacity: 0;
}

.slide-enter-active {
  transition: all 0.5s;
}

.slide-enter-from {
  transform: translateY(10px);
  opacity: 0;
}
</style>
