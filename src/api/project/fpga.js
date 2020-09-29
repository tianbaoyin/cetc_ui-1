import request from '@/utils/request'

export function getPageFpgaStandard(data) {
  return request({
    url: '/api-project/fpga/pageFpgaStandard',
    method: 'post',
    data: data
  })
}

export function addFpgaStandard(data) {
  return request({
    url: '/api-project/fpga/addFpgaStandard',
    method: 'post',
    data: data
  })
}

export function updateFpgaStandard(data) {
  return request({
    url: '/api-project/fpga/updateFpgaStandard',
    method: 'post',
    data: data
  })
}

export function deleteFpgastandard(id) {
  return request({
    url: '/api-project/fpga/delFpgaStandard/' + id,
    method: 'delete'
  })
}

export function countOfFpgaByYear(data) {
  return request({
    url: '/api-project/fpga/countOfFpgaStandardByYear',
    method: 'post',
    data
  })
}

export function countOfFpgaByKingdom() {
  return request({
    url: '/api-project/fpga/countOfFpgaByKingdom',
    method: 'get'
  })
}

