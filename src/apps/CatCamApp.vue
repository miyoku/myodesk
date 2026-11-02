<script setup>
import PixelIcon from '@/components/PixelIcon.vue'
import { cuePet, fed, feedPet } from '@/stores/pet'
import { t } from '@/i18n'

/** 首次点击把 oodle 放到桌面上；之后再点只是喊她一句 */
function onFeed() {
  if (!fed.value) {
    feedPet()
    return
  }
  cuePet()
}
</script>

<template>
  <div class="wbody cat-body">
    <div class="catcam">
      <PixelIcon name="cat" class="big-cat" />
      <div class="cap">
        {{ t('cat.live') }}<em>{{ fed ? t('cat.out') : t('cat.watch') }}</em>
      </div>
    </div>
    <div class="row" style="margin-top: 8px; justify-content: center">
      <button class="pxbtn" type="button" @click="onFeed">
        {{ fed ? t('cat.call') : t('cat.feed') }}
      </button>
    </div>
    <p class="note">
      {{ fed ? t('cat.noteOut') : t('cat.noteWait') }}
    </p>
  </div>
</template>

<style scoped>
.cat-body {
  padding: 6px;
}
.catcam {
  display: grid;
  place-items: center;
  gap: 8px;
  padding: 8px;
  border: 3px solid;
  border-color: #021018 var(--main-light) var(--main-light) #021018;
  background-color: #0d1f2e;
  background-image: repeating-linear-gradient(
    to bottom,
    rgba(143, 250, 255, 0.05) 0 2px,
    transparent 2px 5px
  );
}
.big-cat {
  width: 128px;
  height: 128px;
  filter: drop-shadow(4px 4px 0 rgba(0, 0, 0, 0.5));
  animation: bob 1.6s steps(2, end) infinite alternate;
}
.cap {
  font-family: var(--fh);
  font-size: 10px;
  letter-spacing: 0.6px;
  color: var(--main-light);
}
.cap em {
  font-style: normal;
  color: var(--acct-light);
}
.note {
  margin: 8px 0 0;
  font-family: var(--fh);
  font-size: 9px;
  letter-spacing: 0.4px;
  text-align: center;
  color: #6b4a72;
}
</style>
