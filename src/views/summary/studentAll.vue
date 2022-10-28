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
       <el-form-item v-hasPermi="['sys:nation:school']"  label="按学院" prop="xybh">
          <el-select @change="getList" v-model="queryParams.xybh" placeholder="请选择">
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

       <!-- <el-form-item  label="按项目类型" prop="xmejlb">
          <el-select @change="updateNf" v-model="queryParams.xmejlb" placeholder="请选择">
            <el-option label="全部项目类型" :value="null"></el-option>
            <el-option
              v-for="item in xmztpes"
              :key="item.dictValue"
              :label="item.dictLabel"
              :value="item.dictValue"
            >
            </el-option>
          </el-select>
        </el-form-item> -->

        <el-form-item label="年份筛选" prop="nf">
          <el-select @change="getList" v-model="queryParams.nf" placeholder="请选择">
             <el-option label="全部" :value="null"></el-option>
            <el-option
              v-for="item in nfList"
              :key="item.id"
              :label="item.value"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="项目名称" prop="xmmc">
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
          <el-button type="primary" size="mini"
           v-loading="exportLoading"
           @click="handleExport">导出汇总表</el-button>
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
        border=""
      >
       <el-table-column label="序号" :index="hIndex" type="index"/>
        <el-table-column
          v-for="column in _columns"
          :label="column.label"
          :type="column.type"
          :min-width="column.width||null"
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
import personDetail from "@/views/jxStuProject/common/personDetail";
import {setPageParams,getPageParams} from '@/utils/auth'
export default {
  components: {personDetail},
  data() {
    return {
      exportLoading:false,
      //项目阶段
      stages:[],
      //学院列表
      xyList:[],
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
        xmejlb:null,
        xybh:null,
        fzxsxm: undefined,
        fzxsxh: undefined,
        fzdsxm: undefined,
        xmmc: undefined,
        isfb:undefined,
        islx:undefined,
      },
      //确认状态
      qrztType: [],
      // 列信息
      columns: [
        { key: "bh", label: `项目编号`,width:'120px', prop: "bianhao", visible: true },
        {key: "xiangmumc",label: `项目名称`,width:'400px',prop: "xiangmumc",visible: true},
        {key:'xymc',label:'学院名称',width:'130px',prop:'xymc',customer:'school',visible:true},
        // {key:'xymc',label:'学院名称',prop:'xymc',customer:'school',visible:true},
        { key: "fzdsxm", label: `负责导师`,type:'teacher', value: "fzdsxm",keys:'fzdsgh', visible: true },
        { key: "fzxsxm", label: `负责学生`,type:'student', value: "fzxsxm",keys:'fzxsxh', visible: true },
        { key: "qrzt", label: `状态`, prop: "qrztStr", visible: true },
        // { key: "xmtype", label: `项目阶段`, prop: "xmtype", visible: true },
        { key: "dbfs", label: `分数`, prop: "dbfs", visible: true },
        { key: "shenqjf", label: `经费`, prop: "shenqjf", visible: true }
      ]
    };
  },
  async created() {
    await this.init()
 
  },
  computed: {
    _columns() {
      return this.columns.filter(item => item.visible);
    },
  },
  mounted(){ this.queryParams=Object.assign({},this.queryParams,getPageParams.call(this))},
  methods: {
      hIndex (index){
       return (index + 1) + (this.queryParams.pageNum  - 1) * this.queryParams.pageSize;
    },
   async init(){
      await this.getDicts("qrzt").then(res => {
      this.qrztType=res.data
    });
     //获取项目状态列表
      await this.getDicts("getLB2MapForAdd").then(res => {
         this.xmztpes = res.data
        });
      //获取项目阶段
      await this.getDicts("stage").then(res => {
         this.stages = res.data.slice(0,3)
         this.stages.push({dictLabel:'未提交',dictValue:''})
         this.stages.push({dictLabel:'未立项',dictValue:'1'})
        });
      await this.updateNf()
      //获取学院列表
      ProjectApi.projectXyList().then(res=>{
        this.xyList=res.data
      })
       this.getList();
      //
    },

    updateNf(){
        //获取期次列表 根据选中的项目类型
        let obj={
          12:1,13:1,14:1,22:2,23:2,24:2,41:3,42:4
        }   
      //  ProjectApi.projectQcList({xmlx:obj[this.queryParams.xmejlb]}).then(res=>{
      return  ProjectApi.projectQcList({xmlx:3}).then(res=>{
        this.nfList = res.data
        this.queryParams.nf = null
        // this.queryParams.nf = res.data[0]?.id||null
      })
    },
    /** 查询待提交的项目列表 */
    getList() {
      this.loading = true;
      if(this.queryParams.xmtype == ''){
        this.queryParams.isfb = 0
        this.queryParams.islx = undefined
      }else if(this.queryParams.xmtype == '1'){
        this.queryParams.islx = 1
        this.queryParams.isfb = undefined
      }else{
        this.queryParams.islx = undefined
        this.queryParams.isfb = undefined
      }
      summaryApi.getStudentAll(this.queryParams).then(response => {
        this.ProjectList = response.rows.map(item => {
          item.qrztStr = this.selectDictLabel(this.qrztType,item.xmzt);
          item.xmejlbStr = this.selectDictLabel(this.xmztpes, item.xmejlb);
          item.shenqjf = parseInt(item.shenqjf)
          //item.xmtypeStr = this.selectDictLabel(this.stages, item.xmtype);
          return item;
        });
        this.total = response.total;
        this.loading = false;
        setPageParams.call(this,this.queryParams)
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
      this.queryParams.fzxsxm = ''
      this.handleQuery();
    },

    /** 查看按钮操作 */
    onReview(row) {
      let path = `/innovation/preView/${row.id}/${row.xmejlb}/${row.type}`
      ,addTag={}
      addTag[path] = row.xiangmumc
      this.$store.dispatch('tagsView/updateRemotePathName',addTag)
      this.$router.push(path)
    },
          /** 导出按钮操作 */
     handleExport() {

            this.$confirm("是否确认导出项目汇总表?", "警告", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            }).then(() => {
               this.exportLoading = true;
                return summaryApi.getStudentFile(this.queryParams)
                // this.download(response.msg);
            
            }).then(res=>{
                downloadFile(res,'学生申报课题汇总表');
                this.exportLoading = false;
            });
    },

  }
};
</script>
<style scoped>
</style>