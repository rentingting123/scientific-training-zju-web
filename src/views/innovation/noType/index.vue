<template>
  <div class="app-container">
    <el-row :gutter="20">
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
            >
            </el-option>
          </el-select>
        </el-form-item>
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
        <el-form-item label="学院名称" prop="xybh">
          <el-select filterable clearable v-model="queryParams.xybh" placeholder="请选择">
            <el-option
              v-for="item in xyList"
              :key="item.xybh"
              :label="item.xymc"
              :value="item.xybh"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="负责学生姓名" prop="fzxsxm">
          <el-input v-model="queryParams.fzxsxm" placeholder="负责学生姓名"> </el-input>
        </el-form-item>
        <el-form-item label="负责学生学号" prop="fzxsxh">
          <el-input v-model="queryParams.fzxsxh" placeholder="负责学生学号"> </el-input>
        </el-form-item>
        <el-form-item label="负责导师" prop="fzdsxm">
          <el-input v-model="queryParams.fzdsxm" placeholder="负责导师姓名"> </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery"
            >搜索</el-button
          >
          <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
            >重置</el-button
          >
        </el-form-item>
      </el-form>
      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5" style="padding-left: 0">
          <!-- <el-button
            type="warning"
            plain
            icon="el-icon-download"
            size="mini"
            :loading="exportLoading"
            @click="handleExport"
            >导出</el-button
          > -->
          <jx-export
            type="warning"
            plain
            fildKey="dqr_field"
            size="mini"
            @done="handleExport"
            >导出</jx-export
          >
        </el-col>
        <!-- <el-col :span="1.5">
          <el-button
            type="danger"
            plain
            icon="el-icon-delete"
            size="mini"
            @click="handleDelete()"
            >批量删除</el-button>
        </el-col> -->
        <el-col :span="1.5" style="padding-left: 0">
          <el-button
            type="primary"
            plain
            icon="el-icon-check"
            size="mini"
            @click="handleConfirm()"
            >批量确定</el-button
          >
        </el-col>
        <el-col :span="1.5">
            <improtFile 
            v-hasRole="['tadmin','admin','xyadmin']"
            url='/project/importQrxmlx'
            title="批量导入确认"
            :close="getList"
            download="https://web.moocollege.com/mooc/schooladmin/%E7%A1%AE%E8%AE%A4%E9%A1%B9%E7%9B%AE%E7%B1%BB%E5%9E%8B.xlsx"
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
         <el-col :span="1.5">
            <improtFile 
            v-hasRole="['tadmin']"
            url='/project/importxgxy'
            title="批量修改学院确认"
            :close="getList"
            download="https://web.moocollege.com/mooc/schooladmin/%E7%A1%AE%E8%AE%A4%E9%A1%B9%E7%9B%AE%E7%B1%BB%E5%9E%8B.xlsx"
            /> 
        </el-col>
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
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="50" align="center" />
        <el-table-column
          v-for="column in _columns"
          :label="column.label"
          :type="column.type"
          align="center"
          :key="column.key"
          :min-width="column.width || null"
          :prop="column.prop"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="scope">
            <div v-if="column.customer == 'school'">
              <acadSelect
                v-if="scope.row.editSchool"
                @onChange="(val) => onChangeSchool(val, scope.row, scope.$index)"
                v-model="scope.row.xymc"
              />
              <div class="schoolName" v-else>
                <el-button
                  v-if="roleType == 'tadmin'"
                  type="primary"
                  size="mini"
                  @click="switchChangeSchool(scope.row, scope.$index)"
                  icon="el-icon-edit"
                  circle
                  style="padding: 5px; margin-right: 3px"
                ></el-button>
                <span class="schoolName" :title="scope.row.xymc">{{
                  scope.row.xymc
                }}</span>
              </div>
            </div>
            <div v-else-if="column.type == 'student' || column.type == 'teacher'">
              <personDetail
                :formdata="scope.row"
                :value="column.value"
                :keys="column.keys"
                :type="column.type"
              />
            </div>
            <div
              v-else-if="
                $store.getters.role == 'xyadmin' &&
                column.key == 'qrzt' &&
                scope.row.xmzt == 3
              "
            >
              <el-button
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="onExpert(scope.row, 1)"
                >{{ scope.row[column.prop] }}</el-button
              >
            </div>
            <div style="text-algin: center" v-else>
              {{ scope.row[column.prop] }}
            </div>
          </template>
        </el-table-column>
        <!-- <el-table-column
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
           <div style="text-algin:center" v-else>
             {{row[column.prop]}}
           </div>
          </template>
        </el-table-column> -->

        <el-table-column
          label="学生选定项目类型"
          align="center"
          width="160"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="scope">
            <div v-for="item in scope.row.category1" :key="item.dictValue">
              {{ item.dictLabel }}
            </div>
          </template>
        </el-table-column>

        <el-table-column
          label="待确定项目类型"
          align="left"
          width="160"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="scope">
            <el-radio
              v-for="item in scope.row.category"
              :key="item.dictValue"
              v-model="scope.row.confirmCat"
              :disabled="scope.row.xmzt != 2"
              :label="item.dictValue"
              >{{ item.dictLabel }}</el-radio
            >
            <div v-if="roleType == 'xyadmin'" style="margin: 0 auto">
              <el-button
                style="padding: 5px 8px"
                v-if="scope.row.xmzt == 2"
                size="mini"
                type="primary"
                icon="el-icon-edit"
                @click="handleResove(scope.row, 6)"
                >不予立项</el-button
              >
            </div>
          </template>
        </el-table-column>
        <!-- <el-table-column
          label="不予立项"
          align="center"
          width="160"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="scope">
           
          </template>
        </el-table-column> -->

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
              icon="el-icon-edit"
              @click="onReview(scope.row)"
              >查看</el-button
            >
             <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              v-hasPermi="['system:leval:updata']"
              @click="updataLeval(scope.row, 2)"
              >修改项目等级</el-button
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
    <el-dialog
      style="min-width: 890px; width: 80%; margin: 0 auto"
      width="100%"
      :visible.sync="reviewVisible"
      @close="reviewVisible = false"
      :title="'查看' + projectType[editType]"
    >
      <review :id="editId" :type="editType" />
    </el-dialog>
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
     
    <div class="check">
      <el-dialog title="确认" :visible.sync="dellist" width="500px">
        <div class="dialogall" v-for="(item, index) in datalist1" :key="index">
          <div>
            是否确认项目“<span>{{ item.title }}</span
            >”为“<span>{{ item.lx }}</span
            >”的项目类型吗？
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="closesubmit()">取 消</el-button>
          <el-button type="primary" @click="submitcheck()">确 定</el-button>
        </span>
      </el-dialog>
    </div>
    <Expert
      :closecb="getList"
      :type="expertType"
      :id="editId"
      :visible.sync="expertVisible"
    />
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
      <el-dialog
      style="min-width: 890px; width: 80%; margin: 0 auto"
      width="100%"
      :visible.sync="updataVisible"
      @close="updataVisible = false"
      title="修改项目等级"
    >
      <updataleval v-if="hackReset == true"  ref="child" :id='changelwvalid' @show="showdila()"
      :sbxmle="changesbxmlb" />
    </el-dialog>
  </div>
