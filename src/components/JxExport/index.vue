<template>
  <div class="top-right-btn">
    <el-row>
        <el-button v-bind="$attrs" @click="showColumn()" >
          <slot></slot>
        </el-button>
    </el-row>
    <el-dialog  :title="title" :visible.sync="open" append-to-body>
      <el-transfer
        v-loading="loading"
        :titles="['导出字段', '不导出字段']"
        v-model="value"
        :data="columns"
        @change="dataChange"
      ></el-transfer>
    <span slot="footer" class="dialog-footer">
      <el-button @click="open = false">取 消</el-button>
      <el-button type="primary" @click="confirmHandle">确 定</el-button>
    </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      // 显隐数据
      value: [],
      // 弹出层标题
      title: "导出选择",
      // 是否显示弹出层
      open: false,
      columns:[],
      loading:false,
    };
  },
  props:{
    fildKey:{
      require:true,
      type:String
      //字典名称
    }
  },
  methods: {
    // 刷新
    refresh() {
      this.$emit("queryTable");
    },
    // 右侧列表元素变化
    dataChange(data) {
      for (var item in this.columns) {
        const key = this.columns[item].key;
        this.columns[item].visible = !data.includes(key);
      }
    },
    // 打开显隐列dialog
    showColumn() {
      this.loading = true
      this.getDicts(this.fildKey).then(res=>{
        this.columns = res.data.map(item=>({
          key:item.dictValue,
          label:item.dictLabel,
          visible:true
        }))
         this.loading = false
      })
      
      this.open = true;
    
    },
    //确定导出按钮
    confirmHandle(){
       this.$emit('done',this.columns.filter(a=>a.visible))
    }
  },
};
</script>
<style lang="scss" scoped>

</style>
