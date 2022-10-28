<template>
  <jxdialog
    :visible="visible"
    @close="close"
    @open="getDetail"
    :close-on-click-modal="false"
    :title="title"
  >
    <el-row :gutter="15">
      <el-form
        ref="elForm"
        :model="formData"
        :rules="rules"
        size="medium"
        label-width="150px"
      >
        <el-col :span="13">
          <el-form-item label="项目名称:">
            <span>{{ base.xiangmumc }}</span>
          </el-form-item>
        </el-col>

        <el-col :span="13">
          <el-form-item label="项目性质:">
            <span> {{ projectNatureFormat(projectBase.xiangmuxz) }}</span>
          </el-form-item>
        </el-col>

        <el-col :span="13">
          <el-form-item label="申报人:">
             <personDetail  :formdata="base" value="fzxsxm" keys="fzxsxh" type="student" />
           
          </el-form-item>
        </el-col>

         <el-col :span="13">
          <el-form-item label="起始时间:">
           <span>{{ `${projectBase.xiangmukssj}至${projectBase.xiangmujssj}` }}</span>
          </el-form-item>
        </el-col>

        <el-col :span="13">
          <el-form-item label="负责导师:">
            <personDetail  :formdata="base" value="fzdsxm" keys="fzdsgh" type="teacher" />
          </el-form-item>
        </el-col>

        <el-col :span="13">
          <el-form-item label="负责学生:">
              <personDetail  :formdata="base" value="fzxsxm" keys="fzxsxh" type="student" />
          </el-form-item>
        </el-col>
        
           <el-col :span="13">
          <el-form-item label="查看详情:">
           <div> <el-button  @click="onReview(base)" type="text" >查看</el-button></div>
          </el-form-item>
        </el-col>

        <el-col :span="19">
          <el-form-item label="项目的主要内容:" prop="xmzynr">
            <CKEditor
              v-model="formData.xmzynr"
              :onlyReview="onlyReview"
              type="textarea"
              :maxlength="500"
              :autosize="{ minRows: 4, maxRows: 4 }"
              :style="{ width: '100%' }"
            ></CKEditor>
          </el-form-item>
        </el-col>
        <el-col :span="19">
          <el-form-item
            label="项目实施情况总结:"
            prop="xmssqk"
          >
            <CKEditor
              v-model="formData.xmssqk"
              :onlyReview="onlyReview"
              type="textarea"
              placeholder="内容提示：1.项目实施情况；2.项目研究内容及方法的创新；3.项目成果的学术价值；4.项目成果的社会效益和经济效益；4.研究存在的不足和欠缺，尚需深入研究的问题等。1500字左右。"
              :maxlength="1500"
              :autosize="{ minRows: 4, maxRows: 4 }"
              :style="{ width: '100%' }"
            ></CKEditor>
          </el-form-item>
        </el-col>
        <el-col v-if="type == 1" :span="19">
          <el-form-item label="是否通过:" prop="jtzt">
            <el-radio-group v-model="formData.jtzt">
              <el-radio label="21">通过</el-radio>
              <el-radio label="20">不通过</el-radio>
               <el-radio label="22">退回修改</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="指导老师意见:" prop="dsyj">
            <el-input
              v-model="formData.dsyj"
              type="textarea"
              placeholder="项目组负责人所承担和完成研究内容情况汇报(500字以内)"
              :maxlength="500"
              :autosize="{ minRows: 4, maxRows: 4 }"
              :style="{ width: '100%' }"
            ></el-input>
          </el-form-item>
        </el-col>

        <el-col v-if="type == 2" :span="19">
          <el-form-item label="指导老师意见:" prop="dsyj">
            {{formData.dsyj}}
          </el-form-item>
          <!-- <el-table
            :data="experts"
            v-if="$store.getters.user.rolekey == 'xyadmin'"
            border
            style="width: 100%;margin-bottom: 20px;"
          >
            <el-table-column prop="zjgh" label="专家工号"> </el-table-column>
            <el-table-column prop="zjmc" label="专家名称"> </el-table-column>
            <el-table-column prop="dbfs" label="专家打分"> </el-table-column>
            <el-table-column prop="yijian" label="专家评语"> </el-table-column>
            <el-table-column prop="shtime" label="审核时间"> </el-table-column>
          </el-table> -->

          <el-form-item label="专家组成员:" prop="zjzcy">
            <CKEditor
              v-model="formData.zjzcy"
              :onlyReview="$store.getters.user.rolekey == 'zj'"
              type="textarea"
              :maxlength="100"
              :autosize="{ minRows: 4, maxRows: 4 }"
              :style="{ width: '100%' }"
            ></CKEditor>
          </el-form-item>

          <el-form-item label="专家组意见:" prop="zjzyj">
            <el-input
              v-model="formData.zjzyj"
              type="textarea"
              placeholder="专家组意见"
              :maxlength="1000"
              :autosize="{ minRows: 4, maxRows: 4 }"
              :style="{ width: '100%' }"
            ></el-input>
          </el-form-item>

            <el-form-item label="评审分数:" prop="dbfs">
            <el-radio-group v-model="formData.dbfs">
              <el-radio v-for="item in scores" :key="item" :label="item">{{item}}</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item
            v-if="$store.getters.user.rolekey == 'xyadmin'"
            label="是否通过:"
            prop="shzt"
          >
            <el-radio-group v-model="formData.shzt">
              <el-radio label="1">上报到学校</el-radio>
              <el-radio label="-1">不通过</el-radio>
              <el-radio label="0">暂缓</el-radio>
              <el-radio label="2">中止</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-form>
    </el-row>
    <div slot="footer" class="dialog-footer">
      <el-button v-if="editAgin" type="primary" @click="submitForm(0)">保存</el-button>
      <el-button  type="primary" @click="submitForm(1)">提交</el-button>
      <el-button @click="close">取消</el-button>
    </div>
  </jxdialog>
