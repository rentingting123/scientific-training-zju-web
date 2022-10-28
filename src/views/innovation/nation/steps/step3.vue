<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--用户数据-->
      <div><ProjectPipe type="end" /></div>
      <el-form
        style="margin-top: 10px"
        :model="queryParams"
        ref="queryForm"
        :inline="true"
        v-show="showSearch"
        label-width="100px"
      >
        <el-form-item label="年份筛选" prop="nf">
          <el-select
            v-model="queryParams.nf"
            placeholder="请选择"
            @change="getList()"
          >
            <el-option
              v-for="item in nfList"
              :key="item.id"
              :label="item.value"
              :value="item.id"
              style="width: 230px"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item
          v-hasPermi="['sys:nation:xmtype']"
          label="按项目状态"
          prop="xmzt"
        >
          <el-select
            v-model="queryParams.xmzt"
            placeholder="请选择"
            @change="getList()"
          >
            <el-option label="全部" :value="null"></el-option>
            <el-option
              v-for="(item, key) in xmztpes"
              :key="key"
              :label="item"
              :value="key"
              style="width: 230px"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item
          v-hasPermi="['sys:nation:school']"
          label="按学院"
          prop="xybh"
        >
          <el-select
            v-model="queryParams.xybh"
            placeholder="请选择"
            @change="getList()"
          >
            <el-option label="全部学院" :value="null"></el-option>
            <el-option
              v-for="item in xyList"
              :key="item.xybh"
              :label="item.xymc"
              :value="item.xybh"
              style="width: 230px"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          v-hasPermi="['sys:nation:school']"
          label="项目类型"
          prop="xmlx"
        >
          <el-select
            v-model="queryParams.xmlx"
            clearable
            filterable
            placeholder="请选择"
            @change="getList()"
          >
            <el-option
              v-for="(key, value) in xmlboptions"
              :key="key"
              :label="value"
              :value="key"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="项目名称" prop="xmmc">
          <el-input
            @change="getList()"
            v-model="queryParams.xmmc"
            placeholder="请输入项目名称"
            clearable
            size="small"
            style="width: 230px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="负责学生姓名" prop="fzxsxm">
          <el-input
            v-model="queryParams.fzxsxm"
            @change="getList()"
            placeholder="负责学生姓名"
            style="width: 230px"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="负责学生学号" prop="fzxsxh">
          <el-input
            v-model="queryParams.fzxsxh"
            @change="getList()"
            placeholder="负责学生学号"
            style="width: 230px"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="负责导师" prop="fzdsxm">
          <el-input
            v-model="queryParams.fzdsxm"
            @change="getList()"
            placeholder="负责导师姓名"
            style="width: 230px"
          >
          </el-input>
        </el-form-item>
        <el-form-item style="margin-left: 15px">
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
        <el-col :span="1.5" style="padding-left: 0">
          <jx-export
            type="warning"
            plain
            fildKey="lx_field"
            size="mini"
            @done="handleExport"
            >导出</jx-export
          >
        </el-col>
        <el-col :span="1.5" style="padding-left: 0">
          <improtFile
            v-hasRole="['tadmin', 'xyadmin']"
            url="/project/importjt"
            title="批量导入"
            :close="getList"
            download="https://web.moocollege.com/mooc/schooladmin/%E7%BB%93%E9%A2%98%E5%AD%A6%E9%99%A2%E5%AE%A1%E6%A0%B8.xlsx"
          />
        </el-col>
        <el-col :span="1.5" style="padding-left: 0">
          <el-button
            v-hasRole="['xyadmin']"
            type="warning"
            plain
            fildKey="lx_field"
            size="mini"
            :loading="exportLoading"
            @click="handleExportAllbg"
            >下载全部结题报告</el-button
          >
        </el-col>
        <!-- <el-col :span="1.5" style="padding-left: 0">
           <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          :loading="exportLoading"
          @click="handleExportallPDF"
          v-hasPermi="['xm:batch:dcpdf']"
        >导出全部PDF</el-button>
        </el-col> -->
        <div v-hasRole="['tadmin']">
          <!-- <el-col :span="1.5" style="padding-left:0;">
          <el-button
            type="danger"

            icon="el-icon-delete"
            size="mini"
            @click="handleDelete()"
            >批量删除</el-button
          >
        </el-col> -->
          <el-col :span="1.5">
            <el-button
              :disabled="ids.length < 1"
              type="success"
              icon="el-icon-check"
              size="mini"
              @click="handleConfirm(1)"
              >批量验收</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="danger"
              :disabled="ids.length < 1"
              icon="el-icon-close"
              size="mini"
              @click="handleConfirm(-1)"
              >批量拒绝</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="warning"
              :disabled="ids.length < 1"
              plain
              icon="el-icon-remove-outline"
              size="mini"
              @click="handleConfirm(-16)"
              >批量中止</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="warning"
              :disabled="ids.length < 1"
              plain
              icon="el-icon-warning-outline"
              size="mini"
              @click="handleConfirm(-50)"
              >批量暂缓</el-button
            >
          </el-col>
        </div>
        <right-toolbar
          :showSearch.sync="showSearch"
          @queryTable="getList"
          :columns="columns"
        ></right-toolbar
      ></el-row>
      <el-table
        border
        v-loading="loading"
        :data="ProjectList"
        @selection-change="handleSelectionChange"
      >
        <!-- <el-table-column type="selection" :selectable="row=>row.xmzt==-15" width="50" align="center" /> -->
        <el-table-column type="selection" :selectable="selectable" width="55" />
        <el-table-column type="index" :index="hIndex" width="50" label="序号" />
        <el-table-column
          v-for="column in _columns"
          :label="column.label"
          :type="column.type"
          align="center"
          :key="column.key"
          :min-width="column.width || null"
          :prop="column.prop"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="{ row }">
            <div v-if="column.type == 'student' || column.type == 'teacher'">
              <personDetail
                :formdata="row"
                :value="column.value"
                :keys="column.keys"
                :type="column.type"
              />
            </div>

            <div
              v-else-if="
                $store.getters.role == 'xyadmin' &&
                column.key == 'qrzt' &&
                (row.xmzt == 13 || row.xmzt == 16)
              "
            >
              <el-button
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="submitMiddle(row)"
                >{{ row[column.prop] }}</el-button
              >
            </div>
            <div
              v-else-if="
                ($store.getters.role == 'xyadmin' ||
                  $store.getters.role == 'tadmin') &&
                column.key == 'qrzt' &&
                row.xmzt == 12
              "
            >
              <el-button
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="submitMiddle(row, 1)"
                >{{ row[column.prop] }}</el-button
              >
            </div>
            <div style="text-algin: center" v-else>
              {{ row[column.prop] }}
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
              icon="el-icon-download"
              v-if="
                ($store.getters.user.rolekey == 'tadmin' && scope.row.jtpdf) ||
                ($store.getters.user.rolekey == 'xyadmin' && scope.row.jtpdf)
              "
              @click="handlePDF(scope.row)"
              >结题PDF</el-button
            >
            <div v-if="$store.getters.user.rolekey == 'tadmin'">
              <a v-if="scope.row.spy" :href="scope.row.spy" download>
                <el-button size="mini" type="text" icon="el-icon-download"
                  >下载系统审批页</el-button
                ></a
              >

              <el-button
                size="mini"
                type="text"
                icon="el-icon-check"
                v-if="adminComfirm(scope.row.xmzt)"
                @click="
                  handleConfirm(
                    1,
                    [scope.row.id],
                    scope.row.xmzt,
                    scope.row.xiangmumc
                  )
                "
                >同意验收</el-button
              >
              <el-button
                size="mini"
                type="text"
                icon="el-icon-close"
                v-if="adminComfirm(scope.row.xmzt)"
                @click="
                  handleConfirm(
                    -1,
                    [scope.row.id],
                    scope.row.xmzt,
                    scope.row.xiangmumc
                  )
                "
                >拒绝验收</el-button
              >

              <!-- <div v-hasRole="['tadmin']">  -->
              <el-button
                size="mini"
                type="text"
                icon="el-icon-remove-outline"
                v-if="adminComfirm(scope.row.xmzt)"
                @click="
                  handleConfirm(
                    -16,
                    [scope.row.id],
                    scope.row.xmzt,
                    scope.row.xiangmumc
                  )
                "
                >中止验收</el-button
              >
              <!-- <el-button
                  size="mini"
                  type="text"
                  icon="el-icon-warning-outline"
                   v-if="adminComfirm(scope.row.xmzt)"
                  @click="handleConfirm(-50,[scope.row.id],scope.row.xmzt,scope.row.xiangmumc)">暂缓验收</el-button> -->

              <!-- <div v-hasRole="['xyadmin']"> 
                 <el-button
                  size="mini"
                  type="text"
                  icon="el-icon-remove-outline"
                   v-if="adminComfirm(scope.row.xmzt)"
                  @click="handleConfirm(-16,[scope.row.id],scope.row.xmzt)">中止验收</el-button>
                 <el-button
                  size="mini"
                  type="text"
                  icon="el-icon-warning-outline"
                   v-if="adminComfirm(scope.row.xmzt)"
                  @click="handleConfirm(-50,[scope.row.id],scope.row.xmzt)">暂缓验收</el-button>
                </div> -->

              <jxUpload
                accept=".pdf"
                :change="(val) => fileUpload(val, scope.row, '6')"
              >
                <el-button size="small" icon="el-icon-upload" type="text"
                  >上传盖章版审批页</el-button
                >
                <div
                  slot="tip"
                  class="el-upload__tip"
                  style="margin-top: -10px"
                >
                  只能上传pdf文件
                </div>
              </jxUpload>
            </div>

            <div v-else>
              <el-button
                size="mini"
                v-hasRole="['xyadmin']"
                type="text"
                icon="el-icon-edit"
                v-if="scope.row.xmzt == 13 || scope.row.xmzt == 16"
                @click="submitMiddle(scope.row)"
                >审核结题申请</el-button
              >

              <jxUpload
                accept=".doc,.docx"
                v-if="$store.getters.user.rolekey == 'zj'"
                :change="(val) => fileUpload(val, scope.row, '3')"
              >
                <el-button size="small" icon="el-icon-upload" type="text"
                  >上传结题报告</el-button
                >
                <div
                  slot="tip"
                  class="el-upload__tip"
                  style="margin-top: -10px"
                >
                  只能上传doc/docx文件
                </div>
              </jxUpload>
            </div>
            <el-button
              v-if="
                scope.row.xmzt == 16 ||
                (scope.row.xmzt == 18) | (scope.row.xmzt == -50)
              "
              size="mini"
              type="text"
              icon="el-icon-warning-outline"
              @click="handleOver(scope.row.id)"
              >结束暂缓</el-button
            >
            <!-- v-if="adminComfirm(scope.row.xmzt)" -->

            <el-button
              size="mini"
              type="text"
              icon="el-icon-warning-outline"
              v-hasRole="['tadmin']"
              v-if="
                scope.row.xmzt !== 16 ||
                (scope.row.xmzt !== 18) | (scope.row.xmzt !== -50)
              "
              @click="
                handleConfirm(
                  -50,
                  [scope.row.id],
                  scope.row.xmzt,
                  scope.row.xiangmumc
                )
              "
              >暂缓验收</el-button
            >
            <el-button
              size="mini"
              type="text"
              icon="el-icon-view"
              @click="onReview(scope.row)"
              >查看详情</el-button
            >
          </template>
        </el-table-column>
      </el-table>

      <pagination
        v-show="queryParams.total > 0"
        :total="queryParams.total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="getList"
      />
    </el-row>
    <endFrom
      :type="pageType"
      :base="editRow"
      :cbClose="getList"
      :visible.sync="dialogVisible"
    />
  </div>
