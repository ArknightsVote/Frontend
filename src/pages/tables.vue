<script setup lang="ts">
const { currentTopicId } = useCurrentTopic()
const router = useRouter()

// 未选择主题时不应停留在数据页，回到选择页
watchEffect(() => {
  if (!currentTopicId.value)
    router.replace({ path: '/' })
})
</script>

<template>
  <div h-full>
    <router-view v-slot="{ Component, route }">
      <keep-alive>
        <component :is="Component" :key="route.fullPath" />
      </keep-alive>
    </router-view>
  </div>
</template>
