<template>
  <div class="app-container">
    <el-form
      :model="queryForm"
      ref="queryForm"
      :inline="true"
      v-show="showSearch"
      label-width="88px"
    >
      <el-form-item label="管理员工号" prop="xh">
        <el-input v-model="queryForm.xh" size="small" />
      </el-form-item>
      <el-form-item label="管理员姓名" prop="xm">
        <el-input v-model="queryForm.xm" size="small" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" @click="handleSearch"
          >搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
            >重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 功能按钮 -->
    <el-row :gutter="10" class="mb8">
      <el-button type="primary" size="small" @click="handleAdd">新增</el-button>
      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getData"
      ></right-toolbar>
    </el-row>

    <el-table border :data="listData" v-loading="loading">
      <el-table-column label="教工号" align="center" prop="xh" />
      <el-table-column label="姓名" align="center" prop="xm" />
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button size="mini" type="text" @click="edit(scope.row)"
            >编辑</el-button
          >
          <el-button size="mini" type="text" @click="deleteAdmin(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryForm.pageNum"
      :limit.sync="queryForm.pageSize"
      @pagination="getData"
    />

    <el-dialog
      title="新增/修改管理员"
      :before-close="cancel"
      :visible.sync="showDialog"
      width="500px"
    >
      <el-form ref="editForm" :model="editForm" label-width="100px">
        <el-form-item
          :rules="[
            { required: true, message: '请输入教工号', trigger: 'blur' }
          ]"
          label="教工号"
        >
          <el-input @input="getNameById" v-model="editForm.xh" />
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="editForm.xm" />
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="editForm.mm" />
        </el-form-item>
        <!-- <el-form-item label="管理类型">
          <el-checkbox-group v-if="gllxList && gllxList.length" v-model="editForm.gllx">
            <el-checkbox v-for="item in gllxList" :label="item.dictValue" :key="item.dictValue">{{item.dictLabel}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item> -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submit">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import AdminAPI from "@/api/jxbasedata/admin";
import StuApi from "@/api/jxStuProject/index";
export default {
  data() {
    return {
      listData: [],
      queryForm: {
        pageNum: 1,
        pageSize: 20,
        xh: "",
        xm: "",
      },
      total: 0,
      showSearch: true,
      editForm: {
        gllx: [],
        xh: "",
        xm: "",
        mm: ""
      },
      loading: false,
      gllxList: [],
      showDialog: false
    };
  },
  created() {
    this.getData();
    this.getGllxList();
  },
  methods: {
    cancel() {
      this.showDialog = false;
      this.resetForm();
    },

    // 提交
    submit() {
      const params = Object.assign({}, this.editForm, {
        gllx: this.editForm.gllx.join(",")
      });
      if (this.editForm.id) {
        // edit
        AdminAPI.edit(params).then(res => {
          if (res.code == 200) {
            this.msgSuccess("操作成功");
            this.cancel();
            this.getData();
          } else {
            this.msgError(res.msg || "操作失败");
          }
        });
      } else {
        // add
        AdminAPI.add(params).then(res => {
          if (res.code == 200) {
            this.msgSuccess("操作成功");
            this.cancel();
            this.getData();
          } else {
            this.msgError(res.msg || "操作失败");
          }
        });
      }
    },

     resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },

    //更具教工号获取教师
    getNameById() {
      if (!this.editForm.xh) return;
      StuApi.getNameById({ jgh: this.editForm.xh })
        .then(data => {
          this.editForm.xm = data.data?.xm;
          this.editForm.xy = data.data?.xy;
        })
        .catch(err => {
          this.editForm.xm = "";
          this.editForm.xy = "";
        });
    },
    getGllxList() {
      AdminAPI.getGllx().then(res => {
        if (res.code == 200) {
          this.gllxList = res.data;
        }
      });
    },

    handleAdd() {
      this.showDialog = true;
    },

    handleSearch() {
      this.queryForm.pageNum = 1;
      this.getData();
    },

    edit(row) {
      this.showDialog = true;
      this.editForm = Object.assign({}, this.editForm, row);
      if (!row.gllx) {
        this.editForm.gllx = [];
      } else {
        this.editForm.gllx = row.gllx.split(",");
      }
    },

    deleteAdmin(row) {
      this.$confirm(
        '是否确认删除"' + row.xm + '"的管理员？',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          const params = {ids: [row.id]};
          return AdminAPI.delete(params);
        })
        .then(res => {
          if (res.code == 200) {
            this.msgSuccess("操作成功");
            this.getData();
          } else {
            this.msgError(res.msg || "操作失败");
          }
        });
    },

    getData() {
      this.loading = true;
      AdminAPI.getAdminList(this.queryForm).then(res => {
        this.loading = false;
        if (res.code == 200) {
          this.listData = res.rows || [];
          this.total = res.total;
          console.log("listData", this.listData);
        }
      });
    }
  }
};
</script>
<style></style>
