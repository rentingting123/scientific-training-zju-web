<template>
    <ul class="links">
        <li v-for="item in lists" :key="item.id" @click="toDetails(item)">
            <p class="dian">{{item.name}}</p>
            <img src="../assets/icon_link.png" alt="">
        </li>
    </ul>
</template>

<script>
import network from "@/api/jxNotice/cc";
export default {
     props: ["type", "size", "newsType"],
    data(){
        return{
            lists: [],
            queryParams:{}
        }
    },
    created(){

    let params = Object.assign({},{
        pageSize: this.size,
        type: this.type == 0 ? undefined : this.type,
        newsType: this.newsType
      });
        network.getCCNewsList(params).then(res=>{
            this.lists = res && res.rows || []
        })
    },
    methods:{
        toDetails(item){
            this.$router.push("/home/ccNews/" + item.id + "?type=" + item.type);
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
        height: 50px;
        padding: 0 17px 0 26px;
        font-size: 15px;
        font-weight: 400;
        color: #2A2A2A;
        line-height: 50px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: #EDEEF6;
        cursor: pointer;
        img{
            width: 16px;
            height: auto;
        }
        p{
            margin: 0;
            padding: 0;
        }
        &:hover{
            p{
                color: #0041AB;
            }
        }
    }
}
</style>