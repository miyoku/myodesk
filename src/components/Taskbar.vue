<script setup>
import { computed } from 'vue'
import PixelIcon from '@/components/PixelIcon.vue'
import { useClock } from '@/composables/useClock'
import { apps, toggleApp } from '@/stores/desktop'
import { t } from '@/i18n'

defineProps({
  menuOpen: { type: Boolean, default: false },
})
defineEmits(['toggle-menu'])

const { time } = useClock()

/** 任务栏只列打开着的窗口；pin 标记的（猫猫摄像）关掉也常驻 */
const tabs = computed(() => apps.filter((app) => app.open || app.pin))
</script>

<template>
  <div class="taskbar">
    <button
      class="start-btn"
      :class="{ on: menuOpen }"
      type="button"
      aria-controls="start-menu"
      :aria-expanded="menuOpen"
      @click="$emit('toggle-menu')"
    >
      <PixelIcon name="paw" />{{ t('task.start') }}
    </button>

    <div class="taskbox">
      <button
        v-for="app in tabs"
        :key="app.id"
        class="task-tab"
        :class="{ off: !app.open }"
        type="button"
        :title="app.open ? t('task.minimize', { name: t(app.nameKey) }) : t('task.restore', { name: t(app.nameKey) })"
        @click="toggleApp(app)"
      >
        <i class="dot" aria-hidden="true" />
        <span>{{ t(app.nameKey) }}</span>
      </button>
    </div>

    <div class="clockbox">
      <PixelIcon name="clock" />
      <span>{{ time }}</span>
    </div>
  </div>
</template>

<style scoped>
.taskbar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  gap: 6px;
  height: 58px;
  padding: 0 8px;
  background: linear-gradient(var(--main) 0 42%, var(--main-dark) 42% 100%);
  border-top: 4px solid var(--cream);
  box-shadow: 0 -4px 0 rgba(6, 2, 14, 0.45);
}

.start-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 42px;
  padding: 4px 14px 0 10px;
  line-height: 1;
  background: linear-gradient(var(--main-light) 0 46%, var(--main) 46%);
  border: 3px solid;
  border-color: #fff var(--main-dark) var(--main-dark) #fff;
  color: var(--ink);
  font-family: var(--fh);
  font-size: 14px;
  letter-spacing: 0.6px;
  white-space: nowrap;
}
.start-btn .px {
  width: 22px;
  height: 22px;
}
.start-btn:active,
.start-btn.on {
  border-color: var(--main-dark) #fff #fff var(--main-dark);
}
.start-btn.on {
  background: var(--main);
}

.taskbox {
  flex: 1 1 auto;
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 6px;
  overflow: hidden;
}
.task-tab {
  display: flex;
  align-items: center;
  gap: 7px;
  min-width: 0;
  max-width: 212px;
  height: 38px;
  padding: 3px 12px 0;
  line-height: 1;
  background: linear-gradient(var(--main-light) 0 46%, var(--main) 46%);
  border: 3px solid;
  border-color: #fff var(--main-dark) var(--main-dark) #fff;
  color: var(--ink);
  font-family: var(--fh);
  font-size: 11px;
}
.task-tab .dot {
  flex: 0 0 auto;
  width: 10px;
  height: 10px;
  background: var(--acct);
  box-shadow: inset -2px -2px 0 var(--acct-dark);
}
.task-tab span {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.task-tab.off {
  opacity: 0.7;
}
.task-tab.off .dot {
  background: var(--main-dark);
  box-shadow: none;
}

.clockbox {
  flex: 0 0 auto;
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 7px;
  height: 40px;
  padding: 3px 13px 0;
  background: var(--main);
  border: 3px solid;
  border-color: var(--main-dark) var(--main-light) var(--main-light) var(--main-dark);
  color: var(--ink);
  font-family: var(--fh);
  font-size: 12px;
  letter-spacing: 0.5px;
}
.clockbox .px {
  width: 18px;
  height: 18px;
}

@media (max-width: 1100px) {
  .taskbox {
    display: none;
  }
}
</style>
