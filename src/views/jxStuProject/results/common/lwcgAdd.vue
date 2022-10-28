<template>
    <div style="display:inline-block;margin-right:8px;">
        <el-button size='mini' v-if="id" type='primary' @click="xq">查看</el-button>
        <el-button type="primary" v-else @click="show=true">新增成果</el-button>

        <el-dialog :visible.sync="show" :title="title+'论文成果'" width="800" append-to-body>
            <el-form :model="form" ref="ruleForm" label-width="160px">
                <el-form-item label="选择项目" prop="xmid" :rules="[{ required: true, message: '请选择项目', trigger: 'blur' }]">
                    <el-select v-if="!id" v-model="form.xmid" placeholder="请选择项目" :disabled='!!id'>
                        <el-option v-for="item in options" :key="item.id" :label="item.xiangmumc" :value="item.id"></el-option>
                    </el-select>
                    <el-input v-else disabled v-model="form.xiangmumc"></el-input>
                </el-form-item>
                <el-form-item label="主要作者" prop="zuozhe" :rules="[{ required: true, message: '请输入主要作者', trigger: 'blur' }]">
                    <el-input v-model="form.zuozhe" type="textarea" maxlength="128"   :disabled='!!id'></el-input>
                </el-form-item>
                <el-form-item label="论文名称" prop="lunwenmc" :rules="[{ required: true, message: '请输入论文名称', trigger: 'blur' }]">
                    <el-input v-model="form.lunwenmc" type="textarea" maxlength="200" :disabled='!!id'></el-input>
                </el-form-item>
                <el-form-item label="期刊名称﹑年﹑卷﹑期﹑页或论文集名称出版社﹑页" prop="qikanwenji" :rules="[{ required: true, message: '请输入期刊名称﹑年﹑卷﹑期﹑页或论文集名称出版社﹑页', trigger: 'blur' }]">
                    <el-input v-model="form.qikanwenji" type="textarea" rows='4' maxlength="500"   :disabled='!!id'></el-input>
                    <span v-if="form.qikanwenji==undefined">注：必须填期刊号</span>
                </el-form-item>
                
                <el-form-item label="论文被引用情况或三大索引收录情况" prop="shouluqk" :rules="[{ required: true, message: '请输入论文被引用情况或三大索引收录情况', trigger: 'blur' }]">
                    <el-input v-model="form.shouluqk" type="textarea" rows='4'  maxlength="500"  :disabled='!!id'></el-input>
                </el-form-item>
                <el-form-item label="论文类别" >
                    <el-checkbox v-model="form.guowaizykw" true-label='1' false-label='null'  :disabled='!!id'>国外重要刊物</el-checkbox>
                    <el-checkbox v-model="form.guoneizykw" true-label='1' false-label='null'  :disabled='!!id'>国内重要刊物</el-checkbox>
                    <el-checkbox v-model="form.guowailw" true-label='1' false-label='null'  :disabled='!!id'>国外学术会议论文</el-checkbox>
                    <el-checkbox v-model="form.guoneilw" true-label='1' false-label='null'  :disabled='!!id'>国内学术会议论文</el-checkbox>
                    <el-checkbox v-model="form.qitakw" true-label='1' false-label='null'  :disabled='!!id'>其他刊物</el-checkbox>
                </el-form-item>
                <el-form-item label="论文全文上传" prop="fjurl" :rules="[{ required: true, message: '请上传论文', trigger: 'blur' }]">
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
                    <el-button @click="qvxiao">取消</el-button>
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
                xmid:undefined,
                zuozhe:undefined,
                lunwenmc:undefined,
                qikanwenji:undefined,
                shouluqk:undefined,
                fjurl:undefined,
                guowaizykw:undefined,
                guoneizykw:undefined,
                guoneilw:undefined,
                guowailw:undefined,
                qitakw:undefined,
                fjurl:undefined,
            },
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
            network.docxq({id: this.id}).then(res=>{
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
                network.adddoc({...this.form}).then(res=>{
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