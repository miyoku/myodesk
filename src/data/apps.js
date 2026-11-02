import ErrorApp from '@/apps/ErrorApp.vue'
import UniverseApp from '@/apps/UniverseApp.vue'
import LoadingApp from '@/apps/LoadingApp.vue'
import CatCamApp from '@/apps/CatCamApp.vue'
import MusicApp from '@/apps/MusicApp.vue'
import YapsApp from '@/apps/YapsApp.vue'

/**
 * 桌面上可打开的窗口清单。
 * 顺序即默认叠放顺序；位置由 DesktopView 的 .win-<id> 样式决定。
 * name 是英文原名，nameKey 指向 i18n 文案（窗口标题 / 任务栏共用）。
 */
export const appDefs = [
  {
    id: 'error',
    name: 'error.exe',
    nameKey: 'app.error',
    url: 'https://desk.local/system/error.exe',
    component: ErrorApp,
  },
  {
    id: 'universe',
    name: 'universe.exe',
    nameKey: 'app.universe',
    url: 'https://desk.local/wallpaper/nebula.exe',
    component: UniverseApp,
  },
  {
    id: 'loading',
    name: 'loading.exe',
    nameKey: 'app.loading',
    url: 'https://desk.local/boot/loading.exe',
    component: LoadingApp,
  },
  {
    id: 'cat',
    name: 'oodlecam.exe',
    nameKey: 'app.cat',
    url: 'https://desk.local/petz/oodlecam.exe',
    component: CatCamApp,
    /* 任务栏常驻：窗口关掉也保留标签 */
    pin: true,
  },
  {
    id: 'music',
    name: 'media-player.exe',
    nameKey: 'app.music',
    url: 'https://desk.local/media/now-playing.exe',
    component: MusicApp,
  },
  {
    id: 'yaps',
    name: 'yaps.exe',
    nameKey: 'app.yaps',
    url: 'https://desk.local/sites/yaps.html',
    component: YapsApp,
    /* 初始收起：点桌面上的 oodle 图标才弹出来；打开时桌宠会跑来抗议（greet） */
    open: false,
    greet: true,
  },
]
