<template>
  <div class="app-container">
    <el-row style="margin-top:10px" :gutter="20">
      <!--用户数据--->
      <el-form
        :model="queryParams"
        ref="queryForm"
        :inline="true"
        v-show="showSearch"
        label-width="100px"
      >
        <el-form-item label="年份筛选" prop="createTime">
           <el-date-picker
              v-model="queryParams.createTime"
              type="year"
              value-format="yyyy"
              placeholder="选择年">
          </el-date-picker>
          <!-- <el-select v-model="queryParams.nf" @change="handleQuery" placeholder="请选择">
            <el-option
              v-for="item in nfList"
              :key="item.id"
              :label="item.value"
              :value="item.id"
            >
            </el-option>
          </el-select> -->
        </el-form-item>
       <el-form-item v-hasPermi="['sys:nation:school']"  label="按学院" prop="xybh">
          <el-select v-model="queryParams.xybh" placeholder="请选择">
            <el-option label="全部学院" :value="null"></el-option>
            <el-option
              v-for="item in xyList"
              :key="item.xybh"
              :label="item.xymc"
              :value="item.xybh"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="导师工号" prop="jgh">
          <el-input v-model="queryParams.jgh" placeholder="导师工号">
          </el-input>
        </el-form-item>

        <el-form-item label="导师姓名" prop="dsxm">
          <el-input v-model="queryParams.dsxm" placeholder="负责导师姓名">
          </el-input>
        </el-form-item>

        <el-form-item label="课题名称" prop="ktmc">
          <el-input v-model="queryParams.ktmc" placeholder="课题名称">
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
        <el-col :span="1.5">
            <improtFile 
            v-hasRole="['tadmin','admin']"
            url='/practice/import'
            title="导入教师选题"
            :close="getList"
            download="https://competition-web.oss-cn-hangzhou.aliyuncs.com/mooc/schooladmin/%E9%99%84%E4%BB%B61%EF%BC%9A%E6%B5%99%E6%B1%9F%E5%A4%A7%E5%AD%A6%E6%9C%AC%E7%A7%91%E7%94%9F%E7%A7%91%E7%A0%94%E5%AE%9E%E8%B7%B5%E9%A1%B9%E7%9B%AE%E6%8C%87%E5%8D%97%28%E6%A8%A1%E6%9D%BF%29%282022%E5%B9%B4%29.xls"
            /> 
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="primary"
            plain
            v-loading="exportLoading"
            icon="el-icon-download"
            size="mini"
            v-hasRole="['tadmin','admin']"
            @click="handleExport"
            >导出课题申报汇总表</el-button
          >
        </el-col>
        <right-toolbar
          :showSearch.sync="showSearch"
          @queryTable="getList"
          :columns="columns"
        ></right-toolbar
      ></el-row>
      <el-table border
        v-loading="loading"
        :data="ProjectList"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" :selectable="row=>row.xmzt==3" width="50" align="center" />
         <el-table-column label="序号" :index="hIndex" width="50" type="index"/>
        <el-table-column
          v-for="column in _columns"
          :label="column.label"
          :type="column.type"
          align="center"
          :key="column.key"
          :prop="column.prop"
          :show-overflow-tooltip="true"
        >
        <template  slot-scope="scope">
           <div style="text-algin:center">
             {{scope.row[column.prop]}}
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
            <el-tooltip :content="'申报状态: ' + `${scope.row.isfb==1?'不可申报':'可申报'}`" placement="top">
            <el-switch
              style="margin-right:10px"
              :active-value="'0'"
              :inactive-value="'1'"
              active-color="rgb(24, 172, 253)"
              inactive-color="#eee"
              v-model="scope.row.isfb"
              @change="getswitch($event,scope.row)"
              >
            </el-switch>
            </el-tooltip>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-view"
              @click="onReview(scope.row)"
              >查看</el-button
            >
          </template>
        </el-table-column>
      </el-table>

      <!-- <pagination
        v-show="total > 0"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :pageNum.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="getList"
      /> -->
       <el-pagination
          v-show="total > 0"
          style="    text-align: right; margin-top: 20px;"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="1"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="10"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
    </el-pagination>
    </el-row>
    <Review :visible.sync="onReviewVisable" :id="id"/>
  </div>
</template>

