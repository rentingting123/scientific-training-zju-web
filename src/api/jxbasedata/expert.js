import request from '@/utils/request'

// 获取学生管理列表
export const getExpertList = (query) => {
  return request({
    url: '/user/zjlist',
    method: 'get',
    params:query
  })
}

//修改学生
export const modifyExpert=data=>request({
  url:'/user/editZj',
  method:'post',
  data,
})

//学生新增
export const addExpert=data=>request({
  url:'/user/zj',
  method:'post',
  data,
})

//删除学生
export const deleteExpert=data=>request({
  url:'/user/deleteZj',
  method:'post',
  data
})