</template>

<script>
import ProjectApi from "@/api/jxStuProject";
import editProject from "@/views/jxStuProject/common/editProject.vue";
import Expert from "@/views/innovation/nation/steps/common/projectExpert.vue";
import review from "@/views/jxStuProject/common/reviewProject.vue";
import personDetail from "@/views/jxStuProject/common/personDetail";
import { downloadFile } from "@/utils/index";
import acadSelect from "@/views/basedata/common/acadSelect";
import improtFile from '@/components/importFile';
import updataleval from '../common/updataleval.vue'
export default {
  components: {updataleval,improtFile, review, acadSelect, personDetail, Expert ,editProject},
  data() {
    return {
      hackReset:true,
      changesbxmlb:undefined,
      changelwvalid:undefined,
      updataVisible:false,
      // 导出遮罩层
      exportLoading: false,
      datalist: [],
      datalist1: [],
      dellist: false,
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
      //编辑框
      // shenqjf:'',
      dialogVisible: false,
      reviewVisible: false,
      reviewVisiblemoney: false,
      expertVisible: false,
      expertType: 2,
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
        nf: null,
        fzxsxm: undefined,
        fzxsxh: undefined,
        fzdsxm: undefined,
        xmmc: undefined,
      },
      moneyList: {},
      nfList: [],
      // 项目列表字典
      projectType: {},
      //确认状态
      qrztType: {},

      category: [],
      //导师意见
      dsyj: "",
      bianhao: "",
      xyList: [],
      // 列信息
      columns: [
        // { key: "index",label: `序号`,type: "index",prop: "index",visible: true},

        {
          key: "xiangmumc",
          label: `项目名称`,
          width: "400px",
          prop: "xiangmumc",
          visible: true,
        },
        {
          key: "fzdsxm",
          label: `负责导师`,
          type: "teacher",
          value: "fzdsxm",
          keys: "fzdsgh",
          visible: true,
        },
        {
          key: "fzxsxm",
          label: `负责学生`,
          type: "student",
          value: "fzxsxm",
          keys: "fzxsxh",
          visible: true,
        },
        { key: "qrzt", label: `状态`, prop: "qrztStr", visible: true },
        // { key: "dbfs", label: `分数`, prop: "dbfs", visible: true },
        {
          key: "xymc",
          label: "学院名称",
          width: "130px",
          prop: "xymc",
          customer: "school",
          visible: true,
        },
        { key: "shenqjf", label: `经费`, prop: "shenqjf", visible: true },
      ],
      checkarr: [],
      //项目状态选项
      xmztpes:{
        '0':'待学生确认参与',
        '1':'待导师确认参与',
        '2':'待确认项目类型',
        '6':'立项不通过',
      },
    };
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
  async created() {
    await ProjectApi.projectXyList().then((res) => {
      this.xyList = res.data;
      // console.log(res.data);
    });
    await this.getDicts("stu_project_type").then((res) => {
      res.data.map((item) => {
        this.projectType[item.dictValue] = item.dictLabel;
      });
    });
    await this.getDicts("sc_category").then((res) => {
      this.category = res.data;
    });
    await this.getDicts("qrzt").then((res) => {
      res.data.map((item) => {
        this.qrztType[item.dictValue] = item.dictLabel;
      });
    });
    await this.init();
    this.getList();
  },
  computed: {
    _columns() {
      return this.columns.filter((item) => item.visible);
    },
    roleType() {
      return this.$store.getters.user.rolekey;
    },
  },
  methods: {
    showdila(){
      this.updataVisible = false
      this.getList()
    },
    // 
    // 修改项目等级
    updataLeval(row){
      this.updataVisible = true
      this.changelwvalid = row.id
      this.changesbxmlb = row.sbxmlb
       this.hackReset  = false
   // $nextTick 是在下次 DOM 更新完成后，在执行里面的函数，类似于回调
    this.$nextTick(() => {
      this.hackReset = true;
    });
    },
     // 编辑按钮操作
    updataReview(row){
      this.rowstatus = true
      this.editId = row.id;
      this.editType = row.type;
      this.dialogVisible = true;
    },
      /** 导出按钮操作 */
    handleExportallPDF() {
      const queryParams = Object.assign({}, this.queryParams, { dcly:'dqr' })
      this.$confirm('是否确认导出所有PDF?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.exportLoading = true;
          return ProjectApi.expertallPdf(queryParams);
        }).then(response => {
           downloadFile(response,'待确认PDF','zip');
          this.exportLoading = false;
        })
    },
    // 导出pdf
    handlePDF(row) {
      ProjectApi.dqdexpertPdf({ id:row.id}).then(data => {
       downloadFile(data,row.fzxsxh + '_' + row.xiangmumc + '_立项申请表.pdf','pdf')
      });
    },
    /** 导出按钮操作 */
    handleExport(columns) {
      const queryParams = Object.assign({}, this.queryParams);
      queryParams.columns = columns;
      this.$confirm("是否确认导出项目?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          return ProjectApi.exportContent(queryParams);
        })
        .then((response) => {
          downloadFile(response, "待确定项目类型");
          this.exportLoading = false;
        })
        .catch((res) => {
          console.log(res);
        });
    },
    //修改学院
    onChangeSchool(item, row, index) {
      if (!item.value) return;
      let data = {
        xmid: row.id,
        newxybh: item.value,
        newxymc: item.label,
      };
      ProjectApi.onlySchool(data).then((data) => {
        row.xymc = item.label;
        this.msgSuccess("学院修改成功");
        this.switchChangeSchool(row, index);
      });
    },
    switchChangeSchool(row, index) {
      // console.log(row,index)
      console.log(row.editSchool, index);
      row.editSchool = !row.editSchool;
      this.$set(this.ProjectList, index, row);
    },
    async init() {
      //获取项目状态列表
      // ProjectApi.projectLxXmzt().then(res=>{
      //   this.xmztpes = res.data
      // })
      //获取期次列表
      await ProjectApi.projectQcList({ xmlx: 0 }).then((res) => {
        this.nfList = res.data;
        this.queryParams.nf = this.queryParams.nf || res.data[0].id;
      });
      //获取学院列表
      // ProjectApi.projectXyList().then(res=>{
      //   this.xyList=res.data
      //   console.log(res.data);
      // })
      //
    },
    xiugaimoney() {
      this.$refs["elFormmoney"].validate(valid => {
        if(!valid) return
        ProjectApi.xyChangeMoney(this.formDatamoney).then((res) => {
        this.getList();
      });
      this.reviewVisiblemoney = false;
      })
      
    },
    onExpert(row, expertType) {
      // this.editId = row.id;
      // this.editType = row.type;
      // this.expertType = expertType;
      // 
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
      this.reviewVisiblemoney = true;
      // console.log(row.bmysf_text);
    },
    /** 查询待提交的项目列表 */
    getList() {
      this.loading = true;
      ProjectApi.schoolAdminGetProjectList(this.queryParams).then((response) => {
        this.ProjectList = response.rows.map((item) => {
          item.typeStr = this.projectType[item.type];
          item.qrztStr = this.qrztType[item.xmzt];
           item.shenqjf = parseInt(item.shenqjf)
          let sblbarr = item.sbxmlb.split(",");
          item.category = this.category;
          item.category1 = this.category.filter((item) =>
            sblbarr.includes(item.dictValue)
          );
          // .filter(item=>sblbarr.includes(item.dictValue))
          return item;
        });
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
      this.handleQuery();
    },
    /** 查看按钮操作 */
    onReview(row) {
      this.editId = row.id;
      this.editType = row.type;
      this.reviewVisible = true;
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id);
      this.bianhao = selection.map((item) => item.bianhao);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    //不予立项
    handleResove(row, status) {
      this.$prompt("请输入意见", "不于立项", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
      })
        .then(({ value }) => {
          ProjectApi.schoolOpinion({
            xmids: [row.id],
            shzt: status,
            xxyj: value,
          }).then((data) => {
            this.getList();
          });
        })
        .catch(() => {});
    },
    // 确认类型
    submitcheck() {
      ProjectApi.schoolConfirm({ list: this.datalist }).then(() => {
        this.getList();
        this.closesubmit();
      });
    },
    closesubmit() {
      this.datalist = [];
      this.datalist1 = [];
      this.dellist = false;
    },
    //批量确认类型
    handleConfirm() {
      let delnameq = "";
      let chooselist = [];
      this.ProjectList.map((item) => {
        if (item.xmzt == 2 && item.confirmCat) {
          this.datalist.push({ id: item.id, xmlx: item.confirmCat });
          this.datalist1.push({
            title: item.xiangmumc,
            lx: this.selectDictLabels(this.category, item.confirmCat + ","),
          });
        }
      });
      if (this.datalist1.length < 1) return this.msgInfo("没有符合需要确认类型的项目");
      this.dellist = true;
    },
    /** 删除按钮操作 */
    handleDelete() {
      this.$confirm('是否确认删除项目编号为："' + this.bianhao + '" 的项目吗？', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then((data) => ProjectApi.deleteProjects({ ids: this.ids }))
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        });
    },
  },
};
</script>
<style scoped>
::v-deep .check .el-dialog__headerbtn {
  display: none;
}
.dialogall {
  font-size: 16px;
}
.dialogall span {
  color: rgb(24, 144, 255);
}
</style>
