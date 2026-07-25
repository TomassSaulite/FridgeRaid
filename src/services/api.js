const API_URL = import.meta.env.VITE_API_URL

if (!API_URL) {
  throw new Error('VITE_API_URL is not configured. Add it to your .env file.')
}

const baseUrl = API_URL.replace(/\/$/, '')
const TOKEN_KEY = 'fridgeraid_auth_token'

export async function request(path = '', options = {}) {
  const token = localStorage.getItem(TOKEN_KEY)
  const { headers: optionHeaders, ...requestOptions } = options

  const response = await fetch(`${baseUrl}/${path.replace(/^\//, '')}`, {
    ...requestOptions,
    headers: {
      Accept: 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...optionHeaders,
    },
  })

  const contentType = response.headers.get('content-type') ?? ''
  const body = contentType.includes('application/json')
    ? await response.json()
    : await response.text()

  if (!response.ok) {
    throw new Error(body?.message ?? `API request failed (${response.status} ${response.statusText})`)
  }

  return body
}

export async function checkApiConnection() {
  try {
    await request()
    return { connected: true }
  } catch (error) {
    return { connected: false, error: error.message }
  }
}

function rememberToken(response) {
  const token = response?.token ?? response?.access_token ?? response?.data?.token

  if (token) {
    localStorage.setItem(TOKEN_KEY, token)
  }

  return response
}

function authRequest(path, payload) {
  return request(`auth/${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  }).then(rememberToken)
}

export function register({ name, email, password, passwordConfirmation }) {
  return authRequest('register', {
    name,
    email,
    password,
    password_confirmation: passwordConfirmation,
  })
}

export function login({ email, password }) {
  return authRequest('login', { email, password })
}

export function getCurrentUser() {
  return request('auth/user')
}

export async function logout() {
  await request('auth/logout', { method: 'POST' })
  localStorage.removeItem(TOKEN_KEY)
}
