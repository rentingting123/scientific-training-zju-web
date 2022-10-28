<template>
  <div class="app-container">
    <el-row>
      <el-form
        :model="queryParams"
        ref="queryForm"
        :inline="true"
        label-width="100px"
      >
        <el-form-item label="项目名称" prop="xmmc">
          <el-input
            v-model="queryParams.xmmc"
            placeholder="请输入项目名称"
            clearable
            size="small"
            style="width: 240px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item
          v-if="
            $store.getters.user.rolekey != 'student' &&
            $store.getters.user.rolekey != 'blacklist'
          "
          label="年份筛选"
          prop="nf"
        >
          <el-select
            v-model="queryParams.nf" size="small" placeholder="请选择"
            @change="handleQuery"
          >
            <el-option label="全部" :value="null" />
            <el-option
              v-for="item in nfList"
              :key="item.id"
              :label="item.value"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            icon="el-icon-search"
            size="mini"
            @click="handleQuery"
            >搜索</el-button
          >
        </el-form-item>
      </el-form>
    </el-row>
    
    <div style="margin-bottom:8px;">
      <el-button
        v-hasRole="['admin','tadmin','xyadmin','daoshi','zj']"
        type="warning"
        plain
        size="mini"
        :loading="exportLoading"
        @click="handleExport"
      >导出</el-button>
    </div>      
    <div v-if="!type" class="top">
      <div></div>
      <!-- 论文成果（正式发表） -->
      <lwcgAdd :options="xmLists" :close="close" v-if="activeName == 1" />
      <!-- 获奖成果 -->
      <hjcgAdd :options="xmLists" :close="close" v-else-if="activeName == 2" />
      <!-- 评议鉴定成果 -->
      <pyjdAdd :options="xmLists" :close="close" v-else-if="activeName == 3" />
      <!-- 推广成果 -->
      <tgcgAdd :options="xmLists" :close="close" v-else-if="activeName == 4" />
      <!-- 论著成果 -->
      <lzcgAdd :options="xmLists" :close="close" v-else-if="activeName == 5" />
      <!-- 专利成果 -->
      <zlcgAdd :options="xmLists" :close="close" v-else-if="activeName == 6" />
      <!-- 经济效益 -->
      <jjxyAdd :options="xmLists" :close="close" v-else-if="activeName == 7" />
      <!-- 知识产权（产品，软件等 -->
      <zscqAdd :options="xmLists" :close="close" v-else-if="activeName == 8" />
      <!-- 与“毕业论文（设计）”，学科竞赛等其他学习环节结合情况 -->
      <bylwAdd :options="xmLists" :close="close" v-else-if="activeName == 9" />
      <!-- 其他成果 -->
      <qtcgAdd :options="xmLists" :close="close" v-else-if="activeName == 10" />
    </div>
    <el-tabs
      v-loading="loading"
      @tab-click="handleQuery"
      v-model="activeName"
      type="card"
    >
      <el-tab-pane
        v-for="item in navs"
        :key="item.id"
        :label="item.dictLabel"
        :name="item.dictValue"
      >
      </el-tab-pane>
      <!-- 论文成果（正式发表） -->
      <lwcg
        v-bind="$attrs"
        ref="details"
        :key="key"
        :cgList="cgList"
        v-if="activeName == 1"
      />
      <!-- 获奖成果 -->
      <hjcg
        v-bind="$attrs"
        ref="details"
        :key="key"
        :cgList="cgList"
        v-else-if="activeName == 2"
      />
      <!-- 评议鉴定成果 -->
      <pyjd
        v-bind="$attrs"
        ref="details"
        :key="key"
        :cgList="cgList"
        v-else-if="activeName == 3"
      />
      <!-- 推广成果 -->
      <tgcg
        v-bind="$attrs"
        ref="details"
        :key="key"
        :cgList="cgList"
        v-else-if="activeName == 4"
      />
      <!-- 论著成果 -->
      <lzcg
        v-bind="$attrs"
        ref="details"
        :key="key"
        :cgList="cgList"
        v-else-if="activeName == 5"
      />
      <!-- 专利成果 -->
      <zlcg
        v-bind="$attrs"
        ref="details"
        :key="key"
        :cgList="cgList"
        v-else-if="activeName == 6"
      />
      <!-- 经济效益 -->
      <jjxy
        v-bind="$attrs"
        ref="details"
        :key="key"
        :cgList="cgList"
        v-else-if="activeName == 7"
      />
      <!-- 知识产权（产品，软件等 -->
      <zscq
        v-bind="$attrs"
        ref="details"
        :key="key"
        :cgList="cgList"
        v-else-if="activeName == 8"
      />
      <!-- 与“毕业论文（设计）”，学科竞赛等其他学习环节结合情况 -->
      <bylw
        v-bind="$attrs"
        ref="details"
        :key="key"
        :cgList="cgList"
        v-else-if="activeName == 9"
      />
      <!-- 其他成果 -->
      <qtcg
        v-bind="$attrs"
        ref="details"
        :key="key"
        :cgList="cgList"
        v-else-if="activeName == 10"
      />
    </el-tabs>
    <pagination
      v-show="queryParams.total > 0"
      :total="queryParams.total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="cgList"
    />
  </div>
