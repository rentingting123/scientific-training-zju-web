import request from '@/utils/request'

// 获取基础设置列表
export const getBaseList = data => {
  return request({
    url: '/systemConfig/setBaseList',
    method: 'post',
    data
  })
}

//修改学生
export const modifyBase=data=>request({
  // url:'/systemConfig/setBaseSave',
  url:'systemset/updatecyrs',
  method:'post',
  data,
})
