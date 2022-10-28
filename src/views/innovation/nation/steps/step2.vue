<template>
  <div class="app-container">
    <ProjectPipe type="middle" />
    <el-row style="margin-top:10px" :gutter="20">
      <!--用户数据-->
      <el-form
        :model="queryParams"
        ref="queryForm"
        :inline="true"
        v-show="showSearch"
        label-width="100px"
      >
        <el-form-item label="年份筛选" prop="nf">
          <el-select v-model="queryParams.nf" placeholder="请选择">
            <el-option
              v-for="item in nfList"
              :key="item.id"
              :label="item.value"
              :value="item.id"
              style="width:230px;"
            >
            </el-option>
          </el-select>
        </el-form-item>
             <el-form-item v-hasPermi="['sys:nation:xmtype']"  label="按项目状态" prop="xmzt">
          <el-select v-model="queryParams.xmzt" placeholder="请选择">
            <el-option label="全部" :value="null"></el-option>
            <el-option
              v-for="(vulue,key) in xmztpes"
              :key="key"
              :label="vulue"
              :value="key"
              style="width:230px;"
            >
            </el-option>
          </el-select>
        </el-form-item>
           <el-form-item v-hasPermi="['sys:nation:school']"  label="按学院" prop="xybh">
          <el-select v-model="queryParams.xybh" placeholder="请选择">
            <el-option label="全部学院" :value="null"></el-option>
              <el-option
              v-for="item in xyList"
              :key="item.xybh"
              :label="item.xymc"
              :value="item.xybh"
              style="width:230px;"
            >
            </el-option>
          </el-select>
        </el-form-item>

  

        <el-form-item v-hasPermi="['sys:nation:school']"  label="项目类型" prop="xmlx">
             <el-select v-model="queryParams.xmlx" clearable filterable placeholder="请选择">
              <el-option
                v-for="(key,value) in xmlboptions"
                 :key="key"
                  :label="value"
                  :value="key">
              </el-option>
            </el-select>
          </el-form-item>

        <el-form-item label="项目名称" prop="xmmc">
          <el-input
            v-model="queryParams.xmmc"
            placeholder="请输入项目名称"
            clearable
            size="small"
            style="width: 230px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
       
        <el-form-item label="负责学生姓名" prop="fzxsxm">
          <el-input v-model="queryParams.fzxsxm" placeholder="负责学生姓名" style="width:230px;">
          </el-input>
        </el-form-item>
        <el-form-item label="负责学生学号" prop="fzxsxh">
          <el-input v-model="queryParams.fzxsxh" placeholder="负责学生学号" style="width:230px;">
          </el-input>
        </el-form-item>
        <el-form-item label="负责导师" prop="fzdsxm">
          <el-input v-model="queryParams.fzdsxm" placeholder="负责导师姓名" style="width:230px;">
          </el-input>
        </el-form-item>
        <el-form-item style="margin-left:15px;">
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
         <el-col :span="1.5" style="padding-left:0;">
            <jx-export
            type="warning"
            plain
            fildKey="lx_field"
            size="mini"
            @done="handleExport"
            >导出</jx-export>
        </el-col>
        <el-col :span="1.5" style="padding-left:0;">
          <improtFile 
            v-hasRole="['tadmin','xyadmin']"
            url='/project/importzq'
            title="批量导入"
            :close="getList"
            download="https://web.moocollege.com/mooc/schooladmin/%E4%B8%AD%E6%9C%9F%E5%AD%A6%E9%99%A2%E5%AE%A1%E6%A0%B8.xlsx"
            /> 
        </el-col>
        <el-col :span="1.5" style="padding-left: 0">
           <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          :loading="exportLoading"
          @click="handleExportallPDF"
          v-hasPermi="['xm:batch:dcpdf']"
        >导出全部PDF</el-button>
        </el-col>
        <!-- <el-col :span="1.5">
          <el-button
            type="danger"
            plain
            icon="el-icon-delete"
            size="mini"
            @click="handleDelete()"
            >批量删除</el-button
          >
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="primary"
            plain
            icon="el-icon-check"
            size="mini"
            @click="handleConfirm()"
            >批量评审</el-button
          >
        </el-col> -->
        <right-toolbar
          :showSearch.sync="showSearch"
          @queryTable="getList"
          :columns="columns"
        ></right-toolbar
      ></el-row>
     <el-table border v-loading="loading"  :data="ProjectList">
        <el-table-column type="index" width="50" :index="hIndex" label='序号'/>
        <el-table-column
          v-for="column in _columns"
          :label="column.label"
          :type="column.type"
          align="center"
          :key="column.key"
          :min-width="column.width||null"
          :prop="column.prop"
          :show-overflow-tooltip="true"
        >
          <template  slot-scope="{row}">
            <div v-if="column.type=='student'||column.type=='teacher'">
              <personDetail  :formdata="row" :value="column.value" :keys="column.keys" :type="column.type" />
           </div>
           <div v-else-if="$store.getters.role=='xyadmin'&&column.key=='qrzt'&&(row.xmzt==9 || row.xmzt==18)">
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
            <div v-hasRole="['xyadmin']">
              <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              v-if="scope.row.xmzt==9 || scope.row.xmzt==18"
              @click="submitMiddle(scope.row)"
              >批阅中期检查表</el-button>
             <el-button
              v-if="scope.row.xmzt==16 || scope.row.xmzt==18 | scope.row.xmzt==-50"
              size="mini"
              type="text"
              icon="el-icon-warning-outline"
              @click="handleOver(scope.row.id)">结束暂缓</el-button>
              <!-- v-if="adminComfirm(scope.row.xmzt)" -->
            <el-button
              size="mini"
              type="text"
              icon="el-icon-warning-outline"
              v-if="scope.row.xmzt !==16 || scope.row.xmzt !==18 | scope.row.xmzt !==-50"
              @click="handleConfirm(-50,[scope.row.id],scope.row.xmzt,scope.row.xiangmumc)">暂缓验收</el-button>
             <!-- <el-button
            size="mini"
            type="text"
            icon="el-icon-warning-outline"
            v-if="scope.row.xmzt==18"
            @click="handleConfirm(scope.row.id,-1)">结束暂缓</el-button> -->
           
            </div>
             <el-button
              size="mini"
              type="text"
              icon="el-icon-remove-outline"
              :disabled="scope.row.xmzt == -16"
              v-if="scope.row.xmzt !== 10 "
              @click="stop(scope.row)"
              >中止</el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-download"
              @click="handlePDF(scope.row)"
              >中期PDF</el-button>
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

      <pagination
        v-show="queryParams.total > 0"
        :total="queryParams.total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="getList"
      />

    </el-row>
        <MiddleFrom
        :base="editRow"
        :cbClose="getList"
        :visible.sync="dialogVisible"
        type="2"
      />
  </div>
