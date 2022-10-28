<template>
    <jxDialog @open="init()" v-on="$listeners" v-bind="$attrs">
             <el-form
                ref="elForm"
                :model="formData"
                :rules="rules"
                size="medium"
                label-width="150px"
              >
                <el-form-item>
                   <a target="_blank" href="http://kyjs.zju.edu.cn/srts/#/home/news/8653?type=14">
                          <span style="color:red;font-size:18px;">申报须知 </span>(点击阅读)
                    </a>
              </el-form-item>
                  <!-- <el-form-item label="项目类别" prop="sbxmlb">
                    <span>成果推广（省创）</span>
                  </el-form-item> -->
              <el-form-item label="项目名称" prop="xiangmumc">
                <el-input
                  v-model="formData.xiangmumc"
                  placeholder="请输入项目名称"
                  clearable
                  @blur="checkProjectName"
                  :style="{ width: '100%' }"
                >
                </el-input>
              </el-form-item>
                <el-row>
            <el-form-item label="学科类别" prop="xuekelb">
          <el-select
            v-model="formData.xuekelb"
            placeholder="请选择学科类别"
            clearable
            :style="{ width: '30%' }"
          >
            <el-option
              v-for="item in xuekelbOptions"
              :key="item.codeKey"
              :label="item.codeName"
              :value="item.codekey"
            ></el-option>
          </el-select>
        </el-form-item>
        </el-row>
        <el-form-item label="项目来源" prop="xiangmuly">
          <el-select
            v-model="formData.xiangmuly"
            placeholder="请选择项目来源"
            clearable
            :style="{ width: '30%' }"
          >
            <el-option
              v-for="(item, index) in xiangmulyOptions"
              :key="index"
              :label="item.dictLabel"
              :value="item.dictValue"
              :disabled="item.disabled"
            ></el-option>
          </el-select>
        </el-form-item>
          <el-form-item label="教师科研项目名称" prop="jskyxmmc">
            <el-input  v-model="formData.jskyxmmc" placeholder="请输入教师科研项目名称"></el-input>
          </el-form-item>
            <el-form-item label="教师科研项目类别" prop="jskyxmlb">
            <el-input  v-model="formData.jskyxmlb" placeholder="教师科研项目类别"></el-input>
          </el-form-item>
          <el-form-item label="教师科研项目批准号" prop="jskyxmpzh">
            <el-input  v-model="formData.jskyxmpzh" placeholder="教师科研项目批准号"></el-input>
          </el-form-item>
        
        <el-form-item label="项目状况" prop="xiangmuzk">
          <el-select
            v-model="formData.xiangmuzk"
            placeholder="请选择项目状况"
            clearable
            :style="{ width: '30%' }"
          >
            <el-option
              v-for="(item, index) in xiangmuxianzOptions"
              :key="index"
              :label="item.dictLabel"
              :value="item.dictValue"
              :disabled="item.disabled"
            ></el-option>
          </el-select>
        </el-form-item>
         <el-form-item label="项目性质" prop="xiangmuxz">
          <el-select
            v-model="formData.xiangmuxz"
            placeholder="请选择项目性质"
            clearable
            :style="{ width: '30%' }"
          >
            <el-option
              v-for="item in xiangmuxzOptions"
              :key="item.dictValue"
              :label="item.dictLabel"
              :value="item.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-row :gutter="15">
          <el-col :span="24">
            <el-row
              v-for="(teacher, index) in formData.xmdsList"
              :key="teacher.id"
            >
              <el-col :span="12">
                <el-form-item
                  :rules="[
                      { required: true, message: '请输入参与导师'},
                    ]"
                  label-width="150px"
                  :label="
                    `${teacher.dslb == 1 ? '负责导师' : '参与老师(校内)'} 工号:`
                  "
                  :prop="'xmdsList.' + index + '.jgh'"
                >
                  <el-input
                    v-model="teacher.jgh"
                    @blur="getNameById(index)"
                    placeholder="请输入参与老师工号"
                    clearable
                    :style="{ width: '70%', 'margin-right': '10px' }"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item
                  label-width="150px"
                  :label="`姓名:`"
                  :prop="'xmdsList.' + index + '.dsxm'"
                >
                  <el-input
                    v-model="teacher.dsxm"
                    placeholder="姓名"
                    clearable
                    :style="{ width: '70%', 'margin-right': '10px' }"
                  ></el-input>
                  <el-button
                    v-if="teacher.dslb != 1"
                    @click.prevent="removeTeacher(index)"
                    >删除</el-button
                  >
                </el-form-item>
              </el-col>
            </el-row>
          </el-col>
          <el-col style="text-align: center" :span="24">
            <div style="text-align:center">
              <div style="margin-bottom:center">
              <el-alert
              style="display: inline;margin: 20px;"
              type="warning"
              title="（请务必核对导师的工号和姓名，确保输入无误）"
            >
            </el-alert>
            </div>
            <el-button
              type="primary"
              :disabled="formData.xmdsList.length>=maxTeacer"
              style="margin-bottom: 10px;
    width: 300px;
    height: 50px;
    font-size: 27px;"
              @click.prevent="addTeacher()"
              >点击增加参与导师</el-button
            >
            </div>
          </el-col>
        </el-row>

        <el-row :gutter="15">
            <el-row
              v-for="(student, index) in formData.xmxsList"
              :key="student.id"
            >
              <el-col :span="7">
                <el-form-item
                  label-width="150px"
                  :label="`${student.xslb == 1 ? '负责学生' : '参与学生 学号'}:`"
                  :prop="'xmxsList.' + index + '.xh'"
                >
                 <!-- :disabled="student.xslb == 1 && $store.getters.role !== 'admin'" -->
                  <el-input
                    v-model="student.xh"
                    placeholder="学号"
                    @blur="getProjectByxh(index)"
                    clearable
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item
                  label-width="50px"
                  :label="`姓名:`"
                  :prop="'xmxsList.' + index + '.xsxm'"
                >
                  <el-input
                    v-model="student.xsxm"
                    disabled
                    placeholder="姓名"
                    clearable
                  ></el-input>
                </el-form-item>
              </el-col>

              <el-col :span="12">
                <el-form-item
                  label-width="100px"
                  :label="`往年项目:`"
                  :prop="'xmxsList.' + index + '.wnxm'"
                >
                  <el-input
                    v-model="student.wnxm"
                    type="textarea"
                    placeholder="往年项目"
                    :disabled="student.xslb != 1"
                    :style="{ width: '70%', 'margin-right': '10px' }"
                  ></el-input>
                  <el-button
                    v-if="student.xslb != 1"
                    @click.prevent="removeStudent(index)"
                    >删除</el-button
                  >
                </el-form-item>
              </el-col>
            </el-row>
            <el-col :span="24" style="text-align: center">
            <div style="text-align:center">
              <el-button
              :disabled="formData.xmxsList.length>=maxStudent"
              type="primary"
              style="margin-bottom:10px;
    width: 300px;
    height: 50px;
    font-size: 29px;"
              @click.prevent="addStu()"
              >点击增加参与学生</el-button
            >
            </div>
          </el-col>
        </el-row>

        <el-form-item label="项目主要内容简介：" prop="xiangmujj">
          <CKEditor
            v-model="formData.xiangmujj"
            type="textarea"
            placeholder="请填写，不超过200字项目主要内容简介："
            :maxlength="200"
            :autosize="{ minRows: 4, maxRows: 4 }"
            :style="{ width: '100%' }"
          ></CKEditor>
        </el-form-item>
        <el-form-item label="项目负责人参与科研情况：" prop="fzrkyqk">
          <CKEditor
            v-model="formData.fzrkyqk"
            type="textarea"
            placeholder="请填写，不超过200字项目负责人参与科研情况："
            :maxlength="200"
            :autosize="{ minRows: 4, maxRows: 4 }"
            :style="{ width: '100%' }"
          ></CKEditor>
        </el-form-item>
        <el-form-item label="项目组成员参与科研情况：" prop="cyrkyqk">
          <CKEditor
            v-model="formData.cyrkyqk"
            type="textarea"
            placeholder="请填写，不超过200字项目组成员参与科研情况："
            :maxlength="200"
            :autosize="{ minRows: 4, maxRows: 4 }"
            :style="{ width: '100%' }"
          ></CKEditor>
        </el-form-item>
        <el-form-item label="项目背景、目的及意义：" prop="xmbjmdyy">
          <CKEditor
            v-model="formData.xmbjmdyy"
            type="textarea"
            placeholder="请简要说明项目背景、意义和实施必要性，研究现状和发展动态，不超过1100字"
            :maxlength="1100"
            :autosize="{ minRows: 4, maxRows: 4 }"
            :style="{ width: '100%' }"
          ></CKEditor>
        </el-form-item>
        <el-form-item label="项目研究方案：" prop="xmyffa">
          <CKEditor
            v-model="formData.xmyffa"
            placeholder="项目研究方案，不超过1200字"
            :maxlength="1200" 
            :autosize="{ minRows: 4, maxRows: 4 }" 
              />
        </el-form-item>


        <el-form-item label="项目研究条件及创新之处：" prop="xmyjtjjcxzc">
          <CKEditor
            v-model="formData.xmyjtjjcxzc"
            :maxlength="500"
            :autosize="{ minRows: 4, maxRows: 4 }" 
            placeholder="已有研究基础，包含与项目有关的研究积累、已取得的成绩和已具备的条件，尚缺少的条件及解决办法，项目优势和风险，以及项目创新点等，不超500字"
          />

        </el-form-item>

      <el-form-item label="项目预期成果：	" prop="xmyqcg">
          <CKEditor
            v-model="formData.xmyqcg"
            type="textarea"
            placeholder="包括知识产权成果，如论文成果、获奖成果、评议鉴定成果、推广成果、论著成果、专利成果、、研制产品、开发软件，与毕设、学科竞赛等其他学习环节结合情况，或其他成果等，以及经济效益、社会效益等，不超130字"
            :maxlength="130"
            :autosize="{ minRows: 4, maxRows: 4 }"
            :style="{ width: '100%' }"
          ></CKEditor>
        </el-form-item>

        <el-form-item label="申请经费" prop="shenqjf">
          <el-input
            v-model="shenqjf"
            disabled
            placeholder="请输入申请经费"
            clearable
            :style="{ width: '30%' }"
          /><el-alert
            style="display: inline;margin-left: 20px;"
            type="warning"
            title="（自动统计，不需填写）"
          >
          </el-alert>
          <el-alert
            style="margin-top:10px"
            type="warning"
            title="科研实践最高1.2万元"
          >
          </el-alert>
        </el-form-item>
        <el-row :gutter="15">
          <el-form-item label="项目经费预算与用途:">
            <el-alert type="error" title="* 只能输入整百的数值"></el-alert>
          </el-form-item>
          <el-col :span="12">
            <el-form-item label="专用材料费" prop="zyclf">
              <el-input-number
                v-model="formData.zyclf"
                placeholder="专用材料预算经费"
                :step="100"
                controls-position="right"
              ></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="主要用途" 
             :rules="formData.zyclf !== 0 ? rules.target:[{required: true,message: '专用材料预算经费主要用途',trigger: 'blur'}]" prop="zyclfText">
              <el-input
                v-model="formData.zyclfText"
                placeholder="专用材料预算经费主要用途"
                clearable
                :style="{ width: '100%' }"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="印刷与资料" prop="ysfyzlf">
              <el-input-number
                v-model="formData.ysfyzlf"
                placeholder="预算经费印刷与资料"
                :step="100"
                controls-position="right"
              ></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="主要用途"
              :rules='formData.ysfyzlf == 0 ? rules.target:[{ required: true,
            message: "印刷与资料经费主要用途",
            trigger: "blur"}]' prop="ysfyzlfText">
              <el-input
                v-model="formData.ysfyzlfText"
                placeholder="印刷与资料经费主要用途"
                clearable
                :style="{ width: '100%' }"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="交通与差旅" prop="dyyclf">
              <el-input-number
                v-model="formData.dyyclf"
                placeholder="交通与差旅预算经费"
                :step="100"
                controls-position="right"
              ></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="主要用途"
             :rules='formData.dyyclf == 0 ? rules.target:[{ required: true,
            message: "交通与差旅主要用途",
            trigger: "blur"}]' prop="dyyclfText">
              <el-input
                v-model="formData.dyyclfText"
                placeholder="交通与差旅主要用途"
                clearable
                :style="{ width: '100%' }"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="出版费" prop="bmysf">
              <el-input-number
                v-model="formData.bmysf"
                placeholder="出版费预算经费"
                :step="100"
                controls-position="right"
              ></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="主要用途"
             :rules='formData.bmysf == 0 ? rules.target:[{required: true,
            message: "出版费预算主要用途",
            trigger: "blur"}]'  prop="bmysfText">
              <el-input
                v-model="formData.bmysfText"
                placeholder="出版费预算主要用途"
                clearable
                :style="{ width: '100%' }"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="邮寄费" prop="ydf">
              <el-input-number
                v-model="formData.ydf"
                placeholder="专用材料预算经费邮寄费"
                :step="100"
                controls-position="right"
              ></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="主要用途"
            :rules='formData.ydf == 0 ? rules.target:[{required: true,
            message: "邮寄费主要用途",
            trigger: "blur"}]' prop="ydfText">
              <el-input
                v-model="formData.ydfText"
                placeholder="邮寄费主要用途"
                clearable
                :style="{ width: '100%' }"
              >
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div class="confirm">
        <h3>承诺书</h3>
        <p>以上所填内容真实可靠，本项目组承诺：</p>
        <p>该项目立项后，将严格遵守有关规定、遵守本申报书和预算表中规定的条款和内容，保证按计划进度完成项目任务。</p>
        <div>
           <el-radio v-model="confirmRadio" label="1">同意</el-radio>
           <el-radio v-model="confirmRadio" label="2">不同意</el-radio>
        </div>
        
      </div>
      <div slot="footer" class="footer">
        <el-button @click="close">取消</el-button>
        <el-button type="primary" v-if="!rowstatus"  @click="handlerStore">保存</el-button>
        <el-button type="primary" v-if="!rowstatus" :disabled="confirmRadio!=1" @click="handelConfirm(1)">保存并提交</el-button>
        <el-button type="primary" v-if="rowstatus" :disabled="confirmRadio!=1" @click="handelConfirm(1)">提交</el-button>
      </div>
    </jxDialog>
