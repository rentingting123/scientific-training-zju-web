<template>
    <ul >
        <li >首页 </li>
        <li v-if="title" :class="{'on': !title1}" @click="toPath"> / {{title}}</li>
        <li v-if="title1" :class="{'on': title1}"> / {{title1}}</li>
        <li v-if="back" @click="toback" class="back">返回</li>
    </ul>
</template>

<script>
export default {
    props: ['title', 'title1', 'back', 'path'],
    data(){
        return{

        }
    },
    methods:{
        toPath(){
            if(!this.path || !this.title1) return;
            this.$router.push(this.path)
        },
        toback(){
            this.$router.back(-1)
        }
    }
}
</script>

<style lang='scss' scoped>
ul{
    width: 100%;
    padding: 3px 0 11px;
    border-bottom: 2px solid #EAAF23;
    li{
        font-size: 14px;
        font-weight: 400;
        color: rgba(0, 0, 0, 0.45);
        line-height: 22px;
        display: inline-block;
        vertical-align: middle;
        &.on{
            color: rgba(0, 0, 0, 0.65);
            cursor: pointer;
        }
        &.back{
            color: rgba(0, 0, 0, 0.75);
            float: right;
            cursor: pointer;
        }
    }
}
</style>