<script>
import ProjectApi from "@/api/jxStuProject";
import SummaryApi from "@/api/jxStuProject/summary"
import Review from './review.vue'
import {downloadFile} from '@/utils/index'
import improtFile from '@/components/importFile'
import acadSelect from "@/views/basedata/common/acadSelect"
export default {
  components: {acadSelect,improtFile,Review},
  data() {
    return {
      value:true,
      exportLoading:false,
      //学院列表
      xyList:[],
      //年份列表
      nfList:[],
      id:'',
      onReviewVisable:false,
      expertType:1,//1立项2修改经费
      expertVisible:false,
      //编辑Id
      editId: null,
      //编辑Type
      editType: "",

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
        createTime:'2022',
        xybh:null,
        ktmc: undefined,
        dsxm: undefined,
      },

      //导师意见
      dsyj: "",
      bianhao:'',
      // 列信息
      columns: [
        // { key: "bh", label: `申报编号`, prop: "id", visible: true },
        {
          key: "sbbm",
          label: `申报编码`,
          prop: "sbbm",
          visible: true
        },
        {key:'xwdsXm',label:'校外导师姓名',prop:'xwdsXm',visible:true},
        { key: "jskyxmlb", label: `教师科研项目类别`, prop: "jskyxmlb", visible: true },
        { key: "jskyxmpzh", label: `教师科研项目批准号`, prop: "jskyxmpzh", visible: true },
        { key: "ktmc", label: `科研实践项目课题名称`, prop: "ktmc", visible: true },
        { key: "dsxm", label: `校内导师姓名`, prop: "kydsxm", visible: true },
        { key: "jskyxmmc", label: `教师科研项目名称`, prop: "jskyxmmc", visible: true },

        { key: "xymc", label: `所属学院`, prop: "xymc", visible: true },
        { key: "ktxsbjyqjqt", label: `学生团队要求`, prop: "ktxsbjyqjqt", visible: true }
      ]
    };
  },
  async created() {
    await this.init()
    this.getList();
  },
  computed: {
    _columns() {
      return this.columns.filter(item => item.visible);
    },
  },
  methods: {
    getswitch(e,row){
       ProjectApi.updateDsxt({
         id:row.id,
         ktmc:row.ktmc,
         isfb:row.isfb,
        }).then(res => {
          if(res.code == 200){
            this.init()
    this.getList();
            this.$message.success('修改申报状态成功')
          }else{
            this.init()
    this.getList();
          }
        }).catch(err => {
           this.init()
    this.getList();})
    },
     hIndex (index){
       return (index + 1) + (this.queryParams.pageNum  - 1) * this.queryParams.pageSize;
    },
     handleSizeChange(val) {
       this.queryParams.pageSize = val
       this.getList();
      },
      handleCurrentChange(val) {
        this.queryParams.pageNum = val
         this.getList();
      },
   async init(){
      //获取期次列表
    //  await  ProjectApi.projectQcList({xmlx:3}).then(res=>{
    //     this.nfList = res.data
    //    //  this.queryParams.nf = this.queryParams.nf||res.data[0].id
    //   })
      //获取学院列表
      ProjectApi.projectXyList().then(res=>{
        this.xyList=res.data
      })
      //
    },
    //导出课题申报汇总表
      handleExport() {
       const queryParams = this.queryParams;
      this.$confirm('是否确认导出教师课题汇总表?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.exportLoading = true;
          return SummaryApi.getTeacherFile(queryParams);
        }).then(response => {
           downloadFile(response, '教师课题汇总表')
          this.exportLoading = false;
        })
    },
    /** 查询待提交的项目列表 */
    getList() {
      this.loading = true;
      // this.queryParams.isfb=0
      ProjectApi.practiceList(this.queryParams).then(response => {
        this.ProjectList = response.rows
        this.total = response.total;
        this.loading = false;
      });
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      // this.queryParams.nf = this.nfList[0].id
      this.handleQuery();
    },
     // expertType:1,//1立项2修改经费
    /** 查看按钮操作 */
    onReview(row) {
        this.id = row.xtid;
        this.onReviewVisable = true;
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id);
      this.bianhao = selection.map(item => item.bianhao);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    /** 删除按钮操作 */
    handleDelete() {
      this.$confirm(
        '是否确认删除项目编号为："' + this.bianhao + '" 的项目吗？',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(data => ProjectApi.deleteProjects({ ids: this.ids }))
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        });
    }
  }
};
</script>
<style scoped>
</style>