</template>

<script>
// @ts-nocheck

import ProjectPipe from "@/components/projectPipe";
import improtFile from "@/components/importFile";
import api from "@/api/retrieval";
import { setPageParams, getPageParams } from "@/utils/auth";
import ProjectApi from "@/api/jxStuProject";
import jxUpload from "@/components/jxUpload";
import endFrom from "@/views/jxStuProject/common/endFrom";
import cdn from "@/components/JxFileUpload/spaceNotice";
import personDetail from "@/views/jxStuProject/common/personDetail";
import { downloadFile, downloadFileHref } from "@/utils";
export default {
  components: { improtFile, ProjectPipe, personDetail, endFrom, jxUpload },
  data() {
    return {
      //学院列表
      xyList: [],
      //年份列表
      nfList: [],
      //项目状态选项
      xmztpes: {},
      //批量操作id
      ids: [],
      //提交中检表
      dialogVisible: false,
      pageType: 1, // 弹框页面类型
      //编辑Id
      editId: null,
      editRow: {},
      //编辑Type
      editType: "",
      //开始时间
      kssj: "",
      // 遮罩层
      loading: true,
      // 显示搜索条件
      showSearch: true,
      // 项目表格数据
      ProjectList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 默认密码
      // 查询参数
      queryParams: {
        total: 0,
        pageNum: 1,
        pageSize: 10,
        xmmc: undefined,
        zjmc: undefined,
        fzxsxm: undefined,
        xmlx: undefined,
        fzxsxh: undefined,
        fzdsxm: undefined,
        xmzt: null,
        xybh: null,
        xmtype: "jt",
      },
      exportLoading: false,
      xmlboptions: {},
      // 项目列表字典
      projectType: {},
      // 列信息
      columns: [
        {
          key: "bh",
          label: `项目编号`,
          width: "120px",
          prop: "bianhao",
          visible: true,
        },
        {
          key: "xiangmumc",
          label: `项目名称`,
          width: "400px",
          prop: "xiangmumc",
          visible: true,
        },
        { label: "项目类型", key: "typeStr", prop: "typeStr", visible: true },
        {
          key: "xymc",
          label: "学院名称",
          width: "130px",
          prop: "xymc",
          customer: "school",
          visible: true,
        },
        {
          key: "fzdsxm",
          label: `负责导师`,
          type: "teacher",
          value: "fzdsxm",
          keys: "fzdsgh",
          visible: true,
        },
        {
          key: "fzxsxm",
          label: `负责学生`,
          type: "student",
          value: "fzxsxm",
          keys: "fzxsxh",
          visible: true,
        },
        { key: "qrzt", label: `状态`, prop: "qrztStr", visible: true },
        { key: "shenqjf", label: `经费`, prop: "shenqjf", visible: true },
      ],
      qrztType: {},
    };
  },
  async created() {
    await this.getDicts("qrzt").then((res) => {
      res.data.map((item) => {
        this.qrztType[item.dictValue] = item.dictLabel;
      });
    });
    await this.getDicts("kyxl_gllx").then((res) => {
      res.data.map((item) => {
        this.projectType[item.dictValue] = item.dictLabel;
      });
    });
    await this.init();
    this.getList();
  },
  computed: {
    _columns() {
      return this.columns.filter((item) => item.visible);
    },
  },
  mounted() {
    this.queryParams = Object.assign(
      {},
      this.queryParams,
      getPageParams.call(this)
    );
  },
  methods: {
    /** 导出按钮操作 */
    handleExportallPDF() {
      const queryParams = Object.assign({}, this.queryParams, { dcly: "zq" });
      this.$confirm("是否确认导出所有PDF?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.exportLoading = true;
          return ProjectApi.expertallPdf(queryParams);
        })
        .then((response) => {
          downloadFile(response, "结题管理PDF", "zip");
          this.exportLoading = false;
        });
    },
    // 导出全部结题表
    handleExportAllbg() {
      const queryParams = {
        xmtype: this.queryParams.xmtype,
        nf: this.queryParams.nf,
      };
      this.$confirm("是否确认下载所有结题报告?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.exportLoading = true;
          return ProjectApi.expertallJt(queryParams);
        })
        .then((response) => {
          downloadFile(response, "结题报告", "zip");
          this.exportLoading = false;
        });
    },
    selectable(row, index) {
      return row.xmzt == 14;
    },
    // 暂缓
    handleOver(id) {
      let params = {
        type: "zq",
        id,
      };
      this.$confirm(`是否确定暂缓编号为'${params.id}'的项目。`, "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return ProjectApi.overpostpone(params);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("操作成功");
        });
    },
    /** 导出按钮操作 */
    handleExport(columns) {
      const queryParams = Object.assign({}, this.queryParams);
      queryParams.columns = columns;
      this.$confirm("是否确认导出结题管理?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          return ProjectApi.getAllReslutOut(queryParams);
        })
        .then((response) => {
          downloadFile(response, "结题管理");
          this.exportLoading = false;
        });
    },
    hIndex(index) {
      return (
        index + 1 + (this.queryParams.pageNum - 1) * this.queryParams.pageSize
      );
    },
    //
    adminComfirm(xmzt) {
      return !["15", "-16", "-1"].includes(xmzt + "");
    },

    async init() {
      //获取项目状态列表
      ProjectApi.projectJtXmzt().then((res) => {
        this.xmztpes = res.data;
      });
      //确定项目lx 1:国创：nation,2省3校4院
      let xmlx = 1;
      let _path = this.$route.path;
      if (_path.indexOf("nation") > -1) xmlx = 1;
      else if (_path.indexOf("province") > -1) xmlx = 2;
      else if (_path.indexOf("kysj") > -1) xmlx = 3;
      else xmlx = 4;
      if (_path.indexOf("academy") > -1) this.queryParams.xmejlb = 42;
      else if (_path.indexOf("school") > -1) this.queryParams.xmejlb = 41;

      //获取期次列表
      await ProjectApi.projectQcList({ xmlx }).then((res) => {
        this.nfList = res.data;
        this.queryParams.nf = this.queryParams.nf || res.data[0].id;
      });
      await api.xmlbList({ xmlb: xmlx }).then((res) => {
        this.xmlboptions = Object.assign({}, { 全部分类: null }, res.data);
      });
      //获取学院列表
      ProjectApi.projectXyList().then((res) => {
        this.xyList = res.data;
      });
      //
    },
    //批量操作

    handleConfirm(shzt, xmids, xmzt, xmmc) {
      // console.log(shzt,xmids,xmzt);
      let params = {
          shzt: shzt,
          xmids: xmids || this.ids,
          syearId: this.$route.params.year,
          xmzt,
        },
        shztStr = {
          1: "同意验收",
          "-1": "拒绝验收",
          "-16": "中止",
          "-50": "暂缓",
        };
      const text =
        this.xmmcs.length > 1
          ? `是否${shztStr[params.shzt]}这${this.xmmcs.length}条项目。`
          : `是否确定${shztStr[params.shzt]}项目名称为'${
              this.xmmcs[0]
            }'的项目。`;
      this.$confirm(text, "警告", {
        // this.$confirm(`是否确定${shztStr[params.shzt]}编号为'${params.xmids}'的项目。`, "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return ProjectApi.schoolEndConfirm(params);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("操作成功");
        });
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      let _xmmcs = [],
        _ids = [];
      selection.map((item) => {
        _ids.push(item.id);
        _xmmcs.push(item.xiangmumc);
      });
      this.xmmcs = _xmmcs;
      this.ids = _ids;
    },
    /** 查询待提交的项目列表 */
    getList() {
      this.loading = true;
      //this.queryParams.nowxh = this.$store.getters.user.userName

      ProjectApi.schAdminGetList(this.queryParams).then((response) => {
        this.ProjectList = response.rows.map((item) => {
          item.typeStr = this.projectType[item.xmejlb];
          item.qrztStr = this.qrztType[item.xmzt];
          item.shenqjf = parseInt(item.shenqjf);
          return item;
        });
        this.queryParams.total = response.total;
        this.loading = false;
        setPageParams.call(this, this.queryParams);
      });
    },
    //上传结题报告 fjlx 3结题报告 6 审批页
    async fileUpload(file, row, fjlx) {
      await cdn.upload({ file }).then((data) => {
        return ProjectApi.uploadProjectFile({
          filename: file.name,
          xmid: row.id,
          fjlx: fjlx,
          relpath: data.location,
        }).then((d) => {
          this.msgSuccess("上传成功！");
          this.getList();
        });
      });
    },
    // 导出pdf
    handlePDF({ id, xiangmumc, fzxsxh }) {
      ProjectApi.expertTable({ id }).then((res) => {
        console.log(res.data.relpath);
        if (res.data) {
          downloadFileHref(res.data.relpath, res.data.filename);
        } else {
          this.msgError("请先上传结题报告！");
        }
      });
    },
    //提交结题检查表
    submitMiddle(row, type) {
      this.editId = row.id;
      // console.log(row);
      this.editRow = row;
      this.pageType = type === 1 ? 1 : 2;
      this.dialogVisible = true;
    },
    /** 查看按钮操作 */
    onReview(row) {
      let path = `/innovation/preView/${row.id}/${row.xmejlb}/${row.type}`,
        addTag = {};
      addTag[path] = row.xiangmumc;
      this.$store.dispatch("tagsView/updateRemotePathName", addTag);
      this.$router.push(path);
    },

    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.queryParams.nf = this.nfList[0].id;
      this.handleQuery();
    },
  },
};
</script>
