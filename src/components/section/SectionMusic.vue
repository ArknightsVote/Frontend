<script setup lang='ts'>
import { ref, computed, onUnmounted, nextTick } from 'vue'
import Section from './Section.vue'

// 音频文件列表
const musicList = [
  {
    id: 1,
    name: '嗵嗵',
    src: '/src/assets/audio/tongtong.mp3'
  },
  {
    id: 2,
    name: '血狼打灰歌',
    src: '/src/assets/audio/xuelangdahui.mp3'
  },
]

// 播放器状态
const currentTrackIndex = ref(0)
const isPlaying = ref(false)
const currentTime = ref(0)
const duration = ref(0)
const volume = ref(0.7)
const audioRef = ref<HTMLAudioElement>()
const showPlaylist = ref(false)

// 计算属性
const currentTrack = computed(() => musicList[currentTrackIndex.value])
const progress = computed(() => duration.value ? (currentTime.value / duration.value) * 100 : 0)
const formattedTime = computed(() => `${formatTime(currentTime.value)}/${formatTime(duration.value)}`)

// 格式化时间
function formatTime(time: number): string {
  const minutes = Math.floor(time / 60)
  const seconds = Math.floor(time % 60)
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

// 播放/暂停
function togglePlay() {
  if (!audioRef.value) return
  
  if (isPlaying.value) {
    audioRef.value.pause()
  } else {
    audioRef.value.play()
  }
}

// 上一首
function previousTrack() {
  currentTrackIndex.value = currentTrackIndex.value > 0 
    ? currentTrackIndex.value - 1 
    : musicList.length - 1
  nextTick(() => {
    if (isPlaying.value) {
      audioRef.value?.play()
    }
  })
}

// 下一首
function nextTrack() {
  currentTrackIndex.value = currentTrackIndex.value < musicList.length - 1 
    ? currentTrackIndex.value + 1 
    : 0
  nextTick(() => {
    if (isPlaying.value) {
      audioRef.value?.play()
    }
  })
}

// 设置进度
function setProgress(event: Event) {
  const target = event.target as HTMLInputElement
  const audio = audioRef.value
  if (audio && duration.value) {
    const newTime = (parseFloat(target.value) / 100) * duration.value
    audio.currentTime = newTime
  }
}

// 设置音量
function setVolume(event: Event) {
  const target = event.target as HTMLInputElement
  volume.value = parseFloat(target.value) / 100
  if (audioRef.value) {
    audioRef.value.volume = volume.value
  }
}

// 音频事件处理
function onLoadedMetadata() {
  if (audioRef.value) {
    duration.value = audioRef.value.duration
  }
}

function onTimeUpdate() {
  if (audioRef.value) {
    currentTime.value = audioRef.value.currentTime
  }
}

function onPlay() {
  isPlaying.value = true
}

function onPause() {
  isPlaying.value = false
}

function onEnded() {
  nextTrack()
}

// 切换播放列表显示
function togglePlaylist() {
  showPlaylist.value = !showPlaylist.value
}

// 清理
onUnmounted(() => {
  if (audioRef.value) {
    audioRef.value.pause()
  }
})
</script>

<template>
  <div>
    <!-- 隐藏的音频元素 -->
    <audio
      ref="audioRef"
      :src="currentTrack.src"
      :volume="volume"
      @loadedmetadata="onLoadedMetadata"
      @timeupdate="onTimeUpdate"
      @play="onPlay"
      @pause="onPause"
      @ended="onEnded"
    />

    <!-- 播放器界面 -->
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
          <h3 text-lg font-bold mb-1 text-gray-800 truncate>{{ currentTrack.name }}</h3>
          <p text-gray-600 text-xs m-0>{{ currentTrackIndex + 1 }} / {{ musicList.length }}</p>
        </div>

        <!-- 播放时间 -->
        <div text-sm text-gray-600 min-w-20 text-center>
          {{ formattedTime }}
        </div>

        <!-- 控制按钮 -->
        <div flex items-center gap-2>
          <button 
            bg="white/80" hover="bg-white text-gray-800 shadow-md scale-110" backdrop-blur-sm border border-gray-200 
            text-gray-600 cursor-pointer p-1.5 rounded-full
            flex items-center justify-center transition-all duration-200
            shadow-sm
            @click="previousTrack" 
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
            @click="togglePlay" 
            :title="isPlaying ? '暂停' : '播放'"
          >
            <svg v-if="!isPlaying" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
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
            @click="nextTrack" 
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
            :value="progress"
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
          :class="{ 'bg-indigo-100 text-indigo-600 border-indigo-300': showPlaylist }"
          @click="togglePlaylist" 
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
          :value="volume * 100"
          @input="setVolume"
          class="volume-slider"
        />
      </div>

      <!-- 播放列表 -->
      <div v-show="showPlaylist" border-t border-gray-200 pt-4>
        <h4 m-0 mb-3 text-gray-800 text-sm font-medium>播放列表</h4>
        <div max-h-40 overflow-y-auto>
          <div flex flex-col gap-2>
            <div
              v-for="(track, index) in musicList"
              :key="track.id"
              flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-all duration-200
              bg="white/40" hover="bg-white/60 shadow-sm"
              border border-gray-200
              :class="{ 'bg-indigo-100/80 text-indigo-600 border-indigo-300': index === currentTrackIndex }"
              @click="currentTrackIndex = index"
            >
              <span text-xs text-gray-600 min-w-4>{{ index + 1 }}</span>
              <span flex-1 text-sm>{{ track.name }}</span>
              <svg v-if="index === currentTrackIndex && isPlaying" width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </Section>
  </div>
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
