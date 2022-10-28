<template>
  <div class="app-container">
    <el-form
      :model="queryForm"
      ref="queryForm"
      :inline="true"
      label-width="88px"
    >
      <el-form-item label="项目类型">
        <el-select v-model="queryForm.xmlx" @change="qcList" filterable placeholder="项目类别">
          <el-option
            v-for="item in xmlxList"
            :key="item.dictValue"
            :label="item.dictLabel"
            :value="item.dictValue"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="项目期次">
        <el-select v-model="queryForm.term"  placeholder="项目期次">
          <el-option
            v-for="item in xmqcList"
            :key="item.id"
            :label="item.value"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="mini" @click="getData">搜索</el-button>
      </el-form-item>
    </el-form>

    <el-table border :data="listData">
      <el-table-column label="时间节点名称" align="center" prop="sysname" />
      <el-table-column label="开始时间" align="center">
        <template slot-scope="scope">
          <el-date-picker
            v-model="scope.row.startdate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
          >
          </el-date-picker>
          <el-button
            size="mini"
            type="text"
            @click="handleEdit(scope.row, 'start')"
            >设置</el-button
          >
        </template>
      </el-table-column>

      <el-table-column label="结束时间" align="center">
        <template slot-scope="scope">
          <el-date-picker
            v-model="scope.row.enddate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
          >
          </el-date-picker>
          <el-button
            size="mini"
            type="text"
            @click="handleEdit(scope.row, 'end')"
            >设置</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import TimeAPI from "@/api/jxsyscig/time";

export default {
  data() {
    return {
      listData: [],
      queryForm: { xmlx: "", type: "" ,term:""},
      basicForm: {},
      xmlxList: [],
      xmqcList: []
    };
  },
  created() {
    const p1 = this.getDicts("sbsj_lx");
    Promise.all([p1]).then(result => {
      const res1 = result[0];
      this.xmlxList = res1.data;
      this.queryForm.xmlx = res1.data?.[0].dictValue;
      this.qcList()
    });
  },
  methods: {
    handleEdit(row, type) {
      TimeAPI.updateTsetsystime(row).then(res => {
        if (res.code == 200) {
          this.msgSuccess("设置成功");
        } else {
          this.msgError(res.msg || "操作失败");
        }
      });
    },
    qcList(){
        TimeAPI.getXmqcList({ xmlx: this.queryForm.xmlx }).then(res=>{
           this.xmqcList=res.data
           this.queryForm.term = res.data[0].id;
           this.getData();
        })
    },
    getData() {
      const params = {
        term: this.queryForm.term,
        xmlx: this.queryForm.xmlx,
        pagesize: 10,
        page: 1
      };
      TimeAPI.getData({ ...params }).then(res => {
        if (res.code == 200) {
           this.listData=[]
          res.data.forEach(item => {
            if(item.syskey == "sbxm"){
              this.listData.push(item)
            }else if(item.syskey == "xgxm"){
              this.listData.push(item)
            }else if(item.syskey == "mrsbsj"){
              item.sysname = '项目默认起止时间'
              this.listData.push(item)
            }
          })
        }
      });
    }
  }
};
</script>
<style></style>
