<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--用户数据-->
        <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
          <el-form-item label="专家工号" prop="zjgh">
            <el-input
              v-model="queryParams.zjgh"
              placeholder="请输入专家工号"
              clearable
              size="small"
              style="width: 240px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="专家姓名" prop="zjmc">
            <el-input
              v-model="queryParams.zjmc"
              placeholder="请输入专家姓名"
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
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
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
              v-hasPermi="['system:zhuanjia:add']"
              
            >新增</el-button>
            <!-- v-hasPermi="['system:user:add']" -->
          </el-col>
          <!-- <el-col :span="1.5">
            <el-button
              type="success"
              plain
              icon="el-icon-edit"
              size="mini"
              :disabled="single"
              @click="handleUpdate"
              v-hasPermi="['system:zhuanjia:updata']"
            >修改</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="danger"
              plain
              icon="el-icon-delete"
              size="mini"
              :disabled="multiple"
              @click="handleDelete"
              v-hasPermi="['system:zhuanjia:del']"
            >删除</el-button> -->
          <!-- </el-col> -->
          <right-toolbar :showSearch.sync="showSearch" @queryTable="getList" :columns="columns"></right-toolbar>
        </el-row>

        <el-table border v-loading="loading" :data="userList" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="50" align="center" />
          <el-table-column label="编号" align="center" key="id" prop="id"  :show-overflow-tooltip="true" />
          <el-table-column label="学院" align="center" key="xymc" prop="xymc" v-if="columns[0].visible" :show-overflow-tooltip="true" />
          <el-table-column label="专家工号" align="center" key="zjgh" prop="zjgh" v-if="columns[1].visible" :show-overflow-tooltip="true" />
          <el-table-column label="姓名" align="center" key="zjmc" prop="zjmc" v-if="columns[2].visible" :show-overflow-tooltip="true" />
          <el-table-column label="性别" align="center" key="zjxb" prop="zjxb" v-if="columns[3].visible" width="120" >
             <template slot-scope="scope">
               {{scope.row.zjxb=='1'?'男':'女'}}
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
                @click="handleUpdate(scope.row)"
               v-hasPermi="['system:zhuanjia:updata']"
              >修改</el-button>
               <!-- v-hasPermi="['system:zj:edit']" -->
              <el-button
                size="mini"
                type="text"
                icon="el-icon-delete"
                @click="handleDelete(scope.row)"
                 v-hasPermi="['system:zhuanjia:del']"
              >删除</el-button>
              <!-- v-hasPermi="['system:zj:delete']" -->
            </template>
          </el-table-column>
        </el-table>

        <pagination
          v-show="total>0"
          :total="total"
          :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize"
          @pagination="getList"
        />
    </el-row>

    <!-- 添加或修改参数配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
    <el-form ref="elForm" :model="formData" size="medium" label-width="100px">
        <el-form-item label="学院" prop="xybh">
        <acadSelect  :style="{width:'70%'}" @onChange="xyChange" v-model="formData.xybh" />
        </el-form-item>
        <el-form-item label="专家工号" prop="zjgh">
          <el-input v-model="formData.zjgh" placeholder="请输入专家工号" clearable :style="{width: '100%'}">
          </el-input>
        </el-form-item>
        <el-form-item label="专家姓名" prop="zjmc">
          <el-input v-model="formData.zjmc" placeholder="请输入专家姓名" clearable :style="{width: '100%'}">
          </el-input>
        </el-form-item>
        <el-form-item label="性别:" prop="zjxb">
          <el-radio-group v-model="formData.zjxb" size="medium">
            <el-radio v-for="(item, index) in zjxbOptions" :key="index" :label="item.value"
              :disabled="item.disabled">{{item.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="open=false">取消</el-button>
        <el-button type="primary" @click="submitForm">确定</el-button>
      </div>
    </el-dialog>

    <!-- 用户导入对话框 -->
    <el-dialog :title="upload.title" :visible.sync="upload.open" width="400px" append-to-body>
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
          <el-checkbox v-model="upload.updateSupport" />是否更新已经存在的用户数据
          <el-link type="info" style="font-size:12px" @click="importTemplate">下载模板</el-link>
        </div>
        <div class="el-upload__tip" style="color:red" slot="tip">提示：仅允许导入“xls”或“xlsx”格式文件！</div>
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
import { delUser,  importTemplate } from "@/api/system/user";
import {modifyExpert,addExpert,getExpertList} from "@/api/jxbasedata/expert"
import acadSelect from './common/acadSelect'
import { getToken } from "@/utils/auth";

export default {
  name: "expert",
  components:{acadSelect},
  data() {
    return {
       result:'',
      errordialog:false,
      // 遮罩层
      loading: true,
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
      // 默认密码
      initPassword: undefined,
      // 状态数据字典
      statusOptions: [],
      // 性别状态字典
      sexOptions: [],
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
        zjgh: undefined,
        zjmc: undefined,
        xymc: undefined,
        
      },
      // 列信息
      columns: [
        { key: 0, label: `学院`, visible: true },
        { key: 1, label: `专家工号`, visible: true },
        { key: 2, label: `姓名`, visible: true },
        { key: 3, label: `性别`, visible: true },
      ],
      // 表单校验
      formData: {
        xybh: undefined,
        zjgh: undefined,
        zjmc: undefined,
        xymc:'',
        zjxb: '1',
      },
      zjxbOptions: [{
        "label": "男",
        "value": '1'
      }, {
        "label": "女",
        "value": '2'
      }],
    };
  },
  created() {
    this.getList();
    this.getDicts("sys_normal_disable").then(response => {
      this.statusOptions = response.data;
    });
    this.getDicts("sys_user_sex").then(response => {
      this.sexOptions = response.data;
    });
    this.getConfigKey("sys.user.initPassword").then(response => {
      this.initPassword = response.msg;
    });
  },
  methods: {
    /** 查询用户列表 */
    getList() {
      this.loading = true;
      getExpertList(this.queryParams).then(response => {
          this.userList = response.rows;
          this.total = response.total;
          this.loading = false;
        }
      );
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    //选择学院
    xyChange(item){
      this.formData.xymc =item.label
    },
    // 表单重置
    reset() {
      this.form = {
        userId: undefined,
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
        this.title = "添加专家";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
        this.open = true;
        this.formData =row
        this.title = "修改用户";
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["elForm"].validate(valid => {
        if (valid) {
          if (this.formData.id!=undefined) {
            modifyExpert(this.formData).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addExpert(this.formData).then(response => {
              this.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const userIds = row.id || this.ids;
      this.$confirm('是否确认删除用户编号为"' + userIds + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delUser(userIds);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(e=>{console.log(e)})
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