<template>
  <div class="app-container">
    <el-table border v-loading="loading" stripe  :data="baseList">
     
      <el-table-column label="类型" align="center" prop="type"  />
      <el-table-column label="名称" align="center" prop="name" />
      <el-table-column label="设置值" align="center"  class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-input style="width:100px;disply:inline-block;margin-right: 15px" v-model="scope.row.value"/>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-check"
            @click="handleSave(scope.row)"
            v-hasPermi="['system:setbase:save']"
          >确定</el-button>
        </template>
      </el-table-column>
    </el-table>

  </div>
</template>

<script>
import { getBaseList,modifyBase } from "@/api/jxsyscig/base";

export default {
  name: "Base",
  data() {
    return {
      // 遮罩层
      loading: true,
      baseList:[],
      total:'',
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询公告列表 */
    getList() {
      this.loading = true;
      getBaseList().then(response => {
        this.baseList = response.data;
        this.loading = false;
      });
    },
    handleSave(row){
      // /systemset/updatecyrs
        this.loading = true;
        modifyBase(row).then(res=>{
            if(res.code==200) this.msgSuccess("修改成功");
            this.loading = false;
        })
    }
  }
};
</script>