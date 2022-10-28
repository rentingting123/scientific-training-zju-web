<template>
<div class="type1">
  <el-button  style="padding:0;width:630px"  @click="dialogVisible = true" :disabled="!disable" type="primary" plain>
     <div class="title">
    <h1>科研实践</h1>
    <p>（包括科教协同的科研实践项目，只限参与过或正在参与四级大学生创新创业项目的学生申报）</p>
    </div>
   </el-button>
     <Table 
        :visible.sync="dialogVisible"
        @close="dialogVisible = false"
        :close-on-click-modal='false'
        title="科研实践申报"
        @firstopen = 'closeFirst'
        ref="child"
        :key="componentKey"
        v-if='dialogVisible' />
      <BaseTypes 
      :sbData='sbData'
       v-if="dialogVisible1"
        :visible.sync="dialogVisible1"
        @close="quanxian"
        :close-on-click-modal='false'
        @find="quanxian"
        title="科研实践申报"
        />
  </div>
</template>
<script>
import Table from '../common/baseType6Table.vue'
import BaseTypes from '../common/baseType6.vue'
export default {
  components: { Table,BaseTypes },
  props: ['disable'],
  data() {
    return {
      dialogVisible: false,
      dialogVisible1:false,
      sbData:null,
      componentKey: 0,
    };
  },
  methods: {
    forceRerender() {
      this.componentKey += 1; 
    },
    quanxian(){
      this.dialogVisible = false
      this.forceRerender()
      this.$parent.getList();
    },
    closeFirst(data){
      this.sbData = data
      this.dialogVisible1 = true
      // this.dialogVisible = false
    }
  }
};
</script>



<style lang="scss" scoped>
.type1{
.el-button--primary.is-plain:hover, .el-button--primary.is-plain:focus{
      color: #74bcff;
        background-color: #e8f4ff;
        border-color: #d1e9ff;
    }
}
  
.title{
    padding:16px 35px;
    // background-color: #F2F8FF;
    // cursor: pointer;
    text-align: center;
    h1{
        font-size: 18px;
        font-weight: 500;
        color: #2A2A2A;
        line-height: 27px;
    }
    p{
        font-size: 13px;
        font-weight: 400;
        color: #7F7F7F;
        line-height: 20px;
    }
}
</style>