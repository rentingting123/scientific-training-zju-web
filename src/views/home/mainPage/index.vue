<template>
    <div class="main">
        <div class="mainPage">
            <div>
                <div class="box_left">
                <div class="left_box">
                         <h title="通知公告" :more='true' path='/home/announcement'></h>
                <tonggaolist :datas='lists' type='14' />
             
                </div>
                   <div class="box_right">
            <!-- <div class="box">
                <h title="新闻动态" :more='true' path='/home/news'></h>
                <news />
            </div> -->
             <!-- <div class="box">
                <h title="常见问题"  :more='true' path='/home/ques'></h>
            <div>
                <links  type="4" :size="4"  />
            </div> -->
            <!-- </div> -->
            <div class="box">
                <h title="相关链接" :more='true'  path='/home/aboutlink'></h>
                <div style="    background: #fff;height:251px;padding: 22px 15px;">
                    <links type="9" :size="4" />
                </div>
            </div>
           
        </div>
            </div>
              
            </div>
          <div class="down_box">
                    <div class="down_box_left">
                     <h title="科研训练" :more='true' path='/home/scsc'></h>
                     <div class="keyan">
                         <div class="chaungye">
                             <div class="tit" @click="toPath(null,1)">国创</div>
                             <div class="chuang">
                                 <div class="con" v-for="(item,index) in list1" @click="toPath(item.id,item.xmlx)" :key="index">{{item.value}}</div>
                             </div>
                         </div>
                         <div class="chaungye">
                             <div class="tit" @click="toPath(null,2)">省创</div>
                             <div class="chuang">
                             <div class="con" v-for="(item,index) in list2"  @click="toPath(item.id,item.xmlx)" :key="index">{{item.value}}</div>
                         </div>
                         </div>
                         <div class="chaungye">
                             <div class="tit"  @click="toPath(null,4,41)">校级SRTP</div>
                             <div class="chuang">
                             <div class="con" v-for="(item,index) in list3" @click="toPath(item.id,item.xmlx,41)"  :key="index">{{item.value}}</div>
                         </div>
                         </div>
                         <div class="chaungye">
                             <div class="tit"  @click="toPath(null,4,42)">院级SRTP</div>
                             <div class="chuang">
                             <div class="con" v-for="(item,index) in list4"  @click="toPath(item.id,item.xmlx,42)" :key="index">{{item.value}}</div>
                         </div>
                         </div>
                     </div>
                    </div>
                    <div class="down_box_right">
                        <div class="top">
                            <h title="科研实践" :more='true' path='/home/scsc' xmlx='3'></h>
                            <div class="shijian">
                                <div class="qc" v-for="(item,index) in list5"   @click="toPath(item.id,item.xmlx)" :key="index">{{item.value}}</div>
                            </div>
                        </div>
                        <div class="down">
                             <h title="其它" :more='true' path='/home/scsc' xmlx='5'></h>
                           <div style="width:100%;padding:16px;background:#fff">
                                 <div class="xietong" @click="toPath(51,5,1)">
                                <div class="qc">
                                    科教协同</div>
                            </div>
                           </div>
                             <!-- <div class="xietong"   @click="toPath(52,5,1)">
                                <div class="qc"   >
                                    中控教育基金项目</div>
                            </div> -->
                        </div>
                    </div>
                </div>
        </div>
     
    </div>
</template>


<script>
import h from '../common/h1'
import questions from '../common/questions'
import files from '../common/files'
import links from '../common/links'
import tonggaolist from '../common/tonggaolist1'
import tips from '../common/tips'
import practice from '../common/practice'
import news from '../common/news'
import workshow from '../common/workshow'
import competitions from '../common/competitions'
import network from '@/api/jxNotice/cc'
import lists from '../common/newlist'
import api from "@/api/retrieval"
export default {
    components:{
        h,
        questions,
        tonggaolist,
        files,
        links,
        tips,
        practice,
        lists,
        news,
        workshow,
        competitions,
    },
    data(){
        return{
            lists:[],
            list1:[],
            list2:[],
            list3:[],
            list4:[],
            list5:[],
            list6:[],
        }
    },
    created(){
        this.getList()
        // 国创
        api.yearList({xmlx:1}).then(res => {
            this.list1 = res.data.splice(0,4)
        })
        // 省创
        api.yearList({xmlx:2}).then(res => {
            this.list2 = res.data.splice(0,4)
        })
        // 校级
        api.yearList({xmlx:4}).then(res => {
                this.list3 = res.data.splice(0,4)
        })
        // 院级
        api.yearList({xmlx:4}).then(res => {
                this.list4 = res.data.splice(0,4)
        })
        // 科研实践
        api.yearList({xmlx:3}).then(res => {
                this.list5 = res.data.splice(0,6)
        })
        // 其它
        api.yearList({xmlx:5}).then(res => {
                this.list6 = res.data.splice(0,2)
        })
        api.xmlbList({xmlb:5}).then(res => {
          this.list6 = res.data
        })
    },
   
    methods:{
        toPath(id,xmlx,type){
            if(type==1){
                this.$router.push({path:'/home/scsc',query:{xmlb:xmlx,xmejlb:id}})
            }
            else if(type == 41 || type == 42){
                this.$router.push({path:'/home/scsc',query:{xmlb:xmlx,xmejlb:type,nf:id}})
            }
            else{
                this.$router.push({path:'/home/scsc',query:{xmlb:xmlx,nf:id}})
            }
        },
        getList(){
                  network.getMhyggList({
                noticeType: 14,
                pageNum: 1,
                pageSize: 6,
                target:2
            }).then(res=>{
                this.lists = res && res.rows || []
                this.total = res && res.total || 0
            })
            }
    }
}
</script>

