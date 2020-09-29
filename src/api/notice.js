import request from '@/utils/request'

export function findPageNotices(isRead, data) {
  return request({
    url: '/api-notice/notice/findNotices/' + isRead,
    method: 'post',
    data
  })
}

export function countMsgUnRead() {
  return request({
    url: '/api-notice/notice/countMsgUnRead',
    method: 'get'
  })
}

export function markAsRead(id) {
  return request({
    url: '/api-notice/notice/markAsRead/' + id,
    method: 'get'
  })
}

export function markAsReadByTime(creater, data) {
  return request({
    url: '/api-notice/notice/markAsReadByTime/' + creater,
    method: 'post',
    data
  })
}

export function deleteNotice(id) {
  return request({
    url: '/api-notice/notice/deleteNotice/' + id,
    method: 'delete'
  })
}

export function deleteByTime(creater, data) {
  return request({
    url: '/api-notice/notice/deleteByTime/' + creater,
    method: 'post',
    data
  })
}
