import request from '@/utils/request'

export function findAllKingdom() {
  return request({
    url: '/api-project/kingdom/findAll',
    method: 'get'
  })
}

export function getPage(data) {
  return request({
    url: '/api-project/kingdom/page',
    method: 'post',
    data
  })
}

export function addKingdom(data) {
  return request({
    url: '/api-project/kingdom/add',
    method: 'post',
    data
  })
}

export function updateKingdom(data) {
  return request({
    url: '/api-project/kingdom/update',
    method: 'post',
    data
  })
}

export function findByName(name) {
  return request({
    url: '/api-project/kingdom/findByName/' + name,
    method: 'get'
  })
}

export function deleteKindom(id) {
  return request({
    url: '/api-project/kingdom/delete/' + id,
    method: 'get'
  })
}

