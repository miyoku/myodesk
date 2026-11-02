<template>
  <svg width="0" height="0" style="position: absolute" aria-hidden="true" focusable="false">
    <symbol id="i-monitor" viewBox="0 0 16 16">
      <rect x="1" y="2" width="14" height="10" fill="#0d0618" />
      <rect x="2" y="3" width="12" height="8" fill="#00d3ff" />
      <rect x="3" y="4" width="10" height="6" fill="#123d5a" />
      <rect x="5" y="5" width="2" height="2" fill="#ff9df3" />
      <rect x="9" y="5" width="2" height="2" fill="#ff9df3" />
      <rect x="6" y="7" width="4" height="2" fill="#f235d9" />
      <rect x="6" y="12" width="4" height="1" fill="#0d0618" />
      <rect x="4" y="13" width="8" height="2" fill="#007a9f" />
      <rect x="4" y="13" width="8" height="1" fill="#8ffaff" />
    </symbol>

    <symbol id="i-folder" viewBox="0 0 16 16">
      <rect x="1" y="3" width="6" height="2" fill="#8a6410" />
      <rect x="1" y="4" width="14" height="9" fill="#e4be51" />
      <rect x="2" y="5" width="12" height="7" fill="#ffd76e" />
      <rect x="2" y="5" width="12" height="1" fill="#fff3cf" />
      <rect x="1" y="12" width="14" height="1" fill="#8a6410" />
      <rect x="3" y="7" width="4" height="3" fill="#fff5e6" />
      <rect x="3" y="7" width="4" height="1" fill="#fff" />
    </symbol>

    <symbol id="i-doc" viewBox="0 0 16 16">
      <rect x="2" y="1" width="11" height="14" fill="#0d0618" />
      <rect x="3" y="2" width="9" height="12" fill="#fff5e6" />
      <rect x="9" y="2" width="3" height="3" fill="#c9c2de" />
      <rect x="4" y="4" width="5" height="1" fill="#00d3ff" />
      <rect x="4" y="6" width="6" height="1" fill="#8a7fa8" />
      <rect x="4" y="8" width="6" height="1" fill="#8a7fa8" />
      <rect x="4" y="10" width="4" height="1" fill="#f235d9" />
      <rect x="12" y="6" width="3" height="2" fill="#ffe45e" />
      <rect x="12" y="6" width="3" height="1" fill="#fff3cf" />
    </symbol>

    <symbol id="i-camera" viewBox="0 0 16 16">
      <rect x="10" y="3" width="3" height="2" fill="#f235d9" />
      <rect x="2" y="6" width="12" height="7" fill="#0d0618" />
      <rect x="3" y="7" width="10" height="5" fill="#00d3ff" />
      <rect x="3" y="7" width="10" height="1" fill="#8ffaff" />
      <rect x="5" y="5" width="4" height="1" fill="#007a9f" />
      <rect x="6" y="8" width="4" height="3" fill="#123d5a" />
      <rect x="7" y="9" width="2" height="1" fill="#ff9df3" />
      <rect x="12" y="8" width="1" height="1" fill="#f235d9" />
    </symbol>

    <symbol id="i-cat" viewBox="0 0 16 16">
      <!-- 尖耳（外侧三角） -->
      <rect x="2" y="1" width="2" height="1" fill="#e08a3c" />
      <rect x="1" y="2" width="3" height="1" fill="#e08a3c" />
      <rect x="1" y="3" width="4" height="2" fill="#e08a3c" />
      <rect x="12" y="1" width="2" height="1" fill="#e08a3c" />
      <rect x="12" y="2" width="3" height="1" fill="#e08a3c" />
      <rect x="11" y="3" width="4" height="2" fill="#e08a3c" />
      <rect x="2" y="2" width="1" height="2" fill="#ff9df3" />
      <rect x="13" y="2" width="1" height="2" fill="#ff9df3" />
      <!-- 头 -->
      <rect x="3" y="4" width="10" height="1" fill="#e08a3c" />
      <rect x="2" y="5" width="12" height="6" fill="#e08a3c" />
      <rect x="3" y="11" width="10" height="1" fill="#e08a3c" />
      <rect x="5" y="12" width="6" height="1" fill="#e08a3c" />
      <rect x="7" y="4" width="2" height="1" fill="#b96a24" />
      <rect x="3" y="5" width="1" height="3" fill="#f6b56b" />
      <!-- 眼睛 -->
      <rect x="4" y="7" width="3" height="2" fill="#0d0618" />
      <rect x="9" y="7" width="3" height="2" fill="#0d0618" />
      <rect x="4" y="7" width="1" height="1" fill="#fff5e6" />
      <rect x="9" y="7" width="1" height="1" fill="#fff5e6" />
      <!-- 口鼻 -->
      <rect x="6" y="9" width="4" height="2" fill="#f6b56b" />
      <rect x="7" y="9" width="2" height="1" fill="#f235d9" />
      <rect x="8" y="10" width="1" height="1" fill="#7a3d10" />
    </symbol>

    <symbol id="i-paw" viewBox="0 0 16 16">
      <rect x="2" y="2" width="2" height="2" fill="#ff9df3" />
      <rect x="7" y="1" width="2" height="2" fill="#ff9df3" />
      <rect x="12" y="2" width="2" height="2" fill="#ff9df3" />
      <rect x="14" y="5" width="2" height="2" fill="#ff9df3" />
      <rect x="0" y="5" width="2" height="2" fill="#ff9df3" />
      <rect x="4" y="6" width="8" height="7" fill="#f235d9" />
      <rect x="5" y="7" width="6" height="2" fill="#ff9df3" />
    </symbol>

    <symbol id="i-arcade" viewBox="0 0 16 16">
      <rect x="2" y="9" width="12" height="5" fill="#f235d9" />
      <rect x="3" y="9" width="10" height="1" fill="#ff9df3" />
      <rect x="6" y="4" width="2" height="5" fill="#0d0618" />
      <rect x="5" y="2" width="4" height="3" fill="#8ffaff" />
      <rect x="5" y="2" width="4" height="1" fill="#fff5e6" />
      <rect x="9" y="6" width="4" height="1" fill="#8ffaff" />
      <rect x="10" y="5" width="2" height="3" fill="#8ffaff" />
      <rect x="12" y="11" width="2" height="2" fill="#fff5e6" />
    </symbol>

    <symbol id="i-gear" viewBox="0 0 16 16">
      <rect x="6" y="1" width="4" height="3" fill="#8ffaff" />
      <rect x="6" y="12" width="4" height="3" fill="#8ffaff" />
      <rect x="1" y="6" width="3" height="4" fill="#8ffaff" />
      <rect x="12" y="6" width="3" height="4" fill="#8ffaff" />
      <rect x="3" y="3" width="10" height="10" fill="#8ffaff" />
      <rect x="3" y="3" width="10" height="1" fill="#fff5e6" />
      <rect x="6" y="6" width="4" height="4" fill="#0d0618" />
    </symbol>

    <symbol id="i-clock" viewBox="0 0 16 16">
      <rect x="4" y="1" width="8" height="1" fill="#0d0618" />
      <rect x="2" y="2" width="12" height="1" fill="#0d0618" />
      <rect x="1" y="3" width="14" height="10" fill="#0d0618" />
      <rect x="2" y="4" width="12" height="8" fill="#fff5e6" />
      <rect x="7" y="5" width="2" height="5" fill="#f235d9" />
      <rect x="8" y="9" width="4" height="2" fill="#f235d9" />
      <rect x="2" y="13" width="12" height="1" fill="#0d0618" />
      <rect x="4" y="14" width="8" height="1" fill="#0d0618" />
    </symbol>
  </svg>
</template>
