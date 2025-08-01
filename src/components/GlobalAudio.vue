<script setup lang='ts'>
import { onMounted, onUnmounted } from 'vue'
import { useMusicStore } from '@/stores/music'

const musicStore = useMusicStore()

// 组件挂载时设置音频元素引用
onMounted(() => {
  const audio = document.getElementById('global-audio') as HTMLAudioElement
  if (audio) {
    musicStore.setAudioRef(audio)
  }
})

// 组件卸载时暂停音乐
onUnmounted(() => {
  musicStore.pause()
})
</script>

<template>
  <!-- 全局音频元素 -->
  <audio
    id="global-audio"
    :src="musicStore.currentTrack.src"
    :volume="musicStore.volume"
    @loadedmetadata="musicStore.onLoadedMetadata"
    @timeupdate="musicStore.onTimeUpdate"
    @play="musicStore.onPlay"
    @pause="musicStore.onPause"
    @ended="musicStore.onEnded"
  />
</template>
