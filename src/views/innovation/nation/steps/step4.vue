<template>
<div class="app-container">
 <results :nf="queryParams.nf" ref='details' :xmmc="queryParams.xmmc" :xmejlb="queryParams.xmejlb" type='admin' /> 
</div> 
</template>

<script>
import results from '@/views/jxStuProject/results'
import ProjectApi from "@/api/jxStuProject";
import {downloadFile} from '@/utils/index'
export default {
    components:{results},
    data() {
      return {
        queryParams:{
          nf:null,
          xmmc:undefined,
          xmejlb:null,
        },
        nfList:[],
      } 
    },
    created(){
      this.init()
    },
    methods:{
     async init(){
        let xmlx = 1
        let _path = this.$route.path
        if(_path.indexOf('nation')>-1)xmlx = 1
        else if(_path.indexOf('province')>-1)xmlx=2
        else if(_path.indexOf('kysj')>-1)xmlx=3
        else xmlx=4
         
        if(_path.indexOf('academy')>-1)this.queryParams.xmejlb=42
        else if(_path.indexOf('school')>-1)this.queryParams.xmejlb=41
        //获取期次列表
      
      await ProjectApi.projectQcList({xmlx}).then(res=>{
          this.nfList = res.data
          this.queryParams.nf = this.queryParams.nf||res.data[0].id
          console.log(this.queryParams.nf,'this.queryParams.nf');
        })
      },
    handleQuery(){
         this.$refs.details.close(true);
      }
    },
}
</script>