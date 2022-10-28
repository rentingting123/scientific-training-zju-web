<template>
  <div>
    <el-dialog
      v-bind="$attrs"
      v-on="$listeners"
      @close="onClose"
      @open="onOpen"
      :title="title"
    >
      <el-row :gutter="15">
        <el-form
          :disabled="title == '查看'"
          ref="elForm"
          :model="formData"
          :rules="rules"
          size="medium"
          label-width="100px"
        >
          <el-col :span="24">
            <el-form-item :label="isAddxw?'用户名':'学工号'" prop="jgh">
              <el-input
                v-model="formData.jgh"
                placeholder="请输入学工号"
                clearable
                :style="{ width: '100%' }"
              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="姓名" prop="xm">
              <el-input
                v-model="formData.xm"
                placeholder="请输入姓名"
                clearable
                :style="{ width: '100%' }"
              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col v-if="isAddxw" :span="24">
            <el-form-item label="密码" prop="mm">
              <el-input
                v-model="formData.mm"
                placeholder="请输入密码"
                clearable
                show-password
                :style="{ width: '100%' }"
              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col  v-if="isAddxw" :span="24">
            <el-form-item label="确认密码" prop="m2m">
              <el-input
                v-model="formData.m2m"
                placeholder="请输入确认密码"
                clearable
                show-password
                :style="{ width: '100%' }"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="性别" prop="xb">
              <el-radio-group v-model="formData.xb" size="medium">
                <el-radio
                  v-for="(item, index) in xbOptions"
                  :key="index"
                  :label="item.value"
                  :disabled="item.disabled"
                  >{{ item.label }}</el-radio
                >
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="邮箱" prop="email">
              <el-input
                v-model="formData.email"
                placeholder="请输入邮箱"
                clearable
                :style="{ width: '100%' }"
              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="联系方式" prop="lxfs">
              <el-input
                v-model="formData.lxfs"
                placeholder="请输入联系方式"
                clearable
                :style="{ width: '100%' }"
              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="院系" prop="xy">
              <acadSelect
                :style="{ width: '70%' }"
                @onChange="acadChange"
                v-model="formData.xy"
              />
            </el-form-item>
          </el-col>
          <el-col v-if="!isAddxw" :span="24">
            <el-form-item label="学位" prop="xw">
              <el-input
                v-model="formData.xw"
                placeholder="请输入学位"
                clearable
                :style="{ width: '100%' }"
              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col v-if="!isAddxw" :span="24">
            <el-form-item label="职称" prop="zc">
              <el-input
                v-model="formData.zc"
                placeholder="请输入职称"
                clearable
                :style="{ width: '100%' }"
              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col v-if="!isAddxw" :span="24">
            <el-form-item label="研究方向" prop="yjfx">
              <el-input
                v-model="formData.yjfx"
                placeholder="请输入研究方向"
                clearable
                :style="{ width: '100%' }"
              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col v-if="!isAddxw" :span="24">
            <el-row>
              <el-col :span="12">
                <el-form-item label="近三年成果" prop="gjdj">
                  <el-input
                    v-model="formData.gjdj"
                    placeholder="请输入近国家级奖项"
                    clearable
                    :style="{ width: '100%' }"
                  >
                    <template slot="prepend">国家级</template>
                    <template slot="append">等奖</template>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="" prop="gjjx">
                  <el-input
                    v-model="formData.gjjx"
                    placeholder="请输入国家级奖项"
                    clearable
                    :style="{ width: '100%' }"
                  >
                    <template slot="append">项</template>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="" prop="sj">
                  <el-input
                    v-model="formData.sj"
                    placeholder="请输入省部级奖项"
                    clearable
                    :style="{ width: '100%' }"
                  >
                    <template slot="prepend">省部级</template>
                    <template slot="append">等奖</template>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="" prop="sjjx">
                  <el-input
                    v-model="formData.sjjx"
                    placeholder="请输入省部级奖项"
                    clearable
                    :style="{ width: '100%' }"
                  >
                    <template slot="append">项</template>
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-col>

          <el-col v-if="!isAddxw" :span="24">
            <el-row>
              <el-col :span="12">
                <el-form-item label="近三年科研经费" prop="kyjf">
                  <el-input
                    v-model="formData.kyjf"
                    placeholder="请输入近三年科研经费"
                    clearable
                    :style="{ width: '100%' }"
                  >
                    <template slot="append">万元</template>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="" prop="yearavg">
                  <el-input
                    v-model="formData.yearavg"
                    placeholder="请输入年均经费"
                    clearable
                    :style="{ width: '100%' }"
                  >
                    <template slot="prepend">年均</template>
                    <template slot="append">万元</template>
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-col>

          <el-col v-if="!isAddxw" :span="24">
            <el-form-item label="要求" prop="yq">
              <el-input
                v-model="formData.yq"
                type="textarea"
                placeholder="请输入要求"
                :autosize="{ minRows: 4, maxRows: 4 }"
                :style="{ width: '100%' }"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <div slot="footer">
        <el-button @click="close">取消</el-button>
        <el-button
          type="primary"
          :disabled="title == '查看'"
          @click="handelConfirm"
          >确定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>
