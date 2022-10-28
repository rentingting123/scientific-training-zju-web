<template>
    <div >
        <div class="app-container">
            <div class="header">
                <el-form :inline="true">
                    <el-form-item label="">
                        <el-form-item label="项目类型: ">
                            <el-select v-model="xmlx" placeholder="请选择项目类型" @change="getList2">
                                <el-option
                                v-for="item in lists1"
                                :key="item.dictValue"
                                :label="item.dictLabel"
                                :value="item.dictValue">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        
                        <el-form-item label="所属期次: ">
                            <el-select v-model="term" placeholder="请选择所属期次" >
                                <el-option
                                v-for="item in lists2"
                                :key="item.id"
                                :label="item.value"
                                :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item>
                            <el-button v-loading="addloading" v-if="data1.length<1" type="primary" @click="addHandle">
                                初始化期次配额
                            </el-button>
                        </el-form-item>
                    </el-form-item>

                    <el-form-item label="" style="display:block;">
                        <div class="sum">
                            共分配了 {{sum}} 个名额
                        </div>
                    </el-form-item>
                </el-form>
            </div>

            <div class="mainForm">
                <el-table border :data="data1" border>
                    <el-table-column prop="xymc" label="学院名称" min-width="180"></el-table-column>
                    <el-table-column prop="num" label="配额" min-width="80">
                        <template slot-scope="{row}">
                            <el-input v-model="row.num" type="number" />
                        </template>
                    </el-table-column>
                    <!-- <el-table-column prop="xmjf" label="项目经费（元/项）" min-width="180">
                        <template slot-scope="{row}">
                            <el-input v-model="row.xmjf" type="number" />
                        </template>
                    </el-table-column>
                    <el-table-column prop="xmjfze" label="项目经费总额（元）" min-width="180">
                        <template slot-scope="{row}">
                            <el-input v-model="row.xmjfze" type="number" />
                        </template>
                    </el-table-column> -->
                </el-table>
            </div>
        </div>
        <div class="footer">
            <el-button type="primary" @click="edit" v-loading='loading'>保存</el-button>
        </div>
    </div>
</template>

<script>
import { pexmqcList, xmpeList, updateXmpe,improtPE } from '@/api/jxsyscig/quota.js'
export default {
    data(){
        return{
            data1: [],
            addloading:false,
            lists1: [],
            lists2: [],
            xmlx: '',
            term: '',
            sum: 0,
            loading: false,

        }
    },
    created(){
        this.getDicts('xmpe_kllx').then(res=>{
            this.lists1 = res && res.data || []
            this.xmlx = this.lists1[0].dictValue
            this.getList2()
        })
    },
    methods:{
        addHandle(){
            this.addloading=true
            improtPE({xmlx:this.xmlx,qcbh:this.term}).then(res=>{
                this.msgSuccess(res.msg)
                this.addloading=false
                this.getData()
            }).catch(e=>{this.addloading=false})
        },
        getList2(){
            this.term = ''
            let query = {
                xmlx: this.xmlx,
            }
            pexmqcList(query).then(res=>{
                this.lists2 = res && res.data || []
                this.term = this.lists2[0]?.id
            })
        },
        getData(){
            xmpeList({
                xmlx: this.xmlx,
                term: this.term
            }).then(res=>{
                this.data1= res && res.data && res.data.list || []
                this.sum = res && res.data && res.data.sum || 0
            })
        },
        edit(){
            if(this.data1.length<1) return this.$message.warning('无数据，请核查！')
            this.loading = true
            updateXmpe(this.data1).then(res=>{
                this.loading = false
                this.getData()
            })
        }
    },
    watch:{
        xmlx(val){
            this.data1 = []
            if(this.xmlx && this.term){
                this.getData()
            }
        },
        term(val){
            this.data1 = []
            if(this.xmlx && this.term){
                this.getData()
            }
        }
    }
}
</script>

<style lang='scss' scoped>
.header{
    .sum{
        width: 100%;
        text-align: center;
        font-weight: bold;
    }
}
.mainForm{
    padding-bottom: 50px;
}
.footer{
    width: 100%;
    height: auto;
    padding: 10px 0 10px 100px;
    position: fixed;
    background: #dfe6ec;
    bottom: 0;
}


</style>