import request from '@/utils/request'

// 项目期次筛选
export const pexmqcList = data => {
  return request({
    url: '/systemConfig/pexmqcList',
    method: 'post',
    data: data
  })
}

// 项目限制设置期次筛选
export const updateXmpe = data => {
    return request({
      url: '/systemConfig/updateXmpe',
      method: 'post',
      data: data
    })
}
// 配置项目配额列表 system:xmpe:list
export const xmpeList = data => {
    return request({
      url: '/systemConfig/xmpeList',
      method: 'post',
      data: data
    })
}

export const improtPE = data=>request.post('/systemset/importpe',data)