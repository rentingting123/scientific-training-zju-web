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

        <el-form-item v-hasPermi="['sys:nation:school']"  label="按学院" prop="xy">
          <el-select @change="getList" v-model="queryParams.xy" placeholder="请选择">
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

       <el-form-item  label="按项目类型" prop="xmejlb">
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

        <el-form-item label="项目名称" prop="xiangmu">
          <el-input
            v-model="queryParams.xiangmumc"
            placeholder="请输入项目名称"
            clearable
   
            style="width: 240px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <!-- <el-form-item label="负责学生姓名" prop="fzdsxm">
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
          <el-button type="primary" size="mini" @click="handleExport">导出项目经费汇总表</el-button>
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
        border
        v-loading="loading"
        :data="ProjectList"
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
    <div class="zongji">
      <span>总计：{{obj.shenqjf}}</span>
      <span>专用材料费：<span>{{obj.zyclf}}</span></span>
      <span>印刷费与资料费：<span>{{obj.ysfyzlf}}</span></span>
      <span>交通与差旅费：<span>{{obj.dyyclf}}</span></span>
      <span>版面印刷费：<span>{{obj.bmysf}}</span></span>
      <span>邮递费：<span>{{obj.ydf}}</span></span>
    </div>
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
      xyList:[],
      obj:{},
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
        xy:null,
        fzxsxm: undefined,
        fzxsxh: undefined,
        fzdsxm: undefined,
        xiangmumc: undefined
      },
      // 列信息
      columns: [
        {key: "xiangmumc",label: `项目名称`,width:'400px',prop: "xiangmumc",visible: true},
        {key:'xymc',label:'学院名称',width:'130px',prop:'xymc',customer:'school',visible:true},
        {key:'fzxsxh',label:'学号',prop:'fzxsxh',visible:true},
        {key:'fzxsxm',label:'姓名',prop:'fzxsxm',visible:true},
         {key:'fzxsxh',label:'导师工号',prop:'fzdsgh',visible:true},
        {key:'fzxsxm',label:'导师姓名',prop:'fzdsxm',visible:true},
        {key:'zyclf',label:'专用材料费',prop:'zyclf',visible:true},
        {key:'ysfyzlf',label:'印刷费与资料费',prop:'ysfyzlf',visible:true},
        {key:'dyyclf',label:'交通与差旅费',prop:'dyyclf',visible:true},
        {key:'bmysf',label:'出版费',prop:'bmysf',visible:true},
        {key:'ydf',label:'邮递费',prop:'ydf',visible:true},
        {key:'shenqjf',label:'合计',prop:'shenqjf',visible:true},
        // { key: "dbfs", label: `分数`, prop: "dbfs", visible: true },
        // { key: "shenqjf", label: `经费`, prop: "shenqjf", visible: true }
      ]
    };
  },
  async created() {
    await this.init()
    await ProjectApi.moneyAll().then(res => {
      this.obj = res.data
    })
    this.getList();
  },
  computed: {
    _columns() {
      return this.columns.filter(item => item.visible);
    },
  },
  methods: {
    hIndex (index){
       return (index + 1) + (this.queryParams.pageNum  - 1) * this.queryParams.pageSize;
    },
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
      ProjectApi.projectXyList().then(res=>{
        this.xyList=res.data
      })
      
    },

    updateNf(){
        //获取期次列表 根据选中的项目类型
        let obj={
          12:1,13:1,14:1,22:2,23:2,24:2,41:3,42:4
        }   
       ProjectApi.projectQcList({xmlx:obj[this.queryParams.xmejlb]}).then(res=>{
        this.nfList = res.data
        // this.queryParams.nf = res.data[0]?.id||null
        this.queryParams.nf = null
      })
    },
    /** 查询待提交的项目列表 */
    getList() {
      this.loading = true;
      summaryApi.getMoneyAll(this.queryParams).then(response => {
        this.ProjectList = response.rows
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
      this.queryParams.xiangmumc = ''
      this.handleQuery();
    },

          /** 导出按钮操作 */
     handleExport() {
            this.$confirm("是否确认导出经费汇总表?", "警告", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            }).then(() => {
             
                return summaryApi.getMoneyFile(this.queryParams)
                // this.download(response.msg);
                
            }).then((res)=>{
                downloadFile(res,'经费汇总表');
                this.exportLoading = false;
            });
    },

  }
};
</script>
<style scoped>
.zongji{
      width: 100%;
    text-align: right;
    height: 50px;
    line-height: 50px;
}
.zongji>span{
  padding-right: 20px;
}
.zongji>span>span{
  padding-left: 8px;
}
</style>