<template>
    <ul >
        <li v-for="item in datas" :key="item.id" @click="toDetail(item.id)">
            <span></span>
            <p class="dian">{{item.ggbt}}</p>
            <time>{{item.fbsj | date}}</time>
        </li>
    </ul>
</template>

<script>
import moment from 'moment'
export default {
    props: ['datas', 'type'],
    data(){
        return{

        }
    },
    methods:{
        toDetail(id){
             let query = {}
            if(this.type) query.type = this.type
            if(this.type == 11){
                this.$router.push({path:'/home/guide/'+id,query:query})
            }else if(this.type == 4){
                this.$router.push({path:'/home/ques/'+id,query:query})
            }else if(this.type == 5){
                this.$router.push({path:'/home/download/'+id,query:query})
            }else{
                this.$router.push({path:'/home/news/'+id,query:query})
            }
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
ul{
    width: 100%;
    height: auto;
    padding-top: 15px;
    padding-bottom: 10px;
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
            width: calc(100% - 60px);
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