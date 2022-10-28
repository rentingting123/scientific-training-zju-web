<template>
  <jxdialog
    :visible="visible"
    @close="close"
    :close-on-click-modal="false"
    :title="title"
    @open="getDetail"
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
          <el-form-item  label="项目性质:">
            {{ projectNatureFormat(formData.xiangmuxz) }}
          </el-form-item>
        </el-col>

        <el-col :span="13">
          <el-form-item label="申报人:">
            <span>{{ base.fzxsxm }}</span>
          </el-form-item>
        </el-col>

        <el-col :span="13">
          <el-form-item label="负责导师:">
            <span>{{ base.fzdsxm }}</span>
          </el-form-item>
        </el-col>

        <el-col :span="13">
          <el-form-item label="负责学生:">
            <span>{{ base.fzxsxm }}</span>
          </el-form-item>
        </el-col>

        <el-col :span="13">
          <el-form-item label="立项经费:" prop="xmjf">
            <el-input
              v-model="formData.xmjf"
              disabled="disabled"
              placeholder="请输入立项经费"
              clearable
              :style="{ width: '100%' }"
            >
            <!-- :disabled="onlyReview" -->
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="13">
          <el-form-item label="开题报告:" prop="sfzjktbg">
            <el-input
              v-model="formData.sfzjktbg"
              :disabled="onlyReview"
              placeholder="请输入开题报告"
              :style="{ width: '100%' }"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="19">
          <el-form-item label="项目研究进展情况:" prop="jzqq">
            <CKEditor
              v-model="formData.jzqq"
              :onlyReview="onlyReview"
              type="textarea"
              placeholder="对研究内容、方法、进度、和过程规范等(800字以内，最低字数为10个字)"
              :maxlength="800"
              :autosize="{ minRows: 4, maxRows: 4 }"
              :style="{ width: '100%' }"
            ></CKEditor>
          </el-form-item>
        </el-col>
        <el-col :span="19">
          <el-form-item label="项目研究已取得阶段性成果和收获:" prop="jdcg">
            <CKEditor
              v-model="formData.jdcg"
              :onlyReview="onlyReview"
              type="textarea"
              placeholder="请填写项目研究已取得阶段性成果和收获(500字以内，最低字数为10个字)"
              :maxlength="500"
              :autosize="{ minRows: 4, maxRows: 4 }"
              :style="{ width: '100%' }"
            ></CKEditor>
          </el-form-item>
        </el-col>
        <el-col :span="19">
          <el-form-item
            label="项目研究存在的主要问题分析及应对思路与措施:"
            prop="ydsl"
          >
            <CKEditor
              v-model="formData.ydsl"
              :onlyReview="onlyReview"
              type="textarea"
              placeholder="请填写项目研究存在的主要问题分析及应对思路与措施(500字以内，最低字数为10个字)"
              :maxlength="500"
              :autosize="{ minRows: 4, maxRows: 4 }"
              :style="{ width: '100%' }"
            ></CKEditor>
          </el-form-item>
        </el-col>
        <el-col :span="19">
          <el-form-item
            label="项目研究下阶段主要任务及时间进度安排:"
            prop="sjjcap"
          >
            <CKEditor
              v-model="formData.sjjcap"
              :onlyReview="onlyReview"
              type="textarea"
              placeholder="请填写项目研究下阶段主要任务及时间进度安排(500字以内，最低字数为10个字)"
              :maxlength="500"
              :autosize="{ minRows: 4, maxRows: 4 }"
              :style="{ width: '100%' }"
            ></CKEditor>
          </el-form-item>
        </el-col>
        <el-col :span="19">
          <el-form-item label="项目经费使用情况:" prop="jfsyqk">
            <CKEditor
              v-model="formData.jfsyqk"
              :onlyReview="onlyReview"
              type="textarea"
              placeholder="请填写项目经费使用情况(100字以内，最低字数为10个字)"
              :maxlength="500"
              :autosize="{ minRows: 4, maxRows: 4 }"
              :style="{ width: '100%' }"
            ></CKEditor>
          </el-form-item>
        </el-col>
        <el-col :span="19">
          <el-form-item
            label="项目组负责人所承担和完成研究内容情况汇报:"
            prop="yjnrqk"
          >
            <CKEditor
              v-model="formData.yjnrqk"
              :onlyReview="onlyReview"
              type="textarea"
              placeholder="项目组负责人所承担和完成研究内容情况汇报(100字以内)"
              :maxlength="100"
              :autosize="{ minRows: 4, maxRows: 4 }"
              :style="{ width: '100%' }"
            ></CKEditor>
          </el-form-item>
        </el-col>
        <el-col v-if="type == 1" :span="19">
          <el-form-item label="是否通过:" prop="zqzt">
            <el-radio-group v-model="formData.zqzt">
              <el-radio :label="3">通过</el-radio>
              <el-radio :label="20">不通过</el-radio>
              <el-radio :label="22">退回修改</el-radio>
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

          <el-form-item label="意见:" prop="zjzyj">
            <el-input
              v-model="formData.zjzyj"
              type="textarea"
              placeholder="意见"
              :maxlength="100"
              :autosize="{ minRows: 4, maxRows: 4 }"
              :style="{ width: '100%' }"
            ></el-input>
          </el-form-item>

          <el-form-item
            v-if="$store.getters.user.rolekey == 'xyadmin'"
            label="是否通过:"
            prop="shzt"
          >
            <el-radio-group v-model="formData.shzt">
              <el-radio :label="1">通过</el-radio>
              <el-radio :label="-1">不通过</el-radio>
              <el-radio :label="0">暂缓</el-radio>
              <el-radio :label="2">中止</el-radio>
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
//type 1导师批阅 2学院管理员批阅
export default {
  components: { CKEditor, jxdialog },
  props: ["visible", "base","onReview",'editAgin',"type", "cbClose"],
  data() {
    return {
      //编辑
      onlyReview: false,
      title: "提交中期检查表",
      experts: [],
      formData: {
        xmjf: undefined,
        sfzjktbg: undefined,
        jzqq: undefined,
        jdcg: undefined,
        ydsl: undefined,
        sjjcap: undefined,
        jfsyqk: undefined,
        yjnrqk: undefined,
        dsyj: "",
        zqzt: "3"
      },
      rules: {
        shzt: [
          {
            required: true,
            message: "请选择通过状态",
            trigger: "blur"
          }
        ],
        dsyj: [
          {
            required: true,
            message: "请输入导师意见",
            trigger: "blur"
          }
        ],
        xmjf: [
          {
            required: true,
            message: "请输入立项经费",
            trigger: "blur"
          }
        ],
        sfzjktbg: [],
        jzqq: [
          {
            required: true,
            message: "请输入项目研究进展情况",
            trigger: "blur"
          }
        ],
        jdcg: [
          {
            required: true,
            message: "请输入项目研究已取得阶段性成果和收获",
            trigger: "blur"
          }
        ],
        ydsl: [
          {
            required: true,
            message: "请输入项目研究存在的主要问题分析及应对思路与措施",
            trigger: "blur"
          }
        ],
        sjjcap: [
          {
            required: true,
            message: "请输入项目研究下阶段主要任务及时间进度安排",
            trigger: "blur"
          }
        ],
        jfsyqk: [
          {
            required: true,
            message: "请输入项目经费使用情况",
            trigger: "blur"
          }
        ],
        // yjnrqk: [
        //   {
        //     required: true,
        //     message: "项目组各人员所承担和完成研究内容情况汇报(100字以内)",
        //     trigger: "blur"
        //   }
        // ]
      },
      projectNature: []
    };
  },
  computed: {},
  async created() {
    await this.getDicts("all_nature").then(res => {
      this.projectNature = res.data;
    });
    // await this.getDetail(this.base.id)
  },
  mounted() {
    this.formData.xmjf = this.base.shenqjf;
  },
  methods: {
    //状态检查
    typeCheck(val) {
      if (!val) return;
      switch (parseInt(val)) {
        case 1:
          this.onlyReview = true;
          this.title = "批阅中期检查表";
          break;
        case 2:
          this.onlyReview = true;
          this.title = "学校管理员批阅中期检查表";
          break;
      }
    },
    //
    // 执行状态字典翻译
    projectNatureFormat(key) {
      return this.selectDictLabel(this.projectNature, key);
    },
    //回填
    getDetail(id) {
      this.typeCheck(this.type);
      this.formData.xmjf = this.base.shenqjf;
      let xmid =id||this.base.id
      if (!xmid) return;
      ProjectApi.getMiddleDate({xmid}).then(data => {
        this.formData = Object.assign({}, this.formData, data.data.txmzq,{xiangmuxz:data?.data?.txmBase?.xiangmuxz});
        this.experts = data.data.txmBaseStageZjList || [];
      });
    },
    close() {
      this.$emit("update:visible", false);
       this.formData.shzt = ''
       this.formData.zjzyj = ''
       this.formData.zjzcy = ''
    },
    submitType1() {
      ProjectApi.confirmMiddle({
        dsyj: this.formData.dsyj,
        xmid: this.base.id,
        zqzt: this.formData.zqzt,
        zqid: this.formData.id
      }).then(data => {
        this.msgSuccess(data.msg);
        this.close();
        this.cbClose && this.cbClose();
      });
    },

    submitType2() {
      let params = {
        zjzcy: this.formData.zjzcy,
        xmid: this.base.id,
        shzt: this.formData.shzt
      };
      if (this.$store.getters.user.rolekey == "zj") {
        params.zjzyj = this.formData.zjzyj;
      } else {
        params.xyyj = this.formData.zjzyj;
      }
      ProjectApi.schoolMiddle(params).then(data => {
        this.msgSuccess(data.msg);
        this.close();
        this.cbClose && this.cbClose();
      });
    },

    submitForm(isfb) {
      this.$refs["elForm"].validate(valid => {
        if (!valid) return;
        //type ==1 提交上面的接口
        if (this.type == 1) return this.submitType1();
        else if (this.type == 2) return this.submitType2();
        // TODO 提交表单
        this.formData.isfb=isfb
        let api = ProjectApi.middleSave;
        if (this.formData.id) {
          api = ProjectApi.middleUpdate;
        }
        api({ txmzq: this.formData, xmid: this.base.id }).then(data => {
          this.msgSuccess("提交成功");
          this.close();
          this.cbClose && this.cbClose();
        });
      });
    },
    resetForm() {
      this.$refs["elForm"].resetFields();
    }
  },
  filter: {}
};
</script>
<style></style>
