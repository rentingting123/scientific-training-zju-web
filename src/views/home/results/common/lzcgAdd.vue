<template>
    <div style="display:inline-block;margin-right:8px;">
        <el-button size='mini' v-if="id" type='primary' @click="xq">查看</el-button>
        <!-- <el-button type="primary" v-else @click="show=true">新增成果</el-button> -->

        <el-dialog :visible.sync="show" :title="title+'论著成果'" width="800" append-to-body>
            <el-form :model="form" ref="ruleForm" label-width="160px">
                <el-form-item label="选择项目" prop="xmid" :rules="[{ required: true, message: '请选择项目', trigger: 'blur' }]">
                    <el-select v-model="form.xmid" placeholder="请选择项目" :disabled='!!id'>
                        <el-option v-for="item in options" :key="item.id" :label="item.xiangmumc" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="论著名称" prop="lunzhumc" :rules="[{ required: true, message: '请输入论著名称', trigger: 'blur' }]">
                    <el-input v-model="form.lunzhumc" :maxlength="50" show-word-limit :disabled='!!id'></el-input>
                </el-form-item>
                <el-form-item label="主要作者" prop="zuozhe" :rules="[{ required: true, message: '请输入主要作者', trigger: 'blur' }]">
                    <el-input v-model="form.zuozhe" :maxlength="50" show-word-limit :disabled='!!id'></el-input>
                </el-form-item>
                <el-form-item label="出版时间" prop="chubansj" :rules="[{ required: true, message: '请选择出版时间', trigger: 'blur' }]">
                    <el-date-picker 
                        v-model="form.chubansj" 
                        align="right" 
                        type="date" 
                        placeholder="选择日期"
                        value-format='yyyy-MM-dd'
                        :disabled='!!id'
                        :picker-options="pickerOptions">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="字数（万字）" prop="zishu" :rules="[{ required: true, message: '请输入字数', trigger: 'blur' },{max: 20, message: '字数不能超过20个字符', trigger: 'blur'}]">
                    <el-input v-model="form.zishu" :maxlength="20" show-word-limit type="textarea" :disabled='!!id' ></el-input>
                </el-form-item>
                <el-form-item label="出版社" prop="chubanshe" :rules="[{ required: true, message: '请输入出版社', trigger: 'blur' },{max: 20, message: '字数不能超过20个字符', trigger: 'blur'}]">
                    <el-input v-model="form.chubanshe" :maxlength="20" show-word-limit type="textarea" :disabled='!!id'></el-input>
                </el-form-item>
                <el-form-item label="论著封面扫描上传" prop="fjurl" :rules="[{ required: true, message: '请上传论著封面', trigger: 'blur' }]">
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
                    <el-button @click="dontshow('ruleForm')">取消</el-button>
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
            pickerOptions: {
                disabledDate(time) {
                    return time.getTime() > Date.now();
                },
                shortcuts: [{
                    text: '今天',
                    onClick(picker) {
                    picker.$emit('pick', new Date());
                    }
                }, {
                    text: '昨天',
                    onClick(picker) {
                    const date = new Date();
                    date.setTime(date.getTime() - 3600 * 1000 * 24);
                    picker.$emit('pick', date);
                    }
                }, {
                    text: '一周前',
                    onClick(picker) {
                    const date = new Date();
                    date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
                    picker.$emit('pick', date);
                    }
                }]
            },
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
        dontshow(formName){
            this.show=false
            this.resetform()
        },
        xq(){
            this.form = {}
            network.lzcgXq({id: this.id}).then(res=>{
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
                network.addLzcg({...this.form}).then(res=>{
                    this.msgSuccess('保存成功')
                    this.show = false
                    this.close && this.close(true)
                this.resetform()
                })
            });
        },
        resetform(){
            this.$refs['ruleForm'].resetFields()
            this.form.filename = ''
            this.form.fjurl=''
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