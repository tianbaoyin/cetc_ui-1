import request from '@/utils/request'

export function addDocumentCheck(data) {
  return request({
    url: '/api-project/documentcheck/add',
    method: 'post',
    data
  })
}

export function updateDocumentCheck(data) {
  return request({
    url: '/api-project/documentcheck/update',
    method: 'post',
    data
  })
}
export function delDocumentCheck(data) {
  return request({
    url: '/api-project/documentcheck/del/',
    method: 'delete',
    data
  })
}
export function getPageList(data) {
  return request({
    url: '/api-project/documentcheck/pageList',
    method: 'post',
    data
  })
}

export function analysisFile(data) {
  return request({
    url: '/api-project/documentcheck/analysisFile',
    method: 'post',
    data
  })
}

export function getAnnoList(data) {
  return request({
    url: '/api-project/documentcheck/findAnnoList',
    method: 'post',
    data
  })
}

export function delAnno(data) {
  return request({
    url: '/api-project/documentcheck/delAnnotaton',
    method: 'post',
    data
  })
}

export function analysisStatus(uuid) {
  return request({
    url: '/api-project/documentcheck/getAnalysisStatus/' + uuid,
    method: 'get'
  })
}

export function getAnnoByUuid(data) {
  return request({
    url: '/api-project/documentcheck/getAnnoByUuid',
    method: 'post',
    data
  })
}

export function uploadfile(data) {
  return request({
    url: '/api-project/documentcheck/uploadFile',
    method: 'post',
    data
  })
}

export function searchFullDocPage(data) {
  return request({
    url: '/api-project/documentcheck/searchPage',
    method: 'post',
    data
  })
}

export function countOfDocAndAnnotationAndPageSize(data) {
  return request({
    url: '/api-project/documentcheck/countOfDocAndAnnotationAndPageSize',
    method: 'post',
    data
  })
}

export function countOfDocType(data) {
  return request({
    url: '/api-project/documentcheck/countOfDocType',
    method: 'post',
    data
  })
}

export function countOfAnnotationType(data) {
  return request({
    url: '/api-project/documentcheck/countOfAnnotationType',
    method: 'post',
    data
  })
}
