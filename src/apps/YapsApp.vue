<script setup>
import { computed, ref } from 'vue'
import PixelIcon from '@/components/PixelIcon.vue'
import { cuePet, fed, feedPet } from '@/stores/pet'
import { t } from '@/i18n'

/**
 * 站点导航：id 同时拼出两个文案 key（site.nav.<id> / site.title.<id>），
 * tone 决定按钮配色，与页面标题的彩色字母同色系。
 */
const pages = [
  { id: 'home', tone: 'pink' },
  { id: 'about', tone: 'lemon' },
  { id: 'petz', tone: 'mint' },
  { id: 'downloads', tone: 'sky' },
  { id: 'links', tone: 'violet' },
  { id: 'guestbook', tone: 'sunset' },
]

const active = ref('home')
const title = computed(() => t(`site.title.${active.value}`))
/** 标题逐字上色，像贴纸一样错开 */
const letters = computed(() => [...title.value])
const palette = ['#ff5fa2', '#d99b00', '#0fb389', '#4a7dff', '#9c4dff', '#ff8a2b']

/** 下载列表：文件名保持英文，跟真文件名一致 */
const files = [
  { name: 'oodle-wallpaper.png', size: '1.2 MB' },
  { name: 'yaps-cursor.cur', size: '4 KB' },
  { name: 'pixel-icons.zip', size: '88 KB' },
  { name: 'silkscreen.ttf', size: '96 KB' },
]
const saved = ref('')

const links = [
  { name: 'oodle.cat', note: 'site.links.oodle', url: 'https://xuan.nekoweb.org/', tone: 'pink' },
  { name: 'nekOS', note: 'site.links.nekos', url: 'https://neocities.org/browse', tone: 'lemon' },
  { name: 'neocities', note: 'site.links.neocities', url: 'https://neocities.org', tone: 'mint' },
  { name: 'petz wiki', note: 'site.links.petz', url: 'https://en.wikipedia.org/wiki/Petz', tone: 'sky' },
]

const guestbook = ref([
  { from: 'oodle', key: 'site.gb.msg1' },
  { from: 'anon', key: 'site.gb.msg2' },
  { from: 'dev', key: 'site.gb.msg3' },
])
const draftName = ref('')
const draftText = ref('')

/** 留言只活在这次会话里，刷新就没了 —— 和 90 年代的留言板一样 */
function postMessage() {
  const text = draftText.value.trim()
  if (!text) return
  guestbook.value.push({ from: draftName.value.trim() || 'anon', text })
  draftText.value = ''
}

/** 宠物页的喂食按钮：和猫猫摄像窗口共用同一份状态 */
function onFeed() {
  if (fed.value) {
    cuePet()
    return
  }
  feedPet()
}
</script>

