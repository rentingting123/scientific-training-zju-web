import request from '@/utils/request'

export default {
  getXy: () => {
    return request({
      url: '/user/xyList',
      method: 'get'
    })
  },
  getAcademyAdminList: (params) => {
    return request({
      url: '/user/xyadminList',
      method: 'get',
      params
    })
  },
  edit: (data) => {
    return request({
      url: '/user/editXyAdmin',
      method: 'post',
      data
    })
  },
  add: (data) => {
    return request({
      url: '/user/addXyAdmin',
      method: 'post',
      data
    })
  },
  delete: (data) => {
    return request({
      url: '/user/deleteXyAdmin',
      method: 'post',
      data
    })
  }
}
