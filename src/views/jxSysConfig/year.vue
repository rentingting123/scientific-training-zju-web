<template>
    <div class="app-container">
        <el-form :model="queryForm" ref="queryForm" :inline="true" label-width="88px">
            <el-form-item label="项目类型">
                <el-select v-model="queryForm.xmlx" @change="getData" filterable placeholder="项目类别">
                    <el-option
                      v-for="item in xmlxList"
                      :key="item.dictValue"
                      :label="item.dictLabel"
                      :value="item.dictValue">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item >
                <el-select v-model="queryForm.type" placeholder="项目期次">
                    <el-option
                        v-for="item in termTypeList"
                        :key="item.dictValue"
                        :label="item.dictLabel"
                        :value="item.dictValue"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" size="mini" @click="getData">搜索</el-button>
                <el-button type="primary" size="mini" @click="setShow('add')">新增</el-button>

            </el-form-item>
        </el-form>
        
        <el-table border :data="listData">
            <el-table-column label="项目期次" align="center" prop="value" />
            <el-table-column label="状态" align="center" :formatter="statusFilter" prop="state" />
            <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                    <el-button
                        size="mini"
                        type="text"
                        @click="setShow('showBasic', scope.row)"
                   
                    >编辑</el-button>
                    <el-button
                        size="mini"
                        type="text"
                        @click="deleteHandle(scope.row)"
                    
                    >删除</el-button>
                    <el-button
                        size="mini"
                        type="text"
                        @click="setThisYear(scope.row)"
                        v-if="scope.row.state == 0"
                    
                    >设置当前{{scope.row.type=='year'?'学年':'期次'}}</el-button>
                </template>
            </el-table-column>
        </el-table>
        
        <el-dialog :title="title" :before-close="cancelBasic" :visible.sync="showBasic" width="500px">
            <el-form ref="basicForm" :model="basicForm" label-width="100px">
                <el-form-item label="">
                    <el-input v-model="basicForm.value" />
                </el-form-item>
                <!-- <el-form-item label="是否限制重复">
                    <el-radio-group v-model="basicForm.isxzcf">
                        <el-radio label="0">限制</el-radio>
                        <el-radio label="1">不限制</el-radio>
                    </el-radio-group>
                </el-form-item> -->
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitEdit">确 定</el-button>
                <el-button @click="cancelBasic">取 消</el-button>
            </div>
        </el-dialog>
        
        <!-- <el-dialog title="项目申报限制设置" :before-close="cancelLimit" :visible.sync="showLimit" width="500px">
            <el-form ref="limitForm" :model="limitForm" label-width="100px">
                <el-form-item label="设置项目申报限制">
                    <el-checkbox-group v-model="limitForm.xmsbxz">
                        <el-checkbox v-for="item in xmqcList" :label="item.id" :key="item.id">
                            {{item.value}}
                        </el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitLimit">确 定</el-button>
                <el-button @click="cancelLimit">取 消</el-button>
            </div>
        </el-dialog> -->
    </div>
</template>
<script>
import YearAPI from '@/api/jxsyscig/year'

export default {
    data() {
        return {
            listData: [],
            queryForm: {
                xmlx:'',
                type:'',
            },
            title:'修改项目期次',
            basicForm: {},
            limitForm: {
                xmsbxz: []
            },
            xmlxList: [],
            termTypeList: [],
            // xmqcList: [2021, 2020, 2019, 2018, 2017, 2016, 2015, 2014],
            xmqcList: [],
            showBasic: false,
            showLimit: false
        }
    },
    created() {
        const p1 = this.getDicts('sbsj_lx')
        
        const p2 = this.getDicts('term_type')
        
        Promise.all([p1, p2]).then(result => {
            const res1 = result[0], res2 = result[1];
            this.xmlxList = res1.data;
            this.queryForm.xmlx = res1.data?.[0].dictValue
            this.termTypeList = res2.data;
            this.queryForm.type = res2.data?.[0].dictValue        
            this.getData()
        })
    },
    methods: {
        getXmqcList(data) {
            const params = {
                xmlx: data.xmlx,
                term: data.type,
                id: data.id
            }
            YearAPI.getXmxzList({ ...params }).then(res => {
                if(res.code == 200) {
                    this.xmqcList = res.data;
                    this.limitForm.xmsbxz = res.data.filter(each => each.isSelect).map(each => each.id)
                } else {
                    this.msgError('获取项目期次失败')
                }
            })
        },
        statusFilter(row){
            let status={
                0:'未启用',
                1:`当前项目${row.type=="year"?'年份':'期次'}`,
            }
            return status[row.state]
        },
        
        deleteHandle(row) {

            this.$confirm(
                '是否确认删除项目："' + row.value,
                "警告",
                {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
                }
            )
            .then(data => YearAPI.deleteTerm(row.id))
            .then(() => {
            this.getData();
            this.msgSuccess("删除成功");
        })
        },
        
        setThisYear(row) {
            const params = {
                id: row.id,
            }
            YearAPI.setIsavail(params).then(res => {
                if(res.code == 200) {
                    this.msgSuccess('设置成功')
                    this.getData();
                } else {
                    this.msgError(res.msg || '操作失败')
                }
            })
        },
        
        submitEdit() {
            const {id} = this.basicForm;
            let api
            if(id)
              api = YearAPI.editTerm(this.basicForm)
            else{
              api=  YearAPI.addTerm(this.basicForm)
            }
            api.then(res => {
                if(res.code == 200) {
                    this.msgSuccess('操作成功')
                    this.cancelBasic();
                    this.getData();
                } else {
                    this.msgError('操作失败' || res.msg)
                }
            })
        },
        
        // submitLimit() {
        //     console.log('limit', this.limitForm)
        //     const { id, xmsbxz } = this.limitForm;
        //     const params = { qcid: id, xmsbxz: xmsbxz.join(',') }
            
        //     YearAPI.addXmsz({...params}).then(res => {
        //         if(res.code == 200) {
        //             this.msgSuccess('操作成功');
        //             this.cancelLimit();
        //         } else {
        //             this.msgError(res.msg || '操作失败')
        //         }
        //     })
        // },
        
        // cancelLimit() {
        //     this.showLimit = false;
        // },
        cancelBasic() {
            this.showBasic = false;
        },
        
        setShow(type, data) {
            this.showBasic = true;
            switch(type) {
                case 'showBasic':
                    this.title="修改项目-"+data.value
                    this.basicForm = Object.assign({}, this.basicForm, { ...data })
                    break;
                case 'add':
                    this.basicForm = {...this.queryForm}
                    this.title="新增-"+this.selectDictLabel(this.termTypeList,this.queryForm.type)+'-'+this.selectDictLabel(this.xmlxList,this.queryForm.xmlx)
                    break;
                default:
                    break;
            }
        },
        
        getData() {
            const params = {
                type: this.queryForm.type,
                xmlx: this.queryForm.xmlx,
                pagesize: 10,
                page: 1
            }
            YearAPI.getData({...params}).then(res => {
                if(res.code == 200) {
                    this.listData = res.data;
                }
            })
        },
    }
}
</script>
<style></style>