<template>
  <div class="site">
    <!-- 左侧：站点导航 -->
    <aside class="nav">
      <p class="brand" aria-label="YAPS">
        <b class="b1">Y</b><b class="b2">A</b><b class="b3">P</b><b class="b4">S</b>
        <PixelIcon name="paw" />
      </p>

      <button
        v-for="page in pages"
        :key="page.id"
        class="navbtn"
        :class="[`tone-${page.tone}`, { on: active === page.id }]"
        type="button"
        :aria-pressed="active === page.id"
        @click="active = page.id"
      >
        {{ t(`site.nav.${page.id}`) }}
      </button>

      <p class="nav-foot">{{ t('site.foot') }}</p>
    </aside>

    <!-- 右侧：当前页内容 -->
    <section class="content">
      <div :key="active" class="page">
        <h2 class="page-title">
          <span v-for="(ch, i) in letters" :key="i" :style="{ color: palette[i % palette.length] }">{{ ch }}</span>
        </h2>

        <template v-if="active === 'home'">
          <p class="lead">{{ t('site.home.lead') }}</p>
          <div class="hero"><PixelIcon name="cat" class="hero-cat" /></div>
          <p class="line">{{ t('site.home.p1') }}</p>
          <p class="line dim">{{ t('site.home.p2') }}</p>

          <div class="cards">
            <div class="card">
              <h3>{{ t('site.home.updates') }}</h3>
              <ul class="log">
                <li><b>{{ t('site.home.date1') }}</b>{{ t('site.home.update1') }}</li>
                <li><b>{{ t('site.home.date2') }}</b>{{ t('site.home.update2') }}</li>
              </ul>
            </div>
            <div class="card">
              <h3>{{ t('site.home.stat') }}</h3>
              <ul class="stat">
                <li><span>{{ t('home.mood') }}</span><b>{{ t('home.moodVal') }}</b></li>
                <li><span>{{ t('home.snacks') }}</span><b>{{ t('home.snacksVal') }}</b></li>
                <li><span>{{ t('site.home.uptime') }}</span><b>{{ t('site.home.uptimeVal') }}</b></li>
              </ul>
            </div>
          </div>
        </template>

        <template v-else-if="active === 'about'">
          <p class="line">{{ t('site.about.p1') }}</p>
          <p class="line">{{ t('site.about.p2') }}</p>
          <ul class="bullets">
            <li>{{ t('site.about.l1') }}</li>
            <li>{{ t('site.about.l2') }}</li>
            <li>{{ t('site.about.l3') }}</li>
          </ul>
          <p class="sign">{{ t('site.about.sign') }}</p>
        </template>

        <template v-else-if="active === 'petz'">
          <p class="line">{{ t('site.petz.p1') }}</p>
          <div class="petcards">
            <div class="petcard">
              <PixelIcon name="cat" class="pet-ico" />
              <div>
                <h3>{{ t('site.petz.oodle') }}</h3>
                <p>{{ t('site.petz.oodleDesc') }}</p>
              </div>
              <span class="badge">{{ t('site.petz.now') }}</span>
            </div>
            <div class="petcard muted">
              <PixelIcon name="paw" class="pet-ico" />
              <div>
                <h3>{{ t('site.petz.friend') }}</h3>
                <p>{{ t('site.petz.friendDesc') }}</p>
              </div>
              <span class="badge off">{{ t('site.petz.soon') }}</span>
            </div>
          </div>
          <p class="note">{{ t('site.petz.note') }}</p>
          <div class="feed-row">
            <button class="pxbtn small" type="button" @click="onFeed">
              {{ fed ? t('cat.call') : t('cat.feed') }}
            </button>
            <span>{{ fed ? t('cat.noteOut') : t('cat.noteWait') }}</span>
          </div>
        </template>

        <template v-else-if="active === 'downloads'">
          <p class="line">{{ t('site.dl.p1') }}</p>
          <ul class="dlist">
            <li v-for="file in files" :key="file.name">
              <span class="dl-name">{{ file.name }}</span>
              <span class="dl-size">{{ file.size }}</span>
              <button class="pxbtn small" type="button" @click="saved = file.name">
                {{ saved === file.name ? t('site.dl.done') : t('site.dl.btn') }}
              </button>
            </li>
          </ul>
          <p class="note">{{ t('site.dl.note') }}</p>
        </template>

        <template v-else-if="active === 'links'">
          <p class="line">{{ t('site.links.p1') }}</p>
          <div class="linkgrid">
            <a
              v-for="link in links"
              :key="link.name"
              class="linkcard"
              :class="`tone-${link.tone}`"
              :href="link.url"
              target="_blank"
              rel="noreferrer noopener"
            >
              <b>{{ link.name }}</b>
              <span>{{ t(link.note) }}</span>
            </a>
          </div>

          <div class="ring">
            <b>{{ t('site.links.ring') }}</b>
            <div class="row ring-nav">
              <a class="pxbtn small alt" :href="links[0].url" target="_blank" rel="noreferrer noopener">
                &#9664; {{ t('site.links.prev') }}
              </a>
              <a class="pxbtn small" :href="links[1].url" target="_blank" rel="noreferrer noopener">
                ? {{ t('site.links.random') }}
              </a>
              <a class="pxbtn small alt" :href="links[2].url" target="_blank" rel="noreferrer noopener">
                {{ t('site.links.next') }} &#9654;
              </a>
            </div>
          </div>
        </template>

        <template v-else>
          <p class="line">{{ t('site.gb.p1') }}</p>
          <ul class="msgs">
            <li v-for="(msg, i) in guestbook" :key="i" :class="{ alt: i % 2 === 1 }">
              <b>{{ msg.from }}</b>
              <span>{{ msg.key ? t(msg.key) : msg.text }}</span>
            </li>
          </ul>

          <form class="gb-form" @submit.prevent="postMessage">
            <input v-model="draftName" type="text" maxlength="16" :placeholder="t('site.gb.name')" />
            <input v-model="draftText" type="text" maxlength="60" :placeholder="t('site.gb.msg')" />
            <button class="pxbtn small" type="submit">{{ t('site.gb.send') }}</button>
          </form>
          <p class="note">{{ t('site.gb.note') }}</p>
        </template>
      </div>

      <!-- 内容区底部：像素小徽章条，顺便压住底边 -->
      <footer class="stamp">
        <b>88×31</b>
        <span>{{ t('site.foot') }}</span>
        <b>oodle</b>
      </footer>
    </section>
  </div>
