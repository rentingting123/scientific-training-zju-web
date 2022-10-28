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
        <el-table-column type="index" width="50" label='序号'/>
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
          :current-page="4"
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
import Review from '@/views/jxPractice/review.vue'
export default {
  components: {Review},
  data() {
    return {
      exportLoading:false,
      //年份列表
      nfList:[],
      id:'',
      onReviewVisable:false,
      expertType:1,//1立项2修改经费
      expertVisible:false,
      // 遮罩层
      loading: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 项目表格数据
      ProjectList: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        createTime:null,
        ktmc: undefined,
      },
      // 列信息
      columns: [
        { key: "bh", label: `申报编号`, prop: "id", visible: true },
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
        { key: "dsxm", label: `校内导师姓名`, prop: "dsxm", visible: true },
        { key: "jskyxmmc", label: `教师科研项目名称`, prop: "jskyxmmc", visible: true },

        { key: "xymc", label: `所属学院`, prop: "xymc", visible: true },
        { key: "ktxsbjyqjqt", label: `学生团队要求`, prop: "ktxsbjyqjqt", visible: true }
      ]
    };
  },
  async created() {
    this.getList();
  },
  computed: {
    _columns() {
      return this.columns.filter(item => item.visible);
    },
  },
  methods: {
     handleSizeChange(val) {
       this.queryParams.pageSize = val
       this.getList();
      },
      handleCurrentChange(val) {
        this.queryParams.pageNum = val
         this.getList();
      },
    /** 查询待提交的项目列表 */
    getList() {
      this.loading = true;
      ProjectApi.teacherPracticeList(this.queryParams).then(response => {
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
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
  }
};
</script>
<style scoped>
</style>
