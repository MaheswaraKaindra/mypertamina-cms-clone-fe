interface CmsUser {
  id: number
  name: string
  email: string
  role: string
  permissions: string[]
}

interface LoginResponse {
  token: string
  user: CmsUser
}

interface MeResponse {
  user: CmsUser
}

export function useAuthToken() {
  return useCookie<string | null>('cms_token', {
    default: () => null,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24,
  })
}

export function useAuthUser() {
  return useState<CmsUser | null>('cms_user', () => null)
}

export function useAuth() {
  const config = useRuntimeConfig()
  const token = useAuthToken()
  const user = useAuthUser()

  async function login(email: string, password: string) {
    const res = await $fetch<LoginResponse>('/auth/login', {
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
      const res = await $fetch<MeResponse>('/auth/me', {
        baseURL: config.public.apiBase,
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
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

  return {
    token,
    user,
    login,
    logout,
    fetchMe,
    hasPermission,
  }
}