interface CmsUser {
  id: number
  name: string
  email: string
  role: string
  permissions: string[]
}

export function useAuthToken() {
  return useCookie<string | null>('cms_token', { default: () => null, sameSite: 'lax' })
}

export function useAuthUser() {
  return useState<CmsUser | null>('cms_user', () => null)
}

export function useAuth() {
  const config = useRuntimeConfig()
  const token = useAuthToken()
  const user = useAuthUser()

  async function login(email: string, password: string) {
    const res = await $fetch<{ token: string; user: CmsUser }>('/auth/login', {
      method: 'POST',
      baseURL: config.public.apiBase,
      body: { email, password },
    })
    token.value = res.token
    user.value = res.user
  }

  async function fetchMe() {
    if (!token.value) return
    try {
      const res = await $fetch<{ user: CmsUser }>('/auth/me', {
        baseURL: config.public.apiBase,
        headers: { Authorization: `Bearer ${token.value}` },
      })
      user.value = res.user
    } catch {
      token.value = null
      user.value = null
    }
  }

  function logout() {
    token.value = null
    user.value = null
  }

  function hasPermission(code: string) {
    return user.value?.permissions?.includes(code) ?? false
  }

  return { token, user, login, logout, fetchMe, hasPermission }
}
