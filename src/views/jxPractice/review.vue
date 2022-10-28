<template>
 <jxDialog @open="onOpen"  v-on="$listeners" v-bind="$attrs">
  <div v-loading="loading" class="reviewProject">
    <el-row class="title" v-for="_list in list" :key="_list.title">
      <el-col :span="6">
        <div>{{ _list.title }}：</div>
      </el-col>
      <el-col class="info" :span="18">
        <personDetail
          v-if="_list.key"
          :formdata="formdata"
          :value="_list.value"
          :keys="_list.key"
          :type="_list.type"
        />
        <div v-else>
          <CKReview :html="formdata[_list.value]" />
        </div>
      </el-col>
    </el-row>
  </div>
 </jxDialog>
</template>
<script>
import ProjectApi from "@/api/jxStuProject";
import CKReview from "@/components/CKReview";
import personDetail from "@/views/jxStuProject/common/personDetail";
import jxDialog from '@/components/jxDialog'
export default {
  props: ["id","type"],
  components: {
    CKReview
    ,jxDialog
    ,personDetail
  },
  data() {
    return {
      loading:false,
      formdata: {},
      list:[
          {
            title: "教师科研项目名称",
            value: "ktmc"
            },
            {
            title: "是否文科科研项目",
            value: "sfwkkyxmStr"
            },
            {
                title:'负责人姓名',
                value:'jskyxmFzrxm'
            },
            {
                title:'依托单位',
                value:'jskyxmYtdw',
            },
            {
                title:'教师科研项目批准号',
                value:'jskyxmpzh',
            },
             {
                title:'教师科研项目批准年度',
                value:'jskyxmPznd',
            },
             {
                title:'科研项目简介',
                value:'jskyxmjj',
            },
             {
                title:'科研实践研究题目',
                value:'jskyxmmc',
            },
             {
                title:'是否校外项目',
                value:'sfxwStr',
            },
            {
                title: "导师信息",
                value: "dsxm",
                key: "jgh",
                type: "teacher"
            },
             {
                title:'研究年限',
                value:'yjnx',
            },
             {
                title:'课题内容简介及研究要求',
                value:'ktnrjyjyq',
            },
             {
                title:'课题预期成效',
                value:'ktyqcx',
            },
             {
                title:'成果形式',
                value:'cgxs',
            },
            {
                title:'课题对学生团队专业背景要求及其他',
                value:'ktxsbjyqjqt',
            },
      ],
    };
  },
  methods: {
    onOpen(){
         this.loading=true
          ProjectApi.practiceDetail({xtid:this.id}).then(res=>{
              res.data.sfwkkyxmStr = res.data.sfwkkyxm==1?'是':'否'
              res.data.sfxwStr = res.data.sfxw ==1?'是':'否'
              this.formdata = res.data
              this.loading=false
      })
    },
  }
};
</script>
<style lang="scss" scoped>
.reviewProject {
    width: 100%;
  .title {
    text-align: right;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    // font-weight: 900;
    margin-bottom: 15px;
    padding-bottom: 15px;
  }
  .info {
    border-left: 1px solid;
    font-size: 14px;
    text-align: left;
    padding-left: 15px;
    min-height: 24px;
  }
}
</style>
