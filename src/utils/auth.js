import Cookies from 'js-cookie'
import md5 from 'blueimp-md5'
import { Message,MessageBox,Radio,RadioGroup } from 'element-ui';
import Vue from "vue";

import{chooseRole,getRoles}from '@/api/login'
const TokenKey = 'SC-Admin-Token'
const RoleKey = 'SC-ROLE'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
   Cookies.remove(TokenKey)
   Cookies.remove(RoleKey)
}

export function setRole(token) {
  return Cookies.set(RoleKey, JSON.stringify(token))
}
export function getRole(){
  return Cookies.get(RoleKey)
}

export function setPageParams(params){
  const KEY = md5(this.$route.path)
  sessionStorage.setItem(KEY,JSON.stringify(params))
}
export function getPageParams(){
  const KEY = md5(this.$route.path)
  let params = sessionStorage.getItem(KEY)
  try {params=JSON.parse(params)}catch(e){console.log('pageParams',e)}
  return params
}
export function removePageParams(path){
  const KEY = md5(path||this.$route.path)
  sessionStorage.removeItem(KEY)
}

const groupSelect = {
  props: {
    options: {
      require: true,
      type: Array
    },
    selectGroup: {
      reuire: false,
      type: Function
    },
    groupId:{
      reuire:false,
      type:String
    }
  },
  data() {
    return {
      radio:(this.groupId||this.options[0].roleId).toString(),
    };
  },
  render() {
    return (
     <div>
      <RadioGroup on-change={this.selectGroup}  v-model={this.radio}>
        {this.options.map(item=>( <Radio style={{marginTop:'10px'}} key={item.roleId} label={item.roleId+''}>{item.roleName}</Radio>))}
      </RadioGroup>

     </div>
     
    );
  }
};
Vue.component("g-select", groupSelect);

export  async function  selectGroup(cb){
  var groups = await getRoles()
  if(groups=='error'||!groups) return 
  let groupId=null
  let seletcRole=[]
  if(groups.length<1){
    Message.warning('用户缺少身份！')
  }
  else if(groups.length>1){
      //必须要定义h不然在当前作用域下面没有vue会报错
      try{
        groupId=JSON.parse(Cookies.get(RoleKey)).roleId.toString()
      }catch(e){
        groupId = groups[0].roleId.toString()
      }
       const h =  new Vue({}).$createElement;
        await MessageBox({
          title: '角色身份选择',
          message:(<g-select options ={groups}
            groupId ={groupId}
            selectGroup={(v)=>(groupId=v)}/>),
          showCancelButton: false,
          showClose:false,
          closeOnPressEscape:false,
          closeOnClickModal:false,
          confirmButtonText: '确定',
          beforeClose: async (action, instance, done) => {
            if (!groupId) {
              Message.warning('必须选择身份！')
            } else {
               seletcRole=groups.filter(a=>a.roleId==groupId)
              const {roleId,roleKey}=seletcRole[0]
              instance.confirmButtonLoading = true;
              instance.confirmButtonText = '身份确认中...';
              await chooseRole(roleId,roleKey)
              done();
              instance.confirmButtonLoading = false;
            }
          }
        }).then( action => {
          Cookies.set(RoleKey,JSON.stringify(seletcRole[0]))
          Message.info('选择身份：'+seletcRole[0].roleName)
        });
  }
  cb&&cb()
}