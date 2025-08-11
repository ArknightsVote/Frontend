// 导入音频文件
import qinghuaciMp3 from '@/assets/audio/qinghuaci.mp3'
import tongtongMp3 from '@/assets/audio/tongtong.mp3'
import xiangxianshubenquMp3 from '@/assets/audio/xiangxianshubenqu.mp3'
import xuelangdahuiMp3 from '@/assets/audio/xuelangdahui.mp3'
import { defineStore } from 'pinia'
import { computed, nextTick, ref } from 'vue'

// 音频文件列表
const musicList = [
  {
    id: 1,
    name: '嗵嗵',
    src: tongtongMp3,
  },
  {
    id: 2,
    name: '血狼打灰歌',
    src: xuelangdahuiMp3,
  },
  {
    id: 3,
    name: '青花瓷',
    src: qinghuaciMp3,
  },
  {
    id: 4,
    name: '向仙术奔去',
    src: xiangxianshubenquMp3,
  }
]

export const useMusicStore = defineStore('music', () => {
  // 播放器状态
  const currentTrackIndex = ref(0)
  const isPlaying = ref(false)
  const currentTime = ref(0)
  const duration = ref(0)
  const volume = ref(0.7)
  const showPlaylist = ref(false)

  // 音频元素引用 - 由全局音频组件设置
  const audioRef = ref<HTMLAudioElement>()

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

  // 设置音频元素引用
  function setAudioRef(audio: HTMLAudioElement) {
    audioRef.value = audio
  }

  // 播放/暂停
  function togglePlay() {
    if (!audioRef.value)
      return

    if (isPlaying.value) {
      audioRef.value.pause()
    }
    else {
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

  // 切换到指定歌曲
  function selectTrack(index: number) {
    const wasPlaying = isPlaying.value
    currentTrackIndex.value = index
    nextTick(() => {
      if (wasPlaying && audioRef.value) {
        audioRef.value.play()
      }
    })
  }

  // 设置进度
  function setProgress(value: number) {
    const audio = audioRef.value
    if (audio && duration.value) {
      const newTime = (value / 100) * duration.value
      audio.currentTime = newTime
    }
  }

  // 设置音量
  function setVolume(value: number) {
    volume.value = value / 100
    if (audioRef.value) {
      audioRef.value.volume = volume.value
    }
  }

  // 切换播放列表显示
  function togglePlaylist() {
    showPlaylist.value = !showPlaylist.value
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

  // 暂停音乐（用于页面卸载时）
  function pause() {
    if (audioRef.value) {
      audioRef.value.pause()
    }
  }

  return {
    // 状态
    musicList,
    currentTrackIndex,
    isPlaying,
    currentTime,
    duration,
    volume,
    showPlaylist,

    // 计算属性
    currentTrack,
    progress,
    formattedTime,

    // 方法
    setAudioRef,
    togglePlay,
    previousTrack,
    nextTrack,
    selectTrack,
    setProgress,
    setVolume,
    togglePlaylist,
    onLoadedMetadata,
    onTimeUpdate,
    onPlay,
    onPause,
    onEnded,
    pause,
  }
})
