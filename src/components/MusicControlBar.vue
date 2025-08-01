<script setup lang='ts'>
import { useMusicStore } from '@/stores/music'

const musicStore = useMusicStore()
</script>

<template>
  <!-- 简化的音乐控制条 -->
  <div 
    v-if="musicStore.currentTrack"
    fixed bottom-4 right-4 z-50
    bg="white/90" backdrop-blur-md border border-gray-200
    rounded-lg shadow-lg p-3
    flex items-center gap-3
    max-w-xs
    transition-all duration-300
  >
    <!-- 歌曲信息 -->
    <div flex-1 min-w-0>
      <p text-sm font-medium text-gray-800 truncate mb-1>
        {{ musicStore.currentTrack.name }}
      </p>
      <div w-full bg-gray-200 rounded-full h-1>
        <div 
          bg-indigo-600 h-1 rounded-full transition-all duration-300
          :style="{ width: musicStore.progress + '%' }"
        ></div>
      </div>
    </div>

    <!-- 控制按钮 -->
    <div flex items-center gap-1>
      <button 
        bg="gray-100" hover="bg-gray-200" text-gray-600 p-1.5 rounded-full
        flex items-center justify-center transition-all duration-200
        @click="musicStore.previousTrack"
        title="上一首"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/>
        </svg>
      </button>

      <button 
        bg-indigo-600 hover="bg-indigo-700" text-white p-2 rounded-full
        flex items-center justify-center transition-all duration-200
        @click="musicStore.togglePlay"
        :title="musicStore.isPlaying ? '暂停' : '播放'"
      >
        <svg v-if="!musicStore.isPlaying" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <path d="M8 5v14l11-7z"/>
        </svg>
        <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
        </svg>
      </button>

      <button 
        bg="gray-100" hover="bg-gray-200" text-gray-600 p-1.5 rounded-full
        flex items-center justify-center transition-all duration-200
        @click="musicStore.nextTrack"
        title="下一首"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/>
        </svg>
      </button>
    </div>
  </div>
</template>
