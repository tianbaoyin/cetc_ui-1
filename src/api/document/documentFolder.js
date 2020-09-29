import request from '@/utils/request'
export function saveFolder(data) {
  return request({
    url: '/api-document/documentFolderTree/saveFolder',
    method: 'post',
    data
  })
}

export function findAllFloders() {
  return request({
    url: '/api-document/documentFolderTree/findAll',
    method: 'get'
  })
}
