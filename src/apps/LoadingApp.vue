<script setup>
import { inject } from 'vue'
import { closeApp } from '@/stores/desktop'
import { t } from '@/i18n'

const app = inject('deskApp')
</script>

<template>
  <div class="wbody">
    <div class="loadbar"><i /></div>
    <p class="meta">{{ t('loading.meta') }}</p>
    <div class="row" style="margin-top: 10px">
      <button class="pxbtn" type="button" @click="closeApp(app)">{{ t('loading.done') }}</button>
      <button class="pxbtn alt" type="button" @click="closeApp(app)">{{ t('loading.cancel') }}</button>
    </div>
  </div>
</template>

<style scoped>
.loadbar {
  height: 18px;
  margin-bottom: 10px;
  padding: 2px;
  background: #0a2430;
  border: 3px solid;
  border-color: #021018 var(--main-light) var(--main-light) #021018;
}
.loadbar > i {
  display: block;
  width: 62%;
  height: 100%;
  background: repeating-linear-gradient(90deg, var(--acct) 0 6px, var(--acct-light) 6px 8px);
  animation: load 4.5s steps(18, end) infinite alternate;
}
</style>
