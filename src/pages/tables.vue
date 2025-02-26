<template>
  <Nav />
  <div
    class="h-[calc(100vh-3.5rem)]"
    overflow-auto
    mx-auto
    relative
    z-1
    container
  >
    <router-view v-slot="{ Component, route }">
      <transition name="slide">
        <keep-alive>
          <component :is="Component" :key="route.path" />
        </keep-alive>
      </transition>
    </router-view>
  </div>
</template>

<style scoped>
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(20px);
  opacity: 0;
}
</style>
