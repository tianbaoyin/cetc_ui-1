import request from '@/utils/request'

export function findPageDocumentTemplates(data) {
  return request({
    url: '/api-document/documentTemplate/findPageDocumentTemplates',
    method: 'post',
    data
  })
}

export function saveDocumentTemplate(data) {
  return request({
    url: '/api-document/documentTemplate/saveDocumentTemplate',
    method: 'post',
    data
  })
}
