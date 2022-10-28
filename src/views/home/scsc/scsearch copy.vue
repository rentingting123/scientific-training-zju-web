<template>
    <div class="news">
        <div class="left">
            <div>
                <img @click="search()" style="width:100%;margin-top:10px;" src="../assets/banner_search.png" >
            </div>
            <!-- <div class="box" v-for="(item,index) in yearList" :key="index">
                <div class="left_head">
                    <div @click="isshow(index)" class="head_title">{{getNewLB1Maplist[index].dictLabel}}</div>
                    <div @click="more(index,item)" class="more">more</div>
                </div>
                </div> -->
                <!-- <ul :class="{ulheight:heightlist[index]}" v-show="showlist[index]">
                    <li v-for="(tit,i) in item" :key="i" @click="toretrieval(tit,getNewLB1Maplist[index].dictValue,getNewLB1Maplist[index].dictLabel)">
                        <span v-if="i < show[index]">{{tit.value}}</span>
                       </li>
                </ul> -->
             <div class="box">
                <div class="left_head">
                    <div class="head_title" @click="isshow(1)">国创</div>
                    <div class="more"  @click="more(1)">more</div>
                </div>
                <ul :class="{ulheight:more1}" v-show="ulheightvalue1">
                    <li v-for="(tit,i) in list1" :key="i" @click="toretrieval(tit,1,'国创')">
                        <span>{{tit.value}}</span>
                       </li>
                </ul>
             </div>
             <div class="box">
                <div class="left_head">
                    <div class="head_title" @click="isshow(2)">省创</div>
                    <div class="more" @click="more(2)">more</div>
                </div>
                <ul :class="{ulheight:more2}" v-show="ulheightvalue2">
                    <li v-for="(tit,i) in list2" :key="i" @click="toretrieval(tit,2,'省创')">
                        <span>{{tit.value}}</span>
                       </li>
                </ul>
             </div>
             <div class="box">
                <div class="left_head">
                    <div class="head_title" @click="isshow(3)">校级SRTP</div>
                    <div class="more"  @click="more(3)">more</div>
                </div>
                <ul :class="{ulheight:more3}" v-show="ulheightvalue3">
                    <li v-for="(tit,i) in list3" :key="i" @click="toretrieval(tit,4,'校级SRTP')">
                        <span>{{tit.value}}</span>
                       </li>
                </ul>
             </div>
             <div class="box">
                <div class="left_head">
                    <div class="head_title" @click="isshow(4)">院级SRTP</div>
                    <div class="more"  @click="more(4)">more</div>
                </div>
                <ul :class="{ulheight:more4}" v-show="ulheightvalue4">
                    <li v-for="(tit,i) in list4" :key="i" @click="toretrieval(tit,4,'院级SRTP')">
                        <span>{{tit.value}}</span>
                       </li>
                </ul>
             </div>
             <div class="box">
                <div class="left_head">
                    <div class="head_title" @click="isshow(5)">科研实践</div>
                    <div class="more"  @click="more(5)">more</div>
                </div>
                <ul :class="{ulheight:more5}" v-show="ulheightvalue5">
                    <li v-for="(tit,i) in list5" :key="i" @click="toretrieval(tit,3,'科研实践')">
                        <span>{{tit.value}}</span>
                       </li>
                </ul>
             </div>
        </div>
        <div class="middle">
            <ul >
        <li :class="{'on': first}" @click="toPath(1)"> 科研训练</li>
        <li  :class="{'on': !first}" @click="toPath(2)"> /竞赛搜索</li>
    </ul>
            <listss v-if="first" :datas='lists' type='9' />
            <retrieval v-else :tit="tit" :searchshow='searchshow' :key="key" :xmejlb="xmejlb" :dictValue='dictValue'></retrieval>
            <el-pagination v-if="first"
                style="text-align:center" 
                layout="prev, pager, next" 
                :total="total"
                :current-page.sync="pageNum"
                :page-size="pageSize"
                @current-change='getList'
                hide-on-single-page>
            </el-pagination>
        </div>
    </div>
</template>


<script>
import h from '../common/h'
import questions from '../common/questions'
import files from '../common/files'
import links from '../common/links'
import network from '@/api/jxNotice/index'
import listss from '../common/lists'
import titles from '../common/titles'
import retrieval from './common/retrieval'
import api from "@/api/retrieval"


