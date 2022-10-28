<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import util from "@/utils/jxUtil";
import cookies from "js-cookie";
// import { getWebSetting } from "@/api/menu";
export default {
  name: "App",
  async created() {
    // let scSetting = await getWebSetting()
    //   if(scSetting!='error'){
    //      this.$store.dispatch('app/getScsetting',scSetting)
    //   }
    let code = util.getParameterByName("token");
    if (code) {
      cookies.set("isZjuLogin", true);
      this.$store.dispatch("LoginSSO", code).then(() => {
        this.$router.push("/home");
        // location.href = "/home";
      });
    }
  },
};
</script>
