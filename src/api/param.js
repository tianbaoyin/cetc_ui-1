import request from '@/utils/request'

export function queryPageParams(data) {
  return request({
    url: '/api-dic/params/findPageParams',
    method: 'post',
    data
  })
}

export function saveParam(data) {
  return request({
    url: '/api-dic/params/saveParam',
    method: 'post',
    data
  })
}

export function queryById(id) {
  return request({
    url: '/api-dic/params/queryById/' + id,
    method: 'get'
  })
}

export function updateById(data) {
  return request({
    url: '/api-dic/params/updateById',
    method: 'put',
    data
  })
}

export function queryByKey(key) {
  return request({
    url: '/api-dic/params/queryByKey/' + key,
    method: 'get'
  })
}

export function deleteById(id) {
  return request({
    url: '/api-dic/params/deleteById/' + id,
    method: 'delete'
  })
}
