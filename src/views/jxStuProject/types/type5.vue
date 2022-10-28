<template>
<div class="type1">
  <el-button  style="padding:0"  @click="dialogVisible = false" disabled type="primary" plain>
  <div  class="title">
    <h1>创业孵化</h1>
    <p>（省创）暂不支持</p>
      </div>

    <el-dialog
      style="min-width:890px;width:80%;margin:0 auto"
      width="100%"
       v-if="dialogVisible"
      :visible.sync="dialogVisible"
      @close="dialogVisible = false"
      :close-on-click-modal='false'
      title="科研训练申报"
    >
      <BaseType v-if='dialogVisible' :visible.sync="dialogVisible"/>
    </el-dialog>
</el-button>
</div>

</template>
<script>
import BaseType from '../common/baseType.vue'
export default {
  components: { BaseType },
  props: ['open'],
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
    // cursor: not-allowed;
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