import request from '@/utils/request'
export function findFileInfoByIds(data) {
  return request({
    url: 'cetc-document/fileInfo/findFileInfoByIds',
    method: 'post',
    data
  })
}

export function ping() {
  return request({
    url: '/cetc-document/uploader/ping',
    method: 'get'

  })
}
