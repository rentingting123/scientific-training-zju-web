<template>
  <div class="app-container">
    <ProjectPipe />
    <el-row style="margin-top:10px" :gutter="20">
      <!--用户数据--->
      <el-form
        :model="queryParams"
        ref="queryForm"
        :inline="true"
        v-show="showSearch"
        label-width="100px"
      >
        <el-form-item label="年份筛选" prop="nf">
          <el-select @change="handleQuery" v-model="queryParams.nf" placeholder="请选择">
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
              v-for="(item,key) in xmztpes"
              :key="key"
              :label="item"
              :value="key"
              style="width:230px;"
            >
            </el-option>
          </el-select>
        </el-form-item>

       <el-form-item v-hasPermi="['sys:nation:school']"  label="按学院" prop="xybh">
          <el-select v-model="queryParams.xybh" placeholder="请选择" style="width:230px;">
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
          <el-form-item  label="项目类型" prop="xmlx">
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
        <!-- <el-col :span="1.5">
          <el-button
            type="danger"
            plain
            icon="el-icon-delete"
            size="mini"
            @click="handleDelete()"
            >批量删除</el-button
          >
        </el-col> -->
          <el-col :span="1.5">
            <improtFile 
            v-hasRole="['tadmin','admin','xyadmin']"
            url='/project/importXypsXm'
            title="批量导入分数结果"
            :close="getList"
            download="https://web.moocollege.com/mooc/schooladmin/%E5%AD%A6%E9%99%A2%E8%AF%84%E5%AE%A1.xlsx"
            /> 
        </el-col>
        <el-col :span="1.5" style="padding-left:0;">
          <el-button
            type="primary"
            plain
            icon="el-icon-check"
            size="mini"
            :disabled="ids.length<1"
            v-hasRole="['tadmin']"
            @click="handleConfirm(7)"
            >批量通过</el-button
          >
        </el-col>
           <el-col :span="1.5" style="padding-left:0;">
          <el-button
            type="ghost"
            plain
            icon="el-icon-close"
             :disabled="ids.length<1"
            size="mini"
            v-hasRole="['tadmin']"
            @click="handleConfirm(6)"
            >批量不通过</el-button
          >
        </el-col>
        <el-col :span="1.5" style="padding-left:0;">
          <jx-export
            type="warning"
            plain
            fildKey="lx_field"
            size="mini"
            @done="handleExport"
            >导出</jx-export>
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
        <right-toolbar
          :showSearch.sync="showSearch"
          @queryTable="getList"
          :columns="columns"
        ></right-toolbar
      ></el-row>
      <el-table
        v-loading="loading"
        :data="ProjectList"
        border
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" :selectable="row=>row.xmzt==4" width="50" align="center" />
           <!-- <el-table-column label="项目类型" align="center" prop="xmlb" :formatter="leibieFormat" /> -->
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
       
        <template  slot-scope="scope">
          <div v-if="column.customer=='school'">
            {{scope.row.editSchool}}
              <acadSelect  v-if="scope.row.editSchool" @onChange="(val)=>onChangeSchool(val,scope.row,scope.$index)" v-model="scope.row.xymc" />
              <div class="schoolName" v-else>
              <el-button v-if="roleType=='tadmin'" type="primary" size='mini' @click="switchChangeSchool(scope.row,scope.$index)" icon="el-icon-edit" circle style="padding:5px;margin-right:3px;"></el-button>
              <span class="schoolName" :title='scope.row.xymc'>{{scope.row.xymc}}</span>
             </div>
          </div>
          <div v-else-if="column.type=='student'||column.type=='teacher'">
              <personDetail  :formdata="scope.row" :value="column.value" :keys="column.keys" :type="column.type" />
          </div>
          <div v-else-if="$store.getters.role=='xyadmin'&&column.key=='qrzt'&&scope.row.xmzt == 3">
                <el-button
                  size="mini"
                  type="text"
                  icon="el-icon-edit"
                  @click="onExpert(scope.row,1)"
                  >{{scope.row[column.prop]}}</el-button>
           </div>
           <div style="text-algin:center" v-else>
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
            <!-- <div v-if="roleType=='xyadmin'"> -->
              <!-- <el-button
              v-if="scope.row.xmzt == 3"
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="onExpert(scope.row,1)"
              >立项审批</el-button
            > -->
              <el-button
              v-if="scope.row.xmzt == 3&&(scope.row.xmejleibie == 12 || scope.row.xmejleibie == 22 || scope.row.xmejleibie == 42 || scope.row.xmejleibie == 41)"
              size="mini"
              type="text"
              icon="el-icon-edit"
              v-hasRole="['xyadmin']"
              @click="ontypeback(scope.row,1)"
              >回退至待确定</el-button
            >
 
            <!-- </div> -->
               <el-button
                size="mini"
                type="text"
                icon="el-icon-edit"
                 v-if="scope.row.xmzt == 0 || scope.row.xmzt == 1 ||scope.row.xmzt == 2 || scope.row.xmzt == 7"
                @click="updataReview(scope.row)"
                >编辑</el-button
              >
               <el-button
            size="mini"
            v-if="scope.row.xmzt == 3"
            type="text"
            v-hasRole="['admin','tadmin','xyadmin']"
            icon="el-icon-edit"
            @click="updataReview(scope.row)"
            >编辑</el-button
          >
           <el-button
            size="mini"
            v-if="scope.row.xmzt == 4"
            type="text"
            v-hasRole="['admin','tadmin']"
            icon="el-icon-edit"
            @click="updataReview(scope.row)"
            >编辑</el-button
          >
             <el-button
              v-if="roleType=='tadmin'&&scope.row.xmzt==4"
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="handleResove(scope.row,7)"
              >同意立项</el-button
            >

             <el-button
              v-if="roleType=='tadmin'&&scope.row.xmzt==4"
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="handleResove(scope.row,6)"
              >不同意立项</el-button
            >
            <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              v-hasRole="['admin','tadmin','xyadmin']"
              @click="onExpert(scope.row,2)"
              >修改项目经费</el-button
            >   
             <!-- <el-button
              v-if="roleType=='tadmin'"
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="onChangeSchool(scope.row)"
              >修改学院</el-button
            > -->

            <el-button
              size="mini"
              type="text"
              icon="el-icon-paperclip"
              @click="handlePDF(scope.row)"
              >立项PDF</el-button
            >
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
       <!-- <el-pagination
          v-show="total > 0"
          style="text-align: right;margin-top: 20px;"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="1"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="10"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
    </el-pagination> -->
    </el-row>
    <Expert :closecb="getList"
    :type="expertType"
    :id="editId" :visible.sync="expertVisible"/>
    <jxDialog
        :visible.sync="reviewVisible"
        @close="reviewVisible = false"
        :title="'查看' + onReviewRow.xiangmumc"
      >
      <preView :row="onReviewRow"/>
    </jxDialog>
    <editProject
      v-if="dialogVisible"
      :visible.sync="dialogVisible"
      :rowstatus = rowstatus
      @close="dialogVisible = false"
      :title="'修改' + projectType1[editType]"
      :type="editType"
      :cbClose="getList"
      :xiangmuerjileibie="xiangmuerjileibie"
      :id="editId"
    />
  </div>
