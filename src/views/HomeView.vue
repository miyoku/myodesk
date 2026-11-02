<script setup>
import { onBeforeUnmount, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import heroUrl from '@/assets/oodle-hero.webp'
import { locale, t, toggleLocale } from '@/i18n'

const router = useRouter()

function login() {
  router.push('/desktop')
}

/** 首页即登录页：回车 / 空格直接进桌面 */
function onKeydown(event) {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    login()
  }
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown))
</script>

<template>
  <main class="home">
    <div class="stage">
      <img
        class="hero"
        :src="heroUrl"
        :alt="t('home.alt')"
        decoding="async"
        fetchpriority="high"
      />
      <div class="veil" aria-hidden="true" />

      <button class="lang pixel-corners" type="button" :title="t('task.lang')" @click="toggleLocale">
        {{ locale === 'zh' ? '中' : 'EN' }}
      </button>

      <p class="foot">
        {{ t('home.footPre') }}
        <router-link to="/desktop">{{ t('home.skip') }}</router-link>
      </p>
    </div>

    <section class="card">
      <p class="eyebrow">{{ t('home.eyebrow') }}</p>
      <h1 class="title">oodle<span>.cat</span></h1>
      <p class="blurb">
        {{ t('home.line1') }}<br />
        {{ t('home.line2') }}
      </p>

      <ul class="stats">
        <li><span>{{ t('home.mood') }}</span><b>{{ t('home.moodVal') }}</b></li>
        <li><span>{{ t('home.snacks') }}</span><b>{{ t('home.snacksVal') }}</b></li>
        <li><span>{{ t('home.nap') }}</span><b>{{ t('home.napVal') }}</b></li>
      </ul>

      <!-- 登录按钮固定英文，不随语言切换 -->
      <button class="pxbtn login" type="button" @click="login">click to login</button>
      <p class="hint">{{ t('home.hint') }}</p>
    </section>
  </main>
</template>

<style scoped>
.home {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  /* 兜底色，与插画底部的粉壁纸同调 */
  background: #f9c9d8;
}

.stage {
  position: absolute;
  inset: 0;
}
.hero {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: 50% 40%;
}
.veil {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background:
    radial-gradient(120% 70% at 50% 104%, rgba(13, 6, 24, 0.5), transparent 62%),
    linear-gradient(180deg, rgba(13, 6, 24, 0.16), transparent 24%);
}

/* 中/英切换：右上角的像素胶囊 */
.lang {
  position: absolute;
  top: 20px;
  right: 22px;
  z-index: 3;
  min-width: 44px;
  padding: 9px 12px 7px;
  background: var(--cream);
  border: 3px solid;
  border-color: #fff var(--ink) var(--ink) #fff;
  color: var(--ink);
  font-family: var(--fh);
  font-size: 11px;
  letter-spacing: 0.6px;
}
.lang:hover {
  background: #fff;
}

.foot {
  position: absolute;
  right: 20px;
  bottom: 14px;
  z-index: 3;
  margin: 0;
  font-family: var(--fh);
  font-size: 9.5px;
  letter-spacing: 0.4px;
  color: rgba(255, 245, 230, 0.9);
  text-shadow: 2px 2px 0 rgba(13, 6, 24, 0.75);
}
.foot a {
  color: var(--main-light);
}

/* ---------- 登录卡片 ---------- */
.card {
  position: absolute;
  left: clamp(18px, 5vw, 74px);
  bottom: clamp(22px, 6vh, 62px);
  z-index: 4;
  width: min(432px, calc(100% - 36px));
  padding: 18px 20px 16px;
  background: var(--cream);
  border: 4px solid var(--ink);
  box-shadow: 8px 8px 0 rgba(13, 6, 24, 0.45);
  color: var(--ink);
}

.eyebrow {
  margin: 0;
  font-family: var(--fh);
  font-size: 9.5px;
  letter-spacing: 1px;
  color: #8b5f7f;
}

.title {
  margin: 6px 0 9px;
  font-family: var(--fh);
  font-size: clamp(30px, 4.2vw, 44px);
  line-height: 1;
  letter-spacing: -1px;
  text-shadow: 4px 4px 0 var(--acct-light);
}
.title span {
  color: var(--acct-dark);
}

.blurb {
  margin: 0;
  font-family: var(--fb);
  font-size: 14px;
  line-height: 1.5;
  color: #3f2b4c;
}

.stats {
  display: flex;
  margin: 14px 0;
  padding: 0;
  list-style: none;
  background: #ffe9f2;
  border: 3px solid var(--ink);
}
.stats li {
  flex: 1 1 0;
  min-width: 0;
  padding: 6px 8px 4px;
  text-align: center;
}
.stats li + li {
  border-left: 3px solid var(--ink);
}
.stats span {
  display: block;
  font-family: var(--fh);
  font-size: 9px;
  letter-spacing: 0.6px;
  color: #8b5f7f;
}
.stats b {
  display: block;
  margin-top: 4px;
  font-family: var(--fh);
  font-size: 12px;
  font-weight: 400;
  color: var(--ink);
}

.login {
  width: 100%;
  padding: 14px 12px 11px;
  font-size: 14px;
  letter-spacing: 1px;
}

.hint {
  margin: 9px 0 0;
  font-family: var(--fh);
  font-size: 9.5px;
  letter-spacing: 0.5px;
  text-align: center;
  color: #8b5f7f;
}

/* ---------- 窄屏：竖排，大图在上、卡片在下 ---------- */
@media (max-width: 900px) {
  .home {
    display: flex;
    flex-direction: column;
    overflow-y: auto;
  }
  .stage {
    position: relative;
    inset: auto;
    flex: 0 0 auto;
    height: 54vh;
  }
  .hero {
    object-position: 50% 34%;
  }
  .veil {
    background: linear-gradient(180deg, transparent 74%, rgba(13, 6, 24, 0.42));
  }
  .lang {
    top: 12px;
    right: 12px;
    font-size: 10px;
  }
  .foot {
    display: none;
  }
  .card {
    position: relative;
    left: auto;
    bottom: auto;
    flex: 1 0 auto;
    width: 100%;
    padding: 18px 16px 26px;
    border: 0;
    border-top: 4px solid var(--ink);
    box-shadow: none;
  }
  .title {
    font-size: 34px;
  }
}
</style>
