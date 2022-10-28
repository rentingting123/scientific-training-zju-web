import request from '@/utils/request'

export default {
  getData: (params) => {
    return request({
      url: '/systemConfig/termList',
      method: 'get',
      params
    })
  },
  editTerm: (data) => {
    return request({
      url: '/systemset/updateqc',
      method: 'post',
      data
    })
  },  
  addTerm: (data) => {
    return request({
      url: '/systemset/setterm',
      method: 'post',
      data
    })
  },
  getXmxzList: (data) => {
    return request({
      url: '/systemConfig/xmxzList',
      method: 'post',
      data
    })
  },
  setIsavail: (data) => {
    return request({
      url: '/systemset/updatenow',
      method: 'get',
      data
    })
  },
  deleteTerm: (id) => {
    return request({
      url: '/systemset/deleteqc/'+id,
      method: 'get',
    })
  },
  addXmsz: (data) => {
    return request({
      url: '/systemConfig/addXmsz',
      method: 'post',
      data
    })
  }
}
