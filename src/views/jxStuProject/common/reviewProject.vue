<template>
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
    <el-row class="title">
      <el-col :span="6"><div>项目经费预算与用途：</div></el-col>
      <el-col class="info" :span="18">
        <el-table border :data="money"  style="width: 100%">
          <el-table-column prop="title" label="开支科目" width="180">
          </el-table-column>
          <el-table-column prop="value" label="预算经费(元)" width="180">
          </el-table-column>
          <el-table-column prop="remark" label="主要用途"> </el-table-column>
        </el-table>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import reviewFactory from "./reviewFactory"
import personDetail from "./personDetail";
import CKReview from "@/components/CKReview";
export default {
  props: ["id","type","xmejlb"],
  components: {
    personDetail,
    CKReview
  },
  data() {
    return {
      loading:false,
      formdata: {},
      list:[],
      money: []
    };
  },
  async created() {
   
    this.getDetail(this.id);
  },
  watch: {
    id(val, oval) {
      if (val == oval || !oval) return;
      this.getDetail(val,this.type);
    }
  },
  methods: {
    async getDetail(id) {
      this.loading=true
      let data = await reviewFactory(id,this.type,this.xmejlb)
          this.list = data.list
          this.money = data.money
          this.formdata = data.data
          this.loading=false
    },
  }
};
</script>
<style lang="scss" scoped>
.reviewProject {
  .title {
    text-align: right;
    //font-size: 20px;
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
