import request from '@/utils/request'
import config from '@/settings'
// 登录方法
export function login(username, password, code, uuid) {
  const data = {
    username,
    password,
    code,
    uuid
  }
  //测试环境自动写密码
   //data.password = process.env.NODE_ENV === 'development'?'JGppYW4meHVlXzEyMw==':data.password
  return request({
    url: '/login',
    method: 'post',
    data: data
  })
}

// 获取用户详细信息
export function getInfo() {
  return request({
    url: '/getInfo',
    method: 'get'
  })
}

// 退出方法
export function logout() {
  return request({
    url: '/logout',
    method: 'post'
  })
}

// 获取验证码
export function getCodeImg() {
  return request({
    url: '/captchaImage',
    method: 'get'
  })
}
//选择身份
export function chooseRole(roleId,roleKey){
  return request.get('/chooseRole',{roleId,roleKey})
}
//获取用户角色列表
export function getRoles(d){
  return request.get('/getRoles',d).then(res=>{
    if(res.code==200){
      return res.data
    }
  })
}