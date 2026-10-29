import { ref } from 'vue'

interface Toast {
  id: number
  title?: string
  message: string
  type: 'success' | 'error' | 'warning' | 'info' | 'notification'
  action?: () => void
}

const toasts = ref<Toast[]>([])
let counter = 0

export const useToast = () => {
  /**
   * Maximum toasts on screen at once.
   *
   * A page that fires six failing requests used to render six full-width error cards,
   * which on a 390px phone covered the entire viewport — the user could not see the page
   * or reach anything behind them.
   */
  const MAX_VISIBLE = 3

  const showToast = (
    message: string,
    type: 'success' | 'error' | 'warning' | 'info' | 'notification' = 'success',
    action?: () => void,
    title?: string,
  ) => {
    // Only one error on screen at a time.
    //
    // Matching on the message was not enough: six failing endpoints produce six different
    // messages, so an outage still stacked six cards. A user cannot act on any of them
    // individually — the cause is the same — so the newest error replaces the last.
    if (type === 'error') {
      toasts.value = toasts.value.filter((t) => t.type !== 'error')
    }

    // The same message arriving again is one problem, not two.
    const duplicate = toasts.value.find((t) => t.message === message && t.type === type)
    if (duplicate) return

    const id = counter++
    toasts.value.push({ id, title, message, type, action })

    // Drop the oldest rather than growing without limit.
    if (toasts.value.length > MAX_VISIBLE) {
      toasts.value = toasts.value.slice(-MAX_VISIBLE)
    }

    if (process.client) {
      window.setTimeout(() => {
        removeToast(id)
      }, 5000)
    }
  }

  const removeToast = (id: number) => {
    toasts.value = toasts.value.filter(t => t.id !== id)
  }

  return {
    toasts,
    showToast,
    removeToast
  }
}
