<template>
  <div class="app-container">
    <div style="margin-top:-10px;margin-bottom:15px;">项目申报流程</div>
    <ProjectPipe />
    <div class="btnGroup">
       <h3 class='btnTitle'>科研训练类</h3>
       <div class="btn">
       <type1  :disable="newArr.length>0" 

         v-hasPermi="['xm:student:add']" />
       </div>
       <div class="btn">
        <type2 :disable="checkList.includes(1)"/>
        <type3 :disable="checkList.includes(1)"/>
       </div>
        <div class="btn">
         <type4 :disable="checkList.includes(2)"/>
         <type5 :disable="checkList.includes(2)"/>
       </div>
       <h3 class='btnTitle'>科研实践类</h3>
      <div class="btn">
       <type6 :disable="checkList.includes(3)" v-hasPermi="['xm:student:add']" />
      </div>
    </div>
  </div>
</template>

<script>
import type1 from './types/type1.vue'
import type2 from './types/type2.vue'
import type3 from './types/type3.vue'
import type4 from './types/type4.vue'
import type5 from './types/type5.vue'
import type6 from './types/type6.vue'
import ProjectPipe from "@/components/projectPipe";
import ProjectApi from "@/api/jxStuProject";
export default {
  components:{type1,type2,type3,type4,type5,type6,ProjectPipe},
  data() {
    return {
      checkList:[],
      newArr:[],
    };
  },
  created(){
    this.getList()
  },
  methods:{
    getList(){
       ProjectApi.checksbjy().then(res => {
         let arr = res.data
         this.newArr = arr.filter(function(val,index,arr){
        	return val != 3
        })
         this.checkList = res.data
      })
    }
  }
};
</script>

<style lang="scss" >

.btnGroup{
   justify-content: center;
   align-items: center;
   display: flex;
   flex-direction: column;
   .btnTitle{
    width: 630px;
    margin-top: 10px;

   }
   .btn{
     margin-top:18px;
     width: 630px;
     display: flex;
     justify-content: space-between;
   }

}
</style>
