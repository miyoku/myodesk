<script setup>
import PixelIcon from '@/components/PixelIcon.vue'
import { t } from '@/i18n'

defineProps({
  open: { type: Boolean, default: false },
})
defineEmits(['select'])

/** 与 nekOS 开始菜单同构；sep 表示这一项之前插一条分隔线，route 表示跳到首页而不是开窗口 */
const items = [
  { key: 'main', icon: 'monitor', label: 'menu.main', route: true },
  { key: 'files', icon: 'folder', label: 'menu.files' },
  { key: 'petz', icon: 'cat', label: 'menu.petz' },
  { key: 'arcade', icon: 'arcade', label: 'menu.arcade' },
  { key: 'camera', icon: 'camera', label: 'menu.camera' },
  { key: 'settings', icon: 'gear', label: 'menu.settings', sep: true },
]
</script>

<template>
  <div id="start-menu" class="start-menu" :class="{ open }" role="menu" aria-hidden="!open">
    <div class="sidebar"><span>desk<em>OS</em></span></div>

    <div class="menu-list">
      <template v-for="item in items" :key="item.key">
        <div v-if="item.sep" class="menu-sep" aria-hidden="true" />
        <button
          class="menu-item"
          type="button"
          role="menuitem"
          :title="item.route ? t('icon.home') : undefined"
          @click="$emit('select', item.key)"
        >
          <PixelIcon :name="item.icon" />
          {{ t(item.label) }}
        </button>
      </template>
    </div>
  </div>
</template>

<style scoped>
.start-menu {
  position: fixed;
  left: 58px;
  bottom: 64px;
  z-index: 120;
  display: none;
  background: var(--main);
  border: 3px solid var(--cream);
  border-bottom-color: var(--acct-dark);
  border-right-color: var(--acct-dark);
  box-shadow: 7px 7px 0 rgba(6, 2, 14, 0.5);
}
.start-menu.open {
  display: flex;
}

.sidebar {
  width: 42px;
  background: var(--main-light);
  border-right: 3px solid var(--main-dark);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 0;
}
.sidebar span {
  writing-mode: vertical-rl;
  text-orientation: mixed;
  font-family: var(--fh);
  font-size: 24px;
  line-height: 1;
  letter-spacing: 1px;
  color: var(--main-dark);
}
.sidebar span em {
  font-style: normal;
  color: var(--acct-dark);
}

.menu-list {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 6px;
  min-width: 242px;
}
.menu-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px 6px;
  color: var(--ink);
  font-family: var(--fh);
  font-size: 12px;
  text-align: left;
}
.menu-item .px {
  width: 22px;
  height: 22px;
}
.menu-item:hover {
  background: var(--acct);
  color: var(--cream);
}
.menu-sep {
  height: 3px;
  margin: 4px 2px;
  background: linear-gradient(var(--main-light) 0 50%, var(--main-dark) 50% 100%);
}

@media (max-width: 1100px) {
  .start-menu {
    left: 12px;
  }
}
</style>
