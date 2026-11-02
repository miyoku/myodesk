<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import PixelIcon from '@/components/PixelIcon.vue'
import { petLines } from '@/data/petLines'
import { cue, movePet, petX, petY, yapCue } from '@/stores/pet'
import { locale, t } from '@/i18n'

const root = ref(null)
const bubbleEl = ref(null)
const talking = ref(false)
const parts = ref([])
const walking = ref(false)
const dir = ref(1)
const bubbleShift = ref(0)
const bubbleBelow = ref(false)

let drag = null
let sayTimer = null
let hideTimer = null
let wanderTimer = null
let walkRaf = 0

const clamp = (v, min, max) => Math.min(Math.max(v, min), max)

/** 拖动后坐标由内联样式接管，并取消 left/bottom 定位 */
const positionStyle = computed(() =>
  petX.value === null
    ? {}
    : { left: `${petX.value}px`, top: `${petY.value}px`, right: 'auto', bottom: 'auto' },
)

/** 气泡整体平移量：贴着桌面边缘时不得被裁 */
const bubbleStyle = computed(() => ({ '--bs': `${bubbleShift.value}px` }))

/** 6~14 秒随口说一句 */
const nextGap = () => 6000 + Math.random() * 8000

/** 8~18 秒自己溜达一次 */
const nextWander = () => 8000 + Math.random() * 10000

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

function showLine(raw) {
  // |...| 之间的片段加粗高亮
  parts.value = raw
    .split('|')
    .map((text, i) => ({ text, hot: i % 2 === 1 }))
    .filter((part) => part.text)

  talking.value = true

  clearTimeout(hideTimer)
  hideTimer = setTimeout(() => {
    talking.value = false
  }, 5600)

  // 每次说完都重新排下一次，避免连说两句
  clearTimeout(sayTimer)
  sayTimer = setTimeout(say, nextGap())

  // 台词长短会改变气泡宽度，换完再夹一次边界
  nextTick(placeBubble)
}

function say() {
  const lines = petLines[locale.value] ?? petLines.zh
  showLine(lines[Math.floor(Math.random() * lines.length)])
}

/**
 * 打开 yaps 时跑过去抗议：走到窗口正下方居中，再喊一句 |Shut your yap.|
 * 梗不翻译（yap 即窗口名里的 yap）；被拖住时不动，减动效时瞬移
 */
function goToYaps() {
  const el = root.value
  if (!el || drag) return

  const box = el.parentElement.getBoundingClientRect()
  const rect = el.getBoundingClientRect()
  const win = document.querySelector('.win-yaps')
  const line = '|Shut your yap.|'

  if (!win || !box.width) {
    showLine(line)
    return
  }

  const wrect = win.getBoundingClientRect()
  const maxX = Math.max(box.width - rect.width, 0)
  const maxY = Math.max(box.height - rect.height, 0)
  const fromX = rect.left - box.left
  const fromY = rect.top - box.top
  const toX = clamp(Math.round(wrect.left - box.left + wrect.width / 2 - rect.width / 2), 0, maxX)
  const toY = clamp(Math.round(wrect.bottom - box.top + 14), 0, maxY)
  const dist = Math.hypot(toX - fromX, toY - fromY)

  // 抗议优先：打断待办的随机溜达，走完再重新排
  clearTimeout(wanderTimer)
  dir.value = toX < fromX ? -1 : 1

  if (reducedMotion() || dist < 24) {
    movePet(toX, toY)
    showLine(line)
    scheduleWander()
    return
  }

  walkTo(toX, toY, Math.round(clamp(dist * 7, 480, 1600)), () => showLine(line))
  scheduleWander()
}

// 窗口刚 open 完成（display:none 刚解除）才能量到位置，等 DOM 刷新后再出发
watch(yapCue, () => nextTick(goToYaps))

/**
 * 把气泡夹回桌面内：
 * - 水平：靠边时整体往回平移，不靠 `left:50%` 死居中
 * - 垂直：头上放不下就翻到宠物身下
 */
function placeBubble() {
  const el = root.value
  const bubble = bubbleEl.value
  if (!el || !bubble) return

  const box = el.parentElement.getBoundingClientRect()
  const rect = el.getBoundingClientRect()
  const cx = rect.left - box.left + rect.width / 2
  const edge = 10
  const w = bubble.offsetWidth
  const room = box.width - edge * 2

  bubbleShift.value = w >= room ? 0 : Math.round(clamp(cx, edge + w / 2, room + edge - w / 2) - cx)

  const need = bubble.offsetHeight + 20
  const above = rect.top - box.top
  bubbleBelow.value = above < need && box.height - (above + rect.height) > above
}

