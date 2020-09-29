import request from '@/utils/request'

export function saveMenu(data) {
  return request({
    url: '/api-admin/saveMenu',
    method: 'post',
    data
  })
}

export function findAllMenus() {
  return request({
    url: '/api-admin/findAllMenus',
    method: 'get'
  })
}

export function findAllMenusVisble() {
  return request({
    url: '/api-admin/findAllMenusVisble',
    method: 'get'
  })
}

export function findTreeMenus() {
  return request({
    url: '/api-admin/findTreeMenus',
    method: 'get'
  })
}

export function findMenuById(menuId) {
  return request({
    url: '/api-admin/findMenuById/' + menuId,
    method: 'get'
  })
}

export function deleteMenuById(menuId) {
  return request({
    url: '/api-admin/deleteMenuById/' + menuId,
    method: 'delete'
  })
}

export function updateMenuById(data) {
  return request({
    url: '/api-admin/updateMenuById',
    method: 'put',
    data
  })
}
