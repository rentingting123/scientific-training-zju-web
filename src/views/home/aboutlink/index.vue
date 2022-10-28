<template>
    <div class="guide">
        
        <div class="middle">
            <titles title='相关链接'/>
            <tonggaolist :datas='lists' type='9' />
            <el-pagination 
                style="text-align:center" 
                layout="prev, pager, next" 
                :total="total"
                :current-page.sync="pageNum"
                :page-size="pageSize"
                @current-change='getList'
                hide-on-single-page>
            </el-pagination>
        </div>
        <!-- <div class="left">
            <h title="常见问题" :more='true' path='/'></h>
            <links  type="2" :size="2" />
            <h title="相关文件"  style="margin-top:24px" path='/'></h>
            <links  type="4" :size="2" />
            <h title="相关链接" style="margin-top:24px"  ></h>
            <links  type="8" :size="2" />
        </div> -->
    </div>
</template>


<script>
import h from '../common/h'
import questions from '../common/questions'
import files from '../common/files'
import links from '../common/links'
import network from '@/api/jxNotice/cc'
import lists from '../common/lists'
import titles from '../common/titles'
import tonggaolist from '../common/tonggaolist2'

export default {
    components:{
        h,
        tonggaolist,
        questions,
        files,
        links,
        lists,
        titles,
    },
    data(){
        return{
            lists: [],
            total: 0,
            pageNum: 1,
            pageSize: 20,
        }
    },
    created(){
        this.getList();
    },
    methods:{
        getList(){
            // 1 重点提示, 2 常见问题, 3 新闻动态, 4 相关文件, 5 相关下载, 6 指南流程, 7 成果展示, 8 相关链接, 9 科研训练
            network.getMhyggList({
                 noticeType: 9,
                pageNum: this.pageNum,
                pageSize: this.pageSize,
                 target:2
            }).then(res=>{
                this.lists = res && res.rows || []
                this.total = res && res.total || 0
            })
        },
        
    }
}
</script>

<style lang='scss' scoped>
.guide{
    width: 1200px;
    height: 857px;
    margin: 24px auto 31px;
    >div{
        display: inline-block;
        vertical-align: top;
    }
    .left{
           width: 335px;
    padding: 24px;
    background: #fff;
    /* border-right: 1px solid #DADADA; */
    // height: 100%;
    margin-left: 24px;
    border-radius: 4px;
    }
    .middle{
        // width: 840px;
        width: 100%;
    background: #fff;
     height: 100%; 
    min-height: 700px;
    border-radius: 4px;
    padding: 24px;
    }
}
</style>