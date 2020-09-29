import request from '@/utils/request'
export function findGroups(data) {
  return request({
    url: 'cetc-activiti/processUser/findGroups',
    method: 'post',
    data
  })
}

export function addGroup(data) {
  return request({
    url: 'cetc-activiti/processUser/createGroup',
    method: 'post',
    data
  })
}

export function findGroupById(groupId) {
  return request({
    url: 'cetc-activiti/processUser/findGroupById/' + groupId,
    method: 'get'
  })
}

export function updateGroupById(data) {
  return request({
    url: 'cetc-activiti/processUser/updateGroupById',
    method: 'put',
    data
  })
}

export function deleteGroupById(id) {
  return request({
    url: 'cetc-activiti/processUser/deleteGroupById/' + id,
    method: 'delete'
  })
}

export function addUserGroup(id, data) {
  return request({
    url: 'cetc-activiti/processUser/addUserGroup/' + id,
    method: 'post',
    data
  })
}

export function findGroupUsers(id) {
  return request({
    url: 'cetc-activiti/processUser/findGroupUsers/' + id,
    method: 'get'
  })
}

export function findPageActUsers(data) {
  return request({
    url: 'cetc-activiti/processUser/findPageActUsers',
    method: 'post',
    data
  })
}

export function findAllActUsers() {
  return request({
    url: 'cetc-activiti/processUser/findAllActUsers',
    method: 'get'

  })
}

export function addActUsers(data) {
  return request({
    url: 'cetc-activiti/processUser/addActUsers',
    method: 'post',
    data

  })
}

export function queryByName(data) {
  return request({
    url: 'cetc-activiti/processUser/queryByName',
    method: 'post',
    data

  })
}

export function findAllTransferActUsers() {
  return request({
    url: 'cetc-activiti/processUser/findAllTransferActUsers',
    method: 'get'

  })
}
