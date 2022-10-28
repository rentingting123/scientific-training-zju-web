<template>
    <div class="bylw">
        <el-table border :data="datas" style="width: 100%">
            <el-table-column prop="xiangmumc" label="项目名称" min-width="180"></el-table-column>
            <el-table-column prop="bylwsj" label="与“毕业论文（设计）”、学科竞赛等其它学习环节结合情况描述" min-width="100"></el-table-column>
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
import edit from './bylwAdd'
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
            network.getBylwList(params).then(res=>{
                 this.datas = res && res.rows || []
                 cb&&cb(res.total)
            })
        },
        del(row){
            this.$confirm('删除后无法恢复，请确认是否删除','提示',{
                confirmButtonText:'确定',
                cancelButtonText:'取消',
            }).then(()=>{
                network.delBylw({id: row.id}).then(res=>{
                     this.msgSuccess('操作成功')
                    this.cgList()
                })
            }).catch(()=>{})
        }
    }
}
</script>

<style lang='scss' scoped>

</style>