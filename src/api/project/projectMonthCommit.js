import request from '@/utils/request'

export function add(data) {
  return request({
    url: '/api-project/projectMonthCommit/add',
    method: 'post',
    data
  })
}

export function findAll(id) {
  return request({
    url: '/api-project/projectMonthCommit/findAll/' + id,
    method: 'get'
  })
}

export function update(data) {
  return request({
    url: '/api-project/projectMonthCommit/update',
    method: 'post',
    data
  })
}

export function deleteById(id) {
  return request({
    url: '/api-project/projectMonthCommit/delete/' + id,
    method: 'get'
  })
}

export function findById(id) {
  return request({
    url: '/api-project/projectMonthCommit/findById/' + id,
    method: 'get'
  })
}
