import Cookies from 'js-cookie'

const TokenKey = 'vue_admin_template_token'

const RefreshTokenKey = 'vue_admin_refresh_token'

const ExpireTimeKey = 'vue_admin_expire_time'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function getRefreshToken() {
  return Cookies.get(RefreshTokenKey)
}

export function setRefreshToken(refreshToken) {
  return Cookies.set(RefreshTokenKey, refreshToken)
}

export function removeRefreshToken() {
  return Cookies.remove(RefreshTokenKey)
}

export function getExpireTime() {
  return Cookies.get(ExpireTimeKey)
}

export function setExpireTime(expireTime) {
  return Cookies.set(ExpireTimeKey, expireTime)
}

export function removeExpireTime() {
  return Cookies.remove(ExpireTimeKey)
}
