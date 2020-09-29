import request from '@/utils/request'

export function queryPageDics(data) {
  return request({
    url: '/api-dic/dic/queryPageDics',
    method: 'post',
    data
  })
}

export function saveDic(data) {
  return request({
    url: '/api-dic/dic/saveDic',
    method: 'post',
    data
  })
}

export function queryDicById(id) {
  return request({
    url: '/api-dic/dic/queryDicById/' + id,
    method: 'get'
  })
}

export function queryByDicName(dicName) {
  return request({
    url: '/api-dic/dic/queryByDicName/' + dicName,
    method: 'get'
  })
}

export function queryByDicType(dicType) {
  return request({
    url: '/api-dic/dic/queryByDicType/' + dicType,
    method: 'get'
  })
}

export function updateDicById(data) {
  return request({
    url: '/api-dic/dic/updateDicById',
    method: 'put',
    data
  })
}

export function fuzzyQueryDic(data) {
  return request({
    url: '/api-dic/dic/fuzzyQueryDic',
    method: 'post',
    data
  })
}

export function deleteDicById(id) {
  return request({
    url: '/api-dic/dic/deleteDicById/' + id,
    method: 'delete'
  })
}
