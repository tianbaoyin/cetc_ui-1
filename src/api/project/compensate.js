import request from '@/utils/request'

export function download() {
  return request({
    url: '/api-project/compensate/download',
    method: 'get'
  })
}