</template>

<script>// @ts-nocheck

import ProjectApi from "@/api/jxStuProject";
import improtFile from '@/components/importFile'
import api from "@/api/retrieval"
import {setPageParams,getPageParams} from '@/utils/auth'
import preView from "@/views/innovation/common/preview"
import editProject from "@/views/jxStuProject/common/editProject.vue";
import jxDialog from '@/components/jxDialog'
import ProjectPipe from "@/components/projectPipe";
import personDetail from "@/views/jxStuProject/common/personDetail";
import Expert from "./common/projectExpert.vue";
import { downloadFile } from "@/utils/index";
import acadSelect from "@/views/basedata/common/acadSelect"
export default {
  components: {improtFile,jxDialog,preView,ProjectPipe,Expert,acadSelect,personDetail,editProject},
  data() {
    return {
      xiangmuerjileibie:'',
      exportLoading:false,
      dialogVisible: false,
      reviewVisible:false,
      //学院列表
      xyList:[],
      //年份列表
      nfList:[],
      //项目状态选项
      xmztpes:{},
      expertType:1,//1立项2修改经费
      expertVisible:false,
      //编辑Id
      editId: null,
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
      //项目类型
      xmtypes: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 默认密码
      // 查询参数
      queryParams: {
        total:0,
        pageNum: 1,
        pageSize: 10,
        xmtype: "lx",
        xmzt:null,
        xmlx:undefined,
        xybh:null,
        fzxsxm: undefined,
        fzxsxh: undefined,
        fzdsxm: undefined,
        xmmc: undefined
      },
      rowstatus:true,
      xmlboptions:{},
      // 项目列表字典
      projectType: {},
      //确认状态
      qrztType: {},
      projectType1:{},
      ids:[],
      //导师意见
      dsyj: "",
      bianhao:'',
      onReviewRow:{},
      leibieOptions: [],
      // 列信息
      columns: [
        {key: "bh", label: `项目编号`,width:'120px', prop: "bianhao", visible: true },
        {key: "xiangmumc",label: `项目名称`,width:'400px',prop: "xiangmumc",visible: true},
        {label: "项目类型",key: "xmejlb",prop: "xmejlb",visible: true},
        {key:'xymc',label:'学院名称',width:'130px',prop:'xymc',customer:'school',visible:true},
        {key: "fzdsxm", label: `负责导师`,type:'teacher', value: "fzdsxm",keys:'fzdsgh', visible: true },
        {key: "fzxsxm", label: `负责学生`,type:'student', value: "fzxsxm",keys:'fzxsxh', visible: true },
        {key: "qrzt", label: `状态`, prop: "qrztStr", visible: true },
        // { key: "dbfs", label: `分数`, prop: "dbfs", visible: true },
        { key: "shenqjf", label: `经费`, prop: "shenqjf", visible: true }
      ]
    };
  },
  mounted(){ this.queryParams=Object.assign({},this.queryParams,getPageParams.call(this))},
  async created() {
    
    await this.getDicts("kyxl_gllx").then(res => {
      res.data.map(item => {
        this.projectType[item.dictValue] = item.dictLabel;
      });
    });
      await this.getDicts("stu_project_type").then(res => {
      res.data.map(item => {
        this.projectType1[item.dictValue] = item.dictLabel;
      });
    });
    this.getDicts("gc_xmtype").then(res => {
      this.xmtypes = res.data;
    });
    // await this.getDicts("getLB2MapForAdd").then(res => {
    //   this.xmlboptions = res.data;
    // });
    await this.getDicts("qrzt").then(res => {
      res.data.map(item => {
        this.qrztType[item.dictValue] = item.dictLabel;
      });
    });
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
    // 回退至待确定
    ontypeback(row){
      api.typeback(row.id).then(res => {
        if(res.code == 200){
          this.getList()
        }
      })
    },
// 编辑按钮操作
    updataReview(row){
      this.rowstatus = true
      this.editId = row.id;
       for(let i in this.xmlboptions){
         if(row.xmejlb == i){
           this.xiangmuerjileibie = this.xmlboptions[i]
         }
       }
      // this.xiangmuerjileibie = row.xmejlb
      this.editType = row.type;
      // this.editType = 2;
      this.dialogVisible = true;
    },
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
           downloadFile(response,'立项管理PDF','zip');
          this.exportLoading = false;
        })
    },
             /** 导出按钮操作 */
     handleExport(columns) {
      const queryParams = Object.assign({},this.queryParams) 
            queryParams.columns=columns
      this.$confirm('是否确认导出所选立项管理数据?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.exportLoading = true;
          return ProjectApi.getAllReslutOut(queryParams);
        }).then(response => {
           downloadFile(response, '立项管理')
          this.exportLoading = false;
        })
    },
     hIndex (index){
	    return (index + 1) + (this.queryParams.pageNum  - 1) * this.queryParams.pageSize;
    },
     handleCurrentChange(val) {
        this.queryParams.pageNum = val
         this.getList();
      },
     handleSizeChange(val) {
       this.queryParams.pageSize = val
       this.getList();
      },
   async init(){
     //获取项目状态列表
      ProjectApi.projectLxXmzt().then(res=>{
        this.xmztpes = res.data
      })
      //确定项目xmlx 1:国创：nation,2省,3科研实践
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
      ProjectApi.projectXyList().then(res=>{
        this.xyList=res.data
      })
      //
    },

    // 导出pdf
    handlePDF({id,xiangmumc,fzxsxh}) {
      ProjectApi.expertPdf({ id, type:'lx' }).then(data => {
       downloadFile(data,fzxsxh + '_' + xiangmumc + '_立项申请表','pdf')
      });
    },
    //
    switchChangeSchool(row,index){
      row.editSchool=!row.editSchool
      this.$set(this.ProjectList,index,row)

    },
    findKey (value, compare = (a, b) => a === b) {
      return Object.keys(this.xmlboptions).find(k => compare(this.xmlboptions[k], value))
    },
    /** 查询待提交的项目列表 */
    getList() {
      
      this.loading = true;
      ProjectApi.schAdminGetList(this.queryParams).then(response => {
        this.ProjectList = response.rows.map(item => {
          item.xmejleibie = item.xmejlb
          item.shenqjf = parseInt(item.shenqjf)
        for(let i in this.xmlboptions){
          if(item.xmejlb == this.xmlboptions[i]){
            item.xmejlb = i
          }
        }
          item.typeStr = this.projectType[item.xmejlb];
          item.qrztStr = this.qrztType[item.xmzt];
          return item;
        });
        this.queryParams.total = response.total;
        this.loading = false;
        setPageParams.call(this,this.queryParams)
      });
    },
    //修改学院
    onChangeSchool(item,row,index){
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
    //评审按钮
    onExpert(row,expertType){
      this.editId = row.id;
      this.editType = row.type;
      this.expertType = expertType;
      this.expertVisible = true;
    },
    /** 查看按钮操作 */
    onReview(row) {
      // this.onReviewRow = row
      // this.reviewVisible=true
      // console.log(row.xmejlb);
      for(let i in this.xmlboptions){
          if(row.xmejlb == i){
            row.xmejlb = this.xmlboptions[i]
          }
        }
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
    //不予立项
    handleResove(row, status) {
      this.$prompt("请输入意见", `${status==7?'通过立项':'不通过'}`, {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(({ value }) => {
          ProjectApi.schoolOpinion({
            xmids: [row.id],
            shzt: status,
            xxyj: value
          }).then(data => {
            this.getList();
          });
        })
        .catch(() => {});
    },
    //批量确认类型
    handleConfirm(status) {
      // return false
      let ids = this.ids
      if (ids.length < 1) return this.msgInfo("没有符合需要确认类型的项目");
      this.$prompt('请输入统一意见',`批量${status==7?'通过立项':'不通过'}Id为：${ids} 的项目类型吗？`,{
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "info"
      }).then(({value}) => {
        return ProjectApi.schoolOpinion({  xmids: ids,
            shzt: status,
            xxyj: value }).then((res) => {
          this.msgSuccess(res.msg)
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
</style>
