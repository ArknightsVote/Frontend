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
    <router-view v-slot="{ Component }">
      <transition name="slide" mode="out-in">
        <keep-alive>
          <component :is="Component" />
        </keep-alive>
      </transition>
    </router-view>
  </div>
</template>

<style scoped>
.slide-move,
.slide-enter-active,
.slide-leave-active {
  transition: .3s all ease-in;
}

.slide-enter-from {
  opacity: 0;
  transition: translateX(50px);
}

.slide-leave-to {
  opacity: 0;
  transition: rotateZ(-10deg);
}
</style>
