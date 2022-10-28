<template>
<div class="type1">
  <el-button  style="padding:0" @click="dialogVisible = true" :disabled="!disable" type="primary" plain>
   <div class="title">
    <h1 >创业实践</h1>
    <p>（国创）</p>
      </div>
</el-button>
    <BaseType 
        v-if="dialogVisible"
        :visible.sync="dialogVisible"
        @close="quanxian"
        :close-on-click-modal='false'
        title="申报创业实践项目"
         />
</div>
 
</template>
<script>
import BaseType from '../common/baseType3.vue'
export default {
  components: { BaseType },
  props: ['disable'],
  data() {
    return {
      dialogVisible: false,
    };
  },
  mounted() {},
  methods: {
    quanxian(){
      this.$parent.getList();
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
    padding:16px 45px;
    // background-color: #F2F8FF;
    // cursor: pointer;
    text-align: center;
    width: 306px;
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