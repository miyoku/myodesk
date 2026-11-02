<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import PixelIcon from '@/components/PixelIcon.vue'
import { shareDoc } from '@/data/share'
import { framesDoc } from '@/data/frames'

/**
 * 通用像素文档页（分享会 / 收藏夹共用）：左侧目录 + 右侧长文档。
 * 内容按 docId 从 data/ 里取；新增一个页面 = 一份数据 + 一条路由。
 */
const props = defineProps({
  docId: { type: String, default: 'share' },
})

const docs = { share: shareDoc, frames: framesDoc }
const router = useRouter()

const palette = ['#ff5fa2', '#d99b00', '#0fb389', '#4a7dff', '#9c4dff', '#ff8a2b']
const toneColor = { pink: '#ff5fa2', lemon: '#d99b00', mint: '#0fb389', sky: '#4a7dff', violet: '#9c4dff', sunset: '#ff8a2b' }

const doc = computed(() => docs[props.docId] ?? shareDoc)
const talk = computed(() => doc.value.talk)
const sections = computed(() => doc.value.sections)

const letters = computed(() => [...talk.value.title])
const brandLetters = computed(() => [...doc.value.brand])
/** 地址栏拆成两行放在目录底部 */
const railHost = computed(() => doc.value.addr.split('/')[0])
const railPath = computed(() => `/${doc.value.addr.split('/')[1]}`)

const active = ref(sections.value[0].id)
const progress = ref(0)

const pageNo = computed(() => {
  const i = sections.value.findIndex((s) => s.id === active.value)
  return String((i < 0 ? 0 : i) + 1).padStart(2, '0')
})

const totalNo = computed(() => String(sections.value.length).padStart(2, '0'))

/** 两个文档页复用同一个组件实例，换文档时把目录与滚动位置归零 */
watch(
  () => props.docId,
  () => {
    active.value = sections.value[0].id
    progress.value = 0
    window.scrollTo({ top: 0 })
  },
)

/** 跟随系统的减少动效设置 */
function scrollBehavior() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
}

/** offsetTop 受定位祖先影响，统一用文档坐标换算 */
function docTop(el) {
  return el.getBoundingClientRect().top + window.scrollY
}

function goTo(id) {
  const el = document.getElementById(id)
  if (!el) return
  window.scrollTo({ top: docTop(el) - 68, behavior: scrollBehavior() })
  active.value = id
}

function goTop() {
  window.scrollTo({ top: 0, behavior: scrollBehavior() })
}

function backToDesk() {
  router.push('/desktop')
}

function onScroll() {
  const y = window.scrollY + 120
  let current = sections.value[0].id
  for (const s of sections.value) {
    const el = document.getElementById(s.id)
    if (el && docTop(el) <= y) current = s.id
  }
  active.value = current

  const max = document.documentElement.scrollHeight - window.innerHeight
  progress.value = max > 0 ? Math.min(100, (window.scrollY / max) * 100) : 0
}

/** Esc 回桌面，和其它页面的关窗习惯一致 */
function onKeydown(event) {
  if (event.key === 'Escape') backToDesk()
}

onMounted(() => {
  document.body.classList.add('is-doc')
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onScroll)
  window.addEventListener('keydown', onKeydown)
  onScroll()
})

