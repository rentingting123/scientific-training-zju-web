<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--用户数据-->
      <el-form
        :model="queryParams"
        ref="queryForm"
        :inline="true"
        v-show="showSearch"
        label-width="68px"
      >
        <el-form-item label="学生学号" prop="xh">
          <el-input
            v-model="queryParams.xh"
            placeholder="请输入学生学号"
            clearable
            size="small"
            style="width: 240px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="学生姓名" prop="xm">
          <el-input
            v-model="queryParams.xm"
            placeholder="请输入学生姓名"
            clearable
            size="small"
            style="width: 240px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="学院名称" prop="xymc">
         <acadSelect  @keyup.enter.native="handleQuery" :style="{width:'240px'}" v-model="queryParams.xybh" />
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
        <el-col :span="1.5">
          <el-button
            type="primary"
            plain
            icon="el-icon-plus"
            size="mini"
            @click="handleAdd"
            v-hasPermi="['system:user:add']"
            >新增</el-button
          >
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="success"
            plain
            icon="el-icon-edit"
            size="mini"
            :disabled="single"
            @click="handleUpdate"
            v-hasPermi="['system:user:edit']"
            >修改</el-button
          >
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="danger"
            plain
            icon="el-icon-delete"
            size="mini"
            :disabled="multiple"
            @click="handleDelete"
            v-hasPermi="['system:user:remove']"
            >删除</el-button
          >
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="info"
            plain
            disabled
            icon="el-icon-upload2"
            size="mini"
            @click="handleImport"
            v-hasPermi="['system:user:import']"
            >导入</el-button
          >
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="warning"
            plain
            disabled
            icon="el-icon-download"
            size="mini"
            :loading="exportLoading"
            @click="handleExport"
            v-hasPermi="['system:user:export']"
            >导出</el-button
          >
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="primary"
            plain
            icon="el-icon-upload"
            size="mini"
            @click="handleSystemAdd"
            v-hasPermi="['system:user:add']"
            >从教务系统导入</el-button
          >
        </el-col>
        <right-toolbar
          :showSearch.sync="showSearch"
          @queryTable="getList"
          :columns="columns"
        ></right-toolbar>
      </el-row>

      <el-table border
        v-loading="loading"
        :data="userList"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="50" align="center" />
        <el-table-column
          :label="columns[0].label"
          align="center"
          key="xymc"
          prop="xymc"
          v-if="columns[0].visible"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          :label="columns[1].label"
          align="center"
          key="xh"
          prop="xh"
          v-if="columns[1].visible"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          :label="columns[2].label"
          align="center"
          key="xm"
          prop="xm"
          v-if="columns[2].visible"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          :label="columns[3].label"
          align="center"
          key="sj"
          prop="sj"
          v-if="columns[3].visible"
          width="120"
        />
        <el-table-column
          :label="columns[4].label"
          align="center"
          key="email"
          prop="email"
          v-if="columns[4].visible"
        />
        <!-- <el-table-column
          :label="columns[5].label"
          align="center"
          key="isdl"
          prop="isdl"
          v-if="columns[5].visible"
        >
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.isdl"
              @change="handleStatusChange(scope.row)"
            ></el-switch>
          </template>
        </el-table-column> -->
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
              @click="handleUpdate(scope.row)"
              v-hasPermi="['system:user:edit']"
              >修改</el-button
            >
            <!-- <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)"
              v-hasPermi="['system:user:remove']"
              >删除</el-button
            > -->
            <!-- <el-button
              size="mini"
              type="text"
              icon="el-icon-key"
              @click="handleResetPwd(scope.row)"
              v-hasPermi="['system:user:resetPwd']"
              >重置</el-button
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

    <!-- 添加或修改参数配置对话框 -->
    <studentEdit :studentId="singleId" @close="close" :title="title" @cb="getList" :open="open"/>

    <!-- 用户导入对话框 -->
    <el-dialog
      :title="upload.title"
      :visible.sync="upload.open"
      width="400px"
      append-to-body
    >
      <el-upload
        ref="upload"
        :limit="1"
        accept=".xlsx, .xls"
        :headers="upload.headers"
        :action="upload.url + '?updateSupport=' + upload.updateSupport"
        :disabled="upload.isUploading"
        :on-progress="handleFileUploadProgress"
        :on-success="handleFileSuccess"
        :auto-upload="false"
        drag
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">
          将文件拖到此处，或
          <em>点击上传</em>
        </div>
        <div class="el-upload__tip" slot="tip">
          <el-checkbox
            v-model="upload.updateSupport"
          />是否更新已经存在的用户数据
          <el-link type="info" style="font-size:12px" @click="importTemplate"
            >下载模板</el-link
          >
        </div>
        <div class="el-upload__tip" style="color:red" slot="tip">
          提示：仅允许导入“xls”或“xlsx”格式文件！
        </div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFileForm">确 定</el-button>
        <el-button @click="upload.open = false">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog
      title="导入结果"
      :visible.sync="errordialog"
      width="500px"
     >
      <div  style="max-height: 500px;width: 100%;overflow-y: auto;" v-html="result"></div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="errordialog = false">取 消</el-button>
        <el-button type="primary" @click="errordialog = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  exportUser,
  resetUserPwd,
  importTemplate
} from "@/api/system/user";
import {
  modifyStudent,
  deleteStudent,
  getStudentList
} from "@/api/jxbasedata/student";
import { getToken } from "@/utils/auth";
import studentEdit from './common/editStudent'
import acadSelect from './common/acadSelect'
import {runJob} from "@/api/monitor/job";
export default {
  name: "User",
  components:{studentEdit,acadSelect},
  data() {
    return {
       result:'',
      errordialog:false,
      //选中被修改或则删除的用户Id
      singleId:'',
      // 遮罩层
      loading: true,
      // 导出遮罩层
      exportLoading: false,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 用户表格数据
      userList: null,
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 岗位选项
      postOptions: [],
      // 角色选项
      roleOptions: [],
      // 表单参数
      form: {},
      // 用户导入参数
      upload: {
        // 是否显示弹出层（用户导入）
        open: false,
        // 弹出层标题（用户导入）
        title: "",
        // 是否禁用上传
        isUploading: false,
        // 是否更新已经存在的用户数据
        updateSupport: 0,
        // 设置上传的请求头部
        headers: { Authorization: "Bearer " + getToken() },
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + "/system/user/importData"
      },
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        xh: undefined,
        xm: undefined,
        xymc: undefined
      },
      // 列信息
      columns: [
        { key: 0, label: `学院`, visible: true },
        { key: 1, label: `学号`, visible: true },
        { key: 2, label: `姓名`, visible: true },
        { key: 3, label: `联系方式`, visible: true },
        { key: 4, label: `EMAIL`, visible: true },
        { key: 5, label: `允许登录`, visible: true },
        { key: 6, label: `创建时间`, visible: true }
      ],
      // 表单校验
      rules: {
        userName: [
          { required: true, message: "用户名称不能为空", trigger: "blur" }
        ],
        nickName: [
          { required: true, message: "用户昵称不能为空", trigger: "blur" }
        ],
        password: [
          { required: true, message: "用户密码不能为空", trigger: "blur" }
        ],
        email: [
          {
            type: "email",
            message: "'请输入正确的邮箱地址",
            trigger: ["blur", "change"]
          }
        ],
        phonenumber: [
          {
            pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
            message: "请输入正确的手机号码",
            trigger: "blur"
          }
        ]
      }
    };
  },
  created() {
    this.getList()
  },
  methods: {
    //定时任务
      handleSystemAdd(){
        this.$confirm('自动从教务接口同步师生信息，预计耗费几个小时，将于当晚0时更新','确认信息',{
            confirmButtonText:'确定',
            cancelButtonText:'取消',
            }).then(()=>{
              return runJob(5,'SYSTEM')
          }).then(res=>{
          this.msgSuccess(res.msg)
        })
      },
    /** 查询用户列表 */
    getList() {
      this.loading = true;
      getStudentList(this.queryParams).then(
        response => {
          this.userList = response.rows;
          this.total = response.total;
          this.loading = false;
        }
      );
    },
    // 用户状态修改
    handleStatusChange(row) {
      let text = row.isdl ? "启用" : "停用";
      this.$confirm('确认要"' + text + '""' + row.xm + '"用户吗?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(function() {
          return modifyStudent(row);
        })
        .then(() => {
          this.msgSuccess(text + "成功");
        })
        .catch(function() {
          row.isdl = !!row.isdl;
        });
    },
    // 取消按钮
    close() {
      console.log('F开始关闭')
      this.open = false;
    },
    // 表单重置
    reset() {
      this.form = {
        id: undefined,
        userName: undefined,
        nickName: undefined,
        password: undefined,
        phonenumber: undefined,
        email: undefined,
        sex: undefined,
        status: "0",
        remark: undefined,
        postIds: [],
        roleIds: []
      };
      this.resetForm("form");
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
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.open = true;
      console.log(this.open)
      this.singleId=null;
      this.title = "添加用户";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      console.log("row",row)
      this.singleId = row.id || this.ids[0]
      this.open = true;
      this.title = "修改用户";
    },
    /** 重置密码按钮操作 */
    handleResetPwd(row) {
      this.$prompt('请输入"' + row.xm + '"的新密码', "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(({ value }) => {
          resetUserPwd(row.id, value).then(response => {
            this.msgSuccess("修改成功，新密码是：" + value);
          });
        })
        .catch(() => {});
    },

    /** 删除按钮操作 */
    handleDelete(row) {
      const userIds = row.id?[row.id]:this.ids;
      this.$confirm(
        '是否确认删除用户编号为"' + userIds + '"的学生吗？',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(function() {
          return deleteStudent({ids:userIds});
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        });
    },
    /** 导出按钮操作 导入导出暂时不做2021-6-10 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm("是否确认导出所有用户数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.exportLoading = true;
          return exportUser(queryParams);
        })
        .then(response => {
          this.download(response.msg);
          this.exportLoading = false;
        });
    },
    /** 导入按钮操作 */
    handleImport() {
      this.upload.title = "用户导入";
      this.upload.open = true;
    },
    /** 下载模板操作 */
    importTemplate() {
      importTemplate().then(response => {
        this.download(response.msg);
      });
    },
    // 文件上传中处理
    handleFileUploadProgress(event, file, fileList) {
      this.upload.isUploading = true;
    },
    // 文件上传成功处理
    handleFileSuccess(response, file, fileList) {
      this.upload.open = false;
      this.upload.isUploading = false;
      this.$refs.upload.clearFiles();
      this.result = response.msg
      this.errordialog = true
      // this.$alert(response.msg, "导入结果", { dangerouslyUseHTMLString: true });
      this.getList();
    },
    // 提交上传文件
    submitFileForm() {
      this.$refs.upload.submit();
    }
  }
};
</script>
