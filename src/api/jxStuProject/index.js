import request from '@/utils/request'
const {get, download, downloadGet, post } = request
export default {
    // 导出全部pdf
    expertallPdf: d => download('exportPdf/batchDqrPDF', d),
     // 导出全部结题表
     expertallJt: d => downloadGet('project/downloadalljtbg', d),
    // 导出
    exportContent: d => download('project/exportdqrlist', d),
    //提交课程训练项目表单
    submitProject: data => request({
        url: '/project/addStudentXm',
        method: 'post',
        data
    }),
    //project/updateStudentXm
    //更新课程训练项目表单
    updateProject: data => request({
        url: '/project/updateStudentXm',
        method: 'post',
        data
    }),

    //改变申报状态
    updateDsxt: data => request({
        url: '/practice/updateDsxt',
        method: 'post',
        data
    }),

    //提交其他项目
    submitOtherProject: d => request.post('project/addOthers', d),

    //更新其他项目
    updateOtherProject: d => request.post('project/updateOthers', d),

    //检查项目名称是否重复
    checkProjectName: (params) => {
        return request({
            url: '/project/checkXmmc',
            method: 'get',
            params
        })
    },

    //根据教工号查询导师姓名
    getNameById: (params) => {
        return request({
            url: `/project/getdsByjgh/${params.jgh}`,
            method: 'get',
            params
        })
    },
    //根据学号查询学生姓名和往年项目
    getHisProjectById: (params) => {
        return request({
            url: `/project/getXsWnxm/${params.xh}`,
            method: 'get',
            params
        })
    },
    //待提交项目列表
    getUndeclaredProjectList: params => request({
        url: '/project/tjxmList',
        method: 'get',
        params
    }), 
    //待提交项目列表 admin 
    getUnSubmitlistList: params => request({
        url: '/project/unsubmitlist',
        method: 'get',
        params
    }),
    //学生待确定项目类型项目列表
    getUndefindProjectList: params => request({
        url: '/project/xsqrxmList',
        method: 'get',
        params
    }),
    //学生删除项目
    delProject: id => request({
        url: '/project/deleteStudentXm/' + id,
        method: 'post',
    }),

    //修改项目等级
    updataProject: data => request({
        url: '/project/changetype',
        method: 'post',
        data
    }),
    //删除其它类型项目
    delOtherProject: data => request.post('/project/deleteOthers', data),

    //学生编辑项目
    editProject: data => request({
        url: '/project/updateStudentXm',
        method: 'post',
        data
    }),

    //根据项目ID查询项目详情
    getProjectById: params => request({
        url: '/project/getXmById/' + params.id,
        method: 'get',
        params
    }),

    //学生确认参加项目
    stuComfirm: data => request({
        url: `/project/studentQrxm/${data.id}/${data.qrzt}/${data.typeList}`,
        method: 'post',
    }),

    //导师待确认列表
    teacherGetProjectList: params => request({
        url: '/project/dsqrxmList',
        method: 'get',
        params
    }),
    //导师确认参加
    teacherConfirm: data => request({
        url: `project/dsQrxm`,
        method: 'post',
        data
    }),
    //批量删除项目
    deleteProjects: data => request.post('project/deleteXm', data),
    //学院管理员获取列表
    schoolAdminGetProjectList: data => request.get('project/xydqrList', data),
    //学院不予立项 xm:admin:xxypsXm
    schoolOpinion: data => request({
        url: 'project/xxypsXm',
        method: 'post',
        data,
    }),
    //修改学院
    changeSchool: d => request.post(`project/updatexmxy`, d),

    //修改学院，不修改学生的
    onlySchool: d => request.post(`project/onlyupdatexmxy`, d),
    //学校管理员评审
    expertOpinion: data => request.post('project/xypsXm', data),
    //学院管理员修改经费
    expertChangeMoney: d => request.post('project/xgxmjf', d),
    //
    xyChangeMoney: d => request.post('project/dqrxgxmjf', d),


    //立项查看详情
    expertDetail: d => request.get('project/preLook', d),
    //科研实践申报详情
    shenbaoDetail: d => request.get('practice/detail', d),
    //学校批量确定项目类型 xm:yxadmin:qrxmlx
    schoolConfirm: data => request({
        url: 'project/qrxmlx',
        method: 'post',
        data
    }),
    //获取学院列表
    projectXyList: d => request.get('project/xylist', d),
    //获取期次列表
    projectQcList: d => request.get('project/qclist', d),
    //立项中期结题项目管理
    projectManagementList: d => request.get('project/getXmglList', d),
    //立项项目状态筛选状态列表
    projectLxXmzt: d => request.get('project/lxXmzt', d),
    //中期项目状态列表
    projectZqXmzt: d => request.get('project/zqXmzt', d),
    //结题项目状态列表
    projectJtXmzt: d => request.get('project/jtXmzt', d),
    //学校确认列表
    schAdminGetList: data => request.get('project/getXmList', data),
    //中期检查表保存
    middleSave: d => request.post('project/saveXmzq', d),
    middleUpdate: d => request.post('project/updateXmzq', d),
    //获取中期检查详情
    getMiddleDate: d => request.get(`project/zqjcxq/${d.xmid}`, d),

    //获取结题详情
    getEndDate: d => request.get(`project/tjjtsqxq/${d.xmid}`, d),
    //导师批阅中期检查表
    confirmMiddle: d => request.post('project/pyxmzq', d),
    //导师批阅结题检查表
    confirmEnd: d => request.post('project/dspyjt', d),
    //学院审核结题
    schoolEnd: d => request.post('project/saveSHjtb', d),
    //学院审核中期
    schoolMiddle: d => request.post('project/xyshzq', d),
    //提交结题申请
    submitReslutApply: d => request.post('project/tjjtsq', d),
    //修改结题报告
    updateEndApply: d => request.post('project/updateJt', d),
    //上传结题报告
    uploadProjectFile: d => request.post('project/addword', d),
    //批量操作验收
    schoolEndConfirm: d => request.post('project/xxplys', d),
    //中期改变状态
    schoolMidConfirm: d => request.post('project/zzhzh', d),
    // 判断参与学生是否具备条件
    isstucan: d => request.post('project/checkLevel', d),
    stopmiddle: key => request.get(`project/suspend/${key}`),
    //下载PDF
    expertPdf: d => request.download('exportPdf/lxpdf', d),
    //下载结题表
    expertTable: d => request.get('project/downloadjtbg', d),
    // 待确定项目类型下载pdf
    dqdexpertPdf: d => request.download('exportPdf/toBeDetermined ', d),
    //立项导出
    expertLixiang: d => request.download('project/export', d),
    //经费汇总
    moneyAll: d => request.get('projectSummary/moneynum', d),
    //查询最高上线
    checkMaxMeber: key => request.get(`project/ValidatedRs/${key}`),
    addXtgg: (data) => {
        return request({
            url: '/systemConfig/addXtgg',
            method: 'post',
            data
        })
    },
    xtggDetail: (params) => {
        return request({
            url: `/systemConfig/xtggDetail/${params.id}`,
            method: 'get',
            params
        })
    },
    //导师列表科研实践项目列表
    teacherPracticeList: d => get('/practice/mylist', d),
    //科研实践项目列表
    practiceList: d => get('/practice/list', d),
    //申报报名编码
    // checkSbbm:d=>get('/practice/declare?'+d),
    checkSbbm: params => request({
        url: `/practice/declare`,
        method: 'get',
        params
    }),
    // 申报成功后调用修改项目是否可申报的接口
    getupdata: params => request({
        url: `/practice/update`,
        method: 'get',
        params
    }),
    //申报条件校验
    checksbjy: params => request({
        url: `/project/sbjy`,
        method: 'get',
        params
    }),
    //科研实践详情
    practiceDetail: d => get('practice/detail', d),
    //成果导出
    getReslutOut: d => download('achievement/result/export', d),
    //所有导出
    getAllReslutOut: d => download('project/export', d),
    //提交过程记录
    guocheng: d => post('project/process/record', d),
    //提交过程历史
    lsguocheng: (params) => {
        return request({
            url: `/project/process/record/${params.proId}`,
            method: 'get',
            params
        })
    },
    // 暂缓
  overpostpone:d=>get('/project/overpostpone',d),
}