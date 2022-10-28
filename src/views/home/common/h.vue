<template>
    <h2>
        <div>
            <img src="../assets/yellowtit.png" class="icon">
            <!-- <img :src="url" v-if="url" class="title"> -->
            <span style="font-size: 18px;">{{title}}</span>
        </div>
        <span class="more" v-if="more" @click="toMore">查看更多<i class="el-icon-arrow-right"></i></span>
    </h2>
</template>

<script>
export default {
    props: ['title', 'more', 'path'],
    data(){
        return{

        }
    },
    // computed:{
    //     url(){
    //         let str = ''
    //         if(this.title == '常见问题'){
    //             str = require('../assets/1.png')
    //         }else if(this.title == '相关文件'){
    //             str = require('../assets/2.png')
    //         }else if(this.title == '相关链接'){
    //             str = require('../assets/3.png')
    //         }else if(this.title == '重点提示'){
    //             str = require('../assets/4.png')
    //         }else if(this.title == '科研训练、科研实践'){
    //             str = require('../assets/5.png')
    //         }else if(this.title == '新闻动态'){
    //             str = require('../assets/6.png')
    //         }else if(this.title == '成果展示'){
    //             str = require('../assets/7.png')
    //         }else if(this.title == '学科竞赛'){
    //             str = require('../assets/8.png')
    //         }else if(this.title == '竞赛基地'){
    //             str = require('../assets/9.png')
    //         }
    //         else if(this.title == '校级竞赛'){
    //             str = require('../assets/11.png')
    //         }else if(this.title == '省级竞赛'){
    //             str = require('../assets/12.png')
    //         }else if(this.title == '国家级竞赛'){
    //             str = require('../assets/13.png')
    //         }else if(this.title == '国际级竞赛'){
    //             str = require('../assets/14.png')
    //         }
    //         return str
    //     }
    // },
    methods:{
        toMore(){
            this.path && this.$router.push(this.path);
        }
    }
}
</script>

<style lang='scss' scoped>
h2{
    margin: 0;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #001B57;
    >div{
            color: #0041AB;
    display: flex;
    align-items: center;
    font-size: 18px;
    justify-content: flex-start;
    }
    .icon{
        width: 28px;
        margin-left: -6px;
    height: 28px;
    margin-right: 5px;
    }
    .title{
        width: auto;
        height: 26px;
        padding: 4px 0;
    }
    .more{
               cursor: pointer;
    font-size: 12px;
    font-weight: 400;
    display: inline-block;
    color: #0041AB;
    line-height: 18px;
    margin-right: 15px;
    }
}
</style>