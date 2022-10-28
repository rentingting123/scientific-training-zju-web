import request from '@/utils/request'

export default {
  getData: () => {
    return request({
      url: '/systemConfig/setJfList',
      method: 'post'
    })
  },
  
  setConfig: (data) => {
    return request({
      url: '/systemConfig/setJfSave',
      method: 'post',
      data
    })
  }
}
