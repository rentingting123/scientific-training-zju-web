<template>
    <div style="display:inline-block;margin-right:8px;">
        <el-button size='mini' v-if="id" type='primary' @click="xq">查看</el-button>
        <el-button type="primary" v-else @click="show=true">新增成果</el-button>

        <el-dialog :visible.sync="show" :title="title+'专利成果'" width="800" append-to-body>
            <el-form :model="form" ref="ruleForm" label-width="170px">
                <el-form-item label="选择项目" prop="xmid" :rules="[{ required: true, message: '请选择项目', trigger: 'blur' }]">
                    <el-select v-if="!id" v-model="form.xmid" placeholder="请选择项目" :disabled='!!id'>
                        <el-option v-for="item in options" :key="item.id" :label="item.xiangmumc" :value="item.id"></el-option>
                    </el-select>
                    <el-input v-else disabled v-model="form.xiangmumc"></el-input>
                </el-form-item>
                <el-form-item label="专利类别" prop="zllb" :rules="[{ required: true, message: '请选择专利类别', trigger: 'blur' }]">
                    <el-select v-model="form.zllb" placeholder="请选择专利类别" :disabled='!!id'>
                        <el-option label="发明专利" value="1"></el-option>
                        <el-option label="实用新型专利" value="2"></el-option>
                        <el-option label="外观设计专利" value="3"></el-option>
                        <el-option label="软件著作权" value="4"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="第一作者是否是本科生" prop="sfbks" :rules="[{ required: true, message: '请选择', trigger: 'blur' }]">
                    <el-select v-model="form.sfbks" placeholder="请选择专利类别" :disabled='!!id'>
                        <el-option label="是" value="1"></el-option>
                        <el-option label="否" value="0"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="专利名称" prop="zhuanlimc" :rules="[{ required: true, message: '请输入专利名称', trigger: 'blur' }]">
                    <el-input v-model="form.zhuanlimc" :disabled='!!id'></el-input>
                </el-form-item>
                <el-form-item label="申请人或专利权人" prop="shenqingr" :rules="[{ required: true, message: '请输入申请人或专利权人', trigger: 'blur' }]">
                    <el-input v-model="form.shenqingr" :disabled='!!id'></el-input>
                </el-form-item>
                <el-form-item label="发明人" prop="famingr" :rules="[{ required: true, message: '请输入发明人', trigger: 'blur' }]">
                    <el-input v-model="form.famingr" :disabled='!!id'></el-input>
                </el-form-item>
                <el-form-item label="申请号或授权号" prop="shenqingh" :rules="[{ required: true, message: '请输入申请号或授权号', trigger: 'blur' }]">
                    <el-input v-model="form.shenqingh" :disabled='!!id'></el-input>
                </el-form-item>
                <el-form-item label="专利国别" prop="zhuanligb" :rules="[{ required: true, message: '请输入专利国别', trigger: 'blur' }]">
                    <el-input v-model="form.zhuanligb" :disabled='!!id'></el-input>
                </el-form-item>
                <el-form-item label="申请日" prop="shenqingrq" :rules="[{ required: true, message: '请选择申请日', trigger: 'blur' }]">
                    <el-date-picker 
                        v-model="form.shenqingrq" 
                        align="right" 
                        type="date" 
                        placeholder="选择日期"
                        value-format='yyyy-MM-dd'
                        :disabled='!!id'
                        :picker-options="pickerOptions">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="授权日" prop="shouquanrq" :rules="[{ required: true, message: '请选择授权日', trigger: 'blur' }]">
                    <el-date-picker 
                        v-model="form.shouquanrq" 
                        align="right" 
                        type="date" 
                        placeholder="选择日期"
                        value-format='yyyy-MM-dd'
                        :disabled='!!id'
                        :picker-options="pickerOptions">
                    </el-date-picker>
                </el-form-item>
                
                <el-form-item label="证书扫描上传" prop="fjurl" :rules="[{ required: true, message: '请上传证书', trigger: 'blur' }]">
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
import network from '@/api/jxStuProject/result'
export default {
    props: ['options', 'close', 'id'],
    data(){
        return{
            show: false,
            form: {
                zllb: "1",
                sfbks: "1",
            },
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
        xq(){
            this.form = {}
            network.zlcgXq({id: this.id}).then(res=>{
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
                network.addZlcg({...this.form}).then(res=>{
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
            this.form.zllb = "1"
            this.form.sfbks = "1"
        },
        qvxiao(){
            this.resetform()
            this.show=false
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