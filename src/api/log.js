import request from '@/utils/request'

export function findPageLogs(data) {
  return request({
    url: '/api-log/findPageLogs',
    method: 'post',
    data
  })
}

export function queryPageLogs(data) {
  return request({
    url: '/api-log/queryPageLogs',
    method: 'post',
    data
  })
}