<script>
import acadSelect from "./acadSelect.vue";
import { modifyTeacher, addTeacher } from "@/api/jxbasedata/teacher";
export default {
  inheritAttrs: false,
  components: { acadSelect },
  props: ["title", "selectTeacher"],
  data() {
     var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          if (this.formData.m2m !== '') {
            this.$refs.elForm.validateField('m2m');
          }
          callback();
        }
      };
      var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.formData.mm) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
    return {
      isAddxw:false,
      formData: {},
      rules: {
        jgh: [
          {
            required: true,
            message: "请输入学工号",
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
        xb: [],
        email: [
          {
            required: true,
            message: "请输入邮箱",
            trigger: "blur"
          }
        ],
        lxfs: [
          {
            required: true,
            message: "请输入联系方式",
            trigger: "blur"
          }
        ],
        xy: [
          {
            required: true,
            message: "请选择院系",
            trigger: "change"
          }
        ],
        xw: [],
        zc: [],
        yjfx: [],
        gjdj: [
          {
            required: true,
            message: "请输入近国家级奖项",
            trigger: "blur"
          }
        ],
        gjjx: [
          {
            required: true,
            message: "请输入国家级奖项",
            trigger: "blur"
          }
        ],
        sj: [
          {
            required: true,
            message: "请输入省部级奖项",
            trigger: "blur"
          }
        ],
        sjjx: [
          {
            required: true,
            message: "请输入省部级奖项",
            trigger: "blur"
          }
        ],
        kyjf: [
          {
            required: true,
            message: "请输入近三年科研经费",
            trigger: "blur"
          }
        ],
        yearavg: [
          {
            required: true,
            message: "请输入年均经费",
            trigger: "blur"
          }
        ],
        yq: [
          {
            message: "请输入要求",
            trigger: "blur"
          }
        ],
         mm: [{
          required: true,
          message: '请输入密码',
          trigger: 'blur'
        },  { validator: validatePass, trigger: 'blur' }],
        m2m: [{ validator: validatePass2, trigger: 'blur' }],
      },
      xbOptions: [
        {
          label: "男",
          value: "1"
        },
        {
          label: "女",
          value: "2"
        }
      ]
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    resetFrom(out) {
      this.formData = {
        jgh: undefined,
        xm: undefined,
        xb: "1",
        email: undefined,
        lxfs: undefined,
        xy: undefined,
        xw: undefined,
        zc: undefined,
        yjfx: undefined,
        isxw: out,
        gjdj: "0",
        gjjx: 0,
        sj: 0,
        sjjx: "0",
        kyjf: 0,
        yearavg: 0,
        yq: undefined
      };
      return this.formData;
    },
    acadChange(acad) {
      this.formData.xymc = acad.label;
    },
    onOpen() {
      this.isAddxw = this.title == '添加校外导师'
      this.resetFrom(this.isAddxw);
      this.formData =Object.assign(this.formData,this.selectTeacher)
    },
    onClose() {
      this.$refs["elForm"].resetFields();
    },
    close() {
      this.$emit("update:visible", false);
    },
    handelConfirm() {
      this.$refs["elForm"].validate(valid => {
        if (!valid) return;
        if (this.formData.id != undefined) {
          modifyTeacher(this.formData).then(response => {
            this.msgSuccess("修改成功");
            this.close();
            this.$emit("cb");
          });
        } else {
          addTeacher(this.formData).then(response => {
            this.msgSuccess("新增成功");
            this.close();
            this.$emit("cb");
          });
        }
      });
    }
  }
};
</script>
<style></style>
