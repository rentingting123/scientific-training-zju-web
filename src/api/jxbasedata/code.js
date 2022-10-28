import request from '@/utils/request'

// 获取学生管理列表
export default {
  getCodeList: (params) => {
    return request({
      url: '/user/codeList',
      method: 'get',
      params
    })
  },
  addCode: (data) => {
    return request({
      url: '/user/addCode',
      method: 'post',
      data
    })
  },
 
  editCode: (data) => {
    return request({
      url: 'user/editCode',
      method: 'post',
      data
    })
  },
  updateSort: (data) => {
    return request({
      url: '/user/updateSort',
      method: 'post',
      data
    })
  }
}
