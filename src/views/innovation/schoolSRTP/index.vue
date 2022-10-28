<template>
  <div>
    <div class="enter" v-if="!$route.meta.pureComponent">
      <div>
        <el-button type="success" @click="$router.push(`/innovation/schoolSrtp/${$route.params.year}/step1`)">立项</el-button>
        <i class="el-icon-right icon1"></i>
        <el-button type="warning" @click="$router.push(`/innovation/schoolSrtp/${$route.params.year}/step2`)">中期</el-button>

      </div>
      <div style="text-align: right;padding-right: 50px;">
        <i class="el-icon-bottom icon2"></i>
      </div>
    
      <div>
        <el-button type="primary" @click="$router.push(`/innovation/schoolSrtp/${$route.params.year}/step3`)">成果</el-button>
        <i class="el-icon-back icon3"></i>
        <el-button type="danger" @click="$router.push(`/innovation/schoolSrtp/${$route.params.year}/step4`)">结题</el-button>
      </div>
    </div>
     <router-view />
  </div>
</template>

<script>
export default {
  data() {
    return {
      year: ""
    };
  },
};
</script>
<style lang='scss' scoped>
.enter{
  position:absolute;
  width: 350px;
  height: 350px;
  left: 0;
  right: 0;
  top:0;
  bottom:0;
  margin: auto;
  button{
    width: 150px;
    height: 150px;
    font-size: 20px;
    margin: 0;
  }
  .icon1,.icon3,.icon2{
    font-size: 50px;
    color:#13ce66;
  }
}
</style>