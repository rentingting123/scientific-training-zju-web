<template>
    <div  class="hjcg">
        <el-table border :data="datas" style="width: 100%">
            <el-table-column prop="xiangmumc" label="项目名称" min-width="180"></el-table-column>
            <el-table-column prop="huojiangcgmc" label="获奖成果名称" min-width="100"></el-table-column>
            <el-table-column prop="wanchengr" label="主要完成人" min-width="100"></el-table-column>
            <el-table-column prop="shoujiangdw" label="授奖单位" min-width="100"></el-table-column>
            <el-table-column prop="jianglimc" label="奖励名称" min-width="100"></el-table-column>
            <el-table-column prop="dengji" label="等级" min-width="100">
                <template slot-scope="{row}">
                    <p v-if="row.dengji==1">国家级奖项</p>
                    <p v-else-if="row.dengji==2">省级奖项</p>
                    <p v-else-if="row.dengji==3">市级奖项</p>
                    <p v-else-if="row.dengji==4">校级奖项</p>
                </template>
            </el-table-column>
            <el-table-column prop="riqi" label="日期" min-width="100"></el-table-column>
            <el-table-column prop="operate" label="操作" min-width="100">
                <template slot-scope="{row}">
                    <edit v-bind="$attrs" :id='row.id' />
                    <el-button size='mini' type='danger' @click="del(row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
import network from '@/api/jxStuProject/result'
import edit from './hjcgAdd'
export default {
    props:['cgList'],
    components:{
        edit
    },
    data(){
        return{
            datas: [],
        }
    },

    methods:{
        getLists(params,cb){
            network.getHjcgList(params).then(res=>{
                 this.datas = res && res.rows || []
                cb&&cb(res.total)
            })
        },
        del(row){
            this.$confirm('删除后无法恢复，请确认是否删除','提示',{
                confirmButtonText:'确定',
                cancelButtonText:'取消',
            }).then(()=>{
                network.delHjcg({id: row.id}).then(res=>{
                     this.msgSuccess('操作成功')
                    this.cgList()
                    this.getLists()
                })
            }).catch(()=>{})
        }
    }
}
</script>

<style lang='scss' scoped>

</style>