function scheduleWander() {
  clearTimeout(wanderTimer)
  wanderTimer = setTimeout(wander, nextWander())
}

/** 逐帧走位：每 6px 停一下，看起来是一格一格跳过去的 */
function walkTo(toX, toY, ms, onDone) {
  const el = root.value
  if (!el) return

  const box = el.parentElement.getBoundingClientRect()
  const rect = el.getBoundingClientRect()
  const maxX = Math.max(box.width - rect.width, 0)
  const maxY = Math.max(box.height - rect.height, 0)
  const fromX = rect.left - box.left
  const fromY = rect.top - box.top
  const start = performance.now()

  cancelAnimationFrame(walkRaf)
  movePet(fromX, fromY)
  walking.value = true

  const step = (now) => {
    const p = Math.min((now - start) / ms, 1)
    const x = Math.round((fromX + (toX - fromX) * p) / 6) * 6
    const y = Math.round((fromY + (toY - fromY) * p) / 6) * 6
    movePet(clamp(x, 0, maxX), clamp(y, 0, maxY))

    if (p < 1) {
      walkRaf = requestAnimationFrame(step)
      return
    }

    walking.value = false
    if (onDone) onDone()
  }

  walkRaf = requestAnimationFrame(step)
}

/** 随机事件：自己挑个新位置溜达过去（偶尔小步，偶尔窜远一点） */
function wander() {
  const el = root.value
  if (!el || drag || document.hidden || reducedMotion()) {
    scheduleWander()
    return
  }

  const box = el.parentElement.getBoundingClientRect()
  const rect = el.getBoundingClientRect()
  const maxX = Math.max(box.width - rect.width, 0)
  const maxY = Math.max(box.height - rect.height, 0)
  const fromX = rect.left - box.left
  const fromY = rect.top - box.top

  const far = Math.random() < 0.22
  const spanX = far ? Math.min(maxX, 460) : Math.min(maxX, 240)
  const spanY = Math.min(maxY, 150)

  const toX = clamp(fromX + (Math.random() * 2 - 1) * spanX, 0, maxX)
  const toY = clamp(fromY + (Math.random() * 2 - 1) * spanY, 0, maxY)
  const dist = Math.hypot(toX - fromX, toY - fromY)

  if (dist < 30) {
    scheduleWander()
    return
  }

  dir.value = toX < fromX ? -1 : 1
  walkTo(toX, toY, Math.round(clamp(dist * 9, 420, 1700)), () => {
    // 走到地方偶尔再补一句
    if (!talking.value && Math.random() < 0.3) say()
  })

  scheduleWander()
}

function onPointerDown(event) {
  if (event.button !== 0) return

  // 手一碰就停：打断正在走的路和待办的溜达
  clearTimeout(wanderTimer)
  cancelAnimationFrame(walkRaf)
  walking.value = false

  const el = root.value
  const rect = el.getBoundingClientRect()
  const box = el.parentElement.getBoundingClientRect()

  drag = {
    dx: event.clientX - rect.left,
    dy: event.clientY - rect.top,
    w: rect.width,
    h: rect.height,
    box,
    moved: false,
    fromX: event.clientX,
    fromY: event.clientY,
  }

  movePet(rect.left - box.left, rect.top - box.top)
  event.preventDefault()

  // 指针已释放时浏览器会抛错，忽略即可，拖拽仍靠指针事件驱动
  try {
    el.setPointerCapture(event.pointerId)
  } catch {
    /* noop */
  }
}

function onPointerMove(event) {
  if (!drag) return

  const { box, dx, dy, w, h } = drag
  if (Math.abs(event.clientX - drag.fromX) + Math.abs(event.clientY - drag.fromY) > 4) {
    drag.moved = true
  }

  const x = Math.min(Math.max(event.clientX - dx - box.left, 0), Math.max(box.width - w, 0))
  const y = Math.min(Math.max(event.clientY - dy - box.top, 0), Math.max(box.height - h, 0))
  movePet(x, y)
}

function onPointerUp() {
  // 没拖动就是点了一下，喵一句
  if (drag && !drag.moved) say()
  drag = null
  scheduleWander()
}

