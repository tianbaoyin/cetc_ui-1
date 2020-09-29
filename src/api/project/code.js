import request from '@/utils/request'

// 《令号管理》新增
export function addCode(data) {
  return request({
    url: '/api-project/code/add',
    method: 'post',
    data
  })
}

// 《令号管理》删除
export function deleteCode(id) {
  return request({
    url: '/api-project/code/delete/' + id,
    method: 'delete'
  })
}

// 《令号管理》修改
export function updateCode(data) {
  return request({
    url: '/api-project/code/update',
    method: 'post',
    data
  })
}

// 《令号管理》分页查询
// 《子令号管理》分页查询
export function findPageCode(data) {
  return request({
    url: '/api-project/code/findPageCode',
    method: 'post',
    data
  })
}

// 《令号管理》令号重复性检查
export function checkCode(data) {
  return request({
    url: '/api-project/code/checkCode',
    method: 'post',
    data
  })
}

// 《令号管理》获取令号的序号
export function getNum() {
  return request({
    url: '/api-project/code/getNum',
    method: 'get'
  })
}

// 《令号管理》令号派发
export function commitApply(data) {
  return request({
    url: 'api-project/code/commitCodeApply',
    method: 'post',
    data
  })
}

// 树形结构检查令号的权限
export function checkCodeRole(codeId) {
  return request({
    url: '/api-project/code/checkRole/' + codeId,
    method: 'get'
  })
}

// 《子令号管理》获取令号权限用户
export function findVisableUser(codeId) {
  return request({
    url: '/api-project/code/findVisableUser/' + codeId,
    method: 'get'
  })
}

// 《子令号管理》分页查询已签收的令号
export function findPageCodeWithReady(data) {
  return request({
    url: '/api-project/code/findPageCodeWithReady',
    method: 'post',
    data
  })
}

// 《子令号管理》设置令号权限用户
export function setLeader(data) {
  return request({
    url: '/api-project/code/setLeader',
    method: 'post',
    data
  })
}

// 《子令号管理》设置令号权限用户
export function handleCodeIsZy(data) {
  return request({
    url: '/api-project/code/handleCodeIsZy',
    method: 'post',
    data
  })
}

// 《Tree项目管理节点》令号数量第一排
export function findCodeData() {
  return request({
    url: '/api-project/code/findCodeData',
    method: 'get'
  })
}

// 《Tree项目管理节点》的统计领域下的令号
export function countOfKingdom() {
  return request({
    url: '/api-project/code/countOfKingdom',
    method: 'get'
  })
}

// 《Tree项目管理节点》按月份统计令号
export function countCodeOfMonth(data) {
  return request({
    url: '/api-project/code/countOfMonth',
    method: 'post',
    data
  })
}

export function findCodeById(id) {
  return request({
    url: 'api-project/code/findCodeById/' + id,
    method: 'get'
  })
}

