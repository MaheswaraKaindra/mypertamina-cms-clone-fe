export default defineNuxtRouteMiddleware(async (to) => {
  const { token, user, fetchMe } = useAuth()

  if (to.path === '/login') {
    if (token.value) return navigateTo('/')
    return
  }

  if (!token.value) {
    return navigateTo('/login')
  }

  if (!user.value) {
    await fetchMe()
    if (!user.value) {
      return navigateTo('/login')
    }
  }
})