</template>
<script>
import CodeAPI from "@/api/jxbasedata/code";
import jxDialog from '@/components/jxDialog'
import StuApi from "@/api/jxStuProject/index";
import {ObjectUpdate} from "@/utils/jxUtil"
import {getInfo} from "@/api/login"
import CKEditor from "@/components/CKEdit";
export default {
  components: { CKEditor ,jxDialog},
  props: ['id','cbClose','sbData','rowstatus'],
  data() {
    return {
      //最大学生导师
      maxTeacer:0,
      maxStudent:0,
      confirmRadio:'1',
      formData: {
        xmyqcg:undefined,
        type:2,//申报类型
        fzdsgh:'',//负责导师工号
        fzdsxm:'',//负责导师姓名
        xmid: null,
        xmdsList: [
          {
            dslb: 1,
            dsxm: undefined,
            jgh: undefined
          }
        ],
        xmxsList: [
          {
            xslb: 1,
            xh: undefined,
            xsxm: '',//$store.getters.name,
            wnxm: undefined
          }
        ],
        xiangmumc: undefined,
        xuekelb: undefined,
        xiangmuly: '439',
        xiangmuzk: undefined,
        xiangmuxz: undefined,
        xiangmujj: undefined,
        fzrkyqk:undefined,
        cyrkyqk:undefined,
        xmbjmdyy: undefined,
        xmyffa: undefined,
        xmyjtjjcxzc: undefined,
        shenqjf: undefined,
        zyclf: 0,
        zyclfText: undefined,
        ysfyzlf: 0,
        ysfyzlfText: undefined,
        dyyclf: 0,
        dyyclfText: undefined,
        bmysf: 0,
        bmysfText: undefined,
        ydf: 0,
        ydfText: undefined,
        jskyxmlb: null,
        jskyxmpzh: null,
        jskyxmmc: null,

      },
     
      rules: {
        xmyqcg:[{required: true,
            message: "请填写项目预期成果",
            trigger: "blur"}],
        jskyxmmc: [{ required: true, message: "请输入教师科研项目名称", trigger: "change"}],
        jskyxmpzh: [{ required: true, message: "请输入教师科研项目批准号", trigger: "change"}],
        jskyxmlb: [{ required: true, message: "请输入教师科研项目类别", trigger: "change"}],
        xiangmumc: [
          {
            required: true,
            message: "请输入项目名称",
            trigger: "blur"
          }
        ],
        xuekelb: [
          {
            required: true,
            message: "请选择学科类别",
            trigger: "change"
          }
        ],
        xiangmuly: [
          {
            required: true,
            message: "请选择项目来源",
            trigger: "change"
          }
        ],
        xiangmuzk: [
          {
            required: true,
            message: "请选择项目状况",
            trigger: "change"
          }
        ],
        xiangmuxz: [
          {
            required: true,
            message: "请选择项目性质",
            trigger: "change"
          }
        ],
        xiangmujj: [
          {
            required: true,
            message: "请填写，不超过200字项目主要内容简介：",
            trigger: "blur"
          }
        ],
        fzrkyqk: [
          {
            required: true,
            message: "请填写，不超过200字项目组成员参与科研情况：",
            trigger: "blur"
          }
        ],
         cyrkyqk: [
          {
            required: true,
            message: "请填写，不超过200字项目负责人参与科研情况：",
            trigger: "blur"
          }
        ],
        xmbjmdyy: [
          {
            required: true,
            message: "简要说明项目背景、意义和实施必要性，研究现状和发展动态，不超过1100字",
            trigger: "blur"
          }
        ],
        xmyffa: [
          {
            required: true,
            message: "项目研究内容，不超过1200字",
            trigger: "blur"
          }
        ],
        xmyjtjjcxzc: [
          {
            required: true,
            message:
              "已有研究基础，包含与项目有关的研究积累、已取得的成绩和已具备的条件，尚缺少的条件及解决办法，项目优势和风险，以及项目创新点等，不超500字",
            trigger: "blur"
          }
        ],
        zyclf: [
          {
            required: true,
            message: "专用材料预算经费",
            trigger: "blur"
          }
        ],
        // zyclfText: [
        //   {
        //     required: true,
        //     message: "专用材料预算经费主要用途",
        //     trigger: "blur"
        //   }
        // ],
        ysfyzlf: [
          {
            required: true,
            message: "预算经费印刷与资料",
            trigger: "blur"
          }
        ],
        // ysfyzlfText: [
        //   {
        //     required: true,
        //     message: "印刷与资料经费主要用途",
        //     trigger: "blur"
        //   }
        // ],
        dyyclf: [
          {
            required: true,
            message: "交通与差旅预算经费",
            trigger: "blur"
          }
        ],
        // dyyclfText: [
        //   {
        //     required: true,
        //     message: "交通与差旅主要用途",
        //     trigger: "blur"
        //   }
        // ],
        bmysf: [
          {
            required: true,
            message: "出版费预算经费",
            trigger: "blur"
          }
        ],
        // bmysfText: [
        //   {
        //     required: true,
        //     message: "出版费预算主要用途",
        //     trigger: "blur"
        //   }
        // ],
        ydf: [
          {
            required: true,
            message: "专用材料预算经费邮寄费",
            trigger: "blur"
          }
        ],
        // ydfText: [
        //   {
        //     required: true,
        //     message: "邮寄费主要用途",
        //     trigger: "blur"
        //   }
        // ]
      },
      xuekelbOptions: [],
      xiangmulyOptions: [{dictLabel:'导师自主选题',dictValue:'439'}],
      xiangmuxianzOptions: [],
      xiangmuxzOptions:[],
    };
  },
  computed: {
    //计算科研经费
    shenqjf(){
      return this.formData.zyclf+this.formData.ysfyzlf+this.formData.dyyclf+this.formData.bmysf+this.formData.ydf
    }
  },
 
  created() {
      // console.log(this.$route.path);
    this.init()
    this.getDetailById(this.id)
       //kyxmlbOptions
    
    //查询最多老师 学生
    StuApi.checkMaxMeber('sc_kysj_ds').then(d=>{this.maxTeacer = d.data})
    StuApi.checkMaxMeber('sc_kysj_xs').then(d=>{this.maxStudent = d.data})
   
    //xiangmuxzOptions
    this.getDicts("cgtg_nature").then(response => {
      this.xiangmuxzOptions = response.data;
    });
    //xiangmuxianzOptions
    this.getDicts("project_status").then(response => {
      this.xiangmuxianzOptions = response.data;
    })
    CodeAPI.getCodeList({ parent: 9999 }).then(response => {
      if (response.code == 200) {
        this.xuekelbOptions = response.data || [];
      } else {
        this.msgError(response.msg || "操作失败");
      }
    });
     getInfo().then(res=>{
       
       if(this.$store.getters.role == 'student'){
         this.formData.xmxsList[0].xsxm=res.user.nickName
      this.formData.xmxsList[0].xh=res.user.userName
       }
        })
  },
  mounted() {},
  methods: {
    init() {
      if(this.sbData){
        // this.formData = Object.assign({},this.formData,this.sbData)

        StuApi.shenbaoDetail({xtid:this.sbData.xtid}).then(data=>{
          this.formData.xiangmumc = data.data.ktmc
          this.formData.xiangmujj = data.data.jskyxmjj
          this.formData.fzdsgh = data.data.jgh
          this.formData.xmbjmdyy = ''
          this.formData.xmyqcg = data.data.cgxs
          this.formData.xmdsList[0] = { dslb: 1,
            dsxm: data.data.dsxm,
            jgh: data.data.jgh}
            this.formData = Object.assign({},this.formData,data.data)
        }).catch(err=>{

        })
      }
      
    },
    getDetailById(id){
        if(!id)return
        StuApi.expertDetail({xmid:id,xmejlb:61}).then(data=>{
            let _formData =Object.assign({},data.data.txmBase) 
            // this.xuekelbOptions.forEach(item => {
            //   if(data.data.txmBase.xuekelb == item.codeName){
            //     data.data.txmBase.xuekelb = item.codekey
            //   }
            // })
            // console.log(data.data.txmBase.xuekelb);
            this.formData = _formData
        }).catch(err=>{

        })
    },
    //学生学号查询姓名和往届作品
    getProjectByxh(index){
      if(!this.formData.xmxsList[index].xh) return 
       StuApi.getHisProjectById({ xh: this.formData.xmxsList[index].xh }).then(
        data => {
          this.formData.xmxsList[index].xsxm = data.data?.name;
          this.formData.xmxsList[index].wnxm = data.data?.wnxm.join(',')
        }
      ).catch(err=>{
        this.formData.xmxsList[index].xh = ""
      });
    },
    //获取老师名称
    getNameById(index) {
      if(!this.formData.xmdsList[index].jgh) return 
      StuApi.getNameById({ jgh: this.formData.xmdsList[index].jgh }).then(
        data => {
          this.formData.xmdsList[index].dsxm = data.data?.xm;
        }
      ).catch(err=>{
        this.formData.xmdsList[index].jgh=""
      });
    },
    //检查项目名称是否已存在
    checkProjectName() {
      let params = {
        xmmc: this.formData.xiangmumc,
        xmid: this.formData.xmid,
        xmlx: "1"//6.23先传死的
      };
      StuApi.checkProjectName(params).then(data => {});
    },
    //添加导师
    addTeacher() {
      this.formData.xmdsList.push({
        dslb: 0,
        dsxm: undefined,
        jgh: undefined
      });
    },
    //移除导师
    removeTeacher(index) {
      this.formData.xmdsList.splice(index, 1);
    },
    //添加学生
    addStu() {
      this.formData.xmxsList.push({
        xslb: 0,
        xh: undefined,
        xsxm: undefined,
        wnxm: undefined
      });
    },
    //移除学生
    removeStudent(index) {
      this.formData.xmxsList.splice(index, 1);
    },
    onClose() {
      this.$refs["elForm"].resetFields();
    },
    close() {
      this.$emit("update:visible", false);
      this.cbClose&&this.cbClose()
    },
    //保存项目
    handlerStore(){
      this.$refs["elForm"].validate(valid => {
        if(!valid) return
        this.handelConfirm(0)
      })
    },
    //保存并提价
    handelConfirm(isfb=1) {
      this.formData.xmdsList = this.formData.xmdsList.filter(a=>(a.jgh||a.dslb==1))
      this.formData.xmxsList = this.formData.xmxsList.filter(a=>(a.xh||a.sxlb==1))
      this.$refs["elForm"].validate(valid => {
        if (!valid && isfb==1) return;
       //计算属性经费
        this.formData.shenqjf = this.shenqjf
       this.xuekelbOptions.forEach(item => {
              if( this.formData.xuekelb  == item.codeName){
                this.formData.xuekelb = item.codekey
              }
            })
        //0保存1提交
        this.formData.isfb = isfb
         //要求逗号隔开的字符串
        //融于字段 负责导师 负责学生
        this.formData.fzdsgh = this.formData.xmdsList[0].jgh;
        this.formData.fzdsxm = this.formData.xmdsList[0].dsxm;
        this.formData.fzxsxh = this.formData.xmxsList[0].xh;
        this.formData.fzxsxm = this.formData.xmxsList[0].xsxm
        this.formData.xmlb = 3//国创
        this.formData.xmejlb = 31//科研实践项目二级类别
        this.formData.type = 6//keyanshijian
        if(this.id){
          this.formData.id = this.id
        }
        StuApi[this.id?'updateOtherProject':'submitOtherProject'](this.formData).then(data=>{
          // if(data.code == 500) {
          //   this.$message.error(data.msg)
          // }
          this.$message(`${data.msg||isfb==1?'提交成功':'保存成功'}`)
           this.close();
          // this.$parent.getList();
         
          StuApi.getupdata({xtid:this.sbData.xtid,isfb:1}).then(res => {
             this.$parent.quanxian();
            this.$emit('find')
          })
         
        })
      });
    },
  }
};
</script>
<style lang="scss" scoped>
.footer{
    padding: 10px;
    text-align: center;
}
  .confirm{
    padding: 5px 20px;
    font-size: 18px;
    border: 1px solid;
    h3{
      text-align: center;
      margin-bottom: 20px;
    }
    div{
      margin-top: 20px;
      text-align: center;
    }
    p{
      text-align: left;
    }
  }
</style> 
