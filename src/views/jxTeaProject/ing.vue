<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--用户数据-->
      <div><ProjectPipe type="middle" /></div>
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
      <el-form-item label="负责老师" prop="fzdsxm">
         <el-input
          v-model="queryParams.fzdsxm"
          placeholder="请输入负责老师"
          clearable
          size="small"
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
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

      <right-toolbar class="mb8"
        :showSearch.sync="showSearch"
        @queryTable="getList"
        :columns="columns"
      ></right-toolbar>
      <el-table border v-loading="loading" :data="ProjectList">
         <el-table-column type="index" width="50"  :index="hIndex"  label='序号'/>
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
          <div v-else-if="$store.getters.role=='daoshi'&&column.key=='qrzt'&&row.xmzt==8">
                <el-button
                  size="mini"
                  type="text"
                  icon="el-icon-edit"
                  @click="submitMiddle(row)"
                  >{{row[column.prop]}}</el-button>
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
              >查看详情</el-button
            >
              <el-button
              size="mini"
              type="text"
              icon="el-icon-view"
              @click="openlishiGuocheng(scope.row)"
              > 历史过程记录 </el-button
            >
            <el-button
              size="mini"
              v-if="scope.row.xmzt==8"
              type="text"
              icon="el-icon-edit"
              @click="submitMiddle(scope.row)"
              >批阅中期检查表</el-button
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
      <MiddleFrom
        :base="editRow"
        :type=1
        :cbClose="getList"
        :visible.sync="dialogVisible"
      />
             <!-- 历史过程记录 -->
          <el-dialog
            title="提示"
            :visible.sync="lsdialogVisible"
            width="60%">
             <div class="app-container">
                <el-table
                  :data="lslist"
                  style="width: 100%">
                  <el-table-column
                    prop="createTime"
                    label="提交时间"
                    width="100">
                     <template slot-scope="{row}">
                       {{row.createTime | dtime}}
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="createBy"
                    label="提交人"
                    width="100"
                  >
                  </el-table-column>
                  <el-table-column
                    prop="description"
                    label="过程记录描述">
                  </el-table-column>
                   <el-table-column
                    prop="fileName"
                      width="180"
                    label="相关材料">
                     <template slot-scope="{row}">
                       <!-- {{row.fileName}} -->
                       <a :href="row.fileURL" target="_blank">{{row.fileName}}</a>
                    </template>
                     
                  </el-table-column>
                  
                </el-table>
                   <el-pagination
                      @current-change="handleCurrentChange"
                      current-page.sync="1"
                      :page-size="params.pageSize"
                      layout=" prev, pager, next"
                      style="text-align:center;margin-top:20px"
                      :total="lstotal">
                    </el-pagination>
                </div>
          </el-dialog>

  </div>
</template>

<script>
import ProjectPipe from "@/components/projectPipe";
import ProjectApi from "@/api/jxStuProject";
import moment from 'moment'
import {setPageParams,getPageParams} from '@/utils/auth'
import personDetail from "@/views/jxStuProject/common/personDetail";
import MiddleFrom from "@/views/jxStuProject/common/middleFrom";
export default {
  name: "expert",
  components: { ProjectPipe,personDetail, MiddleFrom },
  data() {
    return {
      lslist:[],
      lstotal:1,
      params:{
        proId:undefined,
        pageNum:1,
        pageSize:5
      },
      lsdialogVisible:false,
      //提交中检表
      dialogVisible: false,
      //编辑Id
      editId: null,
      editRow:{},
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
        fzdsxm: undefined,
        xmtype: "zq"
      },
      // 项目列表字典
      projectType: {},
      // 列信息
      columns: [
        { key: "bh", label: `项目编号`, prop: "bianhao", visible: true },
        {
          key: "xiangmumc",
          label: `项目名称`,
          prop: "xiangmumc",
          visible: true
        },
        {
          label: "项目类型",
          key: "typeStr",
          prop: "typeStr",
          visible: true
        },
        { key: "fzdsxm", label: `负责导师`,type:'teacher', value: "fzdsxm",keys:'fzdsgh', visible: true },
        { key: "fzxsxm", label: `负责学生`,type:'student', value: "fzxsxm",keys:'fzxsxh', visible: true },
        { key: "qrzt", label: `状态`, prop: "qrztStr", visible: true },
        // { key: "dbfs", label: `中检结果`, prop: "dbfs", visible: true },
        { key: "shenqjf", label: `经费`, prop: "shenqjf", visible: true }
      ],
      qrztType: {}
    };
  },
  async created() {
    await this.getDicts("qrzt").then(res => {
      res.data.map(item => {
        this.qrztType[item.dictValue] = item.dictLabel;
      });
    });
    await this.getDicts("getLB2MapForAdd").then(res => {
      res.data.map(item => {
        this.projectType[item.dictValue] = item.dictLabel;
      });
    });
    this.getList();

    this.queryParams.nf = this.$route.params.year;
  },
  computed: {
    _columns() {
      return this.columns.filter(item => item.visible);
    }
  },
  mounted(){ this.queryParams=Object.assign({},this.queryParams,getPageParams.call(this))},
  methods: {
      hIndex (index){
       return (index + 1) + (this.queryParams.pageNum  - 1) * this.queryParams.pageSize;
    },
      handleCurrentChange(val) {
        this.params.pageNum = val
        this.getlslist()
      },
      openlishiGuocheng(row){
      this.params.proId = row.id
        this.lsdialogVisible = true
        this.getlslist()
    },
     getlslist(){
      ProjectApi.lsguocheng(this.params).then(res => {
        this.lstotal = res.total
          this.lslist = res.rows
        })
    },
    /** 查询待提交的项目列表 */
    getList() {
      this.loading = true;
      //this.queryParams.nowxh = this.$store.getters.user.userName
      ProjectApi.projectManagementList(this.queryParams).then(response => {
        this.ProjectList = response.rows.map(item => {
          item.typeStr = this.projectType[item.xmejlb];
          item.qrztStr = this.qrztType[item.xmzt];
          item.shenqjf = parseInt(item.shenqjf)
          return item;
        });
        this.total = response.total;
        this.loading = false;
        setPageParams.call(this,this.queryParams)
      });
    },
    //提交中期检查表
    submitMiddle(row) {
      this.editId = row.id;
      this.editRow = row;
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
      this.queryParams.page = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    }
  },
    filters:{
         dtime(val){
        if(val){
            return moment(val).format('YYYY-MM-DD')
        }else{
            return ''
        }
       
    }
    },
};
</script>
