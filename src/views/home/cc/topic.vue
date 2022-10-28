<template>
  <div>
    <el-button type="primary" @click="dialogVisible = true">立项申报</el-button>
    <el-dialog width="550px" :visible.sync="dialogVisible"  @open="onOpen" @close="onClose" title="填写项目申报信息">
      <el-row :gutter="15">
        <el-form ref="elForm" :model="formData" :rules="rules" size="medium" label-width="100px">
          <el-col :span="24">
            <el-form-item label="姓名" prop="nickName">
              <el-input v-model="formData.nickName" placeholder="请输入姓名" clearable :style="{width: '100%'}">
              </el-input>
            </el-form-item>
          </el-col>
              <el-col :span="24">
            <el-form-item label="教师编号" prop="userId">
              <el-input v-model="formData.userId" placeholder="请输入教师编号" clearable :style="{width: '100%'}">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="所在学院(系)" prop="organization">
              <el-input v-model="formData.organization" placeholder="请输入所在学院(系)" clearable
                :style="{width: '100%'}"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="联系方式" prop="contact">
              <el-input v-model="formData.contact" placeholder="请输入联系方式" clearable :style="{width: '100%'}">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="岗位" prop="post">
              <el-input v-model="formData.post" placeholder="请输入岗位" clearable :style="{width: '100%'}">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="职称" prop="title">
              <el-input v-model="formData.title" placeholder="请输入职称" clearable :style="{width: '100%'}">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="申报材料" prop="file">
                   <upload  :size='5' 
                     :uploaded="uploadFile">
                      <el-tag
                        :key="tag.url"
                        v-for="(tag,index) in fileList"
                        closable
                        style="margin-right:10px"
                        :disable-transitions="false"
                        @close="fileClose(tag,index)">
                        {{tag.name}}
                    </el-tag>
              <el-button size="small" type="primary" icon="el-icon-upload">点击上传</el-button>
            </upload>
            </el-form-item>
          </el-col>
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
import upload from "@/components/jxUpload";
import network from "@/api/jxNotice/cc"
export default {
  inheritAttrs: false,
  components: {upload},
  props: ['competitionId'],
  data() {
    return {
        fileList:[],
        dialogVisible:false,
      formData: {
        nickName: undefined,
        userId:undefined,
        organization: undefined,
        contact: undefined,
        post: undefined,
        title: undefined,
        file: null,
        projectCompetitionId:'',
      },
      rules: {
        nickName: [{
          required: true,
          message: '请输入姓名',
          trigger: 'blur'
        }],
        userId: [{
          required: true,
          message: '请输入教师编号',
          trigger: 'blur'
        }],
        organization: [],
        contact: [{
          required: true,
          message: '请输入联系方式',
          trigger: 'blur'
        }],
        post: [{
          required: true,
          message: '请输入岗位',
          trigger: 'blur'
        }],
        title: [{
          required: true,
          message: '请输入职称',
          trigger: 'blur'
        }],
        file:[{
          required: true,
          message: '请填写申报材料',
          trigger: 'blur'
        }],
      },
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    onOpen() {},
    onClose() {
      this.$refs['elForm'].resetFields()
    },
    close() {
      this.dialogVisible=false
    },
     uploadFile(ret){
        this.fileList.push({
            url:ret.url,
            name:ret.file.name,
            size:ret.file.size
        })
        this.formData.file = this.fileList
    },
      //删除文件
      fileClose(file,index){
          this.fileList.splice(index,1)
      },
    handelConfirm() {
      this.$refs['elForm'].validate(valid => {
        if (!valid) return
        this.formData.projectCompetitionId=this.competitionId
        network.ccTopic(this.formData).then(data=>{
            this.msgSuccess(data.msg)
            this.close()
        })
        //
      })
    },
  }
}

</script>
<style>
.el-upload__tip {
  line-height: 1.2;
}

</style>
