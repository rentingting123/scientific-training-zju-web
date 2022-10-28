<template>
  <div class="type1">
    <el-button   style="padding:0" @click="visible = true" :disabled="!disable" type="primary" plain>
    <div class="title">
    <h1>成果推广</h1>
    <p>（省创）</p>
      </div>
  </el-button>
      <BaseType 
       v-if="visible"
        :visible.sync="visible"
        @close="quanxian"
        :close-on-click-modal='false'
        title="成果推广"
        />
  </div>
</template>
<script>
import BaseType from '../common/baseType4.vue'
export default {
  components: { BaseType },
  props: ['disable'],
  data() {
    return {
      visible: false,
    };
  },
  methods: {
    quanxian(){
      // console.log('close',this.visible)
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