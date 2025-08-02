<script setup lang='ts'>
import { useMusicStore } from '@/stores/music'
import Section from './Section.vue'

const musicStore = useMusicStore()

// 设置进度
function setProgress(event: Event) {
  const target = event.target as HTMLInputElement
  musicStore.setProgress(parseFloat(target.value))
}

// 设置音量
function setVolume(event: Event) {
  const target = event.target as HTMLInputElement
  musicStore.setVolume(parseFloat(target.value))
}
</script>

<template>
  <Section title="音乐播放器" relative>
    <div 
      absolute right-0 top-0 w-32 h-40 opacity-30 pointer-events-none
      bg-no-repeat bg-right bg-contain
      class="music-bg"
    ></div>

    <!-- 主控制区域 - 标题、时间、控制按钮在一行 -->
    <div flex items-center justify-between mb-4 gap-4>
      <!-- 当前歌曲信息 -->
      <div flex-1 min-w-0>
        <h3 text-lg font-bold mb-1 text-gray-800 truncate>{{ musicStore.currentTrack.name }}</h3>
        <p text-gray-600 text-xs m-0>{{ musicStore.currentTrackIndex + 1 }} / {{ musicStore.musicList.length }}</p>
      </div>

      <!-- 播放时间 -->
      <div text-sm text-gray-600 min-w-20 text-center>
        {{ musicStore.formattedTime }}
      </div>

      <!-- 控制按钮 -->
      <div flex items-center gap-2>
        <button 
          bg="white/80" hover="bg-white text-gray-800 shadow-md scale-110" backdrop-blur-sm border border-gray-200 
          text-gray-600 cursor-pointer p-1.5 rounded-full
          flex items-center justify-center transition-all duration-200
          shadow-sm
          @click="musicStore.previousTrack" 
          title="上一首"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/>
          </svg>
        </button>
        
        <button 
          bg-indigo-600 hover="bg-indigo-700 scale-105 shadow-lg" text-white w-10 h-10 rounded-full cursor-pointer border-none
          flex items-center justify-center transition-all duration-200
          shadow-md
          @click="musicStore.togglePlay" 
          :title="musicStore.isPlaying ? '暂停' : '播放'"
        >
          <svg v-if="!musicStore.isPlaying" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z"/>
          </svg>
          <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
          </svg>
        </button>
        
        <button 
          bg="white/80" hover="bg-white text-gray-800 shadow-md scale-110" backdrop-blur-sm border border-gray-200 
          text-gray-600 cursor-pointer p-1.5 rounded-full
          flex items-center justify-center transition-all duration-200
          shadow-sm
          @click="musicStore.nextTrack" 
          title="下一首"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- 进度条区域 -->
    <div flex items-center gap-3 mb-4>
      <div flex-1>
        <input
          type="range"
          w-full h-1.5 rounded-full bg-gray-200 outline-none cursor-pointer
          appearance-none
          min="0"
          max="100"
          :value="musicStore.progress"
          @input="setProgress"
          class="range-slider"
        />
      </div>
      
      <!-- 播放列表切换按钮 -->
      <button 
        bg="white/80" hover="bg-white text-gray-800 shadow-md scale-110" backdrop-blur-sm border border-gray-200 
        text-gray-600 cursor-pointer p-2 rounded-full
        flex items-center justify-center transition-all duration-200
        shadow-sm
        :class="{ 'bg-indigo-100 text-indigo-600 border-indigo-300': musicStore.showPlaylist }"
        @click="musicStore.togglePlaylist" 
        title="播放列表"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z"/>
        </svg>
      </button>
    </div>

    <!-- 音量控制 -->
    <div flex items-center gap-3 mb-4 justify-center>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" text-gray-600>
        <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
      </svg>
      <input
        type="range"
        w-24 h-1 rounded-full bg-gray-200 outline-none cursor-pointer appearance-none
        min="0"
        max="100"
        :value="musicStore.volume * 100"
        @input="setVolume"
        class="volume-slider"
      />
    </div>

    <!-- 播放列表 -->
    <div v-show="musicStore.showPlaylist" border-t border-gray-200 pt-4>
      <h4 m-0 mb-3 text-gray-800 text-sm font-medium>播放列表</h4>
      <div max-h-40 overflow-y-auto>
        <div flex flex-col gap-2>
          <div
            v-for="(track, index) in musicStore.musicList"
            :key="track.id"
            flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-all duration-200
            bg="white/40" hover="bg-white/60 shadow-sm"
            border border-gray-200
            :class="{ 'bg-indigo-100/80 text-indigo-600 border-indigo-300': index === musicStore.currentTrackIndex }"
            @click="musicStore.selectTrack(index)"
          >
            <span text-xs text-gray-600 min-w-4>{{ index + 1 }}</span>
            <span flex-1 text-sm>{{ track.name }}</span>
            <svg v-if="index === musicStore.currentTrackIndex && musicStore.isPlaying" width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </div>
        </div>
      </div>
    </div>
  </Section>
</template>

<style scoped>
/* 背景图片样式 */
.music-bg {
  background-image: url('/src/assets/images/xuelang.png');
}

/* Range slider 自定义样式 */
.range-slider::-webkit-slider-thumb {
  appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #4f46e5;
  cursor: pointer;
}

.range-slider::-moz-range-thumb {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #4f46e5;
  cursor: pointer;
  border: none;
}

.volume-slider::-webkit-slider-thumb {
  appearance: none;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #4f46e5;
  cursor: pointer;
}

.volume-slider::-moz-range-thumb {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #4f46e5;
  cursor: pointer;
  border: none;
}
</style>