</template>
<script>
import CKEditor from "@/components/CKEdit";
import jxdialog from "@/components/jxDialog";
import ProjectApi from "@/api/jxStuProject";
import personDetail from "@/views/jxStuProject/common/personDetail";
//type 1导师批阅 2学院管理员批阅
export default {
  components: { CKEditor, jxdialog,personDetail },
  props: ["visible", "base",'onReview',"editAgin","type", "cbClose"],
  data() {
    return {
      projectNature:[],
      //编辑
      scores:['优秀','良','中','及格','不及格'],
      projectBase:{},
      onlyReview: false,
      title: "提交结题检查表",
      experts: [],
      formData: {
       zjzyj:undefined,
        xmzynr: undefined,
        xmssqk: undefined,
        dbfs:'优秀',
        dsyj: "",
        jtzt: "21",
        shzt:'1',
      },
      rules: {
        xmzynr: [
          {
            required: true,
            message: "请输入项目的主要内容",
            trigger: "blur"
          }
        ],
        xmssqk: [
          {
            required: true,
            message: "请输入项目实施情况总结",
            trigger: "blur"
          }
        ],
      }
    };
  },
  computed: {},
  created() {
      this.getDicts("project_nature").then(res => {
      this.projectNature = res.data;
    });
  },
  methods: {
       // 执行状态字典翻译
    projectNatureFormat(key) {
      return this.selectDictLabel(this.projectNature, key);
    },
    //状态检查
    typeCheck() {
      if (!this.type) return;
      switch (parseInt(this.type)) {
        case 1:
          this.onlyReview = true;
          this.title = "批阅结题检查表";
          break;
        case 2:
          this.onlyReview = true;
          this.title = "学校管理员批阅结题检查表";
          break;
      }
    },
    //回填
    getDetail() {
      this.typeCheck()
      let xmid = this.base.id
      if (!xmid) return;
      ProjectApi.getEndDate({xmid}).then(data => {
        this.formData = Object.assign({}, this.formData, data.data);
        this.projectBase = data.data.txmBase
        this.formData.zjzyj = data.data.txmBaseStageZj?.yijian
        this.formData.dbfs = data.data.txmBaseStageZj?.dbfs
        this.experts = data.data.txmBaseStageZjList||[]
      });
    },
    close() {
      this.cbClose && this.cbClose();
      this.$emit("update:visible", false);
      this.$refs["elForm"].resetFields(); 
    },
    submitType1() {
      ProjectApi.confirmEnd({
        dsyj: this.formData.dsyj,
        xmid: this.base.id,
        jtzt: this.formData.jtzt,
        jtid: this.formData.id
      }).then(data => {
        this.msgSuccess(data.msg);
        this.close();
      });
    },

    submitType2() {
      let params = {
        zjzcy: this.formData.zjzcy,
        xmid: this.base.id,
        shzt: this.formData.shzt,
        jtid: this.formData.id,
        dbfs: this.formData.dbfs
      };
      if (this.$store.getters.user.rolekey == "zj") {
        params.zjzyj = this.formData.zjzyj;
      } else {
        params.xyyj = this.formData.zjzyj;
      }
      ProjectApi.schoolEnd(params).then(data => {
        this.msgSuccess(data.msg);
        this.close();
      });
    },

    submitForm(isfb) {
      this.$refs["elForm"].validate(valid => {
        if (!valid) return;
        //type ==1 提交上面的接口
        if (this.type == 1) return this.submitType1();
        else if (this.type == 2) return this.submitType2();
        this.formData.xmId = this.base.id
        let API = ProjectApi.submitReslutApply 
        if(this.editAgin) {
          API = ProjectApi.updateEndApply
          this.formData.isfb = isfb
          }
        API(this.formData).then(data => {
          this.msgSuccess(data.msg);
          this.formData.zjzyj = ''
          this.close();
        });
      });
      this.resetForm()
    },
    resetForm() {
      this.$refs["elForm"].resetFields();
    }
  }
};
</script>
<style></style>
