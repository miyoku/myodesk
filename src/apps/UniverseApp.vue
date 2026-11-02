<script setup>
import { t } from '@/i18n'
</script>

<template>
  <div class="wbody">
    <div class="canvas">
      <span>
        {{ t('universe.text') }}
        <!-- 8x8 像素笑脸，与文字同色，自带像素偏移阴影 -->
        <svg class="smile" viewBox="0 0 8 8" shape-rendering="crispEdges" aria-hidden="true" focusable="false">
          <g fill="currentColor">
            <rect x="2" y="0" width="4" height="1" />
            <rect x="1" y="1" width="1" height="1" />
            <rect x="6" y="1" width="1" height="1" />
            <rect x="0" y="2" width="1" height="4" />
            <rect x="7" y="2" width="1" height="4" />
            <rect x="1" y="6" width="1" height="1" />
            <rect x="6" y="6" width="1" height="1" />
            <rect x="2" y="7" width="4" height="1" />
            <rect x="2" y="2" width="1" height="1" />
            <rect x="5" y="2" width="1" height="1" />
            <rect x="2" y="4" width="1" height="1" />
            <rect x="5" y="4" width="1" height="1" />
            <rect x="3" y="5" width="2" height="1" />
          </g>
        </svg>
      </span>
    </div>
    <p class="meta" style="margin-top: 8px">{{ t('universe.meta') }}</p>
  </div>
</template>

<style scoped>
.canvas {
  position: relative;
  display: grid;
  place-items: center;
  height: 168px;
  overflow: hidden;
  border: 3px solid;
  border-color: var(--main-dark) var(--main-light) var(--main-light) var(--main-dark);
  background-image:
    radial-gradient(1.5px 1.5px at 14px 22px, #fff 50%, transparent 51%),
    radial-gradient(1.5px 1.5px at 62px 48px, #fff 50%, transparent 51%),
    radial-gradient(2px 2px at 98px 14px, var(--acct-light) 50%, transparent 51%),
    radial-gradient(1.5px 1.5px at 40px 72px, var(--main-light) 50%, transparent 51%),
    radial-gradient(1.5px 1.5px at 108px 62px, #fff 50%, transparent 51%),
    linear-gradient(
      180deg,
      #1b0a33 0 22%,
      #3d1160 0 45%,
      #7b1b83 0 68%,
      #c72a9a 0 86%,
      #ff5ec7 0
    );
  background-size: 120px 90px, 120px 90px, 120px 90px, 120px 90px, 120px 90px, 100% 100%;
  image-rendering: pixelated;
}
.canvas::after {
  content: '';
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(to bottom, rgba(13, 6, 24, 0.16) 0 2px, transparent 2px 4px);
}
.canvas span {
  position: relative;
  z-index: 1;
  font-family: var(--fh), 'PingFang SC', 'Microsoft YaHei', sans-serif;
  font-size: 13px;
  letter-spacing: 1px;
  color: var(--cream);
  text-shadow: 2px 2px 0 var(--acct-dark), 4px 4px 0 rgba(13, 6, 24, 0.6);
  white-space: nowrap;
}
.smile {
  width: 13px;
  height: 13px;
  vertical-align: -1px;
  filter: drop-shadow(2px 2px 0 var(--acct-dark)) drop-shadow(4px 4px 0 rgba(13, 6, 24, 0.6));
}
</style>
