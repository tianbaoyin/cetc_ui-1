import request from '@/utils/request'

export function pageDocBySearch(data) {
  return request({
    url: '/api-project/document/pageDocBySearch',
    method: 'post',
    data
  })
}

export function addDocument(data) {
  return request({
    url: '/api-project/document/add',
    method: 'post',
    data
  })
}

export function getAllDocument() {
  return request({
    url: '/api-project/document/findAllDocument',
    method: 'get'
  })
}

export function getDocumentById(id) {
  return request({
    url: '/api-project/document/findDocumentById/' + id,
    method: 'get'
  })
}

export function pageDocumentGeneration(data) {
  return request({
    url: '/api-project/document/pageDocumentGeneration',
    method: 'post',
    data
  })
}
