<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--用户数据-->
      <el-form
        :model="queryParams"
        ref="queryForm"
        :inline="true"
        v-show="showSearch"
        label-width="100px"
      >
        <el-form-item label="项目名称" prop="xmmc">
          <el-input
            v-model="queryParams.xmmc"
            placeholder="请输入项目名称"
            clearable
            size="small"
            style="width: 240px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="负责学生姓名" prop="fzdsxm">
          <el-input v-model="queryParams.fzdsxm" placeholder="负责学生姓名">
          </el-input>
        </el-form-item>
        <el-form-item label="负责学生学号" prop="fzxsxh">
          <el-input v-model="queryParams.fzxsxh" placeholder="负责学生学号">
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            icon="el-icon-search"
            size="mini"
            @click="handleQuery"
            >搜索</el-button
          >
          <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
            >重置</el-button
          >
        </el-form-item>
      </el-form>
      <el-row :gutter="10" class="mb8">
        <right-toolbar
          :showSearch.sync="showSearch"
          @queryTable="getList"
          :columns="columns"
        ></right-toolbar
      ></el-row>
      <el-table border v-loading="loading" :data="ProjectList">
         <el-table-column type="index" width="50" :index="hIndex"  label='序号'/>
        <el-table-column
          v-for="column in _columns"
          :label="column.label"
          :type="column.type"
          align="center"
          :key="column.key"
          :prop="column.prop"
         :show-overflow-tooltip="true"
        >
          <template  slot-scope="{row}">
            <div v-if="column.type=='student'||column.type=='teacher'">
              <personDetail  :formdata="row" :value="column.value" :keys="column.keys" :type="column.type" />
          </div>
           <div style="text-algin:center" v-else>
             {{row[column.prop]}}
           </div>
          </template>
        </el-table-column>

        <el-table-column
          label="操作"
          align="center"
          width="160"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="onReview(scope.row)"
              >查看</el-button
            >
            <el-button
              size="mini"
              type="text"
              v-if="scope.row.dsqrzt == 0||scope.row.dsqrzt == 3"
              icon="el-icon-edit"
              @click="handleResove(scope.row, 1,'确认参与')"
              >确认参与</el-button
            >
            <el-button
               v-if="scope.row.dsqrzt == 0||scope.row.dsqrzt == 3"
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="handleResove(scope.row, -1,'拒绝参与')"
              >拒绝参与</el-button
            >
              <el-button
              v-if="scope.row.dsqrzt == 0||scope.row.dsqrzt == 3"
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="handleResove(scope.row, 3,'退回修改')"
              >退回修改</el-button
            >
            <!-- <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)"
              v-hasPermi="['xm:student:delete']"
              >删除</el-button
            > -->
          </template>
        </el-table-column>
      </el-table>

      <pagination
        v-show="total > 0"
        :total="total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="getList"
      />
    </el-row>
    <el-dialog
      style="min-width:890px;width:80%;margin:0 auto"
      width="100%"
      :visible.sync="reviewVisible"
      @close="reviewVisible = false"
      :title="'查看' + projectType[editType]"
    >
      <review :id="editId" :type="editType" />
    </el-dialog>
  </div>
</template>

<script>
import ProjectApi from "@/api/jxStuProject";
import review from "@/views/jxStuProject/common/reviewProject.vue";
import personDetail from "@/views/jxStuProject/common/personDetail";

export default {
  components: { review,personDetail },
  data() {
    return {
      //编辑框
      dialogVisible: false,
      reviewVisible: false,
      //编辑Id
      editId: null,
      //编辑Type
      editType: "",
      //开始时间
      kssj: "",
      // 遮罩层
      loading: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 项目表格数据
      ProjectList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 默认密码
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        fzxsxh: undefined,
        fzdsxm: undefined,
        xmmc: undefined
      },
      // 项目列表字典
      projectType: {},
      //确认状态
      qrztType: {},
      //导师意见
      dsyj: "",
      // 列信息
      columns: [
        { key: "bh", label: `项目编号`, prop: "bianhao", visible: true },
        {
          key: "xiangmumc",
          label: `项目名称`,
          prop: "xiangmumc",
          visible: true
        },
        { key: "fzdsxm", label: `负责导师`,type:'teacher', value: "fzdsxm",keys:'fzdsgh', visible: true },
        { key: "fzxsxm", label: `负责学生`,type:'student', value: "fzxsxm",keys:'fzxsxh', visible: true },
        { key: "qrzt", label: `状态`, prop: "qrztStr", visible: true },
        { key: "dbfs", label: `分数`, prop: "dbfs", visible: true },
        { key: "shenqjf", label: `经费`, prop: "shenqjf", visible: true }
      ]
    };
  },
  async created() {
    await this.getDicts("stu_project_type").then(res => {
      res.data.map(item => {
        this.projectType[item.dictValue] = item.dictLabel;
      });
    });
    await this.getDicts("qrzt").then(res => {
      res.data.map(item => {
        this.qrztType[item.dictValue] = item.dictLabel;
      });
    });
    this.getList();
  },
  computed: {
    _columns() {
      return this.columns.filter(item => item.visible);
    }
  },
  methods: {
      hIndex (index){
       return (index + 1) + (this.queryParams.pageNum  - 1) * this.queryParams.pageSize;
    },
    /** 查询待提交的项目列表 */
    getList() {
      this.loading = true;
      ProjectApi.teacherGetProjectList(this.queryParams).then(response => {
        this.ProjectList = response.rows.map(item => {
          item.typeStr = this.projectType[item.type];
          item.qrztStr = this.qrztType[item.xmzt];
          item.shenqjf = parseInt(item.shenqjf)
          return item;
        });
        this.total = response.total;
        this.loading = false;
      });
    },

    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.page = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    /** 查看按钮操作 */
    onReview(row) {
      this.editId = row.id;
      this.editType = row.type;
      this.reviewVisible = true;
    },
    //确认或拒绝参加
    handleResove(row, status,text) {
      this.$prompt("请输入意见", text, {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(({ value }) => {
          ProjectApi.teacherConfirm({
            id: row.id,
            qrzt: status,
            yj: value
          }).then(data => {
             this.$message(data.msg);
            this.getList();
          });
        })
        .catch(() => {});
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      this.$confirm(
        '是否确认删除项目名为："' + row.xiangmumc + '" 的项目吗？',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(function() {
           return ProjectApi.delProject(row.id);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        });
    }
  }
};
</script>
