<script setup>
import { computed, ref } from 'vue'
import { closeApp, focusApp, moveApp } from '@/stores/desktop'
import { t } from '@/i18n'

const props = defineProps({
  app: { type: Object, required: true },
})

const root = ref(null)
let drag = null

const isNarrow = () => window.matchMedia('(max-width: 1100px)').matches

/** 拖拽后坐标由内联样式接管，并取消 right 定位 */
const positionStyle = computed(() => ({
  zIndex: props.app.z,
  ...(props.app.x === null
    ? {}
    : { left: `${props.app.x}px`, top: `${props.app.y}px`, right: 'auto' }),
}))

function startDrag(event) {
  if (event.button !== 0 || event.target.closest('button') || isNarrow()) return

  const el = root.value
  const rect = el.getBoundingClientRect()
  const box = el.parentElement.getBoundingClientRect()

  drag = { dx: event.clientX - rect.left, dy: event.clientY - rect.top, box }
  moveApp(props.app, rect.left - box.left, rect.top - box.top)

  event.currentTarget.setPointerCapture(event.pointerId)
  focusApp(props.app)
  event.preventDefault()
}

function onDrag(event) {
  if (!drag) return
  const { box, dx, dy } = drag
  const x = Math.min(Math.max(event.clientX - dx - box.left, 0), box.width - 90)
  const y = Math.min(Math.max(event.clientY - dy - box.top, 0), box.height - 40)
  moveApp(props.app, x, y)
}

function endDrag() {
  drag = null
}
</script>

<template>
  <section
    ref="root"
    class="window"
    :class="{ 'is-hidden': !app.open }"
    :style="positionStyle"
    @pointerdown="focusApp(app)"
  >
    <header
      class="whead"
      @pointerdown="startDrag"
      @pointermove="onDrag"
      @pointerup="endDrag"
      @pointercancel="endDrag"
    >
      <i class="whead-ico" />
      <span class="whead-title">{{ t(app.nameKey) }}</span>
      <button class="wbtn" type="button" :aria-label="t('win.close')" @click="closeApp(app)">X</button>
    </header>

    <div class="wurl">{{ app.url }}</div>

    <slot />
  </section>
</template>

<style scoped>
.window {
  position: absolute;
  display: flex;
  flex-direction: column;
  padding: 6px;
  background: var(--main);
  border: 4px solid;
  border-color: var(--main-light) var(--main-dark) var(--main-dark) var(--main-light);
  box-shadow: 7px 7px 0 rgba(6, 2, 14, 0.55);
  color: var(--ink);
}
.window.is-hidden {
  display: none;
}

.whead {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 4px 4px 6px;
  background: var(--ink);
  border-bottom: 3px solid #000;
  touch-action: none;
}
.whead-ico {
  flex: 0 0 auto;
  width: 12px;
  height: 12px;
  background: var(--acct);
  box-shadow: inset 2px 2px 0 var(--acct-light), inset -2px -2px 0 var(--acct-dark);
}
.whead-title {
  flex: 1 1 auto;
  min-width: 0;
  padding-top: 2px;
  font-family: var(--fh);
  font-size: 12px;
  letter-spacing: 0.4px;
  color: var(--main-light);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.wbtn {
  flex: 0 0 auto;
  display: grid;
  place-items: center;
  width: 22px;
  height: 22px;
  padding: 1px 0 0;
  background: var(--acct);
  color: var(--ink);
  font-family: var(--fh);
  font-size: 10px;
  line-height: 1;
  border: 3px solid;
  border-color: var(--acct-light) var(--acct-dark) var(--acct-dark) var(--acct-light);
}
.wbtn:hover {
  background: var(--acct-light);
}
.wbtn:active {
  border-color: var(--acct-dark) var(--acct-light) var(--acct-light) var(--acct-dark);
}

.wurl {
  margin: 4px 0 6px;
  padding: 2px 6px 1px;
  background: #06283a;
  border: 3px solid;
  border-color: #021018 var(--main-light) var(--main-light) #021018;
  color: var(--main-light);
  font-family: var(--fb);
  font-size: 11px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.wurl::before {
  content: '\25B8 ';
  color: var(--acct-light);
}
</style>
