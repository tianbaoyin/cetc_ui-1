import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/sys/login',
    method: 'post',
    data
  })
}

export function refreshToken(refreshToken) {
  return request({
    url: '/sys/refreshToken/' + refreshToken,
    method: 'get'
  })
}

export function getInfo() {
  return request({
    url: '/api-auth/getLoginUser',
    method: 'get'
    // params: { token }
  })
}

export function queryPageUsers(data) {
  return request({
    url: '/api-admin/queryPageUsers',
    method: 'post',
    data
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}
export function findByUserId(userId) {
  return request({
    url: '/api-admin/findRolesByUserId/' + userId,
    method: 'get'
  })
}

export function checkUsername(username) {
  return request({
    url: '/api-admin/checkUsername/' + username,
    method: 'get'
  })
}

export function deleteByUserId(userId) {
  return request({
    url: '/api-admin/deleteByUserId/' + userId,
    method: 'delete'
  })
}

export function saveUser(data) {
  return request({
    url: '/api-admin/addUser',
    method: 'post',
    data
  })
}

export function saveUpdatedUser(data) {
  return request({
    url: '/api-admin/saveUpdatedUser',
    method: 'put',
    data
  })
}

export function enabledUser(data) {
  return request({
    url: '/api-admin/enabledUser',
    method: 'post',
    data
  })
}

export function saveRoleByUserId(userId, data) {
  return request({
    url: '/api-admin/saveRoleByUserId/' + userId,
    method: 'post',
    data
  })
}

export function findUserByList(data) {
  return request({
    url: '/api-admin/findUserByList',
    method: 'post',
    data
  })
}

export function checkPasswordExpireTime(day) {
  return request({
    url: '/api-admin/checkPasswordExpireTime/' + day,
    method: 'get'
  })
}

export function checkPasswordConfim(password) {
  return request({
    url: '/api-admin/checkPasswordConfim/' + password,
    method: 'get'
  })
}

export function unLocked(username) {
  return request({
    url: '/api-admin/unLocked/' + username,
    method: 'get'
  })
}

export function updatePassword(data) {
  return request({
    url: '/api-admin/updatePassword',
    method: 'put',
    data
  })
}

export function getByUsername(name) {
  return request({
    url: '/api-admin/getByUsername/' + name,
    method: 'get'
  })
}
export function findAllUser() {
  return request({
    url: '/api-admin/findAll',
    method: 'get'
  })
}

export function findUserListIsNotSys() {
  return request({
    url: '/api-admin/findUserListIsNotSys',
    method: 'get'
  })
}
