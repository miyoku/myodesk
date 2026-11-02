import { onBeforeUnmount, onMounted, ref } from 'vue'

/** 任务栏时钟：12 小时制，每秒刷新一次 */
export function useClock() {
  const time = ref('00:00 AM')
  let timer = null

  const tick = () => {
    const now = new Date()
    const suffix = now.getHours() >= 12 ? 'PM' : 'AM'
    const hour = String(now.getHours() % 12 || 12).padStart(2, '0')
    const minute = String(now.getMinutes()).padStart(2, '0')
    time.value = `${hour}:${minute} ${suffix}`
  }

  onMounted(() => {
    tick()
    timer = setInterval(tick, 1000)
  })

  onBeforeUnmount(() => clearInterval(timer))

  return { time }
}
