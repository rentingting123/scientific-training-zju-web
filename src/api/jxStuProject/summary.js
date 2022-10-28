import request from '@/utils/request'
const{get,post,downloadGet}=request
export default {
    //统计项目汇总表
    getProjectAll:d=>get('projectSummary/projectAll',d),
    //导出项目汇总表
    getAllProjectFile:d=>downloadGet('projectSummary/exportProjectAll',d),
    //导出成果汇总表
    getReslutFile:d=>downloadGet('projectSummary/exportCgConut',d),
    //获取成果列表
    getReslutAll:d=>get('projectSummary/getCgConut',d),
    //经费汇总表
    getMoneyAll:d=>get('projectSummary/projectFundAll',d),
    //各学院项目经费 废弃
    getMoneyByXy:d=>get('projectSummary/projectFundByXy',d),
    //导出经费汇总表
    getMoneyFile:d=>downloadGet('projectSummary/exportProjectFundAll',d),
    //学生申报课题汇总列表
    getStudentAll:d=>get('projectSummary/stuApplySubjectCount',d),
    //导出学生申请课题汇总
    getStudentFile:d=>downloadGet('projectSummary/exportStuApplySubjectConut',d),
    //导出教师申报课题汇总
    getTeacherFile:d=>downloadGet('practice/exportTeacherApplySubjectCount',d)
}