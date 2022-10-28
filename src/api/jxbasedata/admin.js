import request from '@/utils/request'

export default {
  getAdminList: (params) => {
    return request({
      url: '/user/adminList',
      method: 'get',
      params
    })
  },
  getGllx: () => {
    return request({
      url: '/system/dict/data/type/kyxl_gllx',
    })
  },
  delete: (data) => {
    return request({
      url: '/user/deleteAdmin',
      method: 'post',
      data
    })
  },
  edit: (data) => {
    return request({
      url: '/user/editAdmin',
      method: 'post',
      data
    })
  },
  add: (data) => {
    return request({
      url: '/user/addAdmin',
      method: 'post',
      data
    })
  }
}