</template>

<script>// @ts-nocheck

import ProjectApi from "@/api/jxStuProject";
import api from "@/api/retrieval"
import {setPageParams,getPageParams} from '@/utils/auth'
import {ObjectUpdate} from "@/utils/jxUtil"
import ProjectPipe from "@/components/projectPipe";
import MiddleFrom from "@/views/jxStuProject/common/middleFrom";
import {downloadFile} from "@/utils/index";
import personDetail from "@/views/jxStuProject/common/personDetail";
import improtFile from '@/components/importFile'
export default {
  components: {improtFile,ProjectPipe,MiddleFrom,personDetail},
  data() {
    return {
      //学院列表
      xyList:[],
      //年份列表
      nfList:[],
      //项目状态选项
      xmztpes:{},
      expertType:1,//1立项2修改经费
      dialogVisible:false,
      //编辑Id
      editRow:{},
      editId: null,
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
      //项目类型
      xmtypes: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 默认密码
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        nf:'',
        xybh:'',
        total:0,
        xmtype: "zq",
        xmzt:'',
        fzxsxm: undefined,
        fzxsxh: undefined,
        xmlx:undefined,
        fzdsxm: undefined,
        xmmc: undefined
      },
      exportLoading:false,
      xmlboptions:{},
      // 项目列表字典
      projectType: {},
      //确认状态
      qrztType: {},

      //导师意见
      dsyj: "",
      bianhao:'',
      // 列信息
      columns: [
        { key: "bh", label: `项目编号`,width:'120px', prop: "bianhao", visible: true },
        {key: "xiangmumc",label: `项目名称`,width:'400px',prop: "xiangmumc",visible: true},
        {key:'xymc',label:'学院名称',width:'130px',prop:'xymc',customer:'school',visible:true},
        {label: "项目类型",key: "typeStr",prop: "typeStr",visible: true},
        { key: "fzdsxm", label: `负责导师`,type:'teacher', value: "fzdsxm",keys:'fzdsgh', visible: true },
        { key: "fzxsxm", label: `负责学生`,type:'student', value: "fzxsxm",keys:'fzxsxh', visible: true },
        { key: "qrzt", label: `状态`, prop: "qrztStr", visible: true },
        // { key: "dbfs", label: `中检结果`, prop: "dbfs", visible: true },
        { key: "shenqjf", label: `经费`, prop: "shenqjf", visible: true }
      ],
    };
  },
  async created() {
    await this.getDicts("kyxl_gllx").then(res => {
      res.data.map(item => {
        this.projectType[item.dictValue] = item.dictLabel;
      });
    });
    // await this.getDicts("getLB2MapForAdd").then(res => {
    //   this.xmlboptions = res.data;
    // });
    this.getDicts("gc_xmtype").then(res => {
      this.xmtypes = res.data;
    });
    await this.getDicts("qrzt").then(res => {
      res.data.map(item => {
        this.qrztType[item.dictValue] = item.dictLabel;
      });
    });
    
  },
  async mounted(){ 
      const localParams = getPageParams.call(this)||{}
      // console.log(this.queryParams.nf)
      //Object.assign(this.queryParams,getPageParams.call(this))
      this.queryParams=ObjectUpdate(this.queryParams,localParams)
      //this.queryParams.pageNum = 3//localParams.pageNum
      await this.init()
      this.getList();
    },
  computed: {
    _columns() {
      return this.columns.filter(item => item.visible);
    },
    roleType(){
      return this.$store.getters.user.rolekey
    },
  },
  methods: {

     /** 导出按钮操作 */
    handleExportallPDF() {
      const queryParams = Object.assign({}, this.queryParams, { dcly:'lx' })
      this.$confirm('是否确认导出所有PDF?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.exportLoading = true;
          return ProjectApi.expertallPdf(queryParams);
        }).then(response => {
           downloadFile(response,'中期管理PDF','zip');
          this.exportLoading = false;
        })
    },
    stop(row){
       this.$confirm("是否确认中止项目"+ row.xiangmumc +"?", "警告", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            }).then(() => {
                return ProjectApi.stopmiddle(row.id)
            }).then(response=>{
              this.$message.success('成功')
              this.getList()
                // this.exportLoading = false;
            }).catch(res=>{console.log(res);});
    },
      /** 导出按钮操作 */
     handleExport(columns) {

            const queryParams = Object.assign({},this.queryParams) 
            queryParams.columns=columns
            this.$confirm("是否确认导出中期管理数据?", "警告", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            }).then(() => {
                return ProjectApi.getAllReslutOut(queryParams)
            }).then(response=>{
              downloadFile(response, '中期管理')
                this.exportLoading = false;
            }).catch(res=>{console.log(res);});
    },
    hIndex (index){
       return (index + 1) + (this.queryParams.pageNum  - 1) * this.queryParams.pageSize;
    },
    async init(){
     //获取项目状态列表
      ProjectApi.projectZqXmzt().then(res=>{
        this.xmztpes = res.data
      })
        //确定项目lx 1:国创：nation,2省3校4院
      let xmlx = 1
     let _path = this.$route.path
      if(_path.indexOf('nation')>-1)xmlx = 1
      else if(_path.indexOf('province')>-1)xmlx=2
      else if(_path.indexOf('kysj')>-1)xmlx=3
      else xmlx=4
      if(_path.indexOf('academy')>-1)this.queryParams.xmejlb=42
      else if(_path.indexOf('school')>-1)this.queryParams.xmejlb=41
      //获取期次列表
     await  ProjectApi.projectQcList({xmlx}).then(res=>{
        this.nfList = res.data
        this.queryParams.nf = this.queryParams.nf||res.data[0].id
      })
      await  api.xmlbList({xmlb:xmlx}).then(res => {
        this.xmlboptions = Object.assign({},{'全部分类':null},res.data) 
      })  
      //获取学院列表
     await ProjectApi.projectXyList().then(res=>{
        return  this.xyList=res.data
      })
      //
    },
    //
    switchChangeSchool(row,index){
      // console.log(row,index)
      row.editSchool=!row.editSchool
      this.$set(this.ProjectList,index,row)

    },
    /** 查询待提交的项目列表 */
    getList() {
      this.loading = true;
      ProjectApi.schAdminGetList(this.queryParams).then(response => {
        this.ProjectList = response.rows.map(item => {
          item.typeStr = this.projectType[item.xmejlb];
          item.qrztStr = this.qrztType[item.xmzt];
          item.shenqjf = parseInt(item.shenqjf)
          return item;
        });
       this.queryParams.total = response.total;
        this.loading = false;
        setPageParams.call(this,{...this.queryParams})
      });
    },
    //
        //提交中期检查表
    submitMiddle(row) {
      this.editId = row.id;
      this.editRow = row;
      this.dialogVisible = true;
    },
    handleConfirm(id,xmzt){
      // console.log(id,xmzt);
      let params={
        type:'zq',
        id,
        xmzt
      }
      ,shztStr={'-16':'中止','-50':'暂缓','-1':'结束暂缓'}
      this.$confirm(`是否确定${shztStr[params.xmzt]}编号为'${params.id}'的项目。`, "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return ProjectApi.schoolMidConfirm(params);
        }).then(() => {
          this.getList();
          this.msgSuccess("操作成功");
        })
    },
    // 暂缓
    handleOver(id){
      let params={
        type:'zq',
        id,
      }
      this.$confirm(`是否确定暂缓编号为'${params.id}'的项目。`, "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return ProjectApi.overpostpone(params);
        }).then(() => {
          this.getList();
          this.msgSuccess("操作成功");
        })
    },
    adminComfirm(xmzt){
      return ['9','-17','18'].includes(xmzt+'')
     },
    //修改学院
    onChangeSchool(item,row,index){
      // console.log(item,row)
      if(!item.value) return
      let data={
        xmid:row.id,
        newxybh:item.value,
        newxymc:item.label
      }
      ProjectApi.changeSchool(data).then(data=>{
         row.xymc = item.label
         this.msgSuccess('学院修改成功')
         this.switchChangeSchool(row,index)
      })
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.queryParams.nf = this.nfList[0].id
      this.handleQuery();
    },
     // expertType:1,//1立项2修改经费

    // 导出pdf
    handlePDF({id,xiangmumc,fzxsxh}) {
      ProjectApi.expertPdf({ id, type:'zq' }).then(data => {
        downloadFile(data,fzxsxh + '_' + xiangmumc + '_中期检查表','pdf')
      });
    },

    /** 查看按钮操作 */
    onReview(row) {
      let path = `/innovation/preView/${row.id}/${row.xmejlb}/${row.type}`
      ,addTag={}
      addTag[path] = row.xiangmumc
      this.$store.dispatch('tagsView/updateRemotePathName',addTag)
      this.$router.push(path)
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id);
      this.bianhao = selection.map(item => item.bianhao);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },

    //批量确认类型
    handleConfirmMUt() {
      return false
      let data = [];
      let ids = [];
      this.ProjectList.map(item => {
        if (item.xmzt == 3 && item.confirmCat) {
          data.push({ id: item.id, xmlx: item.confirmCat });
          ids.push(item.id);
        }
      });
      if (ids.length < 1) return this.msgInfo("没有符合需要确认类型的项目");
      this.$confirm('是否确认Id为："' + ids + '" 的项目类型吗？', "确认", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "info"
      }).then(d => {
        return ProjectApi.schoolConfirm({ list: data }).then(() => {
          this.getList();
        });
      });
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
.schoolName{
  text-align: left;
}
</style>
