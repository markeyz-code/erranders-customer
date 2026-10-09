export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook('vue:error', (err, instance, info) => {
    console.error('[vue:error]', err, info, instance?.$options?.__file)
  })
  nuxtApp.hook('app:error', (err) => {
    console.error('[app:error]', err)
  })
})