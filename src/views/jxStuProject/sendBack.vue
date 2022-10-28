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
        <el-form-item label="年份筛选">
          <el-select
          v-model="queryParams.xmlx"
          filterable
          clearable
          placeholder="项目类别"
          style="width:140px"
          @change="xmlxChange"
          @clear="xmlxChange">
            <el-option
              v-for="item in xmlxList"
              :key="item.dictValue"
              :label="item.dictLabel"
              :value="item.dictValue">
            </el-option>
          </el-select>
          -
          <el-select @change="handleQuery" v-model="queryParams.nf" placeholder="请选择" style="width:140px;">
            <el-option
              v-for="item in nfList"
              :key="item.id"
              :label="item.value"
              :value="item.id"
              
            >
            </el-option>
          </el-select>
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
      <el-table border v-loading="loading" :data="ProjectList">
        <el-table-column
          v-for="column in _columns"
          :label="column.label"
          align="center"
          :key="column.key"
          :prop="column.prop"
          :show-overflow-tooltip="true"
        >
         <template  slot-scope="{row}">
          <div v-if="column.filter">
            {{column.filte}}
            {{row[column.prop]|dictFilter(xmlboptions)}}
          </div>
           <div v-else>
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
              icon="el-icon-view"
              @click="onReview(scope.row)"
              v-hasPermi="['xm:student:update']"
              >查看</el-button
            >
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

    <editProject
      v-if="dialogVisible"
      :rowstatus = rowstatus
      :visible.sync="dialogVisible"
      @close="dialogVisible = false"
      :title="'修改' + projectType[editType]"
      :type="editType"
      :cbClose="getList"
      :id="editId"
    />

    <jxDialog
      style="min-width:890px;width:80%;margin:0 auto"
      width="100%"
      :visible.sync="reviewVisible"
      @close="reviewVisible = false"
      :title="'查看' + projectType[editType]"
    >
      <review :id="reviewId" :xmejlb="xmejlb" :type="editType" />
    </jxDialog>
    <endFrom :base="editRow" :editAgin="true" :cbClose="getList" :visible.sync="endDialogVisible" />
    <MiddleFrom
        :base="editRow"
        :editAgin="true"
        :cbClose="getList"
        :visible.sync="midDialogVisible"
      />
  </div>
</template>

<script>
import ProjectApi from "@/api/jxStuProject";
import jxDialog from "@/components/jxDialog"
import editProject from "./common/editProject.vue";
import review from "./common/reviewProject.vue";
import endFrom from "@/views/jxStuProject/common/endFrom";
import MiddleFrom from "@/views/jxStuProject/common/middleFrom";

export default {
  components: {jxDialog, editProject,endFrom,MiddleFrom, review },
  data() {
    return {
      editRow:{},
      rowstatus:false,
      //编辑框
      endDialogVisible:false,
      midDialogVisible:false,
      dialogVisible: false,
      reviewVisible: false,
      xmlxList: [],
      nfList: [],
      //编辑Id
      editId: null,
      xmejlb:null,
      reviewId: null,
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
        xmmc: undefined,
        shengqingsj: undefined,
        nf:null,
      },
      // 项目列表字典
      projectType: {},
      xmlboptions:{},
      // 列信息
      columns: [
        { key: 0, label: `学院-系`, prop: "xymc", visible: true },
        { key: 5, label: `项目类别`, prop: "typeStr", visible: true },
        { key: 1, label: `项目名称`, prop: "xiangmumc", visible: true },
        { key: 6, label: `项目状态`, prop: "xmzt", visible: true,filter:true,filte:this.xmlboptions },
        { key: 2, label: `负责老师`, prop: "fzdsxm", visible: true },
        { key: 3, label: `负责学生`, prop: "fzxsxm", visible: true },
        { key: 4, label: `申请经费`, prop: "shenqjf", visible: true },
        // { key: 4, label: `开始时间`, prop: "shengqingsj", visible: true },
       
        // { key: 6, label: `申报时间`, prop: "shengqingsj", visible: true }
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
      this.xmlboptions = res.data
     });
    await this.getDicts('sbsj_lx').then(res => {
      this.xmlxList = res.data;
     });
    this.getList();
  },
  computed: {
    _columns() {
      return this.columns.filter(item => item.visible);
    }
  },
  methods: {
    xmlxChange(val){
      this.queryParams.nf = null
      this.getqcList()
    },
    //获取期次列表
    getqcList() {
      ProjectApi.projectQcList({ xmlx: this.queryParams.xmlx }).then((res) => {
        this.nfList = res.data;
        this.queryParams.nf = res.data.length>0 ? res.data[0].id : null;
        this.getList()
      });
    },
    
    dataChange(val) {
      this.queryParams.shengqingsj = val;
    },
    /** 查询待提交的项目列表 */
    getList() {
      this.loading = true;
      ProjectApi.getUnSubmitlistList(this.queryParams).then(response => {
        this.ProjectList = response.rows.map(item => {
          item.typeStr = this.projectType[item.type];
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
    //中期显示
    submitMiddle(row){
      this.editId = row.id;
      this.editRow = row;
      this.midDialogVisible = true;
    },
    //结题表显示
    submitEnd(row) {
      this.editId = row.id;
      this.editRow = row;
      this.endDialogVisible = true;
    },
    /** 查看按钮操作 */
    onReview(row) {
      this.reviewId = row.id;
      this.editType = row.type;
      this.xmejlb = row.xmejlb
      this.reviewVisible = true;
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.editId = row.id;
      this.editType = row.type;
      this.dialogVisible = true;
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
             if(row.type!=1){
            return ProjectApi.delOtherProject({ids:[row.id]})
          }else{
            return ProjectApi.delProject(row.id);
          }
         
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        });
    }
  }
};
</script>
