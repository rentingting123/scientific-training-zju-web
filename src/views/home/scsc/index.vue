<template>
  <div class="news">
        <div class="left">
            <div style="font-size:18px;color:#000000;height:37px;line-height:37px;border-bottom: 2px solid #EAAF23;margin-bottom:16px">
                科研训练项目
            </div>
            <el-collapse v-model="activeNames" accordion @change="handleChange">
             <el-collapse-item title="国创" name="1">
              <div v-for="item in list1" class="qc" :key="item.id" :class="{current:item.id == formData.nf}" @click="getList1(item)">{{item.value}}</div>
            </el-collapse-item>
             <el-collapse-item title="省创" name="2" style="background:red">
              <div v-for="item in list2" class="qc" :key="item.id" :class="{current:item.id == formData.nf}" @click="getList1(item)">{{item.value}}</div>
            </el-collapse-item>
             <el-collapse-item title="校级SRTP" name="41">
              <div v-for="item in list3" class="qc" :key="item.id" :class="{current:item.id == formData.nf}" @click="getList1(item)">{{item.value}}</div>
            </el-collapse-item>
             <el-collapse-item title="院级SRTP" name="42">
              <div v-for="item in list4" class="qc" :key="item.id" :class="{current:item.id == formData.nf}" @click="getList1(item)">{{item.value}}</div>
            </el-collapse-item>
            <el-collapse-item title="科研实践" name="3">
              <div v-for="item in list5" class="qc" :key="item.id" :class="{current:item.id == formData.nf}" @click="getList1(item)">{{item.value}}</div>
            </el-collapse-item>
             <el-collapse-item title="其它" name="5">
                    <div v-for="item in list6" class="qc" :key="item.id" :class="{current:item.id == formData.nf}" @click="getList1(item)">{{item.value}}</div>
              
            </el-collapse-item>
          </el-collapse>
             <!-- <el-row :gutter="15">
      <el-form ref="elForm" :model="formData" :rules="rules" size="medium" label-width="100px" style="background: #EDEEF6;
    padding: 20px;">
        <el-row>
            <el-col>
          <el-form-item label="项目编号" prop="bianhao">
            <el-input v-model="formData.bianhao" placeholder="请输入项目编号" clearable :style="{width: '100%'}">
            </el-input>
          </el-form-item>
        </el-col>
        </el-row>
        <el-row>
        <el-col>
          <el-form-item label="项目名称" prop="xiangmumc">
            <el-input v-model="formData.xiangmumc" placeholder="请输入项目名称" clearable :style="{width: '100%'}">
            </el-input>
          </el-form-item>
        </el-col>
        </el-row>
        <el-row>
        <el-col>
          <el-form-item label="负责导师" prop="fzdsxm">
            <el-input v-model="formData.fzdsxm" placeholder="请输入负责导师" clearable :style="{width: '100%'}">
            </el-input>
          </el-form-item>
        </el-col>
        </el-row>
       <el-row>
            <el-col>
          <el-form-item label="负责学生" prop="fzxsxm">
            <el-input v-model="formData.fzxsxm" placeholder="请输入负责学生" clearable :style="{width: '100%'}">
            </el-input>
          </el-form-item>
        </el-col>
        </el-row>
         <el-row>
           
        </el-row>
        <el-row>
        <el-col>
          <el-form-item label="项目一级类别" prop="xmlb">
             <el-select v-model="formData.xmlb" @change="getejlb(1)" clearable filterable placeholder="请选择">
              <el-option
                v-for="(item) in getNewLB1Maplist"
                :key="item.dictValue"
                :label="item.dictLabel"
                :value="item.dictValue">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="项目二级类别" prop="xmejlb">
             <el-select v-model="formData.xmejlb" clearable filterable placeholder="请选择">
                <el-option
                :key="0"
                label="全部类别"
                :value="null">
              </el-option>
              <el-option
                v-for="(item,key,index) in xmlboptions"
                :key="index"
                :label="key"
                :value="item">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
         <el-col>
          <el-form-item label="期次" prop="nf">
            <el-select v-model="formData.nf" clearable filterable placeholder="请选择">
                <el-option
                :key="0"
                label="全部期次"
                :value="null">
              </el-option>
              <el-option
                v-for="(item) in qclist"
                :key="item.id"
                :label="item.value"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        </el-row>
        <el-row>
        <el-col>
          <el-form-item label="学院" prop="xy">
             <el-select v-model="formData.xy" clearable filterable placeholder="请选择">
              <el-option
                v-for="(item,key,index) in xyoptions"
                :key="index"
                :label="key"
                :value="item">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        </el-row>
        <el-row>
        <el-col style="text-align:right;text-align:center">
            <el-button type="primary" @click="resect" style="border:1px solid #979797;    margin-right: 40px;color:#4A4A4A;background:#fff">重置</el-button>
            <el-button type="primary" @click="jiansuo" style="background:#0041AB;color:#fff">检索</el-button>
        </el-col>
       </el-row>
       
      </el-form>
    </el-row> -->
        </div>
        <div class="middle">
            <ul style="margin-bottom:20px" >
                <li @click="toPath(1)"> 首页</li>
        <li class="on" @click="toPath(2)"> /科研训练</li>
        <li style="float: right;font-size: 16px;color: #333333">{{this.formData.qc}}</li>
    </ul>
      <div>
        <div v-loading="listLoading">
        <div class="body" style="    margin-bottom: 20px;" v-for="(item,index) in lists" :key="index">
          <div style="    width: 844px;text-align: center;margin-left: -21px;line-height: 40px;background: rgb(237, 238, 246);color: rgb(51, 51, 51);">
              <span>{{item.xy || '全部院校'}}</span>
          </div>
          <div>
              <span><strong>项目名称：</strong><span style="color:rgb(255, 180, 0)">{{item.xiangmumc}}</span></span>
          </div>
            <div style="line-height:54px">
                <span>【{{item.xmejlb1}}&nbsp;{{item.qc}}】</span><span style="padding-left:10px">项目编号：{{item.bianhao}}</span>
            </div>
            <div  class="zhidao">
                    <span>立项人：<span>{{item.sbrxm}}/{{item.sbrgh}}</span></span><br>
                    <span>团队成员：<span v-for="(obj,index) in item.teamMembers" :key="index">{{obj.xsxm}}/{{obj.xh}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></span>
                <br>
                <span>指导教师：<span>{{item.fzdsxm}}/{{item.fzdsgh}}</span></span><br>
            </div>
            <div class="last">
                <!-- <div><router-link :to="`/home/lxsq/${item.id}/${item.xmejlb}/${item.type||1}`" >查看详情</router-link></div> -->
                <!-- <div><router-link :to="`/home/results/${item.id}`" target='_blank'>项目成果</router-link></div> -->
                <!-- <div><router-link to="/lxsq" target='_blank'>中期检查表</router-link></div>
                <div><router-link to="/lxsq" target='_blank'>结题申请表</router-link></div>
                <div><router-link to="/lxsq" target='_blank'>项目相关材料</router-link></div>
                <div><router-link to="/lxsq" target='_blank'>项目成果</router-link></div> -->
            </div>
        </div>
        </div>
    </div>
     <el-pagination
                style="text-align:center" 
                layout="prev, pager, next" 
                :total="total"
                :current-page.sync="formData.pageNum"
                :page-size="formData.pageSize"
                @current-change='getList1()'
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
            lists: [],
            activeNames1:[],
            getNewLB1Maplist:[],
            tit:'',
            listLoading:false,
            dictValue:undefined,
            // xmejlb:undefined,
             activeNames: ['1'],
            formData: {
              bianhao: undefined,
              xiangmumc: null,
              fzdsxm: undefined,
              fzxsxm: undefined,
              xmejlb: null,
              xmlb:null,
              nf:null,
              xy: null,
              pageNum:1,
              pageSize:3
            },
            rules: {
              bianhao: [],
              xiangmumc: [],
              fzdsxm: [],
              fzxsxm: [],
              nf:[],
              xmlb:[],
              xmejlb: [],
              xy: [],
            },
            xmlboptions:{},
            xyoptions:[],
            total:0,
            qclist:[],
            erjilist:[],
             lists:[],
            list1:[],
            list2:[],
            list3:[],
            list4:[],
            list5:[],
            list6:[],
            list7:[],
        }
    },
    created(){
        // 国创
        api.yearList({xmlx:1}).then(res => {
            this.list1 = res.data
        })
        // 省创
        api.yearList({xmlx:2}).then(res => {
            this.list2 = res.data
        })
        // 校级
        api.yearList({xmlx:4}).then(res => {
                this.list3 = res.data
        })
        // 院级
        api.yearList({xmlx:4}).then(res => {
                this.list4 = res.data
        })
        // 科研实践
        api.yearList({xmlx:3}).then(res => {
                this.list5 = res.data
        })
        // 其它1
        api.yearList({xmlx:5,xmejlb:51}).then(res => {
                this.list6 = res.data
                // console.log(this.list6);
        })
          // 其它2
        api.yearList({xmlx:5,xmejlb:52}).then(res => {
                this.list7 = res.data
                // console.log(this.list7);
        })
      this.getDicts('getNewLB1Map').then(res => {
            this.getNewLB1Maplist = res.data
    })
    this.getDicts('getLB2MapForAdd').then(res => {
      this.erjilist = res.data
    })
    
    api.xyList().then(res => {
      this.xyoptions = res.data
    })
         if(!isNaN(this.$route.query.nf) || !isNaN(this.$route.query.xmejlb)){
            this.formData.xmlb = this.$route.query.xmlb 
         if(isNaN(this.$route.query.xmejlb)){
           this.formData.xmejlb = null
           this.activeNames = [this.$route.query.xmlb+'']
         }else{
           this.formData.xmejlb = this.$route.query.xmejlb 
           this.activeNames = [this.$route.query.xmejlb+'']
         }
         if(isNaN(this.$route.query.nf)){
           this.formData.nf = null
         }else{
           this.formData.nf = this.$route.query.nf * 1
         }
            this.getejlb()
             this.getList1();
         }else{
           
         }
     
        this.getList1();
    
    },
    methods:{
        handleChange(val) {
        // console.log(val);
      },
      getejlb(val){
        if(val == 1){
            this.formData.xmejlb = null
         this.formData.nf = null
        }
        api.yearList({xmlx:this.formData.xmlb}).then(res => {
          this.qclist = res.data
        })
       
        api.xmlbList({xmlb:this.formData.xmlb}).then(res => {
          this.xmlboptions = res.data
        })
      },
      handleCurrentChange(val) {
        this.formData.pageNum = val
        this.getList1()
      },
        toPath(num){
             if(num == 1){
                 this.$router.push('/home')
             }
        },
      resect(){
          this.$refs['elForm'].resetFields();
      },
      jiansuo(){
          this.getonelist = true
            this.getList1()
        },
        getList1(val){
          if(val){
            this.formData.xmlb = val.xmlx
          this.formData.nf = val.id
          // this.formData.xmejlb = null
          }
          this.listLoading = true
          if(this.formData.nf == 0){
            this.formData.nf = null
          }
          this.$router.push({path:'/home/scsc',query:{xmlb:this.formData.xmlb,nf:this.formData.nf,xmejlb:this.formData.xmejlb}})
               api.searchCom(this.formData).then(res => {
                   this.total = res.total
                   res.rows.forEach(item => {
                     item.xmejlb1 = this.selectDictLabel(this.erjilist,item.xmejlb)
                   })
                    this.lists = res.rows 
                     this.listLoading = false
                })
          
          
      },
    }
}
</script>

<style lang='scss' scoped>
.current{
  background-color: rgba(187, 211, 250,.4);
}
::v-deep .el-collapse-item__header{
  font-size: 18px;
  padding-left: 10px;
  font-weight: 500;
  height: 30px;
  line-height: 30px;
  background-color: rgb(187, 211, 250);
}
.el-button--medium {
    padding: 10px 20px;
    font-size: 14px;
    width: 100px;
    border-radius: 0;
}
::v-deep .el-form-item__label{
    text-align: left;
}
.ulheight{
    height: 120px;
    overflow: hidden;
}
.el-menu{
    border: none;
}
.zhidao{
     color:#666666;font-size:14px
}
.zhidao>span{
    // margin-bottom: 20px;
    display: block;
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
    width: 1240px;
    // height: 857px;
    background: #fff !important;
    padding: 20px;
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
          .qc{
            cursor: pointer;
    height: 30px;
    padding-left: 10px;
    line-height: 30px;
    margin: 5px 15px;
          }
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