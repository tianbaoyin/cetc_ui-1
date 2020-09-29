import request from '@/utils/request'

export function findPageRoles(data) {
  return request({
    url: '/api-admin/findPageRoles',
    method: 'post',
    data
  })
}

export function findAllRoles() {
  return request({
    url: '/api-admin/findAllRoles',
    method: 'get'
  })
}

export function saveRole(data) {
  return request({
    url: '/api-admin/saveRole',
    method: 'post',
    data
  })
}

export function deleteRoleById(roleId) {
  return request({
    url: '/api-admin/deleteRoleById/' + roleId,
    method: 'delete'

  })
}

export function insertRoleMenus(roleId, data) {
  return request({
    url: '/api-admin/insertRoleMenus/' + roleId,
    method: 'post',
    data
  })
}

export function findMenuIdsByRoleId(roleId) {
  return request({
    url: '/api-admin/findMenuIdsByRoleId/' + roleId,
    method: 'get'
  })
}
