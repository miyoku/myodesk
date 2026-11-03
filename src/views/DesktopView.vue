<script setup>
import { onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import DeskWindow from '@/components/DeskWindow.vue'
import PetOodle from '@/components/PetOodle.vue'
import StartMenu from '@/components/StartMenu.vue'
import Taskbar from '@/components/Taskbar.vue'
import PixelIcon from '@/components/PixelIcon.vue'
import { apps, findApp, openApp } from '@/stores/desktop'
import { fed } from '@/stores/pet'
import { t } from '@/i18n'

const router = useRouter()
const desktop = ref(null)

const menuOpen = ref(false)
const bubble = ref(false)
const ctx = reactive({ open: false, x: 0, y: 0 })

/**
 * 桌面图标。窗口刷新后默认全开，图标只做装饰：
 * - home   点它回首页宠物大图（与开始菜单 main 一致）
 * - to     整页跳转（分享会），不在桌面上开弹窗
 * - app    由图标负责弹出的窗口：相机弹猫猫摄像，oodle 弹文件窗口
 */
const icons = [
  { icon: 'monitor', label: 'icon.myPc', home: true },
  { icon: 'doc', label: 'icon.files', to: '/share' },
  { icon: 'folder', label: 'icon.stash', to: '/frames' },
  { app: 'cat', icon: 'camera', label: 'icon.cam' },
  { app: 'yaps', icon: 'cat', label: 'icon.oodle', pet: true },
]

const ctxItems = ['ctx.arrange', 'ctx.lineup', 'ctx.paste', 'ctx.pasteShortcut']

/** 开始菜单各项 → 窗口 id；petz 回到 oodlecam 窗口 */
const menuTargets = {
  petz: 'cat',
  arcade: 'loading',
  camera: 'cat',
  settings: 'music',
}

/** 开始菜单里走整页跳转的项 */
const menuRoutes = {
  files: '/share',
}

/** 回了首页宠物大图的标题（开始菜单 + 桌面图标共用） */
const homeKeys = ['main']

function openIcon(appId) {
  openApp(findApp(appId))
}

function goHome() {
  router.push('/')
}

/** 图标悬浮提示：有动作的提示目标窗口名，纯装饰图标不提示 */
function iconTitle(item) {
  if (item.home) return t('icon.home')
  if (item.app) return t('icon.open', { label: t(findApp(item.app).nameKey) })
  if (item.to) return t('icon.open', { label: t(item.label) })
  return ''
}

/** 桌面图标点击：我的电脑回首页，文件/收藏夹整页跳转，相机/oodle 弹出绑定窗口，其余装饰图标不响应 */
function onIconClick(item) {
  if (item.home) {
    goHome()
    return
  }
  if (item.to) {
    router.push(item.to)
    return
  }
  if (item.app) openIcon(item.app)
}

function onMenuSelect(key) {
  menuOpen.value = false
  if (homeKeys.includes(key)) {
    goHome()
    return
  }
  if (menuRoutes[key]) {
    router.push(menuRoutes[key])
    return
  }
  openIcon(menuTargets[key])
}

function closeAll() {
  menuOpen.value = false
  ctx.open = false
}

function onContextMenu(event) {
  const box = desktop.value.getBoundingClientRect()
  event.preventDefault()
  ctx.open = true
  ctx.x = Math.min(event.clientX - box.left, box.width - 196)
  ctx.y = Math.min(event.clientY - box.top, box.height - 184)
  menuOpen.value = false
}

function onKeydown(event) {
  if (event.key === 'Escape') closeAll()
}

onMounted(() => {
  document.body.classList.add('is-desktop')
  window.addEventListener('keydown', onKeydown)
})

onBeforeUnmount(() => {
  document.body.classList.remove('is-desktop')
  window.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <main ref="desktop" class="desktop" @pointerdown="closeAll" @contextmenu="onContextMenu">
    <!-- 桌面图标 -->
    <div class="icon-box">
      <button
        v-for="item in icons"
        :key="item.label"
        class="dicon"
        type="button"
        :title="iconTitle(item)"
        @click.stop="onIconClick(item)"
        @mouseenter="bubble = item.pet === true"
        @mouseleave="bubble = false"
        @focus="bubble = item.pet === true"
        @blur="bubble = false"
      >
        <PixelIcon :name="item.icon" />
        <span>{{ t(item.label) }}</span>
      </button>
    </div>

    <!-- 猫猫气泡 -->
    <div class="bubble" :class="{ on: bubble }" role="status">
      {{ t('bubble.pre') }}<b>oodle</b>{{ t('bubble.post') }}
    </div>

    <!-- 窗口 -->
    <DeskWindow v-for="app in apps" :key="app.id" :app="app" :class="`win-${app.id}`">
      <component :is="app.component" />
    </DeskWindow>

    <!-- 桌宠：喂过之后常驻桌面，可拖动 -->
    <PetOodle v-if="fed" />

    <!-- 更新胶囊 -->
    <div class="update-box pixel-corners">
      <span>{{ t('update.label') }}</span><b>2026.10.31</b>
    </div>

    <!-- 右键菜单 -->
    <div
      class="ctx"
      :class="{ open: ctx.open }"
      :style="{ left: `${ctx.x}px`, top: `${ctx.y}px` }"
      role="menu"
      @pointerdown.stop
    >
      <button v-for="label in ctxItems" :key="label" type="button" role="menuitem" @click="closeAll">
        {{ t(label) }}
      </button>
      <hr />
      <button type="button" role="menuitem" @click="closeAll">{{ t('ctx.new') }} &#9654;</button>
      <hr />
      <button type="button" role="menuitem" @click="closeAll">{{ t('ctx.properties') }}</button>
    </div>
  </main>

  <StartMenu :open="menuOpen" @select="onMenuSelect" />
  <Taskbar :menu-open="menuOpen" @toggle-menu="menuOpen = !menuOpen" />

  <div class="crt" aria-hidden="true" />
</template>

<style scoped>
/* ---------- CRT 扫描线 ---------- */
.crt {
  position: fixed;
  inset: 0;
  z-index: 400;
  pointer-events: none;
  background: repeating-linear-gradient(
    to bottom,
    rgba(8, 4, 15, 0.3) 0 1px,
    transparent 1px 3px
  );
  opacity: 0.6;
}

/* ---------- 星空壁纸 ---------- */
.desktop::before,
.desktop::after {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
}
.desktop::before {
  background-image:
    radial-gradient(1.5px 1.5px at 22px 34px, #fff 50%, transparent 51%),
    radial-gradient(1.5px 1.5px at 122px 78px, var(--main-light) 50%, transparent 51%),
    radial-gradient(2px 2px at 74px 148px, #fff 50%, transparent 51%),
    radial-gradient(1.5px 1.5px at 168px 44px, var(--acct-light) 50%, transparent 51%),
    radial-gradient(1.5px 1.5px at 44px 112px, #fff 50%, transparent 51%),
    radial-gradient(2px 2px at 150px 178px, #fff 50%, transparent 51%);
  background-size: 200px 200px;
  animation: twinkle 5s steps(2, end) infinite;
}
.desktop::after {
  background-image:
    radial-gradient(1px 1px at 60px 40px, #fff 50%, transparent 51%),
    radial-gradient(2px 2px at 210px 130px, var(--acct-light) 50%, transparent 51%),
    radial-gradient(1px 1px at 300px 90px, #fff 50%, transparent 51%),
    radial-gradient(1px 1px at 160px 250px, var(--main-light) 50%, transparent 51%),
    radial-gradient(closest-side at 78% 22%, rgba(242, 53, 217, 0.3), transparent 100%),
    radial-gradient(closest-side at 14% 78%, rgba(0, 211, 255, 0.2), transparent 100%);
  background-size: 340px 300px, 340px 300px, 340px 300px, 340px 300px, 100% 100%, 100% 100%;
  opacity: 0.75;
  animation: twinkle 7s steps(3, end) infinite reverse;
}

.desktop {
  position: relative;
  width: 100vw;
  height: calc(100vh - 58px);
  overflow: hidden;
}

/* ---------- 桌面图标 ---------- */
.icon-box {
  position: absolute;
  top: 14px;
  left: 14px;
  z-index: 3;
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 98px;
}
.dicon {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 6px 4px;
  color: var(--cream);
  font-family: var(--fh);
  font-size: 11px;
  letter-spacing: 0.4px;
  text-shadow: 2px 2px 0 #000;
}
.dicon .px {
  width: 48px;
  height: 48px;
  filter: drop-shadow(3px 3px 0 rgba(0, 0, 0, 0.55));
}
.dicon:hover .px {
  filter: drop-shadow(3px 3px 0 rgba(0, 0, 0, 0.55)) drop-shadow(0 0 8px var(--main));
}

/* ---------- 像素对话气泡（硬边缘投影） ---------- */
.bubble {
  position: absolute;
  left: 18px;
  bottom: 20px;
  z-index: 60;
  width: 172px;
  padding: 10px 12px 8px;
  background: var(--cream);
  color: var(--ink);
  font-family: var(--fh);
  font-size: 11px;
  line-height: 1.6;
  opacity: 0;
  transform: translateY(8px);
  transition: opacity 0.12s steps(2), transform 0.12s steps(2);
  pointer-events: none;
  box-shadow:
    0 -4px var(--cream), 0 -8px var(--ink),
    4px 0 var(--cream), 4px -4px var(--ink), 8px 0 var(--ink),
    0 4px var(--cream), 0 8px var(--ink),
    -4px 0 var(--cream), -4px 4px var(--ink), -8px 0 var(--ink),
    -4px -4px var(--ink), 4px 4px var(--ink);
}
.bubble.on {
  opacity: 1;
  transform: none;
}
.bubble b {
  color: var(--acct);
}

/* ---------- 窗口位置（随屏宽流式缩放） ---------- */
.desktop :deep(.win-error) {
  top: 56px;
  left: 10%;
  width: clamp(280px, 23vw, 320px);
}
.desktop :deep(.win-universe) {
  top: 92px;
  left: 36%;
  width: clamp(320px, 28vw, 400px);
}
.desktop :deep(.win-loading) {
  top: 380px;
  left: 12%;
  width: clamp(300px, 24vw, 340px);
}
.desktop :deep(.win-cat) {
  top: 452px;
  left: 42%;
  width: clamp(240px, 19vw, 268px);
}
.desktop :deep(.win-music) {
  top: 20px;
  right: clamp(16px, 3vw, 44px);
  width: clamp(330px, 26vw, 372px);
}
/* 文件窗口：桌面正中的大弹窗，默认收起，点 oodle 图标才展开 */
.desktop :deep(.win-yaps) {
  top: 36px;
  left: 17%;
  width: clamp(680px, 64vw, 1080px);
}

/* ---------- 更新胶囊 ---------- */
.update-box {
  position: absolute;
  right: 18px;
  bottom: 16px;
  z-index: 45;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 9px 16px 7px;
  background: var(--acct-dark);
  border: 3px solid var(--acct);
  color: var(--main-light);
  font-family: var(--fh);
  font-size: 11px;
  letter-spacing: 0.4px;
}
.update-box b {
  color: var(--acct-light);
  font-weight: 400;
}

/* ---------- 右键菜单 ---------- */
.ctx {
  position: absolute;
  z-index: 300;
  display: none;
  flex-direction: column;
  min-width: 182px;
  padding: 4px;
  background: var(--main);
  border: 3px solid #fff;
  border-bottom-color: var(--acct-dark);
  border-right-color: var(--acct-dark);
  box-shadow: 6px 6px 0 rgba(6, 2, 14, 0.5);
}
.ctx.open {
  display: flex;
}
.ctx button {
  padding: 6px 10px 4px;
  text-align: left;
  color: var(--ink);
  font-family: var(--fh);
  font-size: 11px;
}
.ctx button:hover {
  background: var(--acct);
  color: var(--cream);
}
.ctx hr {
  width: 100%;
  margin: 4px 0;
  border: 0;
  border-top: 3px solid var(--main-light);
  border-bottom: 3px solid var(--main-dark);
}

/* ---------- 矮屏：整体上提、内容压缩 ---------- */
@media (min-width: 1101px) and (max-height: 860px) {
  .desktop :deep(.win-error) {
    top: 32px;
    left: 9%;
    width: clamp(270px, 23vw, 300px);
  }
  .desktop :deep(.win-universe) {
    top: 44px;
    left: 36%;
  }
  .desktop :deep(.win-loading) {
    top: 286px;
    left: 11%;
  }
  .desktop :deep(.win-cat) {
    top: 330px;
    left: 42%;
  }
  .desktop :deep(.win-music) {
    top: 10px;
  }
  .desktop :deep(.win-yaps) {
    top: 16px;
    left: 15%;
  }
  .desktop :deep(.canvas) {
    height: 128px;
  }
  .desktop :deep(.big-cat) {
    width: 100px;
    height: 100px;
  }
  .update-box {
    bottom: 12px;
    right: 14px;
  }
}

/* ---------- 窄屏：改为纵向排布 ---------- */
@media (max-width: 1100px) {
  .desktop {
    display: flex;
    flex-direction: column;
    gap: 14px;
    height: auto;
    min-height: calc(100vh - 58px);
    padding: 14px 14px 96px;
    overflow: visible;
  }
  .desktop :deep(.window) {
    position: relative !important;
    left: auto !important;
    right: auto !important;
    top: auto !important;
    width: auto !important;
    max-width: 100%;
  }
  .icon-box {
    position: static;
    flex-direction: row;
    flex-wrap: wrap;
    width: auto;
  }
  .bubble {
    display: none;
  }
  .update-box {
    position: static;
    align-self: flex-start;
    margin-top: 4px;
    font-size: 10px;
  }
}
</style>

<style>
/* 窄屏下桌面需要能滚动，取消 base.css 的全局锁滚动 */
@media (max-width: 1100px) {
  body.is-desktop {
    overflow: auto;
  }
}
</style>
