<template>
    <div style="display:inline-block;margin-right:8px;">
        <el-button size='mini' v-if="id" type='primary' @click="xq">查看</el-button>
        <!-- <el-button type="primary" v-else @click="show=true">新增成果</el-button> -->

        <el-dialog :visible.sync="show" :title="title+'知识产权'" width="800" append-to-body>
            <el-form :model="form" ref="ruleForm" label-width="170px">
                <el-form-item label="选择项目" prop="xmid" :rules="[{ required: true, message: '请选择项目', trigger: 'blur' }]">
                    <el-select v-model="form.xmid" placeholder="请选择项目" :disabled='!!id'>
                        <el-option v-for="item in options" :key="item.id" :label="item.xiangmumc" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="其它类知识产权" prop="qtl" :rules="[{ required: true, message: '请输入其它类知识产权', trigger: 'blur' }]">
                    <el-input v-model="form.qtl" type="textarea" :disabled='!!id'></el-input>
                    <small>实物、模型、设计、网站等</small>
                </el-form-item>
                <el-form-item label="附件上传" prop="fjurl" :rules="[{ required: true, message: '请上传附件', trigger: 'blur' }]">
                    <template v-if="!id">
                        <el-upload action="/" :http-request="beforeUpload" :disabled='loading' :show-file-list='false'>
                            <el-button size="small" type="primary">上传</el-button>
                        </el-upload>
                        <div>
                            <span v-if="form.filename">{{form.filename}}</span>
                        </div>
                    </template>
                    <template v-else>
                        <a :href="form.fjurl" target="_blank">{{form.filename}}</a>
                    </template>
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
import network from '@/api/results'

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
            network.jjxyCqXq({id: this.id, cglb: 8}).then(res=>{
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
                // cglb 7经济效益 8其他类知识产权
                network.addJjxyCq({id:this.form.xmid,cglb:8,...this.form}).then(res=>{
                    this.msgSuccess('保存成功')
                    this.show = false
                    this.close && this.close(true)
                 this.resetform()
                })
            });
        },
        resetform(){
            this.$refs['ruleForm'].resetFields()
            this.form={}
        },
        qvxiao(){
            this.resetform()
            this.show = false
        },
        //上传结题报告
        async beforeUpload(file) {
            file = file.file
            this.loading = true
            await cdn.upload({ file }).then(data => {
                this.loading = false
                this.$set(this.form, 'fjurl', data.location)
                this.$set(this.form, 'filename', file.name)
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