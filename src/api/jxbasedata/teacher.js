import request from '@/utils/request'

// 获取导师管理列表
export const getTeacherList = (query) => {
  return request({
    url: '/user/dsList',
    method: 'get',
    params:query
  })
}

//修改导师
export const modifyTeacher=data=>request({
  url:'/user/editDs',
  method:'post',
  data,
})

//导师新增
export const addTeacher=data=>request({
  url:'/user/addDs',
  method:'post',
  data,
})

//删除导师
export const deleteTeacher=data=>request({
  url:'/user/deleteDs',
  method:'post',
  data
})


//学号获取导师详情
export const teacherDetailByxh=params=>request({
  url:'/user/dsDetailsByjgh',
  method:'get',
  params
})

//获取申报历史
export const sfDetail=params=>request({
  url:'/project/sfDetail',
  method:'get',
  params
})
