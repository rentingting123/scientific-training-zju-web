<template>
    <ul class="links">
        <li v-for="item in lists" :key="item.id" @click="toDetails(item.id,item.url)">
            
                 <img style="width:10px; height:14px; vertical-align: middle;" src="../assets/shape.png" alt="">
                <p class="dian" :title="item.title">{{item.title}}</p>
            <div><img src="../assets/linkss.png" alt=""></div>
        </li>
    </ul>
</template>

<script>
import network from '@/api/jxNotice/cc'
// import NewsAPI from "@/api/cc";
import NewsAPI from '@/api/jxNotice/index'
import util from '@/utils/jxUtil'
export default {
    props:['type','size'],
    data(){
        return{
            lists: []
        }
    },
    created(){
        // 1 重点提示, 2 常见问题, 3 新闻动态, 4 相关文件, 5 相关下载, 6 指南流程, 7 成果展示, 8 相关链接, 9 科研训练
        this.getlist()
       
    },
    methods:{
        getlist(){
             network.getMhyggList({
            noticeType: this.type,
            pageNum: 1,
            pageSize: this.size,
             target:2
        }).then(res=>{
            this.lists = res && res.rows || []
        })
        },
        toDetails(id,url){
            if(url){
                window.open(url,"_self")
            }else 
            if(this.type == 9){
                 NewsAPI.mhyxtggDetail(id).then((res) => {
                 window.open(util.removeHtmlTag(res.data.content),"_self")
                });
            }else if(this.type == 4){
                this.$router.push('/home/ques/'+id+'?type='+this.type)
            }else{
                this.$router.push('/home/news/'+id+'?type='+this.type)
            }
            
            
        }
    }
}
</script>

<style lang='scss' scoped>
.links{
    width: 100%;
    // height: 329px;
    overflow: hidden;
    li{
           margin-top: 16px;
    width: 100%;
    height: 38px;
    padding: 0 16px 0 16px;
    font-size: 14px;
    font-weight: 400;
    color: #333333;
    display: flex;
    align-items: center;
        justify-content: space-between;
    background: #F3F3F3;
    cursor: pointer;
    border-radius: 11px;
        &:nth-child(1){
            margin-top: 0;
        }
        img{
            width: 16px;
            height: auto;
            vertical-align: bottom;
        }
        p{
               width: 100%;
    margin: 0;
    padding-left: 10px;
        }
        &:hover{
            p{
                color: #0041AB;
            }
        }
    }
}
</style>