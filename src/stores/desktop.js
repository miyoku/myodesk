import { markRaw, reactive, ref } from 'vue'
import { appDefs } from '@/data/apps'
import { yapPet } from '@/stores/pet'

/**
 * 桌面窗口状态（模块级单例）：
 * - open  窗口是否显示
 * - z     层级
 * - x / y 拖拽后的坐标；为 null 时交给 CSS 定位
 */
export const apps = reactive(
  /* 默认打开；单个应用可在 apps.js 里用 open: false 声明初始收起 */
  appDefs.map((def) => ({
    open: true,
    ...def,
    /* 组件本身不需要响应式，包进去会触发 Vue 的「reactive component」警告 */
    component: markRaw(def.component),
    z: 0,
    x: null,
    y: null,
  })),
)

const topZ = ref(40)
apps.forEach((app) => {
  app.z = ++topZ.value
})

export function focusApp(app) {
  app.z = ++topZ.value
}

export function openApp(app) {
  app.open = true
  focusApp(app)
  /* 打开标记了 greet 的窗口（yaps）时，桌宠会跑过去抗议 */
  if (app.greet) yapPet()
}

export function closeApp(app) {
  app.open = false
}

/** 任务栏按钮：未打开则打开，已置顶则最小化，否则置顶 */
export function toggleApp(app) {
  if (!app.open) {
    openApp(app)
    return
  }
  if (app.z === topZ.value) {
    app.open = false
    return
  }
  focusApp(app)
}

export function moveApp(app, x, y) {
  app.x = x
  app.y = y
}

export function findApp(id) {
  return apps.find((app) => app.id === id)
}
