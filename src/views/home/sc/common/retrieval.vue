<template>
  <div class="main">
    <el-row v-if="searchshow" :gutter="15">
      <el-form ref="elForm" :model="formData" :rules="rules" size="medium" label-width="100px">
        <el-row>
            <el-col :span="7">
          <el-form-item label="项目编号" prop="bianhao">
            <el-input v-model="formData.bianhao" placeholder="请输入项目编号" clearable :style="{width: '100%'}">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="项目名称" prop="xiangmumc">
            <el-input v-model="formData.xiangmumc" placeholder="请输入项目名称" clearable :style="{width: '100%'}">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="负责导师" prop="fzdsxm">
            <el-input v-model="formData.fzdsxm" placeholder="请输入负责导师" clearable :style="{width: '100%'}">
            </el-input>
          </el-form-item>
        </el-col>
        </el-row>
       <el-row>
            <el-col :span="7">
          <el-form-item label="负责学生" prop="fzxsxm">
            <el-input v-model="formData.fzxsxm" placeholder="请输入负责学生" clearable :style="{width: '100%'}">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="7">
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
        <el-col :span="7">
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
        <el-col :span="3" style="text-align:right">
            <el-button type="primary" @click="jiansuo">检索</el-button>
        </el-col>
       </el-row>
       
      </el-form>
    </el-row>

    <div>
        <div v-show="!searchshow" class="head">
            <span v-if="tit">{{tit.value}}</span>
        </div>
         <div class="head">
            <span v-if="xy">{{xy}}</span>
            <span v-else>全部院校</span>
        </div>
        <div v-loading="listLoading">
        <div class="body" v-for="(item,index) in lists" :key="index">
            <div style="line-height:54px">
                <span>【{{item.xmejlb}}&nbsp;{{item.qc}}】</span><span style="padding-left:10px">项目编号：{{item.bianhao}}</span><span style="padding-left:20px">项目名称：<span style="color:rgb(237, 179, 104)">{{item.xiangmumc}}</span></span>
            </div>
            <div style="line-height:40px">
                <strong>立项人：</strong><span>{{item.sbrxm}}/{{item.sbrgh}}</span><br>
                <strong>团队成员：</strong><span v-for="(obj,index) in item.teamMembers" :key="index">{{obj.xsxm}}/{{obj.xh}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><br>
                <strong>指导教师：</strong><span>{{item.fzdsxm}}/{{item.fzdsgh}}</span><br>
            </div>
            <div class="last">
                <div><router-link :to="`/home/lxsq/${item.id}/${item.xmejlb}/${item.type||1}`" target='_blank'>查看详情</router-link></div>
                <div><router-link :to="`/home/results/${item.id}`" target='_blank'>项目成果</router-link></div>
                <!-- <div><router-link to="/lxsq" target='_blank'>中期检查表</router-link></div>
                <div><router-link to="/lxsq" target='_blank'>结题申请表</router-link></div>
                <div><router-link to="/lxsq" target='_blank'>项目相关材料</router-link></div>
                <div><router-link to="/lxsq" target='_blank'>项目成果</router-link></div> -->
            </div>
        </div>
        </div>
    </div>
     <pagination
      :total="total"
      :page.sync="formData.pageNum"
      :page-size="formData.pageSize"
      :page-sizes="[3,4,5]"
      :limit.sync="formData.pageSize"
      @pagination="getList"
    />
  </div>
</template>
<script>
import api from "@/api/retrieval"
export default {
  components: {},
  props: ['tit','dictValue','xmejlb','searchshow'],
  data() {
    return {
      getonelist:true,
        xy:'',
        lists:[],
        xmlboptions:{},
        total:0,
      formData: {
        bianhao: undefined,
        xiangmumc: null,
        fzdsxm: undefined,
        fzxsxm: undefined,
        xmejlb: null,
        xy: null,
        pageNum:1,
        pageSize:3
      },
      rules: {
        bianhao: [],
        xiangmumc: [],
        fzdsxm: [],
        fzxsxm: [],
        xmejlb: [],
        xy: [],
      },
      listLoading:false,
      xyoptions:[],
      xmejlbOptions: [],
      NewLB1Map:{}
    }
  },
  computed: {},
  created() {
       this.getDicts('kyxl_gllx').then(res => {
            this.NewLB1Map = res.data
      })
    api.xyList().then(res => {
        this.xyoptions = Object.assign({},{'全部院校':null},res.data) 
    })
    api.xmlbList().then(res => {
        this.xmlboptions = Object.assign({},{'全部分类':null},res.data) 
    })
  },
  watch:{
      formData:{
        immediate: true,//立即执行,让这个函数在页面刚打开的时候就被执行
        deep: true, //深度侦听复杂类型内变化
        handler(newval,oldval){
           this.xy =  this.findKey(this.xyoptions,newval.xy)
        }
    }
  },
  mounted() {this.getList()},
  methods: {
      findKey (obj,value, compare = (a, b) => a === b) {
        return Object.keys(obj).find(k => compare(obj[k], value))
        },
        jiansuo(){
          this.getonelist = true
          this.formData.nf = undefined
            this.formData.xmlb = undefined
            this.getList()
        },
      getList(){
          this.listLoading = true
            if(this.tit.value == 0 || this.tit.id == 0 ){
               api.searchCom(this.formData).then(res => {
                    this.total = res.total
                    res.rows.forEach(item => {
                     item.xmejlb = this.selectDictLabel(this.NewLB1Map,item.xmejlb)
                    }) 
                    this.lists = res.rows 
                     this.listLoading = false
                })
            }else{
              this.formData.nf = this.tit.id
              this.formData.xmlb = this.dictValue
              this.formData.xmejlb = this.xmejlb
              api.getKyxl(this.formData).then(res =>{
                  this.total = res.total 
                   res.rows.forEach(item => {
                     item.xmejlb = this.selectDictLabel(this.NewLB1Map,item.xmejlb)
                    }) 
                this.lists = res.rows 
                this.listLoading = false
            })
          }
          
          
      },
  }
}

</script>
<style>
.el-select{
    width:100%
}
</style>
<style scopde>
::v-deep .el-select--medium{
    width: 100% !important;
}
::v-deep .el-select{
    width: 100% !important;
}
::v-deep .pagination-container{
        background: transparent !important;
    padding: 0 !important;
    margin: 0;
    height: 50px !important;
    line-height: 50px !important;
    margin-top: 27px;
    margin-bottom: 20px;
}
.body{
    padding-left: 20px;
    border-bottom: 1px solid #ccc;
    border-left: 1px solid #ccc;
    border-right: 1px solid #ccc;
    border-top: none;
    font-size: 20px;
    padding-bottom: 20px;
}
.last>div{
    display: inline-block;
    margin-right: 120px;
}
.head{
    width: 100%;
    height: 40px;
    border: 1px solid #cccccc;
    background-color: #cccccc;
    text-align: center;
    color: black;
    font-size: 20px;
    line-height: 40px;
}
.main{
    padding-top: 30px;
    /* width: 1200px; */
    margin: 0 auto;
    min-height: calc(100vh - 59px - 200px - 48px);
}
</style>