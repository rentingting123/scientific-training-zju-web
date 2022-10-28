<template>
    <div class="lwcg">
        <el-table border :data="datas" style="width: 100%">
            <el-table-column prop="xiangmumc" label="项目名称" min-width="180"></el-table-column>
            <el-table-column prop="zuozhe" label="主要作者" min-width="100"></el-table-column>
            <el-table-column prop="lunwenmc" label="论文名称" min-width="100"></el-table-column>
            <el-table-column prop="qikanwenji" label="期刊名称﹑年﹑卷﹑期﹑页或论文集名称出版社﹑页" min-width="100"></el-table-column>
            <el-table-column prop="shouluqk" label="论文被引用情况或三大索引收录情况" min-width="100"></el-table-column>
            <el-table-column prop="lb" label="类别" min-width="100"></el-table-column>
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
import edit from './lwcgAdd'
export default {
    props:['cgList'],
    components:{
        edit
    },
    data(){
        return{
            datas: []
        }
    },
    methods:{
        getLists(params,cb){
            network.getLwcgList(params).then(res=>{
                 this.datas = res && res.rows || []
                 cb&&cb(res.total)
            })
        },
        del(row){
            this.$confirm('删除后无法恢复，请确认是否删除','提示',{
                confirmButtonText:'确定',
                cancelButtonText:'取消',
            }).then(()=>{
                network.deldoc({id: row.id}).then(res=>{
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