</template>

<style scoped>
.site {
  display: grid;
  grid-template-columns: 188px minmax(0, 1fr);
  gap: 8px;
  height: clamp(360px, 62vh, 560px);
  padding: 8px;
  background: linear-gradient(#2b0b56, #1e0640);
  border: 4px solid;
  border-color: #6a1fb8 #150330 #150330 #6a1fb8;
}

/* ---------- 左侧导航 ---------- */
.nav {
  display: flex;
  flex-direction: column;
  gap: 7px;
  min-height: 0;
  padding: 9px 9px 7px;
  overflow-y: auto;
  background-color: #1b0b46;
  background-image:
    radial-gradient(1.5px 1.5px at 14px 18px, rgba(143, 250, 255, 0.55) 50%, transparent 51%),
    radial-gradient(1.5px 1.5px at 54px 62px, rgba(255, 157, 243, 0.5) 50%, transparent 51%),
    radial-gradient(1px 1px at 92px 34px, rgba(255, 245, 230, 0.6) 50%, transparent 51%);
  background-size: 120px 90px;
  border: 3px solid;
  border-color: #12052c #4b1b8c #4b1b8c #12052c;
}

.brand {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1px;
  margin: 0 0 3px;
  font-family: var(--fh);
  font-size: 22px;
  line-height: 1;
  letter-spacing: 1px;
  text-shadow: 2px 3px 0 #12052c;
}
.brand b {
  font-weight: 400;
}
.brand .px {
  width: 18px;
  height: 18px;
  margin-left: 3px;
}
.b1 {
  color: #ff8fb8;
}
.b2 {
  color: #ffe45e;
}
.b3 {
  color: #4fe3c1;
}
.b4 {
  color: #c78bff;
}

.navbtn {
  flex: 0 0 auto;
  padding: 8px 6px 6px;
  color: #2b0b56;
  font-family: var(--fh);
  font-size: 12px;
  letter-spacing: 0.6px;
  text-align: center;
  border: 2px solid #2a0b52;
  border-radius: 10px;
  box-shadow:
    inset 0 -4px 0 rgba(0, 0, 0, 0.16),
    0 3px 0 rgba(0, 0, 0, 0.4);
  transition:
    transform 0.08s steps(2),
    filter 0.08s steps(2);
}
.navbtn:hover {
  filter: brightness(1.1) saturate(1.05);
  transform: translateY(-1px);
}
.navbtn.on,
.navbtn.on:hover {
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

.nav-foot {
  margin: auto 0 0;
  padding-top: 7px;
  font-family: var(--fh);
  font-size: 8px;
  letter-spacing: 0.4px;
  text-align: center;
  color: rgba(255, 245, 230, 0.45);
}

/* ---------- 右侧内容 ---------- */
.content {
  position: relative;
  display: grid;
  grid-template-rows: minmax(0, 1fr) auto;
  min-height: 0;
  overflow: hidden;
  background-color: #f7f2e7;
  background-image:
    radial-gradient(2px 2px at 26px 32px, rgba(58, 17, 136, 0.22) 50%, transparent 51%),
    radial-gradient(2px 2px at 98px 84px, rgba(242, 53, 217, 0.2) 50%, transparent 51%),
    radial-gradient(3px 3px at 152px 42px, rgba(0, 211, 255, 0.26) 50%, transparent 51%),
    radial-gradient(1.5px 1.5px at 62px 122px, rgba(58, 17, 136, 0.18) 50%, transparent 51%);
  background-size: 190px 160px;
  border: 3px solid;
  border-color: #12052c #cbb8e6 #cbb8e6 #12052c;
}

.page {
  min-height: 0;
  height: 100%;
  padding: 12px 16px 14px;
  overflow-y: auto;
  animation: pagein 0.16s steps(3, end);
}
.page::-webkit-scrollbar {
  width: 10px;
}
.page::-webkit-scrollbar-track {
  background: #e6ddcc;
}
.page::-webkit-scrollbar-thumb {
  background: #b9a8cf;
  border: 2px solid #e6ddcc;
}

@keyframes pagein {
  from {
    opacity: 0;
    transform: translateY(6px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}

.page-title {
  margin: 2px 0 10px;
  font-family: var(--fh);
  font-size: clamp(24px, 2.4vw, 34px);
  line-height: 1.15;
  letter-spacing: 4px;
  text-align: center;
  text-shadow: 3px 4px 0 rgba(58, 17, 136, 0.2);
}

.lead {
  margin: 0 0 6px;
  font-size: 13px;
  line-height: 1.55;
  text-align: center;
  color: #3f2b4c;
}
.line {
  margin: 0 0 8px;
  font-size: 13px;
  line-height: 1.55;
  color: #3f2b4c;
}
.dim {
  color: #7a6488;
}

.hero {
  display: grid;
  place-items: center;
  padding: 2px 0 6px;
}
.hero-cat {
  width: 84px;
  height: 84px;
  filter: drop-shadow(3px 3px 0 rgba(58, 17, 136, 0.16));
  animation: bob 1.8s steps(2, end) infinite alternate;
}

.cards {
  display: grid;
  grid-template-columns: minmax(0, 1.15fr) minmax(0, 0.85fr);
  gap: 9px;
  margin-top: 10px;
}
.card {
  padding: 8px 10px 9px;
  background: #fffdf6;
  border: 3px solid var(--ink);
  box-shadow: 4px 4px 0 rgba(58, 17, 136, 0.14);
}
.card h3 {
  margin: 0 0 7px;
  font-family: var(--fh);
  font-size: 11px;
  font-weight: 400;
  letter-spacing: 0.5px;
  color: #3a1188;
}
.log {
  margin: 0;
  padding: 0;
  list-style: none;
  font-size: 11.5px;
  line-height: 1.5;
  color: #4a3557;
}
.log li + li {
  margin-top: 7px;
}
.log b {
  display: block;
  margin-bottom: 1px;
  font-family: var(--fh);
  font-size: 9.5px;
  font-weight: 400;
  letter-spacing: 0.3px;
  color: #a13b8c;
}
.stat {
  margin: 0;
  padding: 0;
  list-style: none;
  font-size: 11.5px;
}
.stat li {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 6px;
  padding: 4px 0;
  border-bottom: 2px dashed rgba(58, 17, 136, 0.18);
}
.stat li:last-child {
  border-bottom: 0;
}
.stat span {
  font-family: var(--fh);
  font-size: 9.5px;
  letter-spacing: 0.4px;
  color: #7a6488;
}
.stat b {
  font-weight: 400;
  color: var(--ink);
}

.bullets {
  margin: 8px 0;
  padding: 8px 10px 8px 26px;
  background: #fffdf6;
  border: 3px solid var(--ink);
  font-size: 12px;
  line-height: 1.7;
  color: #4a3557;
}
.bullets ::marker {
  color: var(--acct);
}
.sign {
  margin: 10px 0 0;
  font-family: var(--fh);
  font-size: 10px;
  text-align: right;
  color: #7a6488;
}

.petcards {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 4px;
}
.petcard {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  background: #fffdf6;
  border: 3px solid var(--ink);
  box-shadow: 4px 4px 0 rgba(58, 17, 136, 0.12);
}
.petcard.muted {
  background: #f1ece1;
  opacity: 0.75;
}
.pet-ico {
  flex: 0 0 auto;
  width: 42px;
  height: 42px;
}
.petcard > div {
  flex: 1 1 auto;
  min-width: 0;
}
.petcard h3 {
  margin: 0 0 2px;
  font-family: var(--fh);
  font-size: 12px;
  font-weight: 400;
  color: #3a1188;
}
.petcard p {
  margin: 0;
  font-size: 11.5px;
  line-height: 1.45;
  color: #4a3557;
}
.badge {
  flex: 0 0 auto;
  padding: 3px 7px 1px;
  background: #7fe8c8;
  border: 2px solid var(--ink);
  font-family: var(--fh);
  font-size: 9px;
  color: var(--ink);
}
.badge.off {
  background: #d9d2e6;
}

.dlist {
  margin: 6px 0 0;
  padding: 0;
  list-style: none;
  background: #fffdf6;
  border: 3px solid var(--ink);
}
.dlist li {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 7px 9px;
}
.dlist li + li {
  border-top: 2px dashed rgba(58, 17, 136, 0.2);
}
.dl-name {
  flex: 1 1 auto;
  min-width: 0;
  overflow: hidden;
  font-family: var(--fh);
  font-size: 10.5px;
  color: var(--ink);
  white-space: nowrap;
  text-overflow: ellipsis;
}
.dl-size {
  flex: 0 0 auto;
  font-family: var(--fh);
  font-size: 9px;
  color: #8b5f7f;
}
.pxbtn.small {
  flex: 0 0 auto;
  padding: 4px 8px 2px;
  font-size: 9px;
  border-width: 2px;
}

.linkgrid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin-top: 8px;
}
.linkcard {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 9px 10px 7px;
  color: var(--ink);
  text-decoration: none;
  border: 3px solid var(--ink);
  box-shadow: 4px 4px 0 rgba(58, 17, 136, 0.15);
}
.linkcard b {
  font-family: var(--fh);
  font-size: 12px;
  font-weight: 400;
  letter-spacing: 0.4px;
}
.linkcard span {
  font-size: 10.5px;
  color: #3f2b4c;
  opacity: 0.82;
}
.linkcard:hover {
  transform: translate(-1px, -1px);
  box-shadow: 5px 5px 0 rgba(58, 17, 136, 0.22);
}

.msgs {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin: 6px 0 0;
  padding: 0;
  list-style: none;
}
.msgs li {
  padding: 7px 10px;
  background: #fffdf6;
  border: 3px solid var(--ink);
  border-left-width: 8px;
  border-left-color: #ff9ec7;
  font-size: 12px;
  line-height: 1.5;
  color: #4a3557;
}
.msgs li.alt {
  border-left-color: #7fe8c8;
}
.msgs li:nth-child(3) {
  border-left-color: #9dc3ff;
}
.msgs b {
  display: block;
  margin-bottom: 2px;
  font-family: var(--fh);
  font-size: 10px;
  font-weight: 400;
  color: #3a1188;
}

.note {
  margin: 10px 0 0;
  font-family: var(--fh);
  font-size: 9.5px;
  line-height: 1.6;
  letter-spacing: 0.3px;
  text-align: center;
  color: #8b5f7f;
}

.feed-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
  padding: 7px 9px;
  background: #fffdf6;
  border: 3px solid var(--ink);
}
.feed-row span {
  font-size: 10.5px;
  line-height: 1.45;
  color: #8b5f7f;
}

.ring {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 10px;
  padding: 8px 10px;
  background: #efe6f7;
  border: 3px dashed #9c7bc4;
}
.ring > b {
  font-family: var(--fh);
  font-size: 10px;
  font-weight: 400;
  letter-spacing: 0.5px;
  color: #3a1188;
}
.ring-nav {
  gap: 6px;
}
.ring .pxbtn {
  display: inline-block;
  text-decoration: none;
}

.gb-form {
  display: flex;
  gap: 6px;
  margin-top: 10px;
}
.gb-form input {
  flex: 1 1 0;
  min-width: 0;
  padding: 6px 7px 4px;
  background: #fffdf6;
  border: 3px solid var(--ink);
  color: var(--ink);
  font-family: var(--fb);
  font-size: 11px;
  user-select: text;
}
.gb-form input:first-child {
  flex: 0 0 88px;
}
.gb-form input::placeholder {
  color: #a294b0;
}

.stamp {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 4px 10px 3px;
  background: #2b0b56;
  border-top: 3px dashed rgba(143, 250, 255, 0.32);
  color: rgba(255, 245, 230, 0.6);
  font-family: var(--fh);
  font-size: 8.5px;
  letter-spacing: 0.5px;
}
.stamp b {
  font-weight: 400;
  color: #8ffaff;
}
.stamp b:last-child {
  color: #ff9df3;
}

/* ---------- 窄屏：导航变顶部横条 ---------- */
@media (max-width: 720px) {
  .site {
    grid-template-columns: 1fr;
    height: auto;
  }
  .nav {
    flex-flow: row wrap;
    gap: 6px;
  }
  .brand {
    flex: 1 1 100%;
    justify-content: flex-start;
    font-size: 18px;
  }
  .navbtn {
    flex: 1 1 42%;
    font-size: 11px;
  }
  .nav-foot {
    display: none;
  }
  .content {
    min-height: 340px;
  }
  .page {
    height: auto;
    max-height: 60vh;
  }
  .cards,
  .linkgrid {
    grid-template-columns: 1fr;
  }
}
</style>
