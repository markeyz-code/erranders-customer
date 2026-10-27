export default defineNuxtRouteMiddleware((to, from) => {
  const token = useCookie('errandr_token')
  let hasToken = !!token.value

  if (!hasToken && process.client) {
    const localToken = localStorage.getItem('token') || localStorage.getItem('errandr_token')
    if (localToken) {
      hasToken = true
      token.value = localToken
    }
  }

  // If user is not logged in and trying to access any dashboard path
  if (!hasToken && to.path.startsWith('/dashboard')) {
    return navigateTo('/auth/login')
  }
})
