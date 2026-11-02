import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import DesktopView from '@/views/DesktopView.vue'
import DocView from '@/views/DocView.vue'

const router = createRouter({
  // hash 模式：静态托管 / 直接打开构建产物都不会 404
  history: createWebHashHistory(),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/desktop', name: 'desktop', component: DesktopView },
    /* 分享会：桌面上的「文件」点开后整页打开，不再是桌面里的弹窗 */
    { path: '/share', name: 'share', component: DocView, props: { docId: 'share' } },
    /* 框架笔记：桌面上的「收藏夹」跳过来，和分享页共用同一套版式 */
    { path: '/frames', name: 'frames', component: DocView, props: { docId: 'frames' } },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
})

export default router
