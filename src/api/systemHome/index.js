import request from '@/utils/request'

export default {
    // 系统首页 特别提醒 查询
    selectIndex:d=>request.get(`/projectD/selectIndex`,d,{isToken:false}),
    //  系统首页 特别提醒 新增修改
    updateIndex:d=>request.post(`/projectD/updateIndex`,d,{isToken:false}),
}