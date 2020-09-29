import request from '@/utils/request'

export function addCodeTest(data) {
  return request({
    url: '/api-project/codetest/add',
    method: 'post',
    data
  })
}

export function codeTestPageList(data) {
  return request({
    url: '/api-project/codetest/pageList',
    method: 'post',
    data
  })
}

export function updateCodeTest(data) {
  return request({
    url: '/api-project/codetest/update',
    method: 'post',
    data
  })
}

export function deleteCodeTest(id) {
  return request({
    url: '/api-project/codetest/delete/' + id,
    method: 'get'
  })
}
