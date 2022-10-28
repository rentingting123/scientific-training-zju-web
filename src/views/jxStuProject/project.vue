<template>
  <div class="app-container">
    <!--用户数据-->
    <div style="padding:0 0 10px 0;"><ProjectPipe /></div>
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      label-width="100px"
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
      <el-form-item  label="按项目状态" prop="xmzt">
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
      <el-form-item  label="项目类型" prop="xmlx">
          <el-select v-model="queryParams.xmlx" clearable filterable placeholder="请选择">
          <el-option
            v-for="dict in xmlboptions1"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="负责学生姓名" prop="fzxsxm">
        <el-input v-model="queryParams.fzxsxm" placeholder="负责学生姓名" style="width:230px;">
        </el-input>
      </el-form-item>
      <el-form-item label="负责学生学号" prop="fzxsxh">
        <el-input v-model="queryParams.fzxsxh" placeholder="负责学生学号" style="width:230px;">
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
        <!-- v-hasPermi="['sys:declare']"  -->
        <el-tooltip class="item"  effect="light" content="申报SRTP请将个人信息的学院设置为专业所在学院" placement="bottom">
      <el-button  v-hasPermi="['sys:declare']"   size="mini" type="primary">
          <div @click="toshenbao()">
            发起申报
          </div>
        </el-button>
    </el-tooltip>
        
      </el-form-item>
    </el-form>
    <el-table border v-loading="loading" :data="ProjectList">
       <el-table-column type="index" :index="hIndex" width="50" label='序号'/>
      <el-table-column
        v-for="column in _columns"
        :label="column.label"
        :type="column.type"
        align="center"
        :min-width="column.width||null"
        :key="column.key"
        :prop="column.prop"
       :show-overflow-tooltip="true"
        >
          <template  slot-scope="{row}">
            <div v-if="column.type=='student'||column.type=='teacher'">
              <personDetail  :formdata="row" :value="column.value" :keys="column.keys" :type="column.type" />
          </div>
          <div v-else-if="column.filter">
            {{column.filte}}
            {{row[column.prop]|dictFilter(xmlboptions)}}
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
              v-if="scope.row.xmzt!=7"
              @click="onExpert(scope.row,2)"
              >修改项目经费</el-button
            >
            <el-button
            size="mini"
            v-if="scope.row.xmzt == 0 || scope.row.xmzt == 1 ||scope.row.xmzt == 3"
            type="text"
            icon="el-icon-edit"
            @click="updataReview(scope.row)"
            >编辑</el-button
          >
          
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="onReview(scope.row)"
            >查看</el-button
          >
          <el-button
            v-if="scope.row.xsqrzt != 0"
            size="mini"
            type="text"
            icon="el-icon-download"
            @click="handlePDF(scope.row)"
            >立项PDF</el-button
          >
          <el-button
            size="mini"
            type="text"
            v-if="
              (role == 'student' && scope.row.xsqrzt == 0) ||
              (role == 'blacklist' && scope.row.xsqrzt == 0) ||
               (role == 'daoshi' && (scope.row.dsqrzt == 0||scope.row.dsqrzt==3))
            "
            icon="el-icon-edit"
            @click="handleResove(scope.row, 1)"
            >确认参与</el-button
          >
          <el-button
            v-if="
              (role == 'student' && scope.row.xsqrzt == 0) ||
                (role == 'daoshi' && (scope.row.dsqrzt == 0||scope.row.dsqrzt==3))
            "
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleResove(scope.row, -1)"
            >拒绝参与</el-button
          >
          <!-- <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-if="scope.row.xmzt == 1 || scope.row.xmzt ==0 || scope.row.xmzt ==2 || scope.row.xmzt ==3"
            >删除</el-button
          > -->
        </template>
      </el-table-column>
    </el-table>
   <editProject
      v-if="dialogVisible"
      :visible.sync="dialogVisible"
      :rowstatus = rowstatus
      @close="dialogVisible = false"
      :title="'修改' + projectType[editType]"
      :type="editType"
      :cbClose="getList"
      :xiangmuerjileibie="xiangmuerjileibie"
      :id="editId"
    />
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />
     <Expert :closecb="getList"
    :type="expertType"
    :id="editId" :visible.sync="expertVisible"/>
    
  </div>
</template>

<script>
import Expert from "./common/projectExpert.vue";
import ProjectPipe from "@/components/projectPipe";
import ProjectApi from "@/api/jxStuProject";
import {downloadFile} from '@/utils/index'
import editProject from "./common/editProject.vue";
import personDetail from "@/views/jxStuProject/common/personDetail";
import { mapGetters } from "vuex";
import {setPageParams,getPageParams} from '@/utils/auth'

