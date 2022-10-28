<template>
   <div  class="app-container">
      <el-button
            type="primary"
            icon="el-icon-search"
            size="mini"
            @click="handleExport"
            >导出</el-button
          >
      <div v-if="!type" class="top">
         <div> </div>
         <!-- 论文成果（正式发表） -->
         <lwcgAdd :options='xmLists' :close='close' v-if="activeName==1" />
         <!-- 获奖成果 -->
         <hjcgAdd :options='xmLists' :close='close' v-else-if="activeName==2" />
         <!-- 评议鉴定成果 -->
         <pyjdAdd :options='xmLists' :close='close' v-else-if="activeName==3" />
         <!-- 推广成果 -->
         <tgcgAdd :options='xmLists' :close='close' v-else-if="activeName==4" />
         <!-- 论著成果 -->
         <lzcgAdd :options='xmLists' :close='close' v-else-if="activeName==5" />
         <!-- 专利成果 -->
         <zlcgAdd :options='xmLists' :close='close' v-else-if="activeName==6" />
         <!-- 经济效益 -->
         <jjxyAdd :options='xmLists' :close='close' v-else-if="activeName==7" />
         <!-- 知识产权（产品，软件等 -->
         <zscqAdd :options='xmLists' :close='close' v-else-if="activeName==8" />
         <!-- 与“毕业论文（设计）”，学科竞赛等其他学习环节结合情况 -->
         <bylwAdd :options='xmLists' :close='close' v-else-if="activeName==9" />
         <!-- 其他成果 -->
         <qtcgAdd :options='xmLists' :close='close' v-else-if="activeName==10" />
      </div>
      <el-tabs v-model="activeName" type="card">
         <el-tab-pane v-for="item in navs" :key="item.id" :label="item.dictLabel" :name="item.dictValue">
         </el-tab-pane>
         <!-- 论文成果（正式发表） -->
         <lwcg v-bind="$attrs" ref='details' :options='xmLists' v-if="activeName==1" />
         <!-- 获奖成果 -->
         <hjcg v-bind="$attrs" ref='details' :options='xmLists' v-else-if="activeName==2" />
         <!-- 评议鉴定成果 -->
         <pyjd v-bind="$attrs" ref='details' :options='xmLists' v-else-if="activeName==3" />
         <!-- 推广成果 -->
         <tgcg v-bind="$attrs" ref='details' :options='xmLists' v-else-if="activeName==4" />
         <!-- 论著成果 -->
         <lzcg v-bind="$attrs" ref='details' :options='xmLists' v-else-if="activeName==5" />
         <!-- 专利成果 -->
         <zlcg v-bind="$attrs" ref='details' :options='xmLists' v-else-if="activeName==6" />
         <!-- 经济效益 -->
         <jjxy v-bind="$attrs" ref='details' :options='xmLists' v-else-if="activeName==7" />
         <!-- 知识产权（产品，软件等 -->
         <zscq v-bind="$attrs" ref='details' :options='xmLists' v-else-if="activeName==8" />
         <!-- 与“毕业论文（设计）”，学科竞赛等其他学习环节结合情况 -->
         <bylw v-bind="$attrs" ref='details' :options='xmLists' v-else-if="activeName==9" />
         <!-- 其他成果 -->
         <qtcg v-bind="$attrs" ref='details' :options='xmLists' v-else-if="activeName==10" />
         
      </el-tabs>
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
   props:['type','nf','xmmc'],
   data(){
      return{
         activeName: '',
         navs: [],
         index:'',
         xmLists: [],
         title:''
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
   created(){
      this.init();
      this.getLists();
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
           this.$parent.handleExport(this.index,this.title)
           
    },
      close(flag){
         if(flag && this.$refs.details){
            this.$refs.details.getLists();
         }
      },
      init(){
         this.getDicts("result_type").then(res=>{
            this.navs = res && res.data || []
            this.$nextTick(()=>{
               this.activeName = this.navs && this.navs[0].dictValue || ''
            })
         })
      },
      getLists(){
         network.getXm({nf:this.$route.params.year}).then(res=>{
            this.xmLists = res && res.data || []
         })
         
      }
   }
}
</script>

<style lang='scss' scoped>
.top{
   display: flex;
   justify-content: space-between;
   align-items: center;
   margin-bottom: 20px;
}
</style>