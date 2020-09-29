import request from '@/utils/request'

export function pageshow(data) {
  return request({
    url: '/api-project/project/pageshow',
    method: 'post',
    data
  })
}

export function selectProjectByKingdomId(kingdomId) {
  return request({
    url: '/api-project/project/selectProjectByKingdomId/' + kingdomId,
    method: 'get'
  })
}

export function getProjectCountBykingdom() {
  return request({
    url: '/api-project/project/getProjectCountBykingdom',
    method: 'get'
  })
}

export function getProjectCountByTestGrade(data) {
  return request({
    url: '/api-project/project/getProjectCountByTestGrade',
    method: 'post',
    data
  })
}

export function selectProjectByKingdomIdAndTestGrade(data, kingdomId) {
  return request({
    url: '/api-project/project/selectProjectByKingdomIdAndTestGrade/' + kingdomId,
    method: 'post',
    data
  })
}

export function getProjectByMonth(year) {
  return request({
    url: '/api-project/project/getProjectByMonth/' + year,
    method: 'get'
  })
}

export function getProjectByYear(data) {
  return request({
    url: '/api-project/project/getProjectByYear',
    method: 'post',
    data
  })
}
