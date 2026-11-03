<script setup>
import { computed, onBeforeUnmount, ref, watch, watchEffect } from 'vue'
import { t } from '@/i18n'
import { findApp } from '@/stores/desktop'
import { setMusicOn } from '@/stores/pet'
/* 音源：交给 Vite 打包成带 hash 的静态资源，换歌只改这一行 */
import trackUrl from '@/assets/love-letter-3.mp3'

const app = findApp('music')

const audio = ref(null)
const playing = ref(false)
const current = ref(0)
const total = ref(0)
/* 音量：0～1，按 10% 一档走，做出像素滑块的顿挫感 */
const vol = ref(0.7)
const muted = ref(false)
const dragging = ref(false)

const playLabel = computed(() => (playing.value ? 'II' : '>'))
const pct = computed(() => (total.value > 0 ? (current.value / total.value) * 100 : 0))
const volPct = computed(() => Math.round((muted.value ? 0 : vol.value) * 100))

/* 音量改变就同步给 <audio>（audio 挂载后才会生效） */
watchEffect(() => {
  if (audio.value) audio.value.volume = muted.value ? 0 : vol.value
})

/** 秒数 → m:ss */
function fmt(s) {
  if (!Number.isFinite(s) || s < 0) return '0:00'
  const m = Math.floor(s / 60)
  const sec = Math.floor(s % 60)
  return `${m}:${String(sec).padStart(2, '0')}`
}

/* 浏览器不允许带声音自动播放，所以默认暂停，等用户点一下 */
async function toggle() {
  const el = audio.value
  if (!el) return
  if (el.paused) {
    try {
      await el.play()
    } catch {
      playing.value = false
    }
  } else {
    el.pause()
  }
}

/** 只有一首，上一首 = 回到开头重放 */
function restart() {
  const el = audio.value
  if (!el) return
  el.currentTime = 0
  el.play().catch(() => {})
}

/** 进度条点击跳转 */
function seek(e) {
  const el = audio.value
  if (!el || total.value <= 0) return
  const box = e.currentTarget.getBoundingClientRect()
  const ratio = Math.min(Math.max((e.clientX - box.left) / box.width, 0), 1)
  el.currentTime = ratio * total.value
  current.value = el.currentTime
}

/* 告诉桌宠：现在在放歌，它好改哼小曲 */
watch(playing, (on) => setMusicOn(on))

/* 窗口被关掉（display:none，组件不销毁）时也要停下来 */
watch(
  () => app?.open,
  (open) => {
    if (!open) audio.value?.pause()
  },
)

onBeforeUnmount(() => {
  audio.value?.pause()
  setMusicOn(false)
})

/* ---------- 音量滑块 ---------- */
function setVolume(e) {
  const box = e.currentTarget.getBoundingClientRect()
  const ratio = Math.min(Math.max((e.clientX - box.left) / box.width, 0), 1)
  vol.value = Math.round(ratio * 10) / 10
  muted.value = false
}
function volDown(e) {
  dragging.value = true
  e.currentTarget.setPointerCapture?.(e.pointerId)
  setVolume(e)
}
function volMove(e) {
  if (dragging.value) setVolume(e)
}
function volUp() {
  dragging.value = false
}
/** 键盘：左右键 10% 一档，M 静音 */
function volKey(e) {
  if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
    e.preventDefault()
    vol.value = Math.max(0, Math.round((vol.value - 0.1) * 10) / 10)
    muted.value = false
  } else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
    e.preventDefault()
    vol.value = Math.min(1, Math.round((vol.value + 0.1) * 10) / 10)
    muted.value = false
  }
}
function toggleMute() {
  muted.value = !muted.value
}
</script>

