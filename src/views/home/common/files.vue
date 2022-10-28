<template>
    <ul class="files">
        <li v-for="item in lists" :key="item.id" class="dian" @click="toDetails(item.id)">
            {{item.ggbt}}
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
            gglx: 4,
            pageNum: 1,
            pageSize: 1,
        }).then(res=>{
            this.lists = res && res.rows || []
        })
    },
    methods:{
        toDetails(id){
            this.$router.push('/home/news/'+id+'?type=3')
        }
    }
}
</script>

<style lang='scss' scoped>
.files{
    width: 100%;
    height: 100px;
    overflow: hidden;
    padding: 16px 0 15px;
    li{
        width: 100%;
        height: 59px;
        background: #EDEEF6;
        padding: 17px 13px 0;
        font-size: 14px;
        font-weight: 400;
        color: #4A4A4A;
        line-height: 14px;
        cursor: pointer;
        &:hover{
            color: #0041AB;
        }
    }
}
</style>