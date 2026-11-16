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
    // Carry where they were going: an invite link to My jobs should land on My jobs after signing in,
    // not on the dashboard with the invite code still in their email.
    return navigateTo({ path: '/auth/login', query: { redirect: to.fullPath } })
  }
})
