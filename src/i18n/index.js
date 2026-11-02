import { ref } from 'vue'

/**
 * 极简 i18n：一个响应式 locale + 一份平面文案表。
 * 默认中文，用户切换后写进 localStorage，下次进来保持选择。
 */
const STORAGE_KEY = 'myodesk-lang'

const LOCALES = ['zh', 'en']

function readSaved() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return LOCALES.includes(saved) ? saved : null
  } catch {
    return null
  }
}

export const locale = ref(readSaved() ?? 'zh')

function syncDocumentLang() {
  if (typeof document !== 'undefined') {
    document.documentElement.lang = locale.value === 'zh' ? 'zh-CN' : 'en'
  }
}
syncDocumentLang()

export function setLocale(next) {
  if (!LOCALES.includes(next) || next === locale.value) return
  locale.value = next
  try {
    localStorage.setItem(STORAGE_KEY, next)
  } catch {
    /* 隐私模式下写不进去，忽略 */
  }
  syncDocumentLang()
}

export function toggleLocale() {
  setLocale(locale.value === 'zh' ? 'en' : 'zh')
}

const messages = {
  zh: {
    /* 窗口名 */
    'app.error': '报错.exe',
    'app.universe': '宇宙.exe',
    'app.loading': '加载.exe',
    'app.cat': '猫猫摄像.exe',
    'app.music': '播放器.exe',
    'app.yaps': 'yaps.exe',
    'win.close': '关闭',

    /* 任务栏 */
    'task.start': '开始',
    'task.minimize': '最小化 {name}',
    'task.restore': '恢复 {name}',
    'task.lang': '切换语言',

    /* 桌面图标 */
    'icon.myPc': '我的电脑',
    'icon.files': '文件',
    'icon.stash': '收藏夹',
    'icon.cam': '相机',
    'icon.oodle': 'oodle',
    'icon.home': '回到宠物页',
    'icon.open': '打开 {label}',

    /* 桌面气泡 / 胶囊 */
    'bubble.pre': 'mrrp。这张桌子属于 ',
    'bubble.post': '。喂喂图标吧，人类。',
    'update.label': '最后更新：',

    /* 右键菜单 */
    'ctx.arrange': '排列图标',
    'ctx.lineup': '对齐图标',
    'ctx.paste': '粘贴',
    'ctx.pasteShortcut': '粘贴快捷方式',
    'ctx.new': '新建',
    'ctx.properties': '属性',

    /* 开始菜单 */
    'menu.main': '主页',
    'menu.files': '文件',
    'menu.petz': '宠物',
    'menu.arcade': '游戏',
    'menu.camera': '相机',
    'menu.settings': '设置',

    /* 报错窗口 */
    'error.pre': '点一下 ',
    'error.post': '，这个错误就修好了。',
    'error.meta': '未处理的异常 @ 0x0oodle',
    'error.fix': '修复',
    'error.ignore': '忽略',

    /* 加载窗口 */
    'loading.meta': '正在解压回忆…… 62%',
    'loading.done': '完成',
    'loading.cancel': '取消',

    /* 猫猫摄像 */
    'cat.live': '直播 · ',
    'cat.out': 'oodle 在桌面上溜达',
    'cat.watch': 'oodle 正盯着你',
    'cat.feed': '喂小鱼干',
    'cat.call': '叫 oodle',
    'cat.noteOut': 'oodle 在桌面巡逻 · 可以拖着她走',
    'cat.noteWait': '喂她一次，她就赖在桌面上不走了',

    /* 星空壁纸 */
    'universe.text': '你不干有的是ai干',
    'universe.meta': '1024 色 · 抖动渐变 · 别点',

    /* 播放器 */
    'music.track': '01 · 没那么简单 — Claude Code',
    'music.prev': '上一首',
    'music.play': '播放',
    'music.pause': '暂停',
    'music.next': '下一首',

    /* 桌宠 */
    'pet.label': 'oodle 猫，按住可以拖走',

    /* 首页 */
    'home.footPre': '© 2026 oodle · 地下室手写 · ',
    'home.skip': '直接进桌面',
    'home.eyebrow': '宠物救助 · 站点 01 · 始于 2026',
    'home.line1': '一只疲惫的玳瑁猫守着这台显示器。',
    'home.line2': '她睡在发烫的玻璃上，顺便审判你的代码。',
    'home.mood': '心情',
    'home.moodVal': '困困的',
    'home.snacks': '小鱼干',
    'home.snacksVal': '还剩 3 条',
    'home.nap': '午睡',
    'home.napVal': '11 小时',
    'home.hint': '没有密码 · 按回车',
    'home.alt': '一只玳瑁猫睡在青色 CRT 显示器顶上',

    /* YAPS 小站窗口 */
    'site.foot': 'oodle.cat · 2026',
    'site.nav.home': '主页',
    'site.nav.about': '关于',
    'site.nav.petz': '宠物',
    'site.nav.downloads': '下载',
    'site.nav.links': '链接',
    'site.nav.guestbook': '留言板',

    'site.title.home': '欢迎',
    'site.title.about': '关于',
    'site.title.petz': '宠物',
    'site.title.downloads': '下载',
    'site.title.links': '链接',
    'site.title.guestbook': '留言板',

    'site.home.lead': '欢迎来到 Yet Another Petz Site，简称 YAPS。',
    'site.home.p1': '这里收集 oodle 的日常：她睡过的显示器、踩过的键盘，还有偷吃的小鱼干。',
    'site.home.p2': '慢慢逛，别把猫吵醒。',
    'site.home.updates': '更新',
    'site.home.date1': '2026 年 10 月 30 日',
    'site.home.update1': '桌上多了一个文件窗口，图标也开始能喂了。',
    'site.home.date2': '2026 年 9 月 23 日',
    'site.home.update2': '换了几张新照片，顺手修好三个像素错位。',
    'site.home.stat': '站点状态',
    'site.home.uptime': '运行时长',
    'site.home.uptimeVal': '11 小时',

    'site.about.p1': '这台桌面是手写的：没有现成模板，也没有 AI 画的大图，只有一堆 16×16 的方块和一只不肯睡觉的猫。',
    'site.about.p2': 'oodle 是站长。她负责睡觉、踩键盘，以及用眼神否掉每一条 commit。',
    'site.about.l1': '字体：Silkscreen / Pixelify Sans',
    'site.about.l2': '配色：霓虹青、品红，再加一点奶油白',
    'site.about.l3': '技术：Vue 3 + Vite，零 UI 库',
    'site.about.sign': '— oodle（趴在显示器上签的）',

    'site.petz.p1': '目前登场的宠物。都是真猫，只是被压缩成了 16×16。',
    'site.petz.oodle': 'oodle',
    'site.petz.oodleDesc': '玳瑁猫 · 桌面管理员 · 会拖拽，也会拒食',
    'site.petz.friend': 'mrrp',
    'site.petz.friendDesc': '邻居家的橘猫 · 只出现在更新日志里',
    'site.petz.now': '在线',
    'site.petz.soon': '没来',
    'site.petz.note': '想见 oodle？去点桌面上的猫猫图标。',

    'site.dl.p1': '壁纸、字体和几个像素素材，随便拿。',
    'site.dl.btn': '下载',
    'site.dl.done': '已保存',
    'site.dl.note': '右键另存为会更有 90 年代的感觉。',

    'site.links.p1': '这些站点比我做得好看，真的。',
    'site.links.oodle': 'oodle 的旧站',
    'site.links.nekos': '参考的像素桌面',
    'site.links.neocities': '手写网页的老家',
    'site.links.petz': 'Petz 百科',
    'site.links.ring': 'oodle cat webring',
    'site.links.prev': '上一站',
    'site.links.random': '随机',
    'site.links.next': '下一站',

    'site.gb.p1': '留言板还活着。上一位客人在 2026 年留下了一句话。',
    'site.gb.msg1': 'mrrp.',
    'site.gb.msg2': '猫猫好可爱，已收藏。',
    'site.gb.msg3': '第一个 commit 是我写的，后来猫踩了一脚，代码反而能跑了。',
    'site.gb.note': '想留言？先喂一条小鱼干再说。',
    'site.gb.name': '你的名字',
    'site.gb.msg': '写点什么…',
    'site.gb.send': '投递',
  },
  en: {
    'app.error': 'error.exe',
    'app.universe': 'universe.exe',
    'app.loading': 'loading.exe',
    'app.cat': 'oodlecam.exe',
    'app.music': 'media-player.exe',
    'app.yaps': 'yaps.exe',
    'win.close': 'close',

    'task.start': 'start',
    'task.minimize': 'minimize {name}',
    'task.restore': 'restore {name}',
    'task.lang': 'switch language',

    'icon.myPc': 'my pc',
    'icon.files': 'files',
    'icon.stash': 'stash',
    'icon.cam': 'cam',
    'icon.oodle': 'oodle',
    'icon.home': 'back to the pet page',
    'icon.open': 'open {label}',

    'bubble.pre': 'mrrp. this desk belongs to ',
    'bubble.post': '. feed the icon, human.',
    'update.label': 'last updated:',

    'ctx.arrange': 'arrange icons',
    'ctx.lineup': 'line up icons',
    'ctx.paste': 'paste',
    'ctx.pasteShortcut': 'paste shortcut',
    'ctx.new': 'new',
    'ctx.properties': 'properties',

    'menu.main': 'main',
    'menu.files': 'files',
    'menu.petz': 'petz',
    'menu.arcade': 'arcade',
    'menu.camera': 'camera',
    'menu.settings': 'settings',

    'error.pre': 'click ',
    'error.post': ' to fix error.',
    'error.meta': 'unhandled exception at 0x0oodle',
    'error.fix': 'fix',
    'error.ignore': 'ignore',

    'loading.meta': 'unpacking memories... 62%',
    'loading.done': 'done',
    'loading.cancel': 'cancel',

    'cat.live': 'live · ',
    'cat.out': 'oodle is out on the desk',
    'cat.watch': 'oodle is watching',
    'cat.feed': 'feed',
    'cat.call': 'call oodle',
    'cat.noteOut': 'oodle roams the desk · drag her around',
    'cat.noteWait': 'feed her and she stays on the desk',

    'universe.text': 'you are the universe',
    'universe.meta': '1024 colors · dithered · click nothing',

    'music.track': '01 · chill it right — jay tholan',
    'music.prev': 'previous',
    'music.play': 'play',
    'music.pause': 'pause',
    'music.next': 'next',

    'pet.label': 'oodle the cat, drag to move',

    'home.footPre': '© 2026 oodle · hand-coded in a basement · ',
    'home.skip': 'skip to desktop',
    'home.eyebrow': 'pet rescue · site 01 · est. 2026',
    'home.line1': 'a tired tortoiseshell guards this monitor.',
    'home.line2': 'she sleeps on the warm glass and judges your code.',
    'home.mood': 'mood',
    'home.moodVal': 'sleepy',
    'home.snacks': 'snacks',
    'home.snacksVal': '3 left',
    'home.nap': 'nap',
    'home.napVal': '11 hrs',
    'home.hint': 'no password · press enter',
    'home.alt': 'oodle the tortoiseshell cat asleep on top of a turquoise CRT monitor',

    'site.foot': 'oodle.cat · 2026',
    'site.nav.home': 'home',
    'site.nav.about': 'about',
    'site.nav.petz': 'petz',
    'site.nav.downloads': 'downloads',
    'site.nav.links': 'links',
    'site.nav.guestbook': 'guestbook',

    'site.title.home': 'WELCOME',
    'site.title.about': 'ABOUT',
    'site.title.petz': 'PETZ',
    'site.title.downloads': 'DOWNLOADS',
    'site.title.links': 'LINKS',
    'site.title.guestbook': 'GUESTBOOK',

    'site.home.lead': 'Welcome to Yet Another Petz Site aka YAPS!',
    'site.home.p1': "A log of oodle's days: the monitors she sleeps on, the keyboards she walks across, and the snacks she steals.",
    'site.home.p2': 'Take your time. Try not to wake the cat.',
    'site.home.updates': 'updates',
    'site.home.date1': 'october 30, 2026',
    'site.home.update1': 'a file window landed on the desk, and the icons are feedable now.',
    'site.home.date2': 'september 23, 2026',
    'site.home.update2': 'new photos, plus three pixel misalignments fixed.',
    'site.home.stat': 'site status',
    'site.home.uptime': 'uptime',
    'site.home.uptimeVal': '11 hrs',

    'site.about.p1': 'This desk is hand-written: no template, no AI art, just a pile of 16x16 squares and a cat who refuses to sleep.',
    'site.about.p2': 'oodle runs the place. She naps, walks on the keyboard, and rejects every commit with a single look.',
    'site.about.l1': 'fonts: Silkscreen / Pixelify Sans',
    'site.about.l2': 'palette: neon cyan, magenta, a little cream',
    'site.about.l3': 'stack: Vue 3 + Vite, zero UI library',
    'site.about.sign': '- signed by oodle, from the top of the monitor',

    'site.petz.p1': 'The pets currently on stage. All real cats, just compressed to 16x16.',
    'site.petz.oodle': 'oodle',
    'site.petz.oodleDesc': 'tortoiseshell - desk admin - draggable, also refuses food',
    'site.petz.friend': 'mrrp',
    'site.petz.friendDesc': "the neighbor's orange cat - only appears in the changelog",
    'site.petz.now': 'online',
    'site.petz.soon': 'away',
    'site.petz.note': 'want to see oodle? click the cat icon on the desk.',

    'site.dl.p1': 'Wallpapers, fonts and a few pixel assets. Take whatever you want.',
    'site.dl.btn': 'get',
    'site.dl.done': 'saved',
    'site.dl.note': 'right click and save as for the full 90s experience.',

    'site.links.p1': 'Sites that look better than mine. Really.',
    'site.links.oodle': "oodle's old site",
    'site.links.nekos': 'the pixel desktop we copied',
    'site.links.neocities': 'home of hand-made pages',
    'site.links.petz': 'petz wiki',
    'site.links.ring': 'oodle cat webring',
    'site.links.prev': 'prev',
    'site.links.random': 'random',
    'site.links.next': 'next',

    'site.gb.p1': 'The guestbook is still alive. The last visitor said something in 2026.',
    'site.gb.msg1': 'mrrp.',
    'site.gb.msg2': 'cute cat, bookmarked.',
    'site.gb.msg3': 'i wrote the first commit, then the cat stepped on it and the code started working.',
    'site.gb.note': 'want to leave a note? feed her a snack first.',
    'site.gb.name': 'name',
    'site.gb.msg': 'say something...',
    'site.gb.send': 'post',
  },
}

/** 取文案；{name} 这类占位符用第二个参数替换，缺词条时回落中文 */
export function t(key, params) {
  const table = messages[locale.value] ?? messages.zh
  const text = table[key] ?? messages.zh[key] ?? key
  if (!params) return text
  return text.replace(/\{(\w+)\}/g, (all, name) => (name in params ? String(params[name]) : all))
}