export default {
    components:{
        h,
        questions,
        files,
        links,
        listss,
        titles,
        retrieval
    },
    data(){
        return{
            key:0,
            lists: [],
            searchshow:false,
            total: 0,
            name:'',
            ulheightvalue1:true,
            ulheightvalue2:true,
            ulheightvalue3:true,
            ulheightvalue4:true,
            ulheightvalue5:true,
            more1:true,
            more2:true,
            more3:true,
            more4:true,
            more5:true,
            first:true,
            showlist:[],
            show:[],
            list1:[],
            list2:[],
            list3:[],
            list4:[],
            list5:[],
            pageNum: 1,
            pageSize: 21,
            yearList:[[],[],[],[],[]],
            getNewLB1Maplist:[],
            heightlist:[],
            tit:'',
            dictValue:undefined,
            xmejlb:undefined,
        }
    },
    created(){
        this.getDicts('getNewLB1Map').then(res => {
            this.getNewLB1Maplist = res.data
            // this.getNewLB1Maplist.forEach((item,index) => {
            //     this.show[index]=4
            //     this.showlist[index]=true
            //     this.heightlist[index]=true
            //     api.yearList({xmlx:item.dictValue}).then(res => {
            //         this.yearList[index]=res.data
            //     })
            // })
            // console.log(this.yearList);
    })
     api.yearList({xmlx:1}).then(res => {
            this.list1 = res.data
    })
    api.yearList({xmlx:2}).then(res => {
            this.list2 = res.data
    })
    api.yearList({xmlx:4}).then(res => {
            this.list3 = res.data
    })
    api.yearList({xmlx:4}).then(res => {
            this.list4 = res.data
    })
    api.yearList({xmlx:3}).then(res => {
            this.list5 = res.data
    })
     this.getList();
    },
    methods:{
         toPath(num){
             if(num == 1){
                 this.first = true
             }else if(num == 2){
                 this.first = false
                 this.searchshow = true
             }
        },
        handleUpdateClick() {
        this.key += 1 
      },
        toretrieval(tit,dictValue,dictLabel){
            this.$router.push({path:'/home/scsearch',query:{qc:tit.value}})
            this.searchshow = false
            this.handleUpdateClick()
            this.tit = tit
            if(dictValue == 4){
                if(dictLabel == '校级SRTP'){
                    this.xmejlb = 41
                    this.dictValue = undefined
                }else{
                     this.xmejlb = 42
                    this.dictValue = undefined
                }
            }else if(dictValue !== 4){
                this.dictValue = dictValue
                this.xmejlb = undefined
            }
            this.first = false
        },
        isshow(index){
            if(index == 1){
                this.ulheightvalue1 = !this.ulheightvalue1
            }else if(index == 2){
                this.ulheightvalue2 = !this.ulheightvalue2
            }else if(index == 3){
                this.ulheightvalue3 = !this.ulheightvalue3
            }else if(index == 4){
                this.ulheightvalue4 = !this.ulheightvalue4
            }else if(index == 5){
                this.ulheightvalue5 = !this.ulheightvalue5
            }
            // if(this.show[index] == 4){
            //     this.show.splice(index, 1, item.length);
            //     this.heightlist.splice(index, 1, false);
            // }else{
            //     this.show.splice(index, 1, 4);
            //     this.heightlist.splice(index, 1, true);
            // }
        },
        more(index){
           if(index == 1){
                this.more1 = !this.more1
            }else if(index == 2){
                this.more2 = !this.more2
            }else if(index == 3){
                this.more3 = !this.more3
            }else if(index == 4){
                this.more4 = !this.more4
            }else if(index == 5){
                this.more5 = !this.more5
            }
            // this.showlist.splice(index, 1, !this.showlist[index]);
        },
        search(){
            this.first = false
            this.searchshow = true
            this.handleUpdateClick()
            this.tit = {id:0,value:0}
        },
        getList(){
            // 1 重点提示, 2 常见问题, 3 新闻动态, 4 相关文件, 5 相关下载, 6 指南流程, 7 成果展示, 8 相关链接, 9 科研训练
            network.getMhyggList({
                gglx: 9,
                pageNum: this.pageNum,
                pageSize: this.pageSize,
            }).then(res=>{
                this.lists = res && res.rows || []
                this.total = res && res.total || 0
            })
        }
    }
}
</script>

<style lang='scss' scoped>
.ulheight{
    height: 120px;
    overflow: hidden;
}
.el-menu{
    border: none;
}
 ::v-deep .el-input-group__append{
        background: #FFB400;
        .search{
            width: 18px;
            height: auto;
            vertical-align: middle;
            margin-top: 0;
            cursor: pointer;
        }
    }
    .left_head{
        width: 100%;
        height: 34px;
        display: flex;
        background-color: pink;
        justify-content: space-between;
        font-size: 18px;
        padding: 0 10px;
        align-items: center;
        cursor: pointer;
        .head_title{
            width:260px;height:100%;line-height: 37px;
        }
        .more{
                height: 100%;
    line-height: 37px;

        }
    }
    .box ul li {
        padding: 0 23px;
    height: 30px;
    font-size: 18px;
    line-height: 30px;cursor: pointer;
    }
.news{
    width: 1200px;
    // height: 857px;
    min-height: calc(100vh - 310px);
    margin: 24px auto 31px;
    >div{
        display: inline-block;
        vertical-align: top;
    }
    .left{
        width: 335px;
        padding-right: 18px;
        border-right: 1px solid #DADADA;
        height: 100%;
    }
    .middle{
        width: 864px;
        padding-left: 20px;
        height: 100%;
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
        cursor: pointer;
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
    }
}
</style>