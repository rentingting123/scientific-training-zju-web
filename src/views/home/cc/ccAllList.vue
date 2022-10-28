<template>
    <div class="guide">
        
        <div class="middle">
            <titles title='资讯搜索'/>
            <tonggaolist :datas='lists' />
            <!-- <h title="通知公告" :more='true' path='/home/cc/0?newsType=8'></h> -->
                <!-- <ccNews newsType='8' type='0' size="5" /> -->
           <el-pagination
      @current-change="handleCurrentChange"
      :page-size="pageSize"
      style="text-align:center"
      layout=" prev, pager, next"
      :total="total">
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
import tonggaolist from '../common/searchList'
// import network from '@/api/jxNotice/index'
import lists from '../common/ccNewsList'
import titles from '../common/titles'
import network from "@/api/jxNotice/cc";

export default {
    components:{
        h,
        questions,
        files,
        links,
        lists,
        tonggaolist,
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
    watch:{
  $route(to,from){
    this.getList()
  }
},
    methods:{
         handleCurrentChange(val) {
        this.pageNum = val
        this.getList()
      },
        getList(){
            network.searchNews({
                pageNum: this.pageNum,
                pageSize: this.pageSize,
                target:2,
                name:this.$route.query.searchValue
            }).then(res => {
               this.total =  res.total
                this.lists = res.rows
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