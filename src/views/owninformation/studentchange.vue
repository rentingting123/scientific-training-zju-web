<template>
  <div class="main">
      <el-row :gutter="15">
        <el-form
          ref="elForm"
          :model="formData"
          :rules="rules"
          size="medium"
          label-width="100px"
        >
          <el-col :span="12">
            <el-form-item label-width="120px" label="学号" prop="xh">
              <el-input
                v-model="formData.xh"
                 disabled="disabled"
                placeholder="请输入学号"
                clearable
                :style="{ width: '70%','margin-right':'10px' }"
              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label-width="120px" label="姓名" prop="xm">
              <el-input
                v-model="formData.xm"
                placeholder="请输入姓名"
                clearable
                :style="{ width: '70%','margin-right':'10px' }"
              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label-width="120px" label="手机号码" prop="sj">
              <el-input
                v-model="formData.sj"
                placeholder="请输入手机号码"
                clearable
                :style="{ width: '70%','margin-right':'10px' }"
              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label-width="120px" label="电子邮件" prop="email">
              <el-input
                v-model="formData.email"
                placeholder="请输入电子邮件"
                clearable
                :style="{ width: '70%','margin-right':'10px' }"
              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label-width="120px" label="学院" prop="xymc">
             <div class="acad">
               <div style="width:70%">
                <acadSelect :style="{width:'100%'}" @onChange="acadChange" v-model="formData.xybh" />
             </div>
                 <div>
                   <el-alert type="warning" title="（申报SRTP请设置为专业所属学院）"></el-alert>
                 </div>
             </div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label-width="120px" label="班级" prop="bjmc">
              <el-input
                v-model="formData.bjmc"
                placeholder="请输入班级"
                clearable
                :style="{ width: '70%','margin-right':'10px' }"
              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label-width="120px" label="专业" prop="zymc">
              <el-input
                v-model="formData.zymc"
                placeholder="请输入专业"
                clearable
                :style="{ width: '70%','margin-right':'10px' }"
              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label-width="120px" label="年级" prop="njmc">
              <el-input
                v-model="formData.njmc"
                placeholder="请输入年级"
                clearable
                :style="{ width: '70%','margin-right':'10px' }"
              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label-width="120px" label="学年排名" prop="xnpm">
              <el-input
                v-model="formData.xnpm"
                placeholder="请输入学年排名"
                clearable
                :style="{ width: '70%','margin-right':'10px' }"
              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label-width="120px"
              label="所有课程累计绩点"
              prop="sykcd"
            >
              <el-input
                v-model="formData.sykcd"
                placeholder="请输入所有课程累计绩点"
                clearable
                :style="{ width: '70%','margin-right':'10px' }"
              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label-width="120px"
              label="主修专业课程累计绩点"
              prop="zxkcd"
            >
              <el-input
                v-model="formData.zxkcd"
                placeholder="请输入主修专业课程累计绩点"
                clearable
                :style="{ width: '70%','margin-right':'10px' }"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label-width="120px"
              label="已获主修专业累计绩点"
              prop="yhdkcd"
            >
              <el-input
                v-model="formData.yhdkcd"
                placeholder="请输入已获主修专业累计绩点"
                clearable
                :style="{ width: '70%','margin-right':'10px' }"
              ></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item
              label-width="120px"
              label="未获得学分课程"
              prop="whdkc"
            >
              <el-input
                v-model="formData.whdkc"
                placeholder="请输入未获得学分课程"
                clearable
                :style="{ width: '70%','margin-right':'10px' }"
              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-button
              type="primary"
              style="margin-bottom:10px"
              @click.prevent="addAward()"
              >增加获奖情况</el-button
            >
            <el-row v-for="(award, index) in formData.hjqkList" :key="award.id">
              <el-col :span="12">
                <el-form-item
                  label-width="120px"
                  :label="`获奖名称${index + 1}:`"
                  :prop="'hjqkList.' + index + '.hjmc'"
                >
                  <el-input
                    v-model="award.hjmc"
                    placeholder="请输入获奖名称"
                    clearable
                    :style="{ width: '70%','margin-right':'10px' }"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item
                  label-width="120px"
                  :label="`获奖等级${index + 1}:`"
                  :prop="'hjqkList.' + index + '.hjdj'"
                >
                  <el-input
                    v-model="award.hjdj"
                    placeholder="请输入获奖等级"
                    clearable
                    :style="{ width: '70%','margin-right':'10px' }"
                  ></el-input>
                  <el-button @click.prevent="removeAward(index)"
                    >删除</el-button
                  >
                </el-form-item>
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="24">
            <el-button
              type="primary"
              style="margin-bottom:10px"
              @click.prevent="addActive()"
              >增加课外活动经历</el-button
            >
            <el-row
              v-for="(active, index) in formData.tzykwhdList"
              :key="active.id"
              :gutter="15"
            >
              <el-col :span="24">
                <el-form-item
                  label-width="120px"
                  :label="`主要课外活动${index + 1}:`"
                  :prop="'tzykwhdList.' + index + '.hjmc'"
                >
                  <el-input
                    v-model="active.zykwhd"
                    placeholder="请输入主要课外活动"
                    clearable
                    :style="{ width: '70%','margin-right':'10px' }"
                  ></el-input>
                  <el-button @click.prevent="removeActive(index)"
                    >删除</el-button
                  >
                </el-form-item>
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="24">
            <el-form-item label-width="120px" label="自我介绍：" prop="zwjs">
              <el-input
                v-model="formData.zwjs"
                type="textarea"
                placeholder="请输入自我介绍："
                :autosize="{ minRows: 4, maxRows: 4 }"
                :style="{ width: '70%','margin-right':'10px' }"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <div slot="footer">
        <el-button type="primary" @click="handelConfirm">确定</el-button>
      </div>
  </div>
