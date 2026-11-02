<script setup>
import IconSprite from '@/components/IconSprite.vue'
</script>

<template>
  <IconSprite />
  <router-view />
</template>

<style>
/* 路由切换用「入场动画」而不是 leave/enter 过渡：
   不依赖 transitionend，页面在后台标签页被打断时也不会卡住不销毁。 */
#app > main {
  animation: page-in 0.2s steps(3) both;
}

@keyframes page-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
