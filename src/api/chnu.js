import {validtateChnu} from './login'
import { getToken} from '@/utils/auth'
//单点登录全局access_token
let access_token
//淮北师范统一认证地址
const casPrefixUrl='https://auth.chnu.edu.cn/authserver'
/**
 * 单点登录
 */
const init = callback => {
    console.log('-------单点登录开始-------')
    let access_token = getToken()
    let st = getUrlParam('ticket')
    let sevice = window.location.protocol + '//' + window.location.host + ''
    if (access_token) {
      loginSuccess(callback)
    } else {
      if (st) {
        validateSt(st, sevice, callback)
      } else {
        let serviceUrl = encodeURIComponent(sevice)
        window.location.href = casPrefixUrl + '/login?service=' + serviceUrl
      }
    }
    console.log('-------单点登录结束-------')
 
}
const SSO = {
  init: init
}

function getUrlParam(paraName) {
  let url = document.location.toString()
  let arrObj = url.split('?')

  if (arrObj.length > 1) {
    let arrPara = arrObj[1].split('&')
    let arr

    for (let i = 0; i < arrPara.length; i++) {
      arr = arrPara[i].split('=')

      if (arr != null && arr[0] == paraName) {
        return arr[1].split('#')[0]
      }
    }
    return ''
  } else {
    return ''
  }
}

function validateSt(ticket, service, callback) {
  let params = {
    ticket: ticket,
    service: service
  }

  validtateChnu(params).then(res => {
      //this.departConfirm(res)
      if (res.access_token) {
        access_token = res.access_token
        loginSuccess(callback)
      } else {
        let sevice = window.location.protocol + '//' + window.location.host + '/' + process.env.VUE_APP_NAME
        let serviceUrl = encodeURIComponent(sevice)
        window.location.href = window._CONFIG['casPrefixUrl'] + '/login?service=' + serviceUrl
      }
    }).catch(err => {
      console.log(err)
      location.href="/"
      //that.requestFailed(err);
    })
}

function loginSuccess(callback) {
  callback(access_token)
}
export default SSO
