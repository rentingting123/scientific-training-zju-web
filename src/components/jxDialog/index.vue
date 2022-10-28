<template>
    <el-dialog
      v-bind="$attrs"
      v-on="$listeners"
      :lock-scroll="true"
      :close-on-click-modal="false"
      class="jxdialog"
      >
      <slot name="title" />
     <slot />
     <span slot="footer" class="dialog-footer">
       <slot name="footer" />
     </span>
    </el-dialog>
</template>

<style lang="scss">
.jxdialog{
    .el-dialog{
        padding: 0 60px;
        min-width:890px;width:80%;margin:0 auto
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
</style>