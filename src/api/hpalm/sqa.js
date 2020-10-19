import request from '@/utils/request'

export function findSQAInfo(data, codeId) {
  return request({
    url: '/api-hpalm/almSQA/findSQAInfo/' + codeId,
    method: 'post',
    data
  })
}
