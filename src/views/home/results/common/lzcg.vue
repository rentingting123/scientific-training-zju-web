<template>
    <div class="lzcg">
        <el-table border :data="datas" border style="width: 100%">
            <el-table-column prop="xiangmumc" label="项目名称" min-width="100"></el-table-column>
            <el-table-column prop="lunzhumc" label="论著名称" min-width="100"></el-table-column>
            <el-table-column prop="zuozhe" label="主要作者" min-width="100"></el-table-column>
            <el-table-column prop="chubansj" label="出版时间" min-width="100"></el-table-column>
            <el-table-column prop="zishu" label="字数(万字)" min-width="100"></el-table-column>
            <el-table-column prop="chubanshe" label="出版社" min-width="200"></el-table-column>
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

import edit from './lzcgAdd'
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
            network.getLzcgList({id:this.$route.params.id}).then(res=>{
                this.datas = res && res.data || []
            })
        },
        del(row){
            this.$confirm('删除后无法恢复，请确认是否删除','提示',{
                confirmButtonText:'确定',
                cancelButtonText:'取消',
            }).then(()=>{
                network.delLzcg({id: row.id}).then(res=>{
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