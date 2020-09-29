import request from '@/utils/request'
export function findInstanceByStartUser(processKey, data) {
  return request({
    url: 'cetc-activiti/processHistory/findInstanceByStartUser/' + processKey,
    method: 'post',
    data
  })
}

export function generateImage(id) {
  return request({
    url: 'cetc-activiti/processInstance/generateImage/' + id,
    method: 'get'
  })
}

export function generateImageByBussinessKey(key, id) {
  return request({
    url: 'cetc-activiti/processInstance/generateImage/' + key + '/' + id,
    method: 'get'
  })
}

export function findTasksByAssign(key, data) {
  return request({
    url: 'cetc-activiti/processTask/findTasksByAssign/' + key,
    method: 'post',
    data
  })
}

export function findNextTaskByInstance(id) {
  return request({
    url: 'cetc-activiti/processTask/findNextTaskByInstance/' + id,
    method: 'get'
  })
}

export function findExecByInstanceId(id) {
  return request({
    url: 'cetc-activiti/processHistory/findExecByInstanceId/' + id,
    method: 'get'
  })
}

export function findExecByBussinessId(key, id) {
  return request({
    url: 'cetc-activiti/processHistory/findExecByBussinessId/' + key + '/' + id,
    method: 'get'
  })
}
