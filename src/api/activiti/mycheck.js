import request from '@/utils/request'
export function handleCheck(taskId, data) {
  return request({
    url: 'cetc-activiti/processTask/handleCheck/' + taskId,
    method: 'post',
    data
  })
}

export function findHistoryTaskByAssign(key, name, data) {
  return request({
    url: 'cetc-activiti/processHistory/findHistoryTasksByAssign/' + key + '/' + name,
    method: 'post',
    data
  })
}

export function findHistoryTaskVariables(taskId) {
  return request({
    url: 'cetc-activiti/processHistory/findHistoryTaskVariables/' + taskId,
    method: 'get'
  })
}
