import request from '@/utils/request'

export function checkAlmDomainExist(name) {
  return request({
    url: '/api-hpalm/almDomain/checkAlmDomainExist/' + name,
    method: 'get'
  })
}

export function findAlmConfig() {
  return request({
    url: '/api-hpalm/almConfig/findAlmConfig',
    method: 'get'
  })
}

export function saveAlmConfig(data) {
  return request({
    url: '/api-hpalm/almConfig/save',
    method: 'post',
    data
  })
}

export function findAlmDomains() {
  return request({
    url: '/api-hpalm/almDomain/findAlmDomains',
    method: 'get'
  })
}

export function findAlmProjects(name) {
  return request({
    url: '/api-hpalm/almProject/findProjectsByDomainName/' + name,
    method: 'get'
  })
}

export function findProjectAnalysic1(id, refresh) {
  return request({
    url: '/api-hpalm/almProject/findProjectAnalysic1/' + id + '/' + refresh,
    method: 'get'
  })
}

export function findProjectAnalysic2(id, refresh) {
  return request({
    url: '/api-hpalm/almProject/findProjectAnalysic2/' + id + '/' + refresh,
    method: 'get'
  })
}

export function findProjectAnalysic3(id, refresh) {
  return request({
    url: '/api-hpalm/almProject/findProjectAnalysic3/' + id + '/' + refresh,
    method: 'get'
  })
}

export function findProjectAnalysic4(id, refresh) {
  return request({
    url: '/api-hpalm/almProject/findProjectAnalysic4/' + id + '/' + refresh,
    method: 'get'
  })
}
