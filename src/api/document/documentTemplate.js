import request from '@/utils/request'

export function findPageDocumentTemplates(data) {
  return request({
    url: '/api-document/documentTemplate/findPageDocumentTemplates',
    method: 'post',
    data
  })
}
export function findAllDocumentTemplates() {
  return request({
    url: '/api-document/documentTemplate/findAllDocumentTemplates',
    method: 'get'
  })
}

export function saveDocumentTemplate(data) {
  return request({
    url: '/api-document/documentTemplate/saveDocumentTemplate',
    method: 'post',
    data
  })
}

export function deleteDocumentTemplate(data) {
  return request({
    url: '/api-document/documentTemplate/delete',
    method: 'post',
    data
  })
}

export function checkFileExist(data) {
  return request({
    url: '/api-document/documentTemplate/checkFileExist',
    method: 'post',
    data
  })
}

export function updateTemplate(data) {
  return request({
    url: '/api-document/documentTemplate/update',
    method: 'post',
    data
  })
}

export function findDocumentTemplates(data) {
  return request({
    url: '/api-document/documentTemplate/queryList',
    method: 'post',
    data
  })
}

