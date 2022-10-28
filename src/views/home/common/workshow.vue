<template>
    <ul class="workshow">
        <li v-for="item in lists" :key="item.id" @click="toDetails(item.id)">
            <span></span>
            <p class="dian">{{item.ggbt}}</p>
            <time>{{item.fbsj | date}}</time>
        </li>
    </ul>
</template>

<script>
import network from '@/api/jxNotice/index'
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
            gglx: 7,
            pageNum: 1,
            pageSize: 4,
        }).then(res=>{
            this.lists = res && res.rows || []
        })
    },
    methods:{
        toDetails(id){
            this.$router.push('/home/news/'+id+'?type=8')
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
.workshow{
    width: 100%;
    height: 166px;
    padding-top: 16px;
    padding-bottom: 7px;
    overflow: hidden;
    li{
        width: 100%;
        height: 16px;
        margin-bottom: 20px;
        cursor: pointer;
        span{
            display: inline-block;
            vertical-align: middle;
            width: 3px;
            height: 3px;
            background: #000000;
            margin-right: 11px;
        }
        p{
            display: inline-block;
            vertical-align: middle;
            width: 253px;
            height: 16px;
            font-size: 16px;
            font-weight: 400;
            color: #4A4A4A;
            line-height: 16px;
            overflow: hidden;
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