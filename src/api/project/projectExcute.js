import request from '@/utils/request'

export function addProjectExcute(data) {
  return request({
    url: '/api-project/testExcute/addProjectExcute',
    method: 'post',
    data
  })
}
export function projectExcutePageList(data) {
  return request({
    url: '/api-project/testExcute/pageList',
    method: 'post',
    data
  })
}
export function deleteExcute(id) {
  return request({
    url: '/api-project/testExcute/deleteExcute/' + id,
    method: 'delete'
  })
}
export function updateProjectExcute(data) {
  return request({
    url: '/api-project/testExcute/updateProjectExcute',
    method: 'post',
    data
  })
}
