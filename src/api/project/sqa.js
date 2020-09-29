import request from '@/utils/request'

export function pageByParent(data) {
  return request({
    url: '/api-project/sqa/pageByParent',
    method: 'post',
    data
  })
}

export function pageShow(data) {
  return request({
    url: '/api-project/sqa/pageShow',
    method: 'post',
    data
  })
}

export function getMaxIndex() {
  return request({
    url: '/api-project/sqa/getMaxIndex',
    method: 'get'
  })
}

export function add(data) {
  return request({
    url: '/api-project/sqa/add',
    method: 'post',
    data
  })
}

export function deleteByid(id) {
  return request({
    url: '/api-project/sqa/delete/' + id,
    method: 'delete'
  })
}

export function getByYear(data) {
  return request({
    url: '/api-project/sqa/getByYear',
    method: 'post',
    data
  })
}

export function getSqaCountByKm() {
  return request({
    url: '/api-project/sqa/getSqaCountByKm',
    method: 'get'
  })
}

export function getBykingDom(domain) {
  return request({
    url: '/api-project/sqa/getByKindDom/' + domain,
    method: 'get'
  })
}

export function AllSQASByKingDom() {
  return request({
    url: '/api-project/sqa/AllSQASByKingDom',
    method: 'get'
  })
}

export function getSQACompletionRate(data, year) {
  return request({
    url: '/api-project/sqa/getSQACompletionRate/' + year,
    method: 'post',
    data
  })
}
