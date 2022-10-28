import axios from 'axios'
import qs from 'qs'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { isEmpty, getTokenHeader } from './commons'
import { MessageBox,Message } from 'element-ui'
import { tologin } from './jxUtil'
// import i18n from './../i18n'
let timer = '', //弹框的定时器
    messTimer = '', //提示框的定时器
    waitingTime=100 //定时器时间
    ,JavaApi = 'api/'

function handleResponse (response, options) {
 
  function loginOut(){
    localStorage.removeItem('login')
    localStorage.removeItem('groupId')
    localStorage.removeItem('userInfo')
    localStorage.removeItem('noviceGuide')
    sessionStorage.clear()
    if(window.location.hash=='#/') return;
    MessageBox.alert(`Token 失效，请重新登录`, '登录异常', {
      confirmButtonText: '确定',
      callback: action => {
            let str = location.hash
            if(str.includes('#/adminLogin') || str.includes('#/admin/workshow')){
                location.href = window.location.href
            }else{
                tologin();
            }
      }
    })
  }
  if(!response){
    Message({showClose:true,message: 'error.e501'})
  } else if (response.status === 200) {
    const contentType = response.headers['content-type']
    if(response.data.code==401)loginOut()

    if (contentType && contentType.indexOf('json') !== -1) {
      if (response.config && (response.config.responseType === 'blob' || response.config.responseType === 'arraybuffer')){
         var enc = new TextDecoder('utf-8') 
          response.data = JSON.parse(enc.decode(new Uint8Array(response.data)))
      }
    }else if (response.config && (response.config.responseType === 'blob' || response.config.responseType === 'arraybuffer'))
    {
      const blob = new Blob([response.data])
      const downloadElement = document.createElement('a')
      //const href = window.URL ? window.URL.createObjectURL(blob) : window.webkitURL.createObjectURL(blob)
      const href = window.URL.createObjectURL(blob)
      const dis = response.headers['content-disposition']
      const filenameKey = 'filename='
      const indexOf = dis.indexOf(filenameKey)
      const filename = indexOf ? decodeURI(dis.substring(indexOf + filenameKey.length)) : '未知文件名'
      downloadElement.href = href
      downloadElement.download = decodeURIComponent(escape(filename))
      //downloadElement.download = filename
      document.body.appendChild(downloadElement)
      downloadElement.click()
      //if (window.URL) {
      window.URL.revokeObjectURL(href)
      //} else {
      //  window.webkitURL.revokeObjectURL(href)
      //}
      document.body.removeChild(downloadElement)
      response.data={code:0,data:'',message:'下载中'}
    }
  } else if (response.status === 401) {
    loginOut()
  } else if (response.status > 400) {
    if(!options.noError) {
        clearTimeout(timer);
        timer = setTimeout(() => {
          // MessageBox.alert(`异常编号：${response.status}，异常信息：${response.statusText}`, 'error.e500')
        }, waitingTime)
    }
  }
}

const fetch = (options) => {
  let {
    method = 'get',
    data,
    url,
    config,
    headers,
    urlData,
  } = options

  const _headers = getTokenHeader()
  for (let el in headers) {
    _headers[el] = headers[el]
  }
  if (options.form)
  {
    data = qs.stringify(data)
    _headers["Content-Type"] = "application/x-www-form-urlencoded";
  }
  const instance = axios.create({
    baseURL: '/',
    headers: _headers
  })

  instance.interceptors.request.use(c => {
    //store.dispatch('loading /openLoading')
     for(let key in config){
       c[key]=config[key]
     }
    return c
  }, err => {
    return Promise.reject(err)
  })

  instance.interceptors.response.use(response => {
    try {
      handleResponse(response, options)
    } catch (err) {
      console.error(err)
    }
    return response
  }, err => {
    handleResponse(err.response, options)
    return Promise.reject(err)
  })

  switch (method.toLowerCase()) {
  case 'get':
    return instance.get(`${url}${!isEmpty(data) ? `?${qs.stringify(data)}` : ''}`, config)
  case 'delete':
    return instance.delete(url, { data })
  case 'head':
    return instance.head(url, data)
  case 'post':
    return instance.post(`${url}${!isEmpty(urlData)?`?${qs.stringify(urlData)}`:''}`, data)
  case 'put':
    return instance.put(url, data)
  case 'patch':
    return instance.patch(url, data)
  default:
    return instance(options)
  }
}

function createNodeFetch(options){
  NProgress.start()
  return fetch(options).then((response) => {
    let data=response.data
    NProgress.done();
    if(data.code==20000){
      return  data.data
    }else{
   
      if(data.code == 401) data.message= 'error.e401'
      throw new Error(data.message)
    }
  }).catch((error) => {
    NProgress.done();
    //if(error.message.indexOf('成功')>-1){}
  
   options.noError&&error.message == 'error.e401' ? " " : Message({showClose:true,message:error.message  || 'qq1923594101'})
    
   return 'error'
  })
}

export default {
  node:(url,o={})=>{o.method='post';o.url = 'nodeapi/'+url;return createNodeFetch(o)},
}
