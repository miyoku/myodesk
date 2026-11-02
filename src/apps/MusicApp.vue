<script setup>
import { computed, ref } from 'vue'
import { t } from '@/i18n'

const playing = ref(true)
const playLabel = computed(() => (playing.value ? 'II' : '>'))
</script>

<template>
  <div class="music-body" :class="{ paused: !playing }">
    <div class="lcd">
      <div class="marquee">
        <div class="marquee__track">
          <span>{{ t('music.track') }}</span>
          <span aria-hidden="true">{{ t('music.track') }}</span>
        </div>
      </div>
      <div class="scrub"><i /></div>
      <div class="times"><span>1:12</span><span>3:46</span></div>
    </div>

    <div class="transport">
      <button class="tbtn" type="button" :title="t('music.prev')">|&lt;</button>
      <button
        class="tbtn"
        type="button"
        :title="playing ? t('music.pause') : t('music.play')"
        :aria-pressed="playing"
        @click="playing = !playing"
      >
        {{ playLabel }}
      </button>
      <button class="tbtn" type="button" :title="t('music.next')">&gt;|</button>
    </div>

    <div class="cd" aria-hidden="true" />
  </div>
</template>

<style scoped>
.music-body {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 8px;
  padding: 8px;
  background: var(--main);
  border: 4px solid;
  border-color: var(--main-dark) var(--main-light) var(--main-light) var(--main-dark);
  color: var(--ink);
}

.lcd {
  flex: 0 0 auto;
  min-width: 0;
  padding: 6px;
  background: #06283a;
  border: 3px solid;
  border-color: #021018 var(--main-light) var(--main-light) #021018;
  color: var(--main-light);
  overflow: hidden;
}

.marquee {
  overflow: hidden;
  -webkit-mask-image: linear-gradient(90deg, #000 84%, transparent 100%);
  mask-image: linear-gradient(90deg, #000 84%, transparent 100%);
}
.marquee__track {
  display: flex;
  width: max-content;
  animation: marquee 16s linear infinite;
}
.marquee__track span {
  flex: 0 0 auto;
  padding-right: 26px;
  font-family: var(--fh), 'PingFang SC', 'Microsoft YaHei', sans-serif;
  font-size: 11px;
  letter-spacing: 0.3px;
  white-space: nowrap;
}

.scrub {
  height: 12px;
  margin: 7px 0 5px;
  background: #021018;
  border: 2px solid;
  border-color: #021018 var(--main-light) var(--main-light) #021018;
}
.scrub > i {
  display: block;
  width: 38%;
  height: 100%;
  background: repeating-linear-gradient(90deg, var(--acct) 0 4px, var(--acct-light) 4px 6px);
}

.times {
  display: flex;
  justify-content: space-between;
  font-family: var(--fh);
  font-size: 10px;
}

.transport {
  display: flex;
  align-items: center;
  gap: 6px;
  flex: 0 0 auto;
  padding-right: 106px;
}

.tbtn {
  display: grid;
  place-items: center;
  width: 42px;
  height: 28px;
  padding: 0 0 2px;
  background: var(--acct);
  color: var(--cream);
  font-family: var(--fh);
  font-size: 10px;
  border: 3px solid;
  border-color: var(--acct-light) var(--acct-dark) var(--acct-dark) var(--acct-light);
}
.tbtn:hover {
  background: var(--acct-light);
  color: var(--ink);
}
.tbtn:active {
  border-color: var(--acct-dark) var(--acct-light) var(--acct-light) var(--acct-dark);
}

/* 旋转 CD：挂在播放器右下角，故意探出窗口外（上沿不遮住 LCD） */
.cd {
  position: absolute;
  right: -30px;
  bottom: -58px;
  width: 92px;
  height: 92px;
  border-radius: 50%;
  border: 4px solid var(--ink);
  box-shadow: 0 0 0 3px var(--acct-dark), 7px 7px 0 rgba(6, 2, 14, 0.5);
  background:
    radial-gradient(circle at 50% 50%, var(--ink) 0 9px, var(--cream) 9px 13px, transparent 14px),
    conic-gradient(
      from 0deg,
      var(--acct-light) 0 12%,
      var(--main-light) 12% 25%,
      var(--cream) 25% 37%,
      var(--acct-light) 37% 50%,
      var(--main-light) 50% 62%,
      var(--cream) 62% 75%,
      var(--acct) 75% 87%,
      var(--acct-light) 87% 100%
    );
  animation: spin 4s linear infinite;
}
.music-body.paused .cd,
.music-body.paused .marquee__track {
  animation-play-state: paused;
}

/* 窄屏：CD 回归文档流 */
@media (max-width: 1100px) {
  .transport {
    padding-right: 0;
  }
  .cd {
    position: relative;
    right: auto;
    bottom: auto;
    margin: 12px auto 0;
  }
}
</style>
