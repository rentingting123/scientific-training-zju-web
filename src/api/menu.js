import request from '@/utils/request'
import network from '@/utils/jxNetwork'
// 获取路由
export const getRouters = () => {
  return request({
    url: '/getRouters',
    method: 'get'
  })
}
export const getWebSetting=()=>network.node('setting/sc')