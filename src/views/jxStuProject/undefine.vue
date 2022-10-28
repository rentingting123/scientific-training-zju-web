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
        <el-form-item label="开始时间" prop="shengqingsj">
          <el-date-picker
            v-model="queryParams.shengqingsj"
            value-format="yyyy-MM-dd"
            @change="dataChange"
            type="date"
            placeholder="选择日期"
          >
          </el-date-picker>
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
         <el-table-column type="index" width="50" :index="hIndex" label='序号'/>
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
            v-if="scope.row.xmzt == 0 || scope.row.xmzt == 1 ||scope.row.xmzt == 2"
            type="text"
            icon="el-icon-edit"
            @click="updataReview(scope.row)"
            >编辑</el-button
          >
           <!-- <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
               v-if="scope.row.xmzt == 1 || 0 || 2 || 3"
              @click="handleDelete(scope.row)"
              >删除</el-button
            > -->
            <el-button
              size="mini"
              type="text"
              icon="el-icon-view"
              @click="onReview(scope.row)"
              v-hasPermi="['xm:student:update']"
              >查看</el-button
            >
            <!-- <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              v-hasPermi="['system:leval:updata']"
              @click="updataLeval(scope.row, 2)"
              >修改项目等级</el-button
            > -->
            <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              v-if="scope.row.xmzt == 2"
              @click="onExpert(scope.row, 2)"
              >修改项目经费</el-button
            >
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
              v-if="scope.row.xsqrzt==0"
              icon="el-icon-edit"
              @click="handleResove(scope.row,1)"
              >确认参与</el-button
            >
            <el-button
             v-if="scope.row.xsqrzt==0"
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="handleResove(scope.row,-1)"
              >拒绝参与</el-button
            >

            <!-- <el-button
             v-if="scope.row.xsqrzt!=0"
              size="mini"
              type="text"
              icon="el-icon-download"
              @click="handlePDF(scope.row.id,'lx')"
              >立项PDF</el-button
            > -->

           
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
      :daiqueding='true'
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
      <review :id="editId" :type="editType" />
    </jxDialog>
     <el-dialog
      style="min-width: 890px; width: 60%; margin: 0 auto"
      width="100%"
      :visible.sync="reviewVisiblemoney"
      @close="reviewVisiblemoney = false"
      title="修改项目经费"
    >
      <el-form
        ref="elFormmoney"
        :model="formDatamoney"
        :rules="rulesmoney"
        size="medium"
        label-width="150px"
      >
        <el-form-item label="申请经费" prop="pzjf">
          <el-input
            v-model="formDatamoney.pzjf"
            disabled
            placeholder="请输入申请经费"
            clearable
            :style="{ width: '30%' }"
          /><el-alert
            style="display: inline; margin-left: 20px"
            type="warning"
            title="（自动统计，不需填写）"
          >
          </el-alert>
          <el-alert style="margin-top: 10px" type="warning" title="创业训练最高1.2万元">
          </el-alert>
        </el-form-item>
       <el-row :gutter="15">
          <el-form-item label="项目经费预算与用途:">
            <el-alert type="error" title="* 只能输入整百的数值"></el-alert>
          </el-form-item>
          <el-col :span="12">
            <el-form-item label="专用材料费" prop="zyclf">
              <el-input-number
                v-model="formDatamoney.zyclf"
                placeholder="专用材料预算经费"
                :step="100"
                controls-position="right"
              ></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="主要用途"  
            :rules='formDatamoney.zyclf == 0 ? rulesmoney.target:[{required: true,
            message: "专用材料预算经费主要用途",
            trigger: "blur"}]'  prop="zyclfText">
              <el-input
                v-model="formDatamoney.zyclfText"
                placeholder="专用材料预算经费主要用途"
                clearable
                :style="{ width: '100%' }"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="印刷与资料" prop="ysfyzlf">
              <el-input-number
                v-model="formDatamoney.ysfyzlf"
                placeholder="预算经费印刷与资料"
                :step="100"
                controls-position="right"
              ></el-input-number>
            </el-form-item>
          </el-col>
           <el-col :span="12">
            <el-form-item label="主要用途"
             :rules='formDatamoney.ysfyzlf == 0 ? rulesmoney.target:[{ required: true,
            message: "印刷与资料经费主要用途",
            trigger: "blur"}]' 
            prop="ysfyzlfText">
            <!--  -->
              <el-input
             
                v-model="formDatamoney.ysfyzlfText"
                placeholder="印刷与资料经费主要用途"
                clearable
                :style="{ width: '100%' }"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="交通与差旅" prop="dyyclf">
              <el-input-number
                v-model="formDatamoney.dyyclf"
                placeholder="交通与差旅预算经费"
                :step="100"
                controls-position="right"
              ></el-input-number>
            </el-form-item>
          </el-col>
             <el-col :span="12">
            <el-form-item label="主要用途"
             :rules='formDatamoney.dyyclf == 0 ? rulesmoney.target:[{ required: true,
            message: "交通与差旅主要用途",
            trigger: "blur"}]'
            prop="dyyclfText">
              <el-input
              
                v-model="formDatamoney.dyyclfText"
                placeholder="交通与差旅主要用途"
                clearable
                :style="{ width: '100%' }"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="出版费" prop="bmysf">
              <el-input-number
                v-model="formDatamoney.bmysf"
                placeholder="出版费预算经费"
                :step="100"
                controls-position="right"
              ></el-input-number>
            </el-form-item>
          </el-col>
           <el-col :span="12">
            <el-form-item label="主要用途" 
            :rules='formDatamoney.bmysf == 0 ? rulesmoney.target:[{required: true,
            message: "出版费预算主要用途",
            trigger: "blur"}]'
             prop="bmysfText">
              <el-input
              
                v-model="formDatamoney.bmysfText"
                placeholder="出版费预算主要用途"
                clearable
                :style="{ width: '100%' }"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="邮寄费" prop="ydf">
              <el-input-number
                v-model="formDatamoney.ydf"
                placeholder="专用材料预算经费邮寄费"
                :step="100"
                controls-position="right"
              ></el-input-number>
            </el-form-item>
          </el-col>
           <el-col :span="12">
            <el-form-item label="主要用途"
             prop="ydfText">
             <!--   :rules='formDatamoney.ydf == 0 ? rules.target:[{required: true,
            message: "邮寄费主要用途",
            trigger: "blur"}]' -->
              <el-input
                v-model="formDatamoney.ydfText"
                placeholder="邮寄费主要用途"
                clearable
                :style="{ width: '100%' }"
              >
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="reviewVisiblemoney = false">取 消</el-button>
        <el-button type="primary" @click="xiugaimoney()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import ProjectApi from "@/api/jxStuProject";
