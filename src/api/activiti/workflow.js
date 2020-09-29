import request from '@/utils/request'

export function deploymentList(data) {
  return request({
    url: 'cetc-activiti/activiti/deploymentList',
    method: 'post',
    data
  })
}

export function processDefinitionList(data) {
  return request({
    url: 'cetc-activiti/activiti/processDefinitionList',
    method: 'post',
    data
  })
}

export function delDeployment(id) {
  return request({
    url: 'cetc-activiti/activiti/deldeployment/' + id,
    method: 'delete'
  })
}

export function findCommentListByTaskId(taskId) {
  return request({
    url: 'cetc-activiti/activiti/findCommentListByTaskId/' + taskId,
    method: 'get'

  })
}

export function findModelList(data) {
  return request({
    url: 'cetc-activiti/activiti/findModelList',
    method: 'post',
    data
  })
}

export function delModel(id) {
  return request({
    url: 'cetc-activiti/activiti/delModel/' + id,
    method: 'delete'
  })
}

export function publish(id) {
  return request({
    url: 'cetc-activiti/activiti/publishModel/' + id,
    method: 'get'
  })
}

export function revokePublish(id) {
  return request({
    url: 'cetc-activiti/activiti/revokePublish/' + id,
    method: 'get'
  })
}

export function viewDeploymentImage(id) {
  return request({
    url: 'cetc-activiti/activiti/viewImage/' + id,
    method: 'get'
  })
}
