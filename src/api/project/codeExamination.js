import request from '@/utils/request'

export function addExamination(data) {
  return request({
    url: '/api-project/examination/add',
    method: 'post',
    data
  })
}

export function examinationPageList(data) {
  return request({
    url: '/api-project/examination/searchPage',
    method: 'post',
    data
  })
}

export function delExamination(id) {
  return request({
    url: '/api-project/examination/delete/' + id,
    method: 'delete'

  })
}

export function updateExamination(data) {
  return request({
    url: '/api-project/examination/update',
    method: 'post',
    data
  })
}
