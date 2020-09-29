import request from '@/utils/request'

export function queryPageDicValues(id, data) {
  return request({
    url: '/api-dic/dicValue/queryPageAll/' + id,
    method: 'post',
    data
  })
}

export function saveDicValue(data) {
  return request({
    url: '/api-dic/dicValue/saveDicValue',
    method: 'post',
    data
  })
}

export function queryById(id) {
  return request({
    url: '/api-dic/dicValue/queryById/' + id,
    method: 'get'
  })
}

export function updateDicValue(data) {
  return request({
    url: '/api-dic/dicValue/updateDicValue',
    method: 'put',
    data
  })
}

export function queryByKey(data) {
  return request({
    url: '/api-dic/dicValue/queryByKey',
    method: 'post',
    data
  })
}

export function deleteById(id) {
  return request({
    url: '/api-dic/dicValue/deleteById/' + id,
    method: 'delete'
  })
}

export function queryDicValuesByDicType(dicType) {
  return request({
    url: '/api-dic/dicValue/queryDicValuesByDicType/' + dicType,
    method: 'get'
  })
}
