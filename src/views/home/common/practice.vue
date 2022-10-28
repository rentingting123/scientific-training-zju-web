<template>
    <ul class="links">
        <li v-for="(item,index) in lists" :key="item.id" :class="getClass(index)" @click="toDetails(item.id)">
            <p class="dian">{{item.ggbt}}</p>
            <img src="../assets/icon_link.png" alt="">
        </li>
    </ul>
</template>

<script>
import network from '@/api/jxNotice/index'
export default {
    data(){
        return{
            lists: []
        }
    },
    created(){
        // 1 重点提示, 2 常见问题, 3 新闻动态, 4 相关文件, 5 相关下载, 6 指南流程, 7 成果展示, 8 相关链接, 9 科研训练
        network.getMhyggList({
            gglx: 9,
            pageNum: 1,
            pageSize: 5,
        }).then(res=>{
            this.lists = res && res.rows || []
        })
    },
    methods:{
        getClass(i){
            return 'bg'+i
        },
        toDetails(id){
            this.$router.push('/home/news/'+id+'?type=6')
        }
    }
}
</script>

<style lang='scss' scoped>
.links{
    width: 100%;
    height: 329px;
    overflow: hidden;
    li{
        margin-top: 16px;
        width: 100%;
        height: 49px;
        padding: 0 17px 0 26px;
        font-size: 15px;
        font-weight: 400;
        color: #2A2A2A;
        line-height: 49px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border: 1px solid #DADADA;
        border-left: 6px solid #0041AB;
        cursor: pointer;
        img{
            width: 16px;
            height: auto;
        }
        p{
            margin: 0;
            padding: 0;
        }
        &.bg1{
            border-left: 6px solid #6275FF;
        }
        &.bg2{
            border-left: 6px solid #3DA1FF;
        }
        &.bg3{
            border-left: 6px solid #00AA91;
        }
        &.bg4{
            border-left: 6px solid #FFD700;
        }
        &:hover{
            p{
                color: #0041AB;
            }
        }
    }
}
</style>