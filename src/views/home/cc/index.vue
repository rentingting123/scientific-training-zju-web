<template>
    <div class="news">
      
        <div class="middle">
            <!-- <titles path='/home/cc' title='学科竞赛'/> -->
            <div class="box">
                <h title="通知公告" :more='true' path='/home/cc/0?newsType=8'></h>
                <ccNews newsType='8' size="5" />
            </div>
        <div class="middleBottom"> 
        <div>
             <div class="box">
                 <h title="校级竞赛" :more='true' path='/home/cc/0?newsType=4'></h>
            <ccNews newsType='4' size="5" />
             </div>
             <div class="box">
                 <h title="国家级竞赛" :more='true' path='/home/cc/0?newsType=2'></h>
           <ccNews newsType='2' size="5" />
             </div>
        </div>
        <div style="margin-left:20px">
             <div class="box">
                 <h title="省级竞赛" :more='true' path='/home/cc/0?newsType=3'></h>
            <ccNews newsType='3' size="5" />
             </div>
             <div class="box">
                 <h title="国际级竞赛" :more='true' path='/home/cc/0?newsType=1'></h>
            <ccNews newsType='1' size="5" />
             </div>
        </div>
        </div>
         </div>
           <div class="left">
            <h title="成果展示" :more='true' path='/home/cc/0?newsType=5'></h>
            <ccNews newsType='5' size="5" />
            <h title="竞赛基地" :more='true' path='/home/cc/0?newsType=6'></h>
            <links newsType='6' size="5" />
        </div>
    </div>
</template>


<script>
import h from '../common/h'
import ccNews from '../common/ccNewsList'
import links from '../common/cclinks'
import titles from '../common/titles'

export default {
    components:{
        h,
        ccNews,
        links,
        titles,
    },
    data(){
        return{
           
            total: 0,
            pageNum: 1,
            pageSize: 5,
        }
    },
    created(){       
    },
    methods:{
    }
}
</script>

<style lang='scss' scoped>
.box{
        background: #fff;
    padding: 24px;
    border-radius: 4px;
    margin-bottom: 24px;
}
.news{
    width: 1200px;
    flex:1;
    margin: 24px auto 31px;
    >div{
        display: inline-block;
        vertical-align: top;
    }
    .left{
           width: 335px;
    background: #fff;
    padding: 24px;
    border-radius: 4px;
    margin-left: 24px;
    }
    .middle{
        width: 840px;
        padding-left: 20px;
        height: 100%;
    }
    .middleBottom{
        display: flex;
        justify-content: space-between;
        div{
            flex:1
        }
    }
}
</style>