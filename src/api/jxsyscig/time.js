import request from '@/utils/request'

export default {
  getData: (data) => {
    return request({
      url: '/systemConfig/timeList',
      method: 'post',
      data
    })
  },
  getXmqcList: (data) => {
    return request({
      url: '/systemConfig/xmqcList',
      method: 'post',
      data
    })
  },
  updateTsetsystime: (data) => {
    return request({
      url: '/systemset/updatetime',
      method: 'post',
      data
    })
  },
  logList:data=>request.get('/systemset/loglist',data),
}
