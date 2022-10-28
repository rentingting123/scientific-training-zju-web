<template>
  <div>
    <el-steps simple :active="6">
      <el-step
        v-for="item in activeLine"
        :key="item"
        icon="el-icon-edit"
        :title="item"
      ></el-step>
    </el-steps>
  </div>
</template>

<script>
export default {
  props: ["type"],
  data() {
    return {
      activeLine: [],
      pipeLine: [
        "申报项目",
        "学生确认参与",
        "导教师确认",
        "学院评审",
        "学校同意立项",
        "立项成功"
      ],
      middleLine: [
        "学生提交中期检查表",
        "导师批阅中期检查表",
        "学院审核中期检查表",
        "中期检查通过"
      ],
      end: [
        "上传成果",
        "上传结题报告和提交结题申请",
        "导师批阅",
        "学院评审",
        "学校验收"
      ]
    };
  },
  mounted() {
    this.activeType(this.type);
  },
  methods: {
    activeType(val) {
      switch (val) {
        case "middle":
          this.activeLine = this.middleLine;
          break;
        case "end":
          this.activeLine = this.end;
          break;
        default:
          this.activeLine = this.pipeLine;
      }
    }
  }
};
</script>