import StuApi from "@/api/jxStuProject/index";
import jxDialog from "@/components/jxDialog"
import editProject from "./common/editProject.vue";
import { downloadFile } from "@/utils/index";
import review from "./common/reviewProject.vue";
import personDetail from "@/views/jxStuProject/common/personDetail";
export default {
  components: { review,personDetail,jxDialog ,editProject},
  data() {
    return {
      // 项目经费弹窗
       reviewVisiblemoney: false,
      rowstatus:true,
      //编辑框
      dialogVisible: false,
      reviewVisible: false,
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
        shengqingsj: undefined
      },
       rulesmoney: {
        zyclf: [
          {
            required: true,
            message: "专用材料预算经费",
            trigger: "blur",
          },
        ],
        // zyclfText: [
        //   {
        //     required: true,
        //     message: "专用材料预算经费主要用途",
        //     trigger: "blur",
        //   },
        // ],
        ysfyzlf: [
          {
            required: true,
            message: "预算经费印刷与资料",
            trigger: "blur",
          },
        ],
        // ysfyzlfText: [
        //   {
        //     required: true,
        //     message: "印刷与资料经费主要用途",
        //     trigger: "blur",
        //   },
        // ],
        dyyclf: [
          {
            required: true,
            message: "交通与差旅预算经费",
            trigger: "blur",
          },
        ],
        // dyyclfText: [
        //   {
        //     required: true,
        //     message: "交通与差旅主要用途",
        //     trigger: "blur",
        //   },
        // ],
        bmysf: [
          {
            required: true,
            message: "出版费预算经费",
            trigger: "blur",
          },
        ],
        // bmysfText: [
        //   {
        //     required: true,
        //     message: "出版费预算主要用途",
        //     trigger: "blur",
        //   },
        // ],
        ydf: [
          {
            required: true,
            message: "专用材料预算经费邮寄费",
            trigger: "blur",
          },
        ],
        // ydfText: [
        //   {
        //     required: true,
        //     message: "邮寄费主要用途",
        //     trigger: "blur",
        //   },
        // ],
      },
      // 项目列表字典
      projectType: {},
      //确认状态
      qrztType:{},
        formDatamoney: {
        zyclf: undefined,
        ysfyzlf: undefined,
        dyyclf: undefined,
        ydf: undefined,
        bmysf: undefined,
        pzjf: undefined,
        zyclfText:undefined,
        ysfyzlfText:undefined,
        dyyclfText:undefined,
        bmysfText:undefined,
        ydfText:undefined,
        xmidz: undefined,
      },
      // 列信息
      columns: [
        { key: "bh", label: `项目编号`, prop: "bianhao", visible: true },
        { key: "xymc", label: `项目所属学院`,prop: "xymc",type:'xymc', value: "xymc",keys:'xymc', visible: true },
        {
          key: "xiangmumc",
          label: `项目名称`,
          prop: "xiangmumc",
          visible: true
        },
        { key: "fzdsxm", label: `负责导师`,type:'teacher', value: "fzdsxm",keys:'fzdsgh', visible: true },
        { key: "fzxsxm", label: `负责学生`,type:'student', value: "fzxsxm",keys:'fzxsxh', visible: true },
        { key: "qrzt", label: `状态`, prop: "qrztStr", visible: true },
        { key: "dbfs", label: `分数`, prop: "dbfs", visible: true },
        { key: "shenqjf", label: `经费`, prop: "shenqjf", visible: true },
        
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
      res.data.map(item => {
        this.qrztType[item.dictValue] = item.dictLabel;
      });
    });
    this.getList();
  },
  computed: {
    _columns() {
      return this.columns.filter(item => item.visible);
    }
  },
    watch: {
    formDatamoney: {
      immediate: true, //立即执行,让这个函数在页面刚打开的时候就被执行
      deep: true, //深度侦听复杂类型内变化
      handler(newval, oldval) {
        this.formDatamoney.pzjf =
          newval.zyclf + newval.ysfyzlf + newval.dyyclf + newval.bmysf + newval.ydf;
      },
    },
  },
  methods: {
    // 获取项目详情接口
    getDetailById(id){
        if(!id)return
        StuApi.getProjectById({id}).then(data=>{
            this.formDatamoney.bmysf = data.data.bmysf;
            this.formDatamoney.zyclf = data.data.zyclf;
            this.formDatamoney.ysfyzlf = data.data.ysfyzlf;
            this.formDatamoney.dyyclf = data.data.dyyclf;
            this.formDatamoney.ydf = data.data.ydf;
            // let _formData = data.data
            // _formData.sbxmlbarr = _formData.sbxmlb.split(",")
            // this.formData = _formData
        }).catch(err=>{

        })
    },
    onExpert(row, expertType) {
      // this.formDatamoney.xmid = row.id;
      this.getDetailById(row.id)
      this.reviewVisiblemoney = true;
      this.formDatamoney.bmysf = row.bmysf;
      this.formDatamoney.xmid = row.id;
      this.formDatamoney.zyclf = row.zyclf;
      this.formDatamoney.ysfyzlf = row.ysfyzlf;
      this.formDatamoney.dyyclf = row.dyyclf;
      this.formDatamoney.ydf = row.ydf;
      this.formDatamoney.zyclfText  = row.zyclf_text ;
      this.formDatamoney.ysfyzlfText  = row.ysfyzlf_text ;
      this.formDatamoney.dyyclfText = row.dyyclf_text;
      this.formDatamoney.bmysfText = row.bmysf_text;
      this.formDatamoney.ydfText = row.ydf_text;
      // this.editId = row.id;
      // this.editType = row.type;
      // this.expertType = expertType;
      this.reviewVisiblemoney = true;
      // this.formDatamoney.bmysf = row.bmysf;
      
      // this.formDatamoney.zyclf = row.zyclf;
      // this.formDatamoney.ysfyzlf = row.ysfyzlf;
      // this.formDatamoney.dyyclf = row.dyyclf;
      // this.formDatamoney.ydf = row.ydf;
    },
     xiugaimoney() {
      ProjectApi.xyChangeMoney(this.formDatamoney).then((res) => {
        this.getList();
      });
      this.reviewVisiblemoney = false;
    },
     // 导出pdf
    handlePDF(row) {
      ProjectApi.dqdexpertPdf({ id:row.id}).then(data => {
       downloadFile(data,row.fzxsxh + '_' + row.xiangmumc + '_立项申请表.pdf','pdf')
      });
    },
    hIndex (index){
       return (index + 1) + (this.queryParams.pageNum  - 1) * this.queryParams.pageSize;
    },
    dataChange(val) {
      this.queryParams.shengqingsj = val;
    },
    /** 查询待提交的项目列表 */
    getList() {
      this.loading = true;
      ProjectApi.getUndefindProjectList(this.queryParams).then(response => {
        this.ProjectList = response.rows.map(item => {
          item.typeStr = this.projectType[item.type];
          item.qrztStr = this.qrztType[item.xmzt]
          item.shenqjf = parseInt(item.shenqjf)
          return item;
        });
        this.total = response.total;
        this.loading = false;
      });
    },
     // 编辑按钮操作
    updataReview(row){
      this.rowstatus = true
      this.editId = row.id;
      this.editType = row.type;
      this.dialogVisible = true;
    },
    //导出pdf
    // handlePDF(id,type){
    //   ProjectApi.expertPdf({id,type}).then(data=>{
    //     if(data.code==200) this.jxDownload(data.msg)
    //   })
    // },

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
    /** 查看按钮操作 */
    onReview(row) {
      this.editId = row.id;
      this.editType = row.type;
      this.reviewVisible = true;
    },
    //确认或拒绝参加
    handleResove(row,status){
     this.$confirm(
          `${status == 1 ? "该项目立项后，将严格遵守有关规定、遵守本申报书和预算表中规定的条款和内容，保证按计划进度完成项目任务。" : "确认不同意参与项目"+row.xiangmumc}`,
          `${status == 1 ? "承诺书" : "拒绝确认"}`,{
              confirmButtonText:`${status == 1 ? "同意" : "确定"}`,
              cancelButtonText:`${status == 1 ? "不同意" : "取消"}`,
          }
        ).then(()=>{
        ProjectApi.stuComfirm({id:row.id,qrzt:status,typeList:2}).then(data=>{
        this.$message(data.msg)
         this.getList();
      })
      })
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
          return ProjectApi.delProject(row.id);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        });
    }
  }
};
</script>
