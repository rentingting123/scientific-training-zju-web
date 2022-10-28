<template>
    <div class="news">
        <div class="left">
            <div style="font-size:18px;color:#000000;height:40px;line-height:40px;border-bottom: 2px solid #EAAF23;margin-bottom:16px">
                科研训练项目检索
            </div>
             <el-row :gutter="15">
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
            <el-col>
          <el-form-item label="期次" prop="qc">
            <el-select v-model="formData.qc" clearable filterable placeholder="请选择">
                <el-option
                :key="0"
                label="全部期次"
                :value="null">
              </el-option>
              <el-option
                v-for="(item) in qclist"
                :key="item.xmlx"
                :label="item.value"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        </el-row>
        <el-row>
        <el-col>
          <el-form-item label="项目类型" prop="xmejlb">
             <el-select v-model="formData.xmejlb" clearable filterable placeholder="请选择">
              <el-option
                v-for="(item,key,index) in xmlboptions"
                :key="index"
                :label="key"
                :value="item">
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
    </el-row>
        </div>
        <div class="middle">
            <ul style="margin-bottom:20px" >
                <li @click="toPath(1)"> 首页</li>
        <li class="on" @click="toPath(2)"> /科研训练</li>
        <li style="    float: right;
    font-size: 16px;
    color: #333333">{{this.formData.qc}}</li>
    </ul>
      <div>
        <div v-loading="listLoading">
        <div class="body" style="    margin-bottom: 20px;" v-for="(item,index) in lists" :key="index">
          <div style="    width: 844px;
    text-align: center;
    margin-left: -21px;
    line-height: 40px;
    background: rgb(237, 238, 246);
    color: rgb(51, 51, 51);">
              全部院校
          </div>
            <div style="line-height:54px">
                <span>【{{item.xmejlb}}&nbsp;{{item.qc}}】</span><span style="padding-left:10px">项目编号：{{item.bianhao}}</span><span style="padding-left:20px">项目名称：<span style="color:rgb(237, 179, 104)">{{item.xiangmumc}}</span></span>
            </div>
            <div style="line-height:40px">
                <strong>立项人：</strong><span>{{item.sbrxm}}/{{item.sbrgh}}</span><br>
                <strong>团队成员：</strong><span v-for="(obj,index) in item.teamMembers" :key="index">{{obj.xsxm}}/{{obj.xh}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><br>
                <strong>指导教师：</strong><span>{{item.fzdsxm}}/{{item.fzdsgh}}</span><br>
            </div>
            <div class="last">
                <!-- <div><router-link :to="`/home/lxsq/${item.id}/${item.xmejlb}/${item.type||1}`" target='_blank'>查看详情</router-link></div> -->
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
            getNewLB1Maplist:[],
            tit:'',
            dictValue:undefined,
            xmejlb:undefined,
            formData: {
              bianhao: undefined,
              xiangmumc: null,
              fzdsxm: undefined,
              fzxsxm: undefined,
              xmejlb: null,
              qc:undefined,
              xy: null,
              pageNum:1,
              pageSize:3
            },
            rules: {
              bianhao: [],
              xiangmumc: [],
              fzdsxm: [],
              fzxsxm: [],
              qc:[],
              xmejlb: [],
              xy: [],
            },
            xmlboptions:{},
            xyoptions:[],
            total:0,
            qclist:[]
        }
    },
    created(){
      this.formData.qc = this.$route.query.qc
        this.getDicts('getNewLB1Map').then(res => {
            this.getNewLB1Maplist = res.data
            res.data.forEach(item => {
              api.yearList({xmlx:item.dictValue}).then(res => {
                res.data.forEach(item => {
                  this.qclist.push(item)
                })
              })
            })
    })
    api.xyList().then(res => {
        this.xyoptions = Object.assign({},{'全部院校':null},res.data) 
    })
    api.xmlbList().then(res => {
        this.xmlboptions = Object.assign({},{'全部分类':null},res.data) 
    })
     this.getList1();
    },
    methods:{
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
          this.formData.nf = undefined
            this.formData.xmlb = undefined
            this.getList1()
        },
        getList1(){
          this.listLoading = true
          this.$router.push({path:'/home/scsearch',query:{qc:this.formData.qc}})
               api.searchCom(this.formData).then(res => {
                 
                   this.total = res.total
                    res.rows.forEach(item => {
                     item.xmejlb = this.selectDictLabel(this.getNewLB1Maplist,item.xmejlb)
                    }) 
                    this.lists = res.rows 
                     this.listLoading = false
                })
          
          
      },
    }
}
</script>

<style lang='scss' scoped>
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