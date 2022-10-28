<template>
    <ul>
        <li v-for="item in lists" :key="item.id" @click="toDetails(item.id)">
            <div class="news">
                <img v-if="item.img" :src="item.img" class="img">
                <img v-else src="@/views/home/assets/nullpic.jpg" class="img" alt="">
                <div>
                    <span class="dian">{{item.title}}</span>
                    <time>{{item.releaseTime | date}}</time>
                </div>
            </div>
        </li>
    </ul>
    
</template>

<script>
import network from '@/api/jxNotice/cc'
import moment from 'moment'
export default {
    data(){
        return{
            lists:[]
        }
    },
    created(){
        // 1 重点提示, 2 常见问题, 3 新闻动态, 4 相关文件, 5 相关下载, 6 指南流程, 7 成果展示, 8 相关链接, 9 科研训练
        network.getMhyggList({
             noticeType:6,
            pageNum: 1,
            pageSize:1,
             target:2
        }).then(res=>{
            this.lists = res && res.rows || []
        })
    },
    methods:{
        toDetails(id){
            this.$router.push('/home/news/'+id+'?type=7')
        }
    },
    filters:{
        date(val){
            if(!val) return '';
            return moment(val).format('MM-DD')
        }
    }
}
</script>

<style lang='scss' scoped>
li{
    cursor: pointer;
}
.news{
        width: 252px;
    height: 170px;
    border-radius: 13px;
    overflow: hidden;
    position: relative;
    margin: 0px 0 24px;
    .img{
        width: 100%;
        height: 100%;
    }
    >div{
        width: 100%;
        height: auto;
        padding: 10px 10px;
        background: rgba(0,0,0,.2);
       
        position: absolute;
        bottom: 0;
        left: 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
        span{
             width: 75%;
            display: inline-block;
            font-size: 14px;
            font-weight: 400;
            color: #FFFFFF;
            line-height: 14px;
        }
        time{
            width: 34px;
            height: 14px;
            font-size: 12px;
            font-weight: 400;
            color: #FFFFFF;
            line-height: 14px;
        }
    }
}
</style>