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

       <el-form-item  label="按项目类型" prop="sql">
          <el-select @change="updateNf" v-model="queryParams.sql" placeholder="请选择">
            <el-option label="全部项目类型" :value="null"></el-option>
            <el-option
              v-for="item in xmztpes"
              :key="item.dictValue"
              :label="item.dictLabel"
              :value="item.dictValue"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="年份筛选" prop="nf">
          <el-select @change="getList" v-model="queryParams.nf" placeholder="请选择">
             <el-option label="全部(请先选择项目类型)" :value="null"></el-option>
            <el-option
              v-for="item in nfList"
              :key="item.id"
              :label="item.value"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <!-- <el-form-item label="项目名称" prop="xmmc">
          <el-input
            v-model="queryParams.xmmc"
            placeholder="请输入项目名称"
            clearable
   
            style="width: 240px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="负责学生姓名" prop="fzdsxm">
          <el-input v-model="queryParams.fzxsxm" placeholder="负责学生姓名">
          </el-input>
        </el-form-item>
        <el-form-item label="负责学生学号" prop="fzxsxh">
          <el-input v-model="queryParams.fzxsxh" placeholder="负责学生学号">
          </el-input>
        </el-form-item>
        <el-form-item label="负责导师" prop="fzdsxm">
          <el-input v-model="queryParams.fzdsxm" placeholder="负责导师姓名">
          </el-input>
        </el-form-item>
        <el-form-item  label="按项目阶段" prop="xmtype">
          <el-select @change="getList" v-model="queryParams.xmtype" placeholder="请选择">
            <el-option label="全部项目阶段" :value="null"></el-option>
            <el-option
              v-for="item in stages"
              :key="item.dictValue"
              :label="item.dictLabel"
              :value="item.dictValue"
            >
            </el-option>
          </el-select>
      </el-form-item> -->
        <el-form-item>
          <el-button
            type="primary"
            icon="el-icon-search"
            size="mini"
            @click="handleQuery"
            >搜索</el-button
          >
          <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
            >重置</el-button>
          <el-button type="primary" size="mini" @click="handleExport">导出成果汇总表</el-button>
        </el-form-item>
      </el-form>
      <el-row :gutter="10" class="mb8">
      
        <right-toolbar
          :showSearch.sync="showSearch"
          @queryTable="getList"
          :columns="columns"
        ></right-toolbar
      ></el-row>
      <el-table
        v-loading="loading"
        :data="ProjectList"
      >
       <el-table-column label="序号" type="index"/>
        <el-table-column
          v-for="column in _columns"
          :label="column.label"
          :type="column.type"
          :min-width="column.width||null"
          align="center"
          :key="column.key"
          :prop="column.prop"
          :show-overflow-tooltip="true"/>
      </el-table>

      <pagination
        v-show="total > 0"
        :total="total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="getList"
      />
    </el-row>
  </div>
</template>

<script>
import summaryApi from "@/api/jxStuProject/summary";
import ProjectApi from "@/api/jxStuProject";
import {downloadFile} from '@/utils/index'
export default {
  components: {},
  data() {
    return {
      //项目阶段
      // stages:[],
      //学院列表
      // xyList:[],
      //年份列表
      nfList:[],
      //项目状态选项
      xmztpes:{},
      // 遮罩层
      loading: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 项目表格数据
      ProjectList: [],
      // 默认密码
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        xmtype: null,
        nf:null,
        sql:null,
        xybh:null,
        fzxsxm: undefined,
        fzxsxh: undefined,
        fzdsxm: undefined,
        xmmc: undefined
      },
      // 列信息
      columns: [
        {key:'xymc',label:'学院名称',prop:'xymc',visible:true},
        {key:'lwcg',label:'论文成果(正式发表)',prop:'lwcg',visible:true},
        {key:'hjcg',label:'获奖成果',prop:'hjcg',visible:true},
        {key:'pyjd',label:'评议鉴定',prop:'pyjd',visible:true},
        {key:'tgcg',label:'推广成果',prop:'tgcg',visible:true},
        // {key:'lzcg',label:'立项阶段',prop:'lzcg',visible:true},
        {key:'lzcg',label:'论著成果',prop:'lzcg',visible:true},
        {key:'zlcg',label:'专利成果',prop:'zlcg',visible:true},
        {key:'jjcg',label:'经济效益',prop:'jjcg',visible:true},
        {key:'zscq',label:'知识产权',prop:'zscq',visible:true},
        {key:'bylw',label:'毕业论文',prop:'bylw',visible:true},
        {key:'qtcg',label:'其他',prop:'qtcg',visible:true},
        {key:'sum',label:'总数',prop:'sum',visible:true},
        // { key: "dbfs", label: `分数`, prop: "dbfs", visible: true },
        // { key: "shenqjf", label: `经费`, prop: "shenqjf", visible: true }
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
   async init(){
     //获取项目状态列表
      await this.getDicts("getLB2MapForAdd").then(res => {
         this.xmztpes = res.data
        });
      //获取项目阶段
      // await this.getDicts("stage").then(res => {
      //    this.stages = res.data
      //   });
      //获取学院列表
      // ProjectApi.projectXyList().then(res=>{
      //   this.xyList=res.data
      // })
      //
    },

    updateNf(){
        //获取期次列表 根据选中的项目类型
        let obj={
          12:1,13:1,14:1,22:2,23:2,24:2,41:3,42:4
        }   
       ProjectApi.projectQcList({xmlx:obj[this.queryParams.sql]}).then(res=>{
        this.nfList = res.data
        this.queryParams.nf = null
        // this.queryParams.nf = res.data[0]?.id||null
      })
    },
    /** 查询待提交的项目列表 */
    getList() {
      this.loading = true;
      summaryApi.getReslutAll(this.queryParams).then(response => {
        this.ProjectList = response.data
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


          /** 导出按钮操作 */
     handleExport() {
            this.$confirm("是否确认导出成果汇总表?", "警告", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            }).then(() => {
                return summaryApi.getReslutFile(this.queryParams)
                // this.download(response.msg);
            
            }).then(res=>{
                downloadFile(res,'成果汇总表');
                this.exportLoading = false;
            });
    },

  }
};
</script>
<style scoped>
</style>