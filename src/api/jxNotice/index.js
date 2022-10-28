import request from '@/utils/request'

export default {
  getXtggList: (params) => {
    return request({
      url: '/systemConfig/xtggList',
      method: 'get',
      params
    })
  },
  addXtgg: (data) => {
    return request({
      url: '/systemConfig/addXtgg',
      method: 'post',
      data
    })
  },
  updateXtgg: (data) => {
    return request({
      url: '/systemConfig/updateXtgg',
      method: 'post',
      data
    })
  },
  xtggDetail: (params) => {
    return request({
      url: `/systemConfig/xtggDetail/${params.id}`,
      method: 'get',
      params
    })
  },
  deleteXtgg: (data) => {
    return request({
      url: '/systemConfig/deleteXtgg',
      method: 'post',
      data
    })
  },
  //  无需权限列表
  getMhyggList: (params) => {
    return request({
      url: '/systemConfig/mhyggList',
      method: 'get',
      params
    })
  },
  //无需权限详情
  mhyxtggDetail: (params) => {
    return request({
      url: `/cc/schoolmanager/expertReview/homeDetail/${params.id}`,
      method: 'get',
      params
    })
  },
}
