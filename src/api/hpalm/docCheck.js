import request from '@/utils/request'

export function docCheckToAlm(data) {
  return request({
    url: '/api-hpalm/docCheck/docCheckToAlm',
    method: 'post',
    data
  })
}