<template>
  <div class="music-body" :class="{ paused: !playing }">
    <audio
      ref="audio"
      :src="trackUrl"
      preload="metadata"
      @loadedmetadata="total = audio.duration"
      @durationchange="total = audio.duration"
      @timeupdate="current = audio.currentTime"
      @play="playing = true"
      @pause="playing = false"
      @ended="playing = false"
    />

    <div class="lcd">
      <div class="marquee">
        <div class="marquee__track">
          <span>{{ t('music.track') }}</span>
          <span aria-hidden="true">{{ t('music.track') }}</span>
        </div>
      </div>
      <div class="scrub" :title="t('music.seek')" @click="seek">
        <i :style="{ width: `${pct}%` }" />
      </div>
      <div class="times"><span>{{ fmt(current) }}</span><span>{{ fmt(total) }}</span></div>
    </div>

    <div class="volume" :class="{ muted }">
      <button
        class="vico"
        type="button"
        :title="t('music.mute')"
        :aria-pressed="muted"
        @click="toggleMute"
      >
        {{ muted ? 'MUTE' : 'VOL' }}
      </button>
      <div
        class="vtrack"
        role="slider"
        tabindex="0"
        :aria-label="t('music.volume')"
        aria-valuemin="0"
        aria-valuemax="100"
        :aria-valuenow="volPct"
        @pointerdown="volDown"
        @pointermove="volMove"
        @pointerup="volUp"
        @pointercancel="volUp"
        @keydown="volKey"
      >
        <i :style="{ width: `${volPct}%` }" />
        <b :style="{ '--vol': volPct / 100 }" />
      </div>
      <span class="vval">{{ volPct }}</span>
    </div>

    <div class="transport">
      <button class="tbtn" type="button" :title="t('music.prev')" @click="restart">|&lt;</button>
      <button
        class="tbtn"
        type="button"
        :title="playing ? t('music.pause') : t('music.play')"
        :aria-pressed="playing"
        @click="toggle"
      >
        {{ playLabel }}
      </button>
      <button class="tbtn" type="button" :title="t('music.next')" disabled>&gt;|</button>
    </div>

    <!-- CD 用 SVG 硬边扇形画：不依赖 conic-gradient，任何引擎都能画出来 -->
    <svg class="cd" viewBox="0 0 92 92" aria-hidden="true" focusable="false">
      <path d="M46 46 L46 4 A42 42 0 0 1 75.7 16.3 Z" fill="#ff9df3" />
      <path d="M46 46 L75.7 16.3 A42 42 0 0 1 88 46 Z" fill="#8ffaff" />
      <path d="M46 46 L88 46 A42 42 0 0 1 75.7 75.7 Z" fill="#fff5e6" />
      <path d="M46 46 L75.7 75.7 A42 42 0 0 1 46 88 Z" fill="#ff9df3" />
      <path d="M46 46 L46 88 A42 42 0 0 1 16.3 75.7 Z" fill="#8ffaff" />
      <path d="M46 46 L16.3 75.7 A42 42 0 0 1 4 46 Z" fill="#fff5e6" />
      <path d="M46 46 L4 46 A42 42 0 0 1 16.3 16.3 Z" fill="#f235d9" />
      <path d="M46 46 L16.3 16.3 A42 42 0 0 1 46 4 Z" fill="#ff9df3" />
      <circle cx="46" cy="46" r="12" fill="#fff5e6" />
      <circle cx="46" cy="46" r="8" fill="#0d0618" />
      <circle cx="46" cy="46" r="44" fill="none" stroke="#0d0618" stroke-width="4" />
    </svg>
  </div>
</template>

<style scoped>
.music-body {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 8px;
  padding: 8px;
  background: var(--main);
  border: 4px solid;
  border-color: var(--main-dark) var(--main-light) var(--main-light) var(--main-dark);
  color: var(--ink);
}

.lcd {
  flex: 0 0 auto;
  min-width: 0;
  padding: 6px;
  background: #06283a;
  border: 3px solid;
  border-color: #021018 var(--main-light) var(--main-light) #021018;
  color: var(--main-light);
  overflow: hidden;
}