watch(cue, () => say())

// 位置一变就重新夹一次气泡（post：等 DOM 位置更新完再量）
watch([petX, petY], () => nextTick(placeBubble), { flush: 'post' })

// 喂完之后第一次露面，打个招呼，然后开始自己溜达
onMounted(() => {
  say()
  scheduleWander()
  window.addEventListener('resize', placeBubble)
})

onBeforeUnmount(() => {
  clearTimeout(sayTimer)
  clearTimeout(hideTimer)
  clearTimeout(wanderTimer)
  cancelAnimationFrame(walkRaf)
  window.removeEventListener('resize', placeBubble)
})
</script>

<template>
  <div
    ref="root"
    class="pet"
    :class="{ walking, 'walk-left': dir < 0 }"
    :style="positionStyle"
    role="img"
    :aria-label="t('pet.label')"
    @pointerdown="onPointerDown"
    @pointermove="onPointerMove"
    @pointerup="onPointerUp"
    @pointercancel="onPointerUp"
    @contextmenu.stop.prevent
  >
    <div
      ref="bubbleEl"
      class="pet-bubble"
      :class="{ on: talking, below: bubbleBelow }"
      :style="bubbleStyle"
      role="status"
    >
      <template v-for="(part, i) in parts" :key="i">
        <b v-if="part.hot">{{ part.text }}</b>
        <span v-else>{{ part.text }}</span>
      </template>
    </div>

    <PixelIcon name="cat" class="sprite" />
  </div>
</template>

<style scoped>
.pet {
  position: absolute;
  right: 84px;
  bottom: 96px;
  z-index: 250;
  width: 96px;
  touch-action: none;
  cursor: grab;
}
.pet:active {
  cursor: grabbing;
}

.sprite {
  display: block;
  width: 96px;
  height: 96px;
  filter: drop-shadow(4px 4px 0 rgba(6, 2, 14, 0.6));
  animation: bob 1.6s steps(2, end) infinite alternate;
}

/* 跑动时改成更快的小跳，并按方向微微歪头 */
.pet.walking .sprite {
  animation: hop-right 0.34s steps(2, end) infinite alternate;
}
.pet.walking.walk-left .sprite {
  animation: hop-left 0.34s steps(2, end) infinite alternate;
}

/* ---------- 像素对话气泡（硬边缘投影 + 扫描线底纹） ---------- */
.pet-bubble {
  position: absolute;
  left: 50%;
  bottom: calc(100% + 12px);
  width: max-content;
  max-width: min(234px, calc(100vw - 40px));
  padding: 9px 12px 7px;
  background-color: var(--cream);
  background-image: repeating-linear-gradient(
    to bottom,
    rgba(13, 6, 24, 0.13) 0 1px,
    transparent 1px 4px
  );
  border: 4px solid var(--ink);
  color: var(--ink);
  font-family: var(--fh);
  font-size: 10.5px;
  line-height: 1.7;
  text-align: left;
  opacity: 0;
  /* --bs 由 JS 按宠物在桌面的位置夹好，贴边时整体往回收 */
  transform: translate(calc(-50% + var(--bs, 0px)), 8px);
  transition: opacity 0.12s steps(2), transform 0.12s steps(2);
  pointer-events: none;
  box-shadow: 5px 5px 0 rgba(6, 2, 14, 0.5);
}
.pet-bubble.on {
  opacity: 1;
  transform: translate(calc(-50% + var(--bs, 0px)), 0);
}
/* 头上空间不够时翻到宠物身下 */
.pet-bubble.below {
  bottom: auto;
  top: calc(100% + 12px);
}
/* 跑动时每帧都在纠正偏移，别让过渡拖慢 */
.pet.walking .pet-bubble {
  transition-property: opacity;
}
.pet-bubble b {
  color: var(--acct);
  font-weight: 400;
}

@media (max-width: 1100px) {
  .pet {
    right: 16px;
    bottom: 24px;
  }
  .sprite {
    width: 76px;
    height: 76px;
  }
}

@keyframes hop-right {
  from {
    transform: translateY(-3px) rotate(5deg);
  }
  to {
    transform: translateY(2px) rotate(1deg);
  }
}
@keyframes hop-left {
  from {
    transform: translateY(-3px) rotate(-5deg);
  }
  to {
    transform: translateY(2px) rotate(-1deg);
  }
}
</style>
