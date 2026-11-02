<script setup>
import { inject } from 'vue'
import { closeApp } from '@/stores/desktop'
import { t } from '@/i18n'

const app = inject('deskApp')
</script>

<template>
  <div class="wbody">
    <div class="warn-ico">!</div>
    <p>{{ t('error.pre') }}<b>{{ t('error.fix') }}</b>{{ t('error.post') }}</p>
    <p class="meta">{{ t('error.meta') }}</p>
    <div class="row" style="margin-top: 10px">
      <button class="pxbtn" type="button" @click="closeApp(app)">{{ t('error.fix') }}</button>
      <button class="pxbtn alt" type="button" @click="closeApp(app)">{{ t('error.ignore') }}</button>
    </div>
  </div>
</template>

<style scoped>
.warn-ico {
  float: left;
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  margin: 0 10px 4px 0;
  background: var(--gold);
  color: var(--ink);
  font-family: var(--fh);
  font-size: 18px;
  border: 3px solid;
  border-color: #ffe9a8 #8a6410 #8a6410 #ffe9a8;
}
</style>
