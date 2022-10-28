<template>
    <div class="banner">
        <div>
             <!-- <div v-hasPermi="['sys:has:preview']" class="yindaobtn"  @click="openproview()">
                <i class="el-icon-arrow-left" style="letter-spacing: -8px;"></i><i style="    letter-spacing: -8px;" class="el-icon-arrow-left"></i> 返回引导页
            </div> -->
            <div class="left">
                
               <img style="width:100%;height:100%;margin:0" v-if="$store.getters.scSetting.homeLogo" :src="$store.getters.scSetting.homeLogo" >
               <img style="width:100%;height:100%;margin:0" v-else src="../assets/2022106logo.png" >
            </div>
            <!-- <div class="left">
                
                <div style="width: 161px;height: 59px;">
                    <img style="width:100%;height:100%;margin:0" src="../assets/2022106logo.png" class="logo">
                </div>
               <div>
                    <div style="font-size:42px;color:#fff;letter-spacing: 7px;">
                    本科生科研训练系统
                </div>
                <div style="font-size:16px;color:#fff;letter-spacing: 4px;">
                    undergraduate  research  training  system 
                </div>
               </div>
            </div> -->
            <div>
                <el-input placeholder="请输入关键字" v-model="name" @keyup.enter.native="search">
                    <img slot="append" class="search" src="../assets/search.png" @click="search">
                </el-input>
                <img style="cursor: pointer;" @click="searchPage()" src="../assets/searchPic.png" >
            </div>
        </div>
    </div>
</template>

<script>
import config from '@/settings'
export default {
    data(){
        return{
            name: ''
        }
    },
    methods:{
        searchPage(){
            this.$router.push('/home/sc')
        },
        openproview(){
            location.href=config.PREVIEWHOST
            //window.open('http://kyjs.zju.edu.cn/kyjs/#/preview',"_self")
        },
        search(){
            // console.log('/home/cc/0?newsType=all&searchValue='+this.name);
            this.$router.push('/home/cc/0?newsType=all&searchValue='+this.name)
        }
    }
}
</script>

<style lang='scss' scoped>
.banner{
    width: 100%;
    height: 200px;
    
    background: url('../assets/keyanbanner.png');
    background-size: cover;
    display: flex;
    align-items: center;
     .yindaobtn{
        width: 100px !important;
    position: absolute;
    border-radius: 4px;
    background-color: #fff;
    color: rgb(12, 73, 174);
    top: 156px;
    line-height: 24px;
    font-size: 14px;
    padding: 0 5px;
    cursor: pointer;
    height: 24px;
    font-weight: 800;
}
    .left{
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 53%;
        position: relative;
    }
    >div{
        width: 1200px;
        margin: 0 auto;
        display: flex;
        justify-content: space-between;
        align-items: center;
        >div{
           width: 238px;
           height: auto;
            img{
               width: 100%;
               height: auto;
               margin-top: 14px;
            } 
        }
    }
    ::v-deep .el-input-group__append{
        background: #F4BD9D;
        .search{
            width: 18px;
            height: auto;
            vertical-align: middle;
            margin-top: 0;
            cursor: pointer;
        }
    }
}
</style>