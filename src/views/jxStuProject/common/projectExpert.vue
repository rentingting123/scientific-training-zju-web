<template>
  <div>
    <el-dialog
      v-bind="$attrs"
      v-on="$listeners"
      @open="onOpen"
      @close="onClose"
      class="jxdialog"
      :title="type==1?'项目评审':'修改经费'"
    >
      <el-row :gutter="15">
        <el-col style="padding-bottom: 7.5px;" v-for="_list in list" :key="_list.title" :span="17">
          <div v-if="formData[_list.value]">
          <div class="title">{{ _list.title }}</div>

          <div class="info" :span="18">
            <personDetail
              v-if="_list.key"
              :formdata="formData"
              :value="_list.value"
              :keys="_list.key"
              :type="_list.type"
            />
            <div v-else>
              <ckReview :html="formData[_list.value]"/>
            </div>
          </div>
          </div>
        </el-col>
      </el-row>

      <el-row   v-if="$store.getters.user.rolekey=='xyadmin'" class="experttable" :gutter="15">
        <!-- <el-table border :data="experts"  style="width: 100%">
          <el-table-column prop="zjgh" label="专家工号" >
          </el-table-column>
          <el-table-column prop="zjmc" label="专家名称">
          </el-table-column>
          <el-table-column prop="dbfs" label="专家打分"> </el-table-column>
          <el-table-column prop="yijian" label="专家评语"> </el-table-column>
          <el-table-column prop="shtime" label="审核时间"> </el-table-column>
        </el-table> -->
      </el-row>
      <el-row :gutter="15">
        <el-form
          ref="elForm"
          :model="formData"
          :rules="rules"
          size="medium"
          lock-scroll
          label-width="100px"
        >
         <el-row  v-if="type==1" :gutter="15">
          <el-col :span="17">
            <el-form-item   label="专家组成员" prop="zjzcy">
              <el-input
                v-if="$store.getters.user.rolekey=='xyadmin'"
                v-model="formData.zjzcy"
                type="textarea"
                placeholder="请输入专家组成员"
                :autosize="{ minRows: 4, maxRows: 4 }"
                :style="{ width: '100%' }"
              ></el-input>
              <span v-else>{{formData.zjzcy}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="17">
            <el-form-item label="评审分数" prop="dbfs">
              <el-input
                v-model="formData.dbfs"
                placeholder="请输入评审分数"
                clearable
                :style="{ width: '100%' }"
              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="17">
            <el-form-item label="专家组意见" prop="zjzyj">
              <el-input
                v-model="formData.zjzyj"
                type="textarea"
                placeholder="请输入专家组意见"
                :maxlength="1000"
                :autosize="{ minRows: 4, maxRows: 4 }"
                :style="{ width: '100%' }"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="17">
            <el-form-item  v-if="$store.getters.user.rolekey=='xyadmin'" label="评审结果" prop="shzt">
              <el-radio-group v-model="formData.shzt" size="medium">
                <el-radio
                  v-for="(item, index) in shztOptions"
                  :key="index"
                  :label="item.value"
                  :disabled="item.disabled"
                  >{{ item.label }}</el-radio
                >
              </el-radio-group>
            </el-form-item>
          </el-col>
         </el-row>

        <el-row v-if="type==2" :gutter="15">
        <el-col :span="24">
        <el-form-item label="申请经费" prop="shenqjf">
          <el-input
            v-model="shenqjf"
            disabled
            placeholder="请输入申请经费"
            clearable
            :style="{ width: '28%' }"
          />
          <el-alert style="display:inline margin-left: 15px;" type="success" title="* 项目经费预算与用途"></el-alert>
        </el-form-item>
        </el-col>
          <el-col :span="12">
            <el-form-item label="专用材料费" prop="zyclf">
              <el-input-number
                v-model="formData.zyclf"
                placeholder="专用材料预算经费"
                :step="1"
                controls-position="right"
              ></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="主要用途" prop="zyclfText">
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
                :step="1"
                controls-position="right"
              ></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="主要用途" prop="ysfyzlfText">
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
                :step="1"
                controls-position="right"
              ></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="主要用途" prop="dyyclfText">
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
                :step="1"
                controls-position="right"
              ></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="主要用途" prop="bmysfText">
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
                :step="1"
                controls-position="right"
              ></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="主要用途" prop="ydfText">
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
      </el-row>
      <div slot="footer">
        <el-button @click="close">取消</el-button>
        <el-button type="primary" @click="handelConfirm">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import ProjectApi from "@/api/jxStuProject";
import personDetail from "@/views/jxStuProject/common/personDetail";
import ckReview from '@/components/CKReview'
export default {
  inheritAttrs: false,
  components: { personDetail,ckReview },
  props: ["closecb", "id","type"],
  //type 2 修改经费  1 专家评语
  data() {
    return {
    experts:[],
    money:[],
    formData: {
        zjzcy: undefined,
        dbfs: undefined,
        zjzyj: undefined,
        shzt: undefined,
      },
      list: [
        {
          title: "项目名称",
          value: "xiangmumc"
        },
        {
          title: "项目类型",
          value: "typeStr"
        },
        {
          title: "项目性质",
          value: "xiangmuxzStr"
        },
        {
          title: "项目状况",
          value: "xiangmuzkStr"
        },
        {
          title: "项目来源",
          value: "xiangmulyStr"
        },
        {
            title:"项目起始时间",
            value:'timers'
        },
        {
          title: "负责导师",
          value: "fzdsxm",
          key: "fzdsgh",
          type: "teacher"
        },
        {
          title: "参与导师",
          value: "xmdsList",
          key: "array",
          type: "teacher"
        },
        {
          title: "负责学生",
          value: "fzxsxm",
          key: "fzxsxh",
          type: "student"
        },
        {
          title: "项目主要内容简介",
          value: "xiangmujj"
        }
      ],
      rules: {
        dbfs: [
          {
            required: true,
            message: "请输入评审分数",
            trigger: "blur"
          }
        ],
        zjzyj: [
          {
            required: true,
            message: "请输入专家组意见",
            trigger: "blur"
          }
        ],
        shzt: [
          {
            required: true,
            message: "评审结果不能为空",
            trigger: "change"
          }
        ]
      },
      shztOptions: [
        {
          label: "上报到学校",
          value: 4
        },
        {
          label: "不通过",
          value: -6
        }
      ],
      kyxmlbOptions: {},
      xiangmuxzOptions: {},
      xiangmuzkOptions: {},
      xiangmulyOptions: {},
      formData: {},
      experts:[],
    };
  },
   computed: {
    //计算科研经费
    shenqjf(){
      return this.formData.zyclf+this.formData.ysfyzlf+this.formData.dyyclf+this.formData.bmysf+this.formData.ydf
    }
  },
  // watch: {
  //   id(val) {
  //     this.getDetail(val);
  //   }
  // },
  async created() {
    await this.getDicts("getLB2MapForAdd").then(response => {
      response.data.map(item => {
        this.kyxmlbOptions[item.dictValue] = item.dictLabel;
      });
    });
    await this.getDicts("all_project_from").then(response => {
      response.data.map(item => {
        this.xiangmulyOptions[item.dictValue] = item.dictLabel;
      });
    });
    //xiangmuzkOptions
    await this.getDicts("all_status").then(response => {
      response.data.map(item => {
        this.xiangmuzkOptions[item.dictValue] = item.dictLabel;
      });
    });
    //xiangmuxzOptions
    await this.getDicts("all_nature").then(response => {
      response.data.map(item => {
        this.xiangmuxzOptions[item.dictValue] = item.dictLabel;
      });
    });
    this.getDetail(this.id);

  },
  mounted() {},
  methods: {
    getDetail(id) {
      id = id || this.id;
      if (!id) return;
      ProjectApi.expertDetail({ xmid: id }).then(data => {
        let _fd = data.data.txmBase;
        _fd.typeStr = this.kyxmlbOptions[_fd.xmejlb];
        //处理项目性质
        _fd.xiangmuxzStr = this.xiangmuxzOptions[_fd.xiangmuxz];
        //处理项目状况
        _fd.xiangmuzkStr = this.xiangmuzkOptions[_fd.xiangmuzk];
        //项目来源
        _fd.xiangmulyStr = this.xiangmulyOptions[_fd.xiangmuly];

        _fd.timers = `${_fd.xiangmukssj} 至 ${_fd.xiangmujssj}`
        //如果是专家赋值
        if(this.$store.getters.user.rolekey=='zj'){
            this.formData.zjzyj = data.data.zjyj?.yijian
            this.formData.dbfs = data.data.zjyj?.dbfs
        }
        this.formData = _fd;
        this.experts = data.data.zjyjList||[]
        this.money = [
            {
              title: "专用材料费",
              value: _fd.zyclf,
              remark: _fd.zyclfText
            },
            {
              title: "印刷费与资料费",
              value: _fd.ysfyzlf,
              remark: _fd.ysfyzlfText
            },
            {
              title: "交通与差旅费",
              value: _fd.dyyclf,
              remark: _fd.dyyclfText
            },
            {
              title: "出版费",
              value: _fd.bmysf,
              remark: _fd.bmysfText
            },
            {
              title: "邮寄费",
              value: _fd.ydf,
              remark: _fd.ydfText
            }
          ];
      });
    },
    onOpen() {
       this.getDetail();
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
        this.formData.xmid = this.id;
        let API = ProjectApi.expertOpinion
        if(this.type==2){API = ProjectApi.expertChangeMoney}
          this.formData.xmid = this.formData.id
          this.formData.pzjf = this.shenqjf
        API(this.formData).then(data => {
          this.msgSuccess(data.msg)
          this.closecb && this.closecb();
          this.close();
        });

      });
    }
  }
};
</script>
<style lang="scss">
.jxdialog{
    .el-dialog{
        padding: 0 60px;
    }
    .el-dialog__body{
        max-height: 70vh;
        position:relative;
        overflow:auto;
    }
    .title {
  display: inline-block;
  vertical-align: top;
  text-align: right;
  // font-weight: 700;
  padding-right: 12px;
}
.info {
  display: inline-block;
  vertical-align: top;
}
}
.experttable{
    padding:15px 0
}
</style>
