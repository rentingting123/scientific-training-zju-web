// @ts-ignore
import request from '@/utils/request'

export default {
  //获取申报审核列表
  typeback:d=>request.get('/project/typeback/'+ d,{},{isToken:false}),
  // 回退至待确定
  searchCom:d=>request.get('/projectD/searcholdKyxl',d,{isToken:false}),
  xyList:d=>request.get('/projectD/preSearchkyxl',d,{isToken:false}),
  xmlbList:d=>request.get('/projectD/getxmejlb',d,{isToken:false}),
  getCodeList:d=>request.get('/user/codeList',d,{isToken:false}),
   //立项查看详情
  expertDetail:d=>request.get('/projectD/preLookDetail',d,{isToken:false}),
  getDicts:d=>request.get('/system/dict/data/type/'+d,{},{isToken:false}),
  teacherDetailByxh:d=>request.get('/user/dsDetailsByjgh',d,{isToken:false}),
  studentDetailByxh:d=>request.get('/user/xsDetailsByxh',d,{isToken:false}),

  //根据第几期查询
  getKyxl:d=>request.get('/projectD/getKyxl',d,{isToken:false}),

  // 获取年份列表
  yearList:d=>request.get('/projectD/getYearList',d,{isToken:false}),
//   exportResult:d=>request.downloadGet('/schoolmanager/competitionResult/exportData',d)
}