</template>

<script>
import network from '@/api/jxStuProject/result'
import ProjectApi from "@/api/jxStuProject";
import {downloadFile} from '@/utils/index'

import lwcg from './common/lwcg'
import hjcg from './common/hjcg'
import pyjd from './common/pyjd'
import tgcg from './common/tgcg'
import lzcg from './common/lzcg'
import zlcg from './common/zlcg'
import jjxy from './common/jjxy'
import zscq from './common/zscq'
import bylw from './common/bylw'
import qtcg from './common/qtcg'
import lwcgAdd from './common/lwcgAdd'
import hjcgAdd from './common/hjcgAdd'
import pyjdAdd from './common/pyjdAdd'
import tgcgAdd from './common/tgcgAdd'
import lzcgAdd from './common/lzcgAdd'
import zlcgAdd from './common/zlcgAdd'
import jjxyAdd from './common/jjxyAdd'
import zscqAdd from './common/zscqAdd'
import bylwAdd from './common/bylwAdd'
import qtcgAdd from './common/qtcgAdd'

export default {
   props:['type','nf','xmmc','xmejlb'],
   data(){
      return{
         loading:false,
         key:0,
         activeName: '',
         navs: [],
         index:'',
         xmLists: [],
         title:'',
         queryParams:{
          pageNum:1,
          pageSize:20,
          total:0,
          nf:null,
          xmmc:undefined,

        },
        nfList:[],
        // 导出遮罩层
      	exportLoading: false,
      }
   },
   components:{
      lwcg,
      hjcg,
      pyjd,
      tgcg,
      lzcg,
      zlcg,
      jjxy,
      zscq,
      bylw,
      qtcg,
      lwcgAdd,
      hjcgAdd,
      pyjdAdd,
      tgcgAdd,
      lzcgAdd,
      zlcgAdd,
      jjxyAdd,
      zscqAdd,
      bylwAdd,
      qtcgAdd,
   },
    mounted(){
      this.init();
   },
   watch:{
      activeName(newval,oldval){
        this.index = newval
        this.title = this.navs[newval-1]
      }
   },
   methods:{
      /** 导出按钮操作 */
        handleExport() {
				const queryParams = {
          nf: this.queryParams.nf,
          xmmc: this.queryParams.xmmc,
          xmejlb:this.xmejlb
        }
					this.$confirm("是否确认导出"+this.title.dictLabel+"?", "警告", {
						confirmButtonText: "确定",
						cancelButtonText: "取消",
						type: "warning"
					}).then(() => {
						this.exportLoading = true;
            if(this.activeName == 1){
              return network.exportLwcg(queryParams);
            }else if(this.activeName == 2){
              return network.exportHjcg(queryParams);
            }else if(this.activeName == 3){
              return network.exportPyjd(queryParams);
            }else if(this.activeName == 4){
              return network.exportCgtg(queryParams);
            }else if(this.activeName == 5){
              return network.exportLunzhu(queryParams);
            }else if(this.activeName == 6){
              return network.exportZhuanli(queryParams);
            }else if(this.activeName == 7){
              return network.exportJjxy(queryParams);
            }else if(this.activeName == 8){
              return network.exportZscq(queryParams);
            }else if(this.activeName == 9){
              return network.exportBylw(queryParams);
            }else if(this.activeName == 10){
              return network.exportOther(queryParams);
            }else{
              return false
            }
					
					}).then(response => {
            downloadFile(response,this.title.dictLabel);
						this.exportLoading = false;
					})
			},
      close(flag){
         if(flag && this.$refs.details){
            this.cgList();
         }
      },
      init(){
         this.getDicts("result_type").then(res=>{
            this.navs = res && res.data || []
            this.$nextTick(()=>{
               this.activeName = this.navs && this.navs[0].dictValue || ''
            })
         })
         let xmlx = 1
         let _path = this.$route.path
         if(_path.indexOf('nation')>-1)xmlx = 1
         else if(_path.indexOf('province')>-1)xmlx=2
         else if(_path.indexOf('kysj')>-1)xmlx=3
         else if(_path.indexOf('srtp')>-1)xmlx=4
         else xmlx = 4
         //获取期次列表
         if(this.$store.getters.user.rolekey != 'student' && this.$store.getters.user.rolekey != 'blacklist'){
            ProjectApi.projectQcList({xmlx}).then(res=>{
            this.nfList = res.data
            this.queryParams.nf = this.queryParams.nf||res.data[0]?.id
            
            
            })
         }
        this.getLists();
        this.cgList()
      },
      getLists(){
         this.loading = true
         network.getXm({nf:this.$route.params.year}).then(res=>{
            // console.log(res);
            this.xmLists = res && res.data || []
             this.loading = false
         })

      },
      cgList(){
         this.$nextTick(()=>{
          setTimeout(() => {
             this.$refs.details.getLists({...this.queryParams,xmejlb: this.xmejlb},total=>this.queryParams.total=total);
            }, 100);
         })
      },
       handleQuery(){
         this.queryParams.pageNum=1;
         this.cgList()
      }
   }
}
</script>

<style lang="scss" scoped>
.top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
</style>
