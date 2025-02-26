<template>
  <Nav />
  <div
    class="h-[calc(100vh-3.5rem)]"
    overflow-y-auto
    overflow-x-hidden
    mx-auto
    relative
    z-1
    container
  >
    <router-view v-slot="{ Component, route }">
      <transition name="slide" mode="out-in">
        <keep-alive>
          <component :is="Component" :key="route.path" />
        </keep-alive>
      </transition>
    </router-view>
  </div>
</template>

<style scoped>
.slide-enter-active {
  transition: all 0.5s;
}

/* .slide-leave-active {
  transition: all 0.5s;
} */

.slide-enter-from {
  transform: translateY(10px);
  opacity: 0;
}

/* .slide-leave-to {
  transform: translateY(-10px);
  opacity: 0;
} */

/* .slide-leave-active {
  position: absolute;
} */
</style>
