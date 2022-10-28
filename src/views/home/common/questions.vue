<template>
    <ul class="questions">
        <li v-for="item in lists" :key="item.id" @click="toDetails(item.id)">
            <img src="../assets/icon_question.png" alt="" srcset="">
            <p class="dian">{{item.ggbt}}</p>
            <time>{{item.fbsj | date}}</time>
        </li>
    </ul>
</template>

<script>
import moment from 'moment'
import network from '@/api/jxNotice/index'
export default {
    props:['type','size'],
    data(){
        return{
            lists:[]
        }
    },
    created(){
        // 1 重点提示, 2 常见问题, 3 新闻动态, 4 相关文件, 5 相关下载, 6 指南流程, 7 成果展示, 8 相关链接, 9 科研训练
        network.getMhyggList({
            gglx: this.type||2,
            pageNum: 1,
            pageSize: this.size||8,
        }).then(res=>{
            this.lists = res && res.rows || []
        })
    },
    methods:{
        toDetails(id){
            this.$router.push('/home/news/'+id+'?type='+this.type||2)
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
.questions{
    width: 100%;
    max-height: 311px;
    padding-top: 16px;
    padding-bottom: 7px;
    overflow: hidden;
    li{
        width: 100%;
        height: 16px;
        display: flex;
        margin-bottom: 20px;
        cursor: pointer;
        img{
            display: inline-block;
            vertical-align: middle;
            width: 11px;
            height: 11px;
            margin-right: 12px;
        }
        p{
            display: inline-block;
            vertical-align: middle;
            width: 245px;
            flex:1;
            height: 16px;
            font-size: 16px;
            font-weight: 400;
            color: #4A4A4A;
            line-height: 16px;
        }
        time{
            display: inline-block;
            vertical-align: middle;
            width: 40px;
            height: 12px;
            font-size: 12px;
            font-weight: 400;
            color: #999999;
            line-height: 18px;
            text-align: right;
        }
        &:hover{
            p, time{
                color: #0041AB;
            }
        }
    }

}
</style>