<template>
    <div class="jjxy">
        <el-table border :data="datas" border style="width: 100%">
            <el-table-column prop="xiangmumc" label="项目名称" min-width="180"></el-table-column>
            <el-table-column prop="ncz" label="年产值(万元)" min-width="100"></el-table-column>
            <el-table-column prop="nls" label="年利税(万元)" min-width="100"></el-table-column>
            <!-- <el-table-column prop="operate" label="操作" min-width="100">
                <template slot-scope="{row}">
                    <edit v-bind="$attrs" :id='row.id' />
                    <el-button size='mini' type='danger' @click="del(row)">删除</el-button>
                </template>
            </el-table-column> -->
        </el-table>
    </div>
</template>

<script>
import network from '@/api/results'

import edit from './jjxyAdd'
export default {
     props:['nf','xmmc'],
    components:{
        edit
    },
    data(){
        return{
            datas: [],
        }
    },
    created(){
        this.getLists()
    },
    methods:{
        getLists(){
            network.getJjxyCqist({id:this.$route.params.id}).then(res=>{
                this.datas = res && res.data || []
            })
        },
        del(row){
            this.$confirm('删除后无法恢复，请确认是否删除','提示',{
                confirmButtonText:'确定',
                cancelButtonText:'取消',
            }).then(()=>{
                network.delJjxyCq({id: row.id, cglb: 7}).then(res=>{
                    this.msgSuccess('操作成功')
                    this.getLists()
                })
            }).catch(()=>{})
        }
    }
}
</script>

<style lang='scss' scoped>

</style>