onBeforeUnmount(() => {
  document.body.classList.remove('is-doc')
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('resize', onScroll)
  window.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <main class="share">
    <div class="sky" aria-hidden="true" />
    <div class="crt" aria-hidden="true" />

    <!-- 顶栏：假装这是一个占满屏幕的浏览器窗口 -->
    <header class="topbar">
      <span class="lights" aria-hidden="true"><i /><i /><i /></span>
      <span class="addr">{{ doc.addr }}</span>
      <span class="page-no">{{ pageNo }} / {{ totalNo }}</span>
      <button class="pxbtn alt back" type="button" @click="backToDesk">
        <PixelIcon name="monitor" />返回桌面
      </button>
      <span class="prog" aria-hidden="true"><i :style="{ width: `${progress}%` }" /></span>
    </header>

    <div class="sheet">
      <!-- 左侧目录 -->
      <aside class="rail">
        <p class="brand" :aria-label="doc.brand">
          <b
            v-for="(ch, i) in brandLetters"
            :key="i"
            :style="{ color: palette[i % palette.length] }"
          >{{ ch }}</b>
        </p>
        <p class="brand-sub">{{ doc.brandSub }}</p>

        <template v-for="(s, i) in sections" :key="s.id">
          <!-- 方向标题：章节按「方向一/二/三」分组 -->
          <p v-if="s.group && (i === 0 || sections[i - 1].group !== s.group)" class="rail-group">
            {{ s.group }}
          </p>
          <button
            class="railbtn"
            :class="[`tone-${s.tone}`, { on: active === s.id }]"
            type="button"
            :aria-current="active === s.id"
            @click="goTo(s.id)"
          >
            <b>{{ s.no }}</b>{{ s.nav }}
          </button>
        </template>

        <div class="rail-foot">
          <span>{{ railHost }}</span>
          <span>{{ railPath }}</span>
          <button class="rail-top" type="button" @click="goTop">▲ 回到顶部</button>
        </div>
      </aside>

      <!-- 右侧正文 -->
      <div class="doc">
        <header class="hero panel">
          <p class="eyebrow">{{ talk.eyebrow }}</p>
          <h1 class="hero-title">
            <span v-for="(ch, i) in letters" :key="i" :style="{ color: palette[i % palette.length] }">{{ ch }}</span>
          </h1>
          <p class="subtitle">{{ talk.subtitle }}</p>
          <p class="lead">{{ talk.lead }}</p>
          <ul class="meta">
            <li v-for="m in talk.meta" :key="m.k"><span>{{ m.k }}</span><b>{{ m.v }}</b></li>
          </ul>
        </header>

        <article
          v-for="s in sections"
          :id="s.id"
          :key="s.id"
          class="sec panel"
          :style="{ '--tone': toneColor[s.tone] }"
        >
          <header class="sec-head">
            <div class="sec-head-row">
              <span class="sec-no" :class="`tone-${s.tone}`">{{ s.no }}</span>
              <div>
                <h2 class="sec-title">{{ s.title }}</h2>
                <p class="sec-en">{{ s.en }}</p>
              </div>
            </div>
            <p class="sec-lede">{{ s.lede }}</p>
          </header>

          <template v-for="(b, bi) in s.blocks" :key="bi">
            <h3 v-if="b.title" class="blk-title">{{ b.title }}</h3>

            <!-- 时间线：前端工程一路怎么长出来的 -->
            <div v-if="b.type === 'timeline'" class="tl">
              <div v-for="item in b.items" :key="item.year" class="tl-item">
                <span class="tl-year">{{ item.year }}</span>
                <div class="tl-body">
                  <b>{{ item.name }}</b>
                  <p>{{ item.text }}</p>
                  <ul v-if="item.points" class="tl-points">
                    <li v-for="point in item.points" :key="point">{{ point }}</li>
                  </ul>
                  <ul class="tags">
                    <li v-for="tag in item.tags" :key="tag">{{ tag }}</li>
                  </ul>
                </div>
              </div>
            </div>

            <!-- 分组标签：框架谱系这种需要按类罗列的内容 -->
            <div v-else-if="b.type === 'groups'" class="blk">
              <div class="groups">
                <div v-for="group in b.items" :key="group.label" class="group-row">
                  <span class="group-label">{{ group.label }}</span>
                  <ul class="group-chips">
                    <li v-for="chip in group.chips" :key="chip.name" class="chip">
                      <span>{{ chip.name }}</span><b>{{ chip.year }}</b>
                    </li>
                  </ul>
                </div>
              </div>
              <p v-if="b.note" class="note">{{ b.note }}</p>
            </div>

            <div v-else-if="b.type === 'table'" class="blk">
              <p v-if="b.caption" class="cap">{{ b.caption }}</p>
              <div class="tbl-scroll">
                <div class="tbl">
                  <div class="tbl-row head">
                    <span v-for="h in b.head" :key="h">{{ h }}</span>
                  </div>
                  <div v-for="row in b.rows" :key="row[0]" class="tbl-row">
                    <span v-for="(cell, ci) in row" :key="ci" :class="{ yr: ci === 0 }">{{ cell }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- 代码对照：左旧右新 -->
            <div v-else-if="b.type === 'compare'" class="blk">
              <p v-if="b.caption" class="cap">{{ b.caption }}</p>
              <div class="cmp">
                <div class="codebox">
                  <p class="codebox-label">{{ b.left.label }}</p>
                  <pre class="code">{{ b.left.code }}</pre>
                </div>
                <div class="codebox">
                  <p class="codebox-label ok">{{ b.right.label }}</p>
                  <pre class="code">{{ b.right.code }}</pre>
                </div>
              </div>
            </div>

            <!-- 对话对比：同一份需求，两种问法 -->
            <div v-else-if="b.type === 'dialog'" class="blk">
              <p v-if="b.caption" class="cap">{{ b.caption }}</p>
              <div class="dialogs">
                <div v-for="pane in b.panes" :key="pane.label" class="chat" :class="pane.tone">
                  <p class="chat-head">{{ pane.label }}</p>
                  <ul class="chat-body">
                    <li v-for="(m, mi) in pane.messages" :key="mi" class="msg" :class="m.from">
                      <span class="msg-who">{{ m.from === 'me' ? '我' : 'AI' }}</span>
                      <p class="msg-text" :class="{ mono: m.mono }">{{ m.text }}</p>
                    </li>
                  </ul>
                  <p v-if="pane.note" class="chat-note">{{ pane.note }}</p>
                </div>
              </div>
            </div>

            <ul v-else-if="b.type === 'cards'" class="grid">
              <li v-for="it in b.items" :key="it.h">
                <b>{{ it.h }}</b>
                <p>{{ it.p }}</p>
              </li>
            </ul>

            <div v-else-if="b.type === 'list'" class="blk">
              <ul class="blist">
                <li v-for="it in b.items" :key="it">{{ it }}</li>
              </ul>
              <p v-if="b.note" class="note">{{ b.note }}</p>
            </div>

            <blockquote v-else-if="b.type === 'quote'" class="quote">
              <b>{{ b.label }}</b>
              <p>{{ b.text }}</p>
            </blockquote>
          </template>
        </article>

        <footer class="foot">
          <div class="stamp">
            <b>88×31</b>
            <span>{{ doc.stamp }}</span>
            <b>oodle.cat</b>
          </div>
          <button class="pxbtn" type="button" @click="backToDesk">回到桌面</button>
        </footer>
      </div>
    </div>
  </main>
</template>

<style scoped>
/* ---------- 背景：星空 + 扫描线 ---------- */
.share {
  position: relative;
  min-height: 100%;
  background: var(--wall-deep);
}

.sky {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  background-image:
    radial-gradient(1.5px 1.5px at 22px 34px, #fff 50%, transparent 51%),
    radial-gradient(1.5px 1.5px at 122px 78px, var(--main-light) 50%, transparent 51%),
    radial-gradient(2px 2px at 74px 148px, #fff 50%, transparent 51%),
    radial-gradient(1.5px 1.5px at 168px 44px, var(--acct-light) 50%, transparent 51%),
    radial-gradient(closest-side at 82% 12%, rgba(242, 53, 217, 0.22), transparent 100%),
    radial-gradient(closest-side at 8% 84%, rgba(0, 211, 255, 0.16), transparent 100%);
  background-size: 200px 200px, 200px 200px, 200px 200px, 200px 200px, 100% 100%, 100% 100%;
  opacity: 0.75;
}

.crt {
  position: fixed;
  inset: 0;
  z-index: 60;
  pointer-events: none;
  background: repeating-linear-gradient(to bottom, rgba(8, 4, 15, 0.28) 0 1px, transparent 1px 3px);
  opacity: 0.4;
}

/* ---------- 顶栏 ---------- */
.topbar {
  position: sticky;
  top: 0;
  z-index: 40;
  display: flex;
  align-items: center;
  gap: 10px;
  height: 56px;
  padding: 0 14px;
  background: #0d0618;
  border-bottom: 3px solid var(--main-dark);
  box-shadow: 0 3px 0 rgba(0, 0, 0, 0.45);
}
.lights {
  display: flex;
  flex: 0 0 auto;
  gap: 5px;
}
.lights i {
  width: 10px;
  height: 10px;
  background: var(--acct);
  box-shadow:
    inset 2px 2px 0 var(--acct-light),
    inset -2px -2px 0 var(--acct-dark);
}
.lights i:nth-child(2) {
  background: var(--gold);
  box-shadow:
    inset 2px 2px 0 #ffe08a,
    inset -2px -2px 0 #8a6410;
}
.lights i:nth-child(3) {
  background: var(--main);
  box-shadow:
    inset 2px 2px 0 var(--main-light),
    inset -2px -2px 0 var(--main-dark);
}
.addr {
  flex: 1 1 auto;
  min-width: 0;
  padding: 5px 8px 3px;
  background: #06283a;
  border: 3px solid;
  border-color: #021018 var(--main-light) var(--main-light) #021018;
  color: var(--main-light);
  font-family: var(--fh);
  font-size: 11px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.addr::before {
  content: '▸ ';
  color: var(--acct-light);
}
.page-no {
  flex: 0 0 auto;
  font-family: var(--fh);
  font-size: 11px;
  letter-spacing: 1px;
  color: var(--acct-light);
}
.back {
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px 4px;
}
.back .px {
  width: 16px;
  height: 16px;
}
.prog {
  position: absolute;
  left: 0;
  right: 0;
  bottom: -3px;
  height: 3px;
}
.prog i {
  display: block;
  height: 100%;
  background: var(--acct);
}

/* ---------- 版心 ---------- */
.sheet {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: 214px minmax(0, 1fr);
  gap: 24px;
  align-items: start;
  width: min(1200px, 100% - 40px);
  margin: 0 auto;
  padding: 24px 0 44px;
}

/* ---------- 左侧目录 ---------- */
.rail {
  position: sticky;
  top: 82px;
  display: flex;
  flex-direction: column;
  gap: 7px;
  max-height: calc(100vh - 104px);
  overflow-y: auto;
  scrollbar-width: none;
  padding: 10px 10px 8px;
  background-color: #1b0b46;
  background-image:
    radial-gradient(1.5px 1.5px at 14px 18px, rgba(143, 250, 255, 0.5) 50%, transparent 51%),
    radial-gradient(1.5px 1.5px at 54px 62px, rgba(255, 157, 243, 0.45) 50%, transparent 51%),
    radial-gradient(1px 1px at 92px 34px, rgba(255, 245, 230, 0.55) 50%, transparent 51%);
  background-size: 120px 90px;
  border: 3px solid;
  border-color: #12052c #4b1b8c #4b1b8c #12052c;
  box-shadow: 6px 6px 0 rgba(0, 0, 0, 0.4);
}
.rail::-webkit-scrollbar {
  display: none;
}
.brand {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1px;
  margin: 0;
  font-family: var(--fh);
  font-size: 20px;
  line-height: 1;
  letter-spacing: 2px;
  text-shadow: 2px 3px 0 #12052c;
}
.brand b {
  font-weight: 400;
}
.brand-sub {
  margin: 0 0 4px;
  font-family: var(--fh);
  font-size: 8px;
  letter-spacing: 1px;
  text-align: center;
  color: rgba(255, 245, 230, 0.5);
}

/* 目录里的方向标题：三个问句 */
.rail-group {
  margin: 7px 0 1px;
  padding: 0 2px;
  font-family: var(--fb);
  font-size: 11px;
  line-height: 1.5;
  letter-spacing: 0.2px;
  color: rgba(143, 250, 255, 0.75);
  white-space: nowrap;
}
.rail-group::before {
  content: '▸ ';
  opacity: 0.7;
}

.railbtn {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 8px 8px 6px;
  color: #2b0b56;
  font-family: var(--fh);
  font-size: 11.5px;
  letter-spacing: 0.3px;
  text-align: left;
  border: 2px solid #2a0b52;
  border-radius: 10px;
  box-shadow:
    inset 0 -4px 0 rgba(0, 0, 0, 0.16),
    0 3px 0 rgba(0, 0, 0, 0.4);
  transition:
    transform 0.08s steps(2),
    filter 0.08s steps(2);
}
.railbtn b {
  font-weight: 400;
  opacity: 0.6;
}
.railbtn:hover {
  filter: brightness(1.1) saturate(1.05);
  transform: translateY(-1px);
}
.railbtn.on,
.railbtn.on:hover {
  border-color: #fff5e6;
  box-shadow:
    inset 0 4px 0 rgba(0, 0, 0, 0.2),
    0 0 0 2px #2a0b52;
  transform: translateY(2px);
}

.tone-pink {
  background: #ff9ec7;
}
.tone-lemon {
  background: #ffe45e;
}
.tone-mint {
  background: #7fe8c8;
}
.tone-sky {
  background: #9dc3ff;
}
.tone-violet {
  background: #c9a0ff;
}
.tone-sunset {
  background: #ffb27a;
}

.rail-foot {
  display: flex;
  flex-direction: column;
  gap: 3px;
  margin-top: 6px;
  padding-top: 7px;
  border-top: 2px dashed rgba(143, 250, 255, 0.28);
  font-family: var(--fh);
  font-size: 8px;
  letter-spacing: 0.5px;
  color: rgba(255, 245, 230, 0.45);
}
.rail-top {
  margin-top: 3px;
  font-family: var(--fh);
  font-size: 8.5px;
  letter-spacing: 0.5px;
  color: var(--main-light);
  text-align: left;
}

/* ---------- 右侧文档 ---------- */
.doc {
  display: flex;
  flex-direction: column;
  gap: 20px;
  min-width: 0;
}

.panel {
  padding: 20px 22px 22px;
  background-color: #f7f2e7;
  background-image:
    radial-gradient(2px 2px at 26px 32px, rgba(58, 17, 136, 0.14) 50%, transparent 51%),
    radial-gradient(2px 2px at 98px 84px, rgba(242, 53, 217, 0.12) 50%, transparent 51%),
    radial-gradient(3px 3px at 152px 42px, rgba(0, 211, 255, 0.16) 50%, transparent 51%);
  background-size: 190px 160px;
  border: 3px solid var(--ink);
  box-shadow: 7px 7px 0 rgba(6, 2, 14, 0.5);
  color: #3f2b4c;
}

.hero {
  padding: 24px 26px 20px;
  background-color: var(--cream);
}
.eyebrow {
  margin: 0;
  font-family: var(--fh);
  font-size: 9.5px;
  letter-spacing: 1.2px;
  color: #8b5f7f;
}
.hero-title {
  margin: 8px 0 6px;
  font-family: var(--fh);
  font-size: clamp(32px, 5.2vw, 60px);
  line-height: 1.05;
  letter-spacing: 2px;
  text-shadow: 4px 5px 0 rgba(58, 17, 136, 0.16);
}
.subtitle {
  margin: 0 0 14px;
  font-family: var(--fh);
  font-size: clamp(11.5px, 1.3vw, 14px);
  line-height: 1.6;
  letter-spacing: 0.3px;
  color: #3a1188;
}
.lead {
  margin: 0;
  font-size: 14px;
  line-height: 1.85;
  color: #4a3557;
}
.meta {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  margin: 18px 0 0;
  padding: 0;
  list-style: none;
  background: #ffe9f2;
  border: 3px solid var(--ink);
}
.meta li {
  padding: 7px 8px 5px;
  text-align: center;
}
.meta li + li {
  border-left: 3px solid var(--ink);
}
.meta span {
  display: block;
  font-family: var(--fh);
  font-size: 9px;
  letter-spacing: 0.8px;
  color: #8b5f7f;
}
.meta b {
  display: block;
  margin-top: 5px;
  font-family: var(--fh);
  font-size: 13px;
  font-weight: 400;
  color: var(--ink);
}

/* ---------- 章节头 ---------- */
.sec-head {
  margin-bottom: 4px;
}
.sec-head-row {
  display: flex;
  align-items: center;
  gap: 12px;
}
.sec-no {
  flex: 0 0 auto;
  display: grid;
  place-items: center;
  width: 46px;
  height: 46px;
  border: 3px solid var(--ink);
  box-shadow: 4px 4px 0 rgba(58, 17, 136, 0.16);
  font-family: var(--fh);
  font-size: 16px;
  color: var(--ink);
}
.sec-title {
  margin: 0;
  font-family: var(--fh);
  font-size: clamp(17px, 2vw, 23px);
  font-weight: 400;
  line-height: 1.25;
  letter-spacing: 0.8px;
  color: #2b0b56;
}
.sec-en {
  margin: 3px 0 0;
  font-family: var(--fh);
  font-size: 8.5px;
  letter-spacing: 2px;
  color: #a294b0;
}
.sec-lede {
  margin: 14px 0 0;
  padding-left: 12px;
  border-left: 4px solid var(--tone);
  font-size: 13.5px;
  line-height: 1.75;
  color: #4a3557;
}

/* ---------- 通用块 ---------- */
.blk-title {
  margin: 20px 0 0;
  font-family: var(--fh);
  font-size: 12.5px;
  font-weight: 400;
  letter-spacing: 0.8px;
  color: #2b0b56;
}
.blk-title::before {
  content: '▸ ';
  color: var(--tone);
}
.cap {
  margin: 18px 0 8px;
  font-family: var(--fh);
  font-size: 9.5px;
  letter-spacing: 0.8px;
  color: #8b5f7f;
}
.cap::before {
  content: '◆ ';
  color: var(--tone);
}

/* 时间线 */
.tl {
  margin: 14px 0 0;
}
.tl-item {
  display: grid;
  grid-template-columns: 104px minmax(0, 1fr);
  gap: 12px;
  padding: 10px 0;
}
.tl-item + .tl-item {
  border-top: 2px dashed rgba(58, 17, 136, 0.22);
}
.tl-year {
  align-self: start;
  justify-self: start;
  padding: 4px 8px 2px;
  background: var(--tone);
  border: 2px solid var(--ink);
  font-family: var(--fh);
  font-size: 10px;
  letter-spacing: 0.4px;
  color: var(--ink);
}
.tl-body b {
  display: block;
  font-family: var(--fh);
  font-size: 12.5px;
  font-weight: 400;
  letter-spacing: 0.5px;
  color: #2b0b56;
}
.tl-body p {
  margin: 5px 0 0;
  font-size: 13px;
  line-height: 1.7;
  color: #4a3557;
}
.tl-points {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin: 8px 0 0;
  padding: 0;
  list-style: none;
}
.tl-points li {
  position: relative;
  padding-left: 16px;
  font-size: 12.5px;
  line-height: 1.65;
  color: #4a3557;
}
.tl-points li::before {
  content: '';
  position: absolute;
  left: 1px;
  top: 7px;
  width: 6px;
  height: 6px;
  background: var(--tone);
  border: 2px solid var(--ink);
}
.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin: 7px 0 0;
  padding: 0;
  list-style: none;
}
.tags li {
  padding: 2px 6px 1px;
  background: #fffdf6;
  border: 2px solid rgba(58, 17, 136, 0.32);
  font-family: var(--fh);
  font-size: 8.5px;
  letter-spacing: 0.3px;
  color: #4a3557;
}

/* 分组标签 */
.groups {
  margin: 12px 0 0;
}
.group-row {
  display: grid;
  grid-template-columns: 88px minmax(0, 1fr);
  gap: 10px;
  align-items: start;
  padding: 8px 0;
}
.group-row + .group-row {
  border-top: 2px dashed rgba(58, 17, 136, 0.18);
}
.group-label {
  padding-top: 4px;
  font-family: var(--fh);
  font-size: 10px;
  letter-spacing: 0.5px;
  color: #2b0b56;
}
.group-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin: 0;
  padding: 0;
  list-style: none;
}
.chip {
  display: inline-flex;
  align-items: baseline;
  gap: 5px;
  padding: 3px 7px 2px;
  background: #fffdf6;
  border: 2px solid var(--ink);
  box-shadow: 2px 2px 0 rgba(58, 17, 136, 0.14);
  font-size: 11.5px;
  color: #2b0b56;
}
.chip b {
  font-family: var(--fh);
  font-size: 8.5px;
  font-weight: 400;
  color: #a13b8c;
}

/* 表格 */
.tbl-scroll {
  overflow-x: auto;
  background: #fffdf6;
  border: 3px solid var(--ink);
  box-shadow: 4px 4px 0 rgba(58, 17, 136, 0.14);
}
.tbl {
  min-width: 540px;
}
.tbl-row {
  display: grid;
  grid-template-columns: 72px minmax(0, 1.15fr) minmax(0, 1fr);
}
.tbl-row + .tbl-row {
  border-top: 2px dashed rgba(58, 17, 136, 0.2);
}
.tbl-row > span {
  padding: 8px 10px;
  font-size: 12.5px;
  line-height: 1.5;
  color: #4a3557;
}
.tbl-row > span + span {
  border-left: 2px dashed rgba(58, 17, 136, 0.2);
}
.tbl-row.head {
  background: #2b0b56;
}
.tbl-row.head > span {
  font-family: var(--fh);
  font-size: 9.5px;
  letter-spacing: 0.8px;
  color: var(--main-light);
}
.tbl-row > span.yr {
  font-family: var(--fh);
  font-size: 11px;
  text-align: center;
  color: #a13b8c;
}

/* 代码对照 */
.cmp {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  align-items: stretch;
}
.codebox {
  display: flex;
  flex-direction: column;
  min-width: 0;
  background: #0f0a20;
  border: 3px solid var(--ink);
  box-shadow: 4px 4px 0 rgba(58, 17, 136, 0.18);
}
.codebox-label {
  margin: 0;
  padding: 5px 8px 3px;
  background: #1b0b46;
  border-bottom: 3px solid var(--ink);
  font-family: var(--fh);
  font-size: 9px;
  letter-spacing: 0.5px;
  color: var(--acct-light);
}
.codebox-label.ok {
  color: #7fe8c8;
}
.code {
  flex: 1 1 auto;
  margin: 0;
  padding: 10px 10px 12px;
  overflow-x: auto;
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 11.5px;
  line-height: 1.7;
  color: var(--main-light);
  white-space: pre;
  -webkit-user-select: text;
  user-select: text;
}

/* 对话对比 */
.dialogs {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}
.chat {
  display: flex;
  min-width: 0;
  flex-direction: column;
  background: #1b0b46;
  border: 3px solid var(--ink);
  box-shadow: 4px 4px 0 rgba(58, 17, 136, 0.18);
}
.chat-head {
  margin: 0;
  padding: 6px 9px 4px;
  background: #0d0618;
  border-bottom: 3px solid var(--ink);
  font-family: var(--fh);
  font-size: 9.5px;
  letter-spacing: 0.6px;
  color: var(--acct-light);
}
.chat.good .chat-head {
  color: #7fe8c8;
}
.chat-body {
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  gap: 9px;
  margin: 0;
  padding: 11px 10px 12px;
  list-style: none;
  background-image:
    radial-gradient(1.5px 1.5px at 16px 20px, rgba(143, 250, 255, 0.28) 50%, transparent 51%),
    radial-gradient(1.5px 1.5px at 66px 68px, rgba(255, 157, 243, 0.24) 50%, transparent 51%);
  background-size: 120px 90px;
}
.msg {
  display: flex;
  flex-direction: column;
  gap: 3px;
  max-width: 94%;
}
.msg.me {
  align-self: flex-end;
  align-items: flex-end;
}
.msg.ai {
  align-self: flex-start;
  align-items: flex-start;
}
.msg-who {
  font-family: var(--fh);
  font-size: 8px;
  letter-spacing: 0.6px;
  color: rgba(255, 245, 230, 0.5);
}
.msg-text {
  margin: 0;
  padding: 7px 9px 6px;
  border: 2px solid var(--ink);
  box-shadow: 3px 3px 0 rgba(0, 0, 0, 0.35);
  font-size: 12px;
  line-height: 1.65;
  white-space: pre-wrap;
}
.msg.me .msg-text {
  background: #7fe8c8;
  color: #14301f;
}
.msg.ai .msg-text {
  background: var(--cream);
  color: #3f2b4c;
}
.msg-text.mono {
  background: #0f0a20;
  color: var(--main-light);
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 11px;
  line-height: 1.7;
  -webkit-user-select: text;
  user-select: text;
}
.chat-note {
  margin: 0;
  padding: 8px 10px 9px;
  border-top: 2px dashed rgba(143, 250, 255, 0.26);
  font-family: var(--fh);
  font-size: 9px;
  line-height: 1.7;
  letter-spacing: 0.2px;
  color: rgba(255, 245, 230, 0.6);
}

/* 卡片格 */
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
  gap: 10px;
  margin: 16px 0 0;
  padding: 0;
  list-style: none;
}
.grid li {
  padding: 10px 12px 11px;
  background: #fffdf6;
  border: 3px solid var(--ink);
  border-left-width: 7px;
  border-left-color: var(--tone);
  box-shadow: 3px 3px 0 rgba(58, 17, 136, 0.12);
}
.grid b {
  display: block;
  font-family: var(--fh);
  font-size: 11.5px;
  font-weight: 400;
  letter-spacing: 0.4px;
  color: #2b0b56;
}
.grid p {
  margin: 6px 0 0;
  font-size: 12.5px;
  line-height: 1.6;
  color: #4a3557;
}

/* 要点列表 */
.blist {
  display: flex;
  flex-direction: column;
  gap: 7px;
  margin: 14px 0 0;
  padding: 0;
  list-style: none;
}
.blist li {
  position: relative;
  padding-left: 18px;
  font-size: 13px;
  line-height: 1.7;
  color: #4a3557;
}
.blist li::before {
  content: '';
  position: absolute;
  left: 1px;
  top: 7px;
  width: 7px;
  height: 7px;
  background: var(--tone);
  border: 2px solid var(--ink);
}
.note {
  margin: 12px 0 0;
  font-family: var(--fh);
  font-size: 9.5px;
  line-height: 1.7;
  letter-spacing: 0.3px;
  color: #8b5f7f;
}
.note::before {
  content: '// ';
}

/* 金句 */
.quote {
  margin: 20px 0 0;
  padding: 12px 14px 13px;
  background: #ffe9f2;
  border: 3px solid var(--ink);
  border-left-width: 8px;
  border-left-color: var(--tone);
  box-shadow: 4px 4px 0 rgba(58, 17, 136, 0.14);
}
.quote b {
  display: block;
  font-family: var(--fh);
  font-size: 8.5px;
  font-weight: 400;
  letter-spacing: 1.6px;
  color: var(--tone);
}
.quote p {
  margin: 6px 0 0;
  font-size: 14px;
  line-height: 1.75;
  color: #2b0b56;
}

/* ---------- 页脚 ---------- */
.foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
  padding: 2px 0 0;
}
.stamp {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 7px 12px 4px;
  background: #2b0b56;
  border: 3px dashed rgba(143, 250, 255, 0.35);
  font-family: var(--fh);
  font-size: 9px;
  letter-spacing: 0.5px;
  color: rgba(255, 245, 230, 0.6);
}
.stamp b {
  font-weight: 400;
  color: var(--main-light);
}
.stamp b:last-child {
  color: var(--acct-light);
}

/* ---------- 窄屏：目录变顶部横条 ---------- */
@media (max-width: 1000px) {
  .sheet {
    grid-template-columns: 1fr;
    gap: 16px;
    width: min(760px, 100% - 24px);
    padding-top: 16px;
  }
  .rail {
    top: 59px;
    z-index: 20;
    flex-flow: row nowrap;
    align-items: center;
    gap: 6px;
    max-height: none;
    overflow-x: auto;
    overflow-y: hidden;
  }
  .brand {
    flex: 0 0 auto;
    justify-content: flex-start;
    font-size: 16px;
    letter-spacing: 1px;
  }
  .brand-sub {
    flex: 0 0 auto;
    margin: 0;
    text-align: left;
    white-space: nowrap;
  }
  .railbtn {
    flex: 0 0 auto;
    padding: 6px 9px 4px;
    font-size: 11px;
  }
  .rail-group {
    display: none;
  }
  .rail-foot {
    display: none;
  }
}

@media (max-width: 680px) {
  .topbar {
    height: 50px;
    gap: 8px;
    padding: 0 10px;
  }
  .lights,
  .page-no {
    display: none;
  }
  .addr {
    font-size: 9.5px;
  }
  .back {
    padding: 5px 8px 3px;
    font-size: 9.5px;
  }
  .rail {
    top: 53px;
  }
  .panel {
    padding: 16px 14px 18px;
  }
  .hero {
    padding: 18px 15px 16px;
  }
  .hero-title {
    font-size: 30px;
    letter-spacing: 1px;
  }
  .meta {
    grid-template-columns: 1fr 1fr;
  }
  .meta li:nth-child(3) {
    border-left: 0;
  }
  .meta li:nth-child(n + 3) {
    border-top: 3px solid var(--ink);
  }
  .tl-item {
    grid-template-columns: 1fr;
    gap: 6px;
  }
  .cmp {
    grid-template-columns: 1fr;
  }
  .dialogs {
    grid-template-columns: 1fr;
  }
}
</style>

<style>
/* 文档页是长页面，需要放开 base.css 的全局锁滚动 */
body.is-doc {
  overflow: auto;
}
</style>
