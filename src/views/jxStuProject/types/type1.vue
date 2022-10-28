<template>
  <div class="type1">
    <el-button
      @click="dialogVisible = true"
      :disabled="!disable"
      type="primary"
      style="padding:0"
      plain
    >
      <div class="title">
        <h1>创新项目</h1>
        <p>
          （国创-创新项目、省创-科技创新项目、校或院（系）级SRTP项目、科教协同科研训练项目）
        </p>
      </div>
    </el-button>
    <BaseType
      v-if="dialogVisible"
      :visible.sync="dialogVisible"
      @close="quanxian"
      :close-on-click-modal="false"
      title="科研训练申报"
    />
  </div>
</template>
<script>
import BaseType from "../common/baseType.vue";
import ProjectApi from "@/api/jxStuProject";
export default {
  components: { BaseType },
  props: ["disable"],
  data() {
    return {
      dialogVisible: false,
      checkList:[],
    };
  },
  mounted() {
    // this.sbjy()
  },
  methods: {
    quanxian() {
      this.$parent.getList&&this.$parent.getList();
    },
    // sbjy(){
    //      ProjectApi.checksbjy().then(res => {
    //      this.checkList = res.data
    //   })
    // }
  },
};
</script>



<style lang="scss" scoped>
.type1 {
  .el-button--primary.is-plain:hover,
  .el-button--primary.is-plain:focus {
    color: #74bcff;
    background-color: #e8f4ff;
    border-color: #d1e9ff;
  }
}

.title {
  padding: 16px 45px;
  text-align: center;
  h1 {
    font-size: 18px;
    font-weight: 500;
    color: #2a2a2a;
    line-height: 27px;
  }
  p {
    font-size: 13px;
    font-weight: 400;
    color: #7f7f7f;
    line-height: 20px;
  }
}
</style>