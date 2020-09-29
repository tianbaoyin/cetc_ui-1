import request from '@/utils/request'

export function getTree() {
  return request({
    url: '/api-project/project/tree',
    method: 'get'
  })
}
/**
 * 项目管理树的项目数据，统计总项目，我的项目，在研项目，我的在研项目
 */
export function findProjectData() {
  return request({
    url: '/api-project/project/findProjectData',
    method: 'get'
  })
}

// 《Tree项目管理节点》按月份统计项目
export function countProjectOfMonth(data) {
  return request({
    url: '/api-project/project/countOfMonth',
    method: 'post',
    data
  })
}

// 子项目管理修改项目的在研状态
export function handleProjectIsZy(data) {
  return request({
    url: '/api-project/project/handleProjectIsZy',
    method: 'post',
    data
  })
}

export function addProject(data) {
  return request({
    url: '/api-project/project/add',
    method: 'post',
    data
  })
}
export function updateProject(data) {
  return request({
    url: '/api-project/project/update',
    method: 'post',
    data
  })
}

export function pageByParent(data) {
  return request({
    url: '/api-project/project/pageByParent',
    method: 'post',
    data
  })
}
export function projectQueryList(data) {
  return request({
    url: '/api-project/project/queryList',
    method: 'post',
    data
  })
}
export function hasProject(data) {
  return request({
    url: '/api-project/project/hasProject',
    method: 'post',
    data
  })
}

export function getTestType(id) {
  return request({
    url: '/api-project/project/getTestType/' + id,
    method: 'get'
  })
}

export function delProject(id) {
  return request({
    url: '/api-project/project/delProject/' + id,
    method: 'get'
  })
}

export function getProjectNum(id) {
  return request({
    url: '/api-project/project/getNum/' + id,
    method: 'get'
  })
}

export function findProjectByCode(id) {
  return request({
    url: '/api-project/project/findByCode/' + id,
    method: 'get'
  })
}

export function commitApply(data) {
  return request({
    url: '/api-project/project/commitProject',
    method: 'post',
    data
  })
}

export function findProjectById(id) {
  return request({
    url: '/api-project/project/findProjectById/' + id,
    method: 'get'

  })
}
// hu
export function countProjectByKingdom() {
  return request({
    url: '/api-project/project/countOfProject',
    method: 'get'
  })
}

export function countProjectByYear(data) {
  return request({
    url: '/api-project/project/countProjectByYear',
    method: 'post',
    data
  })
}
export function countTestByYear(data) {
  return request({
    url: '/api-project/project/countTestByYear',
    method: 'post',
    data
  })
}
export function updateProjectAndJoins(data) {
  return request({
    url: '/api-project/project/updateProjectAndJoins',
    method: 'post',
    data: data
  })
}

export function setProjectVisual(data) {
  return request({
    url: '/api-project/project/setVisual',
    method: 'post',
    data
  })
}

export function findProjectVisual(projectId) {
  return request({
    url: '/api-project/project/findVisual/' + projectId,
    method: 'get'
  })
}

export function checkProjectRole(projectId) {
  return request({
    url: '/api-project/project/checkRole/' + projectId,
    method: 'get'
  })
}

export function findReadyProjectByParentId(codeId) {
  return request({
    url: '/api-project/project/findReadyProjectByParentId/' + codeId,
    method: 'get'
  })
}

export function countProjectOfTestGrade(data) {
  return request({
    url: '/api-project/project/countProjectOfTestGrade',
    method: 'post',
    data
  })
}

export function countProjectByParam(data) {
  return request({
    url: '/api-project/project/countByParam',
    method: 'post',
    data
  })
}

export function countProjectComprehensiveOfMonth(data) {
  return request({
    url: '/api-project/project/countProjectComprehensiveOfMonth',
    method: 'post',
    data
  })
}

export function countProjectOfWeek(data) {
  return request({
    url: '/api-project/project/countOfWeek',
    method: 'post',
    data
  })
}

export function findProjectTree() {
  return request({
    url: '/api-project/findProjectTree',
    method: 'get'
  })
}

export function findMyProjectTree(data) {
  return request({
    url: '/api-project/findMyProjectTree',
    method: 'post',
    data
  })
}

export function findProjectsByStatusReady(data) {
  return request({
    url: '/api-project/project/findProjectsByStatusReady',
    method: 'post',
    data
  })
}