export default {
  name: "expert",
  components: { ProjectPipe,personDetail,editProject,Expert },
  data() {
    return {
      editId: null,
      //编辑Type
      editType: "",
      rowstatus:true,
      expertType:2,
      expertVisible:false,
      // 编辑弹窗
      dialogVisible: false,
      //立项流程
      //编辑Id
      editId: null,
      //编辑Type
      editType: "",
      //开始时间
      kssj: "",
      // 遮罩层
      loading: true,
      // 总条数
      total: 0,
      //项目状态选项
      xmztpes:{},
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
        fzdsxm:undefined,
        xmtype: "lx"
      },
      xiangmuerjileibie:undefined,
      // 项目列表字典
      projectType: {},
      // 列信息
      columns: [
        { key: "bh", label: `项目编号`,width:'120px', prop: "bianhao", visible: true },
        {key: "xiangmumc",label: `项目名称`,width:'400px',prop: "xiangmumc",visible: true},
        {key: "xymc",label: `项目所属学院`,prop: "xymc",visible: true},
        {label: "项目类型",key: "typeStr",prop: "typeStr",visible: true},
        {label: "项目二级类型",key: "xmejlb",prop: "xmejlb",visible: true,filter:true,filte:this.xmlboptions},
        { key: "fzdsxm", label: `负责导师`,type:'teacher', value: "fzdsxm",keys:'fzdsgh', visible: true },
        { key: "fzxsxm", label: `负责学生`,type:'student', value: "fzxsxm",keys:'fzxsxh', visible: true },
        { key: "qrzt", label: `立项状态`, prop: "qrztStr", visible: true },
        { key: "dbfs", label: `分数`, prop: "dbfs", visible: true },
        { key: "shenqjf", label: `经费`, prop: "shenqjf", visible: true }
      ],
      xmlboptions:{},
      xmlboptions1:{},
      qrztType: {}
    };
  },
  async created() {
    //获取项目状态列表
      ProjectApi.projectLxXmzt().then(res=>{
        this.xmztpes = res.data
      })
    await this.getDicts("qrzt").then(res => {
      res.data.map(item => {
        this.qrztType[item.dictValue] = item.dictLabel;
      });
    });
    await this.getDicts("kyxl_gllx").then(res => {
      this.xmlboptions = res.data
     });
    await this.getDicts("kyxl_gllx_other").then(res => {
      this.xmlboptions1 = res.data
    });
    await this.getDicts("stu_project_type").then(res => {
      res.data.map(item => {
        this.projectType[item.dictValue] = item.dictLabel;
      });
    });
    this.getList();

    this.queryParams.nf = this.$route.params.year;
  },
  mounted(){ this.queryParams=Object.assign({},this.queryParams,getPageParams.call(this))},

  computed: {
    ...mapGetters(["role"]),
    _columns() {
      return this.columns.filter(item => item.visible);
    }
  },
  methods: {
     onExpert(row,expertType){
      this.editId = row.id;
      this.editType = row.type;
      this.expertType = expertType;
      this.expertVisible = true;
    },
     hIndex (index){
       return (index + 1) + (this.queryParams.pageNum  - 1) * this.queryParams.pageSize;
    },
    toshenbao(){
      this.$router.push("/jxStuProject/declare")
    },
    //导出pdf
    handlePDF({id,xiangmumc,fzxsxh}) {
      ProjectApi.expertPdf({ id, type:'lx' }).then(data => {
       downloadFile(data,fzxsxh + '_' + xiangmumc + '_立项PDF','pdf')
      });
    },
    /** 查询待提交的项目列表ProjectApi */
    getList() {
      this.loading = true;
      //this.queryParams.nowxh = this.$store.getters.user.userName
      ProjectApi.projectManagementList(this.queryParams).then(response => {
        this.ProjectList = response.rows.map(item => {
          item.typeStr = this.projectType[item.type];
          item.qrztStr = this.qrztType[item.xmzt];
          item.shenqjf = parseInt(item.shenqjf)
          return item;
        });
        this.total = response.total;
        this.loading = false;
        setPageParams.call(this,this.queryParams)
      });
    },
    // 编辑按钮操作
    updataReview(row){
      this.xiangmuerjileibie = row.xmejlb
      this.rowstatus = true
      this.editId = row.id;
      this.editType = row.type;
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

    //确认或拒绝参加
    handleResove(row, status) {
      if (this.role == "daoshi") {
        this.$prompt(
          "请输入意见",
          `${status == 1 ? "参与确认" : "不参与确认"}`,
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消"
          }
        )
          .then(({ value }) => {
            ProjectApi.teacherConfirm({
              id: row.id,
              qrzt: status,
              yj: value,
              typeList: 1
            }).then(data => {
              this.$message(data.msg);
              this.getList();
            });
          })
          .catch(() => {});
      } else {
         this.$confirm(
          `${status == 1 ? "该项目立项后，将严格遵守有关规定、遵守本申报书和预算表中规定的条款和内容，保证按计划进度完成项目任务。" : "确认不同意参与项目"+row.xiangmumc}`,
          `${status == 1 ? "承诺书" : "拒绝确认"}`,{
              confirmButtonText:`${status == 1 ? "同意" : "确定"}`,
              cancelButtonText:`${status == 1 ? "不同意" : "取消"}`,
          }
        ).then(() => {
          ProjectApi.stuComfirm({ id: row.id, qrzt: status, typeList: 1 }).then(
            data => {
              this.$message(data.msg);
              this.getList();
            }
          );
        });
      }
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
          return ProjectApi.delOtherProject({ids:[row.id]});
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        });
    }
  }
};
</script>
