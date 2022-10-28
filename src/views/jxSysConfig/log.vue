<template>
    <div class='app-container'>
        <el-form :model='queryParams' ref='queryForm' :inline='true' v-show='showSearch' label-width='68px'>
            <el-form-item label='操作名称' prop='operatename'>
                 <el-input v-model='queryParams.operatename' placeholder='搜索操作' clearable size='small' style='width: 240px' @keyup.enter.native='handleQuery'/>
            </el-form-item>

            <el-form-item label='操作人员' prop='operator'>
                <el-input v-model='queryParams.operator' placeholder='搜索人员' clearable size='small' style='width: 240px' @keyup.enter.native='handleQuery'/>
            </el-form-item>

             <el-form-item label='时间范围' >
                <el-date-picker
                    v-model="timeRang"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期">
                </el-date-picker>
            </el-form-item>

            <el-form-item>
                <el-button type='primary' icon='el-icon-search' size='mini' @click='handleQuery' >搜索</el-button>
                <el-button icon='el-icon-refresh' size='mini' @click='resetQuery' >重置</el-button >
            </el-form-item>
        </el-form>

        <el-table border v-loading='loading' :data='userList' >
            <el-table-column label='编号' align='center' key='id' prop='id'  />
            <el-table-column label='操作类型' align='center' key='operatename' prop='operatename' />
             <el-table-column label='操作时间' align='center' key='operatedate' prop='operatedate'  />
              <el-table-column label='操作人' align='center' key='operator' prop='operator'  />
        </el-table>

        <pagination v-show='total > 0' :total='total' :page.sync='queryParams.pageNum' :limit.sync='queryParams.pageSize' @pagination='getList' />
    </div>
</template>

<script>
import api from '@/api/jxsyscig/time'
export default {
    data() {
        return {
            // 遮罩层
            loading: true,
            timeRang:'',
            // 导出遮罩层
            exportLoading: false,
            // 显示搜索条件
            showSearch: true,
            // 总条数
            total: 0,
            // 年份列表
            years: [],
            // 用户表格数据
            userList: null,
            // 查询参数
            queryParams: {
                pageNum: 1,
                pageSize: 10,
                year: '',
            },
        };
    },
    created() {
        this.getList()
    },
    methods: {
        /** 查询用户列表 */
        getList() {
            let params=Object.assign({},this.queryParams,{
                startdate:this.timeRang[0]&&this.parseTime(this.timeRang[0],'{y}-{m}-{d}'),
                enddate:this.timeRang[1]&&this.parseTime(this.timeRang[1],'{y}-{m}-{d}'),
            })
                 this.loading = true;
            api.logList(params).then(res=>{
                this.loading = false;
                this.userList = res.rows||[]
                this.total = res.total
            })
           
        },
        /** 搜索按钮操作 */
        handleQuery() {
            this.queryParams.page = 1;
            this.getList();
        },
        /** 重置按钮操作 */
        resetQuery() {
            this.resetForm('queryForm');
            this.handleQuery();
        },
    }
};
</script>