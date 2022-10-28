import request from '@/utils/request'

// 获取学生管理列表
export const getStudentList = (query) => {
  return request({
    url: '/user/xsList',
    method: 'get',
    params:query
  })
}

//修改学生
export const modifyStudent=data=>request({
  url:'/user/editXs',
  method:'post',
  data,
})

//学生新增
export const addStudent=data=>request({
  url:'/user/addXs',
  method:'post',
  data,
})

//删除学生
export const deleteStudent=data=>request({
  url:'/user/deleteXs',
  method:'post',
  data
})

//学院列表
export const acadList=data=>request({
  url:'/user/xyList',
  method:'get',
  data
})

//学生详情
export const studentDetailById=params=>request({
  url:'/user/xsDetails',
  method:'get',
  params
})

//学号获取学生详情
export const studentDetailByxh=params=>request({
  url:'/user/xsDetailsByxh',
  method:'get',
  params
})

//学生修改个人信息
export const studentown=data=>request({
  url:'/projectPeople/editXs',
  method:'post',
  data
})