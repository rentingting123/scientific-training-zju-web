<template>
  <div>
       <el-form
        ref="elForm"
        :model="formData"
        :rules="rules"
        size="medium"
        label-width="150px"
      >
        <el-form-item label="项目类别" prop="sbxmlbarr">
          <el-checkbox-group v-model="formData.sbxmlbarr" :min="1" size="medium">
            <el-checkbox
              v-for="(item, index) in kyxmlbOptions"
              :key="index"
              :label="item.dictValue"
            
              >{{ item.dictLabel }}</el-checkbox
            >
          </el-checkbox-group>
        </el-form-item>
        <el-row :gutter="15">
          <el-col :span="24">
            <el-row
              v-for="(teacher, index) in formData.xmdsList"
              :key="teacher.id"
            >
              <el-col :span="12">
                <el-form-item
                   :rules="[
                      { required: true, message: '请输入参与导师'},
                    ]"
                  label-width="150px"
                  :label="
                    `${teacher.dslb == 1 ? '负责导师' : '参与老师(校内)'} 工号:`
                  "
                  :prop="'xmdsList.' + index + '.jgh'"
                >
                  <el-input
                    v-model="teacher.jgh"
                    @blur="getNameById(index)"
                    placeholder="请输入参与老师工号"
                    clearable
                    disabled
                    :style="{ width: '70%', 'margin-right': '10px' }"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item
                  label-width="150px"
                  :label="`姓名:`"
                  :prop="'xmdsList.' + index + '.dsxm'"
                >
                  <el-input
                    v-model="teacher.dsxm"
                    placeholder="姓名"
                    clearable
                    disabled
                    :style="{ width: '70%', 'margin-right': '10px' }"
                  ></el-input>
                  <el-button
                    v-if="teacher.dslb != 1"
                    @click.prevent="removeTeacher(index)"
                    >删除</el-button
                  >
                </el-form-item>
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="24">
            
          </el-col>
        </el-row>

        <el-row :gutter="15">
          <el-col :span="24">
            <el-row
              v-for="(student, index) in formData.xmxsList"
              :key="student.id"
            >
              <el-col :span="7">
                <el-form-item
                  label-width="150px"
                  :label="`${student.xslb == 1 ? '负责学生' : '参与学生 学号'}:`"
                  :prop="'xmxsList.' + index + '.xh'"
                >
                  <el-input
                   :disabled="true"
                    v-model="student.xh"
                    placeholder="学号"
                    @blur="getProjectByxh(index)"
                    clearable
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item
                  label-width="50px"
                  :label="`姓名:`"
                  :prop="'xmxsList.' + index + '.xsxm'"
                >
                  <el-input
                    v-model="student.xsxm"
                    disabled
                    placeholder="姓名"
                    clearable
                  ></el-input>
                </el-form-item>
              </el-col>

              <el-col :span="12">
                <el-form-item
                  label-width="100px"
                  :label="`往年项目:`"
                  :prop="'xmxsList.' + index + '.wnxm'"
                >
                  <el-input
                    v-model="student.wnxm"
                    type="textarea"
                    placeholder="往年项目"
                    :disabled="true"
                    :style="{ width: '70%', 'margin-right': '10px' }"
                  ></el-input>
                  <el-button
                    v-if="student.xslb != 1"
                    @click.prevent="removeStudent(index)"
                    >删除</el-button
                  >
                </el-form-item>
              </el-col>
            </el-row>
            
          </el-col>
        </el-row>

      </el-form>
       <div slot="footer" class="footer">
        <el-button @click="closed">取消</el-button>
        <el-button type="primary"  @click="submit()">确 定</el-button>
      </div>
  </div>
</template>

<script>
import ProjectApi from "@/api/jxStuProject";
// updataProject
export default {
    // changetype
    props:['id','sbxmle'],
    created(){
        this.getList()
         if(!this.id){
       ProjectApi.checksbjy().then(res => {
         this.checkList = res.data
      })
     }
         this.getDicts("sc_category").then(response => {
      response.data.forEach(item => {
        if(item.dictValue == "12"){
          item.sbjy = 1
        }else if(item.dictValue == "22"){
          item.sbjy = 2
        }else if(item.dictValue == "41"){
          item.sbjy = 4
        }else if(item.dictValue == "42"){
          item.sbjy = 5
        }
      })
      this.kyxmlbOptions = response.data;
    });
    },
    mounted(){
       this.$nextTick(function() {
            this.$on('getList', function() {
                this.getList()
            });
        });
    },
    data(){
        return{
          
             maxTeacer:0,
            maxStudent:0,
            formData:{
                xmdsList:[],
                xmxsList:[],
                sbxmlbarr:[],
            },
            rules:{},
            checkList:[],
            kyxmlbOptions: [],
        }
    },
    methods:{
      getList(){
          let params = {}
        params.id = this.id
        params.sbxmle = this.sbxmle
        ProjectApi.getProjectById(params).then(res=>{
          this.formData.xmdsList = res.data.xmdsList  
           this.formData.xmxsList  = res.data.xmxsList
           this.formData.sbxmlbarr = res.data.sbxmlb.split(',')
        })
        },
      closed(){
        this.$emit("show",false)
      },
      submit(){
         this.$refs["elForm"].validate(valid => {
          if (!valid) return;
          let updataleval = {}
            updataleval.id = this.id
            updataleval.sbxmlb = this.formData.sbxmlbarr.join(',')
          ProjectApi.updataProject(updataleval).then(res => {
            // console.log(res);
            if(res.code == 200){
              this.closed()
            }
          })
          })
        
      }
    }
}
</script>

<style>
.footer{
  width: 100%;
  text-align: center;
}
</style>