</template>
<script>
import acadSelect from "./acadSelect.vue";
import {
  studentDetailById,
  studentDetailByxh,
  studentown
} from "@/api/jxbasedata/student";
export default {
  inheritAttrs: false,
  components: { acadSelect },
  // props: ["title", "open", "studentId"],
  data() {
    return {
      visiable: false,
      formData: {},
      rules: {
        xh: [
          {
            message: "请输入学号",
            trigger: "blur"
          }
        ],
        xm: [
          {
            required: true,
            message: "请输入姓名",
            trigger: "blur"
          }
        ],
        sj: [
          {
            required: true,
            message: "请输入手机号码",
            trigger: "blur"
          }
        ],
        email: [
          {
            required: true,
            message: "请输入电子邮件",
            trigger: "blur"
          }
        ],
        xymc: [
          {
            message: "请选择学院",
            required: true,
            trigger: "change"
          }
        ],bjmc:[{
            message: "请输入班级",
            required: true,
            trigger: "blur"
          }],
        zymc: [{
            message: "请输入专业",
            required: true,
            trigger: "blur"
          }],
        njmc: [
          {
            message: "请输入年级",
            required: true,
            trigger: "blur"
          }
        ],
        sykcd: [],
        zxkcd: [],
        yhdkcd: [],
        xnpm: [],
        whdkc: [],
        zwjs: [
          {
            message: "请输入自我介绍：",
            trigger: "blur"
          }
        ]
      },
      xymcOptions: [
        {
          label: "选项一",
          value: 1
        },
        {
          label: "选项二",
          value: 2
        }
      ]
    };
  },
  created() {
    this.getStuDetail()
  },
  methods: {
    getStuDetail(){
      studentDetailByxh({ xh: this.$store.getters.user.userName }).then(res => {
         this.formData = res.data;
      })
    },
    acadChange(acad) {
      this.formData.xymc = acad.label;
    },
    removeAward(index) {
      this.formData.hjqkList.splice(index, 1);
    },
    addAward() {
      this.formData.hjqkList.push({
        xh: this.formData.xh
      });
    },
    removeActive(index) {
      this.formData.tzykwhdList.splice(index, 1);
    },
    addActive() {
      this.formData.tzykwhdList.push({
        xh: this.formData.xh
      });
    },
    /** 提交按钮 */
    handelConfirm: function() {
      this.$refs["elForm"].validate((valid,errors) => {
        if (valid) {
           studentown(this.formData).then(res => {
            this.msgSuccess("修改成功");
            this.getStuDetail()
              // this.$emit("cb");
          })
          }else{
            let message = errors[Object.keys(errors)[0]][0].message
            this.msgError('请输入：'+message)
          }
         // this.resetFrom();
        });
    }
  }
};
</script>
<style scoped>
.main{
  padding: 20px;
}
.acad{
    display: flex;
    width: 100%;
    justify-content: space-between;
    overflow: hidden;
}
::v-deep .el-alert{
  padding: 0 15px;
}
::v-deep .el-alert__content{
padding: 0 11px 0 0;
}
</style>
