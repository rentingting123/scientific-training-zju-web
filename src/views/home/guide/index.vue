<template>
    <div class="guide">
        
        <div class="middle">
            <titles title='指南流程'/>
            <tonggaolist :datas='lists' type='11' />
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
           <div class="box">
                <h title="常见问题"  :more='true' path='/home/ques'></h>
            <links  type="4" :size="2"  />
            </div>
            <div class="box">
                <h title="相关链接" :more='true'  path='/home/aboutlink'></h>
            <links type="9" :size="2" />
            </div>
            <div class="box">
                <h title="相关下载" :more='true'  path='/home/download'></h>
            <links type="5" :size="2" />
            </div>
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
import tonggaolist from '../common/tonggaolist'
import titles from '../common/titles'

export default {
    components:{
        h,
        questions,
        files,
        links,
        tonggaolist,
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
                pageNum: this.pageNum,
                pageSize: this.pageSize,
                 noticeType: 11,
                target:2
            }).then(res=>{
                this.lists = res && res.rows || []
                this.total = res && res.total || 0
            })
        }
    }
}
</script>

<style lang='scss' scoped>
.box{
            margin-bottom: 24px;
        }
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
        width: 100%;
        // width: 840px;
    background: #fff;
     height: 100%; 
    min-height: 700px;
    border-radius: 4px;
    padding: 24px;
    }
}
</style>