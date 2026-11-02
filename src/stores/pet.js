import { ref } from 'vue'

/**
 * 桌宠状态（模块级单例，与 desktop 同构）：
 * - fed    是否已投喂；投喂后 oodle 常驻桌面
 * - x / y  拖动后的坐标；为 null 时交给 CSS 定位
 * - cue    让桌宠立刻说一句的计数器（窗口里点 "call oodle" 用）
 * - yapCue 打开了 greet 窗口（yaps）的计数器；桌宠会跑过去喊 Shut your yap
 */
export const fed = ref(false)
export const petX = ref(null)
export const petY = ref(null)
export const cue = ref(0)
export const yapCue = ref(0)

export function feedPet() {
  fed.value = true
}

export function cuePet() {
  cue.value++
}

export function yapPet() {
  yapCue.value++
}

export function movePet(x, y) {
  petX.value = x
  petY.value = y
}
