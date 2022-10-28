<template>
    <div class="zlcg">
        <el-table border :data="datas" style="width: 100%">
            <el-table-column prop="xiangmumc" label="项目名称" min-width="180"></el-table-column>
            <el-table-column prop="zllb" label="专利类别" min-width="100">
                <template slot-scope="{row}">
                    <p v-if="row.zllb==1">发明专利</p>
                    <p v-else-if="row.zllb==2">实用新型专利</p>
                    <p v-else-if="row.zllb==3">外观设计专利</p>
                    <p v-else-if="row.zllb==4">软件著作权</p>
                </template>
            </el-table-column>
            <el-table-column prop="sfbks" label="第一作者是否是本科生" min-width="100">
                <template slot-scope="{row}">
                    <p>{{row.sfbks==1?'是':'否'}}</p>
                </template>
            </el-table-column>
            <el-table-column prop="zhuanlimc" label="专利名称" min-width="100"></el-table-column>
            <el-table-column prop="shenqingr" label="申请人或专利权人" min-width="100"></el-table-column>
            <el-table-column prop="famingr" label="发明人" min-width="100"></el-table-column>
            <el-table-column prop="shenqingh" label="申请号或授权号" min-width="100"></el-table-column>
            <el-table-column prop="zhuanligb" label="专利国别" min-width="100"></el-table-column>
            <el-table-column prop="shenqingrq" label="申请日" min-width="100"></el-table-column>
            <el-table-column prop="shouquanrq" label="授权日" min-width="100"></el-table-column>
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
import edit from './zlcgAdd'
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
            network.getZlcgList(params).then(res=>{
                 this.datas = res && res.rows || []
                cb&&cb(res.total)
            })
        },
        del(row){
            this.$confirm('删除后无法恢复，请确认是否删除','提示',{
                confirmButtonText:'确定',
                cancelButtonText:'取消',
            }).then(()=>{
                network.delZlcg({id: row.id}).then(res=>{
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