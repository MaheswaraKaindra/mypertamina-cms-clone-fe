type ApiOptions = Record<string, any>

function getAuthHeaders() {
  const token = useAuthToken()

  return token.value
    ? { Authorization: `Bearer ${token.value}` }
    : {}
}

export function useApi<T>(path: string, opts: ApiOptions = {}) {
  const config = useRuntimeConfig()
  const { headers, ...restOpts } = opts

  return useFetch<T>(path, {
    baseURL: config.public.apiBase,
    headers: {
      ...getAuthHeaders(),
      ...(headers || {}),
    },
    ...restOpts,
  })
}

export function apiFetch<T>(path: string, opts: ApiOptions = {}) {
  const config = useRuntimeConfig()
  const { headers, ...restOpts } = opts

  return $fetch<T>(path, {
    baseURL: config.public.apiBase,
    headers: {
      ...getAuthHeaders(),
      ...(headers || {}),
    },
    ...restOpts,
  })
}