<style lang='scss' scoped>
.mainPage{
    width: 1200px;
    // display: flex;
    // justify-content: space-between;
    min-height: calc(100vh - 1000px);
    .box_left{
            width: 100%;
    display: flex;
    justify-content: space-between;
        .left_box{
                width: 891px;
    background: #DFE7FE;
    box-shadow:  0px 1px 10px 0px rgba(223, 223, 223, 0.5);
    border-radius: 4px;
    margin-bottom: 8px;
    overflow: hidden;
        }
        
    }
    .down_box{
            // width: 876px;
            // display: flex;
            // justify-content: space-between;
            .down_box_left{
                width: 100%;
    border-radius: 4px;
        box-shadow:  0px 1px 10px 0px rgba(223, 223, 223, 0.5);
    overflow: hidden;
    /* height: 466px; */
    background-color: #DFE7FE;
                .keyan{
                       width: 100%;
    background: #fff;
    display: flex;
    height: 97%;
    justify-content: space-between;
    flex-wrap: wrap;
    padding: 16px 16px;
                    .chaungye{
                                width: 286px;
    height: 112px;
    border-radius: 4px;
    padding: 11px 0 11px 0;
    background-color: #DFE7FE;
                        .tit{
                            cursor: pointer;
                            color: #001B57;
                            text-align: center;
                            font-weight: 800;
                            margin-bottom: 6px;
                        }
                        .chuang{
                            display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
                        }
                        .con{
                            cursor: pointer;
                            text-align: center;
                            color: #666666;
                            font-size: 16px;
                            height: 30px;
                            width: 50%;
                            line-height: 30px;
                        }
                    }
                }
                
            }
            .down_box_right{
               display: flex;
               justify-content: space-between;
                   margin-top: 8px;
                .top{
                    cursor: pointer;
                    width: 890px; border-radius: 4px;
                    box-shadow:  0px 1px 10px 0px rgba(223, 223, 223, 0.5);
                    background-color: #DFE7FE;
                    overflow: hidden;
                    .shijian{
                        display: flex;
                        justify-content: space-between;
                        padding: 16px;
                        background-color: #fff;
                        .xietong{
                        width: 100%;
                        height: 45px;
                        background-color: #DFE7FE;
                        border-radius: 16px;
                        line-height: 45px;
                        text-align: center;
                        font-size: 14px;
                        color: #001B57;
                    }
                        .qc{
                            width: 138px;
                            height: 45px;
                            cursor: pointer;
                            background: #DFE7FE;
                            border-radius: 10px;
                            color: #666666;
                            text-align: center;
                            line-height: 45px;
                            font-size: 16px;
                        }
                    }
                }
                .down{
                    width: 302px; border-radius: 4px;
                    box-shadow:  0px 1px 10px 0px rgba(223, 223, 223, 0.5);
                    cursor: pointer;
                    border-radius: 4px;
                    overflow: hidden;
                    background-color: #DFE7FE;
                    .xietong{
                        width: 100%;
                        height: 45px;
                        background-color: #DFE7FE;
                        border-radius: 16px;
                        line-height: 45px;
                        text-align: center;
                        font-size: 14px;
                        color: #001B57;
                    }
                }
            }
        }
    .box_right{
        width: 301px;
        height: 281px;
    /* padding: 24px 24px 0 24px; */
    background-color: #DFE7FE;
    border-radius: 4px;
    box-shadow:  0px 1px 10px 0px rgba(223, 223, 223, 0.5);
    overflow: hidden;
    }
}
.main{
    width: 1200px;
    min-height: calc(100vh - 1000px);
    margin: 16px auto 31px;
    >div{
        // display: inline-block;
        // vertical-align: top;
    }
    .left{
        width: 335px;
        padding-right: 18px;
        border-right: 1px solid #DADADA;
        height: 100%;
    }
    .middle{
        width: 527px;
        padding: 0 20px;
        height: 100%;
    }
    .right{
        width: 334px;
        padding-left: 18px;
        border-left: 1px solid #DADADA;
        height: 100%;
    }
}
</style>