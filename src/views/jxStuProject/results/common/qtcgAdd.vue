<template>
    <div style="display:inline-block;margin-right:8px;">
        <el-button size='mini' v-if="id" type='primary' @click="xq">查看</el-button>
        <el-button type="primary" v-else @click="show=true">新增成果</el-button>

        <el-dialog :visible.sync="show" :title="title+'其他成果'" width="800" append-to-body>
            <el-form :model="form" ref="ruleForm" label-width="170px">
                <el-form-item label="选择项目" prop="xmid" :rules="[{ required: true, message: '请选择项目', trigger: 'blur' }]">
                    <el-select v-if="!id" v-model="form.xmid" placeholder="请选择项目" :disabled='!!id'>
                        <el-option v-for="item in options" :key="item.id" :label="item.xiangmumc" :value="item.id"></el-option>
                    </el-select>
                    <el-input v-else disabled v-model="form.xiangmumc"></el-input>
                </el-form-item>
                <el-form-item label="简单描述" prop="jianjie" :rules="[{ required: true, message: '请输入简单描述', trigger: 'blur' }]">
                    <el-input v-model="form.jianjie" maxlength="200" type="textarea" :disabled='!!id'></el-input>
                </el-form-item>
                <el-form-item v-if="!id" label="全文或照片上传" prop="fjurl" :rules="[{ required: true, message: '请上传全文或照片', trigger: 'blur' }]">
                    <el-upload action="/" :http-request="beforeUpload" :disabled='loading' :show-file-list='false'>
                        <el-button size="small" type="primary">上传</el-button>
                    </el-upload>
                    <div>
                        <span v-if="form.filename">{{form.filename}}</span>
                    </div>
                </el-form-item>
                <el-form-item v-if="!id" label="结题报告上传" prop="fjurl1" :rules="[{ required: true, message: '请上传结题报告', trigger: 'blur' }]">
                    <el-upload action="/" :http-request="beforeUpload1" :disabled='loading' :show-file-list='false'>
                        <el-button size="small" type="primary">上传</el-button>
                    </el-upload>
                    <div>
                        <span v-if="form.filename1">{{form.filename1}}</span>
                    </div>
                </el-form-item>
                <el-form-item v-if="id" label="附件" prop="fjurl1" :rules="[{ required: true, message: '请上传结题报告', trigger: 'blur' }]">
                    <p v-for="item,index in form.filelist" :key="index">
                        <a :href="item.realpath" target="_blank">{{item.filename}}</a>
                    </p>
                </el-form-item>
                <el-form-item >
                    <el-button @click="qvxiao()">取消</el-button>
                    <el-button type="primary" @click="submitForm('ruleForm')">确定</el-button>
                </el-form-item>

            </el-form>
        </el-dialog>

    </div>
</template>

<script>
import cdn from "@/components/JxFileUpload/spaceNotice";
import network from '@/api/jxStuProject/result'
export default {
    props: ['options', 'close', 'id'],
    data(){
        return{
            show: false,
            form: {},
            loading: false,
        }
    },
    computed:{
        title(){
            if(this.id){
                return `查看`
            }else{
                return `新增`
            }
        }
    },
    methods:{
        xq(){
            this.form = {}
            network.qtcgXq({id: this.id}).then(res=>{
                this.form = res && res.data || {}
                this.show = true
            })
        },
        submitForm(formName) {
            if(this.id){
                return this.show = false
            }
            this.$refs[formName].validate((valid) => {
                if (!valid)  return;
                let filelist = []
                filelist.push({
                    filename: this.form.filename,
                    realpath: this.form.fjurl
                })
                filelist.push({
                    filename: this.form.filename1,
                    realpath: this.form.fjurl1
                })

                network.addQtcg({
                    xmid: this.form.xmid,
                    jianjie: this.form.jianjie,
                    filelist
                }).then(res=>{
                    this.msgSuccess('保存成功')
                    this.show = false
                    this.close && this.close(true)
                    this.resetform()
               this.resetform()
                })
            });
        },
        resetform(){
            this.$refs['ruleForm'].resetFields()
            this.form={}
            this.form.filelist = []
        },
        qvxiao(){
            this.resetform()
            this.show = false
        },
        //上传全文或照片
        async beforeUpload(file) {
            file = file.file
            this.loading = true
            await cdn.upload({ file }).then(data => {
                this.loading = false
                this.$set(this.form, 'fjurl', data.location)
                this.$set(this.form, 'filename', file.name)
            });
        },
        //上传结题报告
        async beforeUpload1(file) {
            file = file.file
            this.loading = true
            await cdn.upload({ file }).then(data => {
                this.loading = false
                this.$set(this.form, 'fjurl1', data.location)
                this.$set(this.form, 'filename1', file.name)
            });
        },
    }
}
</script>

<style lang='scss' scoped>
a{
    color: -webkit-link;
}
</style>