.marquee {
  overflow: hidden;
  -webkit-mask-image: linear-gradient(90deg, #000 84%, transparent 100%);
  mask-image: linear-gradient(90deg, #000 84%, transparent 100%);
}
.marquee__track {
  display: flex;
  width: max-content;
  animation: marquee 16s linear infinite;
}
.marquee__track span {
  flex: 0 0 auto;
  padding-right: 26px;
  font-family: var(--fh), 'PingFang SC', 'Microsoft YaHei', sans-serif;
  font-size: 11px;
  letter-spacing: 0.3px;
  white-space: nowrap;
}

.scrub {
  height: 12px;
  margin: 7px 0 5px;
  background: #021018;
  border: 2px solid;
  border-color: #021018 var(--main-light) var(--main-light) #021018;
  cursor: pointer;
}
.scrub > i {
  display: block;
  width: 0;
  height: 100%;
  background: repeating-linear-gradient(90deg, var(--acct) 0 4px, var(--acct-light) 4px 6px);
}

.times {
  display: flex;
  justify-content: space-between;
  font-family: var(--fh);
  font-size: 10px;
}

/* 音量：像素滑块（10% 一档） */
.volume {
  display: flex;
  flex: 0 0 auto;
  align-items: center;
  gap: 6px;
  padding: 0 2px;
}
.vico {
  padding: 0;
  background: none;
  border: 0;
  color: var(--ink);
  font-family: var(--fh);
  font-size: 9px;
  letter-spacing: 0.5px;
  opacity: 0.6;
  cursor: pointer;
}
.volume.muted .vico {
  color: var(--acct-dark);
  opacity: 1;
}
.vtrack {
  position: relative;
  flex: 1 1 auto;
  height: 14px;
  background: #06283a;
  border: 2px solid;
  border-color: #021018 var(--main-light) var(--main-light) #021018;
  cursor: pointer;
  touch-action: none;
}
.vtrack > i {
  display: block;
  height: 100%;
  background: repeating-linear-gradient(90deg, var(--acct) 0 3px, var(--acct-light) 3px 5px);
}
.vtrack > b {
  position: absolute;
  top: -4px;
  /* 让滑块两端都不超出轨道 */
  left: calc(var(--vol) * (100% - 8px));
  width: 8px;
  height: 18px;
  background: var(--cream);
  border: 2px solid var(--ink);
  pointer-events: none;
}
.vtrack:focus-visible {
  outline: 2px solid var(--ink);
  outline-offset: 2px;
}
.vval {
  min-width: 18px;
  font-family: var(--fh);
  font-size: 9px;
  text-align: right;
  color: var(--ink);
  opacity: 0.75;
}

.transport {
  display: flex;
  align-items: center;
  gap: 6px;
  flex: 0 0 auto;
  padding-right: 106px;
}

.tbtn {
  display: grid;
  place-items: center;
  width: 42px;
  height: 28px;
  padding: 0 0 2px;
  background: var(--acct);
  color: var(--cream);
  font-family: var(--fh);
  font-size: 10px;
  border: 3px solid;
  border-color: var(--acct-light) var(--acct-dark) var(--acct-dark) var(--acct-light);
}
.tbtn:hover {
  background: var(--acct-light);
  color: var(--ink);
}
.tbtn:active {
  border-color: var(--acct-dark) var(--acct-light) var(--acct-light) var(--acct-dark);
}
.tbtn:disabled {
  opacity: 0.4;
  cursor: default;
}
.tbtn:disabled:hover {
  background: var(--acct);
  color: var(--cream);
}

/* 旋转 CD：挂在播放器右下角，故意探出窗口外（上沿不遮住 LCD） */
.cd {
  display: block;
  position: absolute;
  right: -30px;
  bottom: -58px;
  width: 92px;
  height: 92px;
  border-radius: 50%;
  box-shadow: 0 0 0 3px #3a1188, 7px 7px 0 rgba(6, 2, 14, 0.5);
  animation: spin 4s linear infinite;
}
.music-body.paused .cd,
.music-body.paused .marquee__track {
  animation-play-state: paused;
}

/* 窄屏：CD 回归文档流 */
@media (max-width: 1100px) {
  .transport {
    padding-right: 0;
  }
  .cd {
    position: relative;
    right: auto;
    bottom: auto;
    margin: 12px auto 0;
  }
}
</style>
