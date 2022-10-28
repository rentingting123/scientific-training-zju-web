<template>
    <div>
        <span @click="handleImport">
            <slot name='names'></slot>
            <slot>
                <el-button
                    type="info"
                    plain
                    icon="el-icon-upload2"
                    size="mini"
                >{{title}}</el-button>
            </slot>
        </span>

        <!-- 用户导入对话框 -->
        <el-dialog :title="titles" :visible.sync="open" width="400px" append-to-body>
            <el-upload
                ref="upload"
                :limit="1"
                :accept="accept"
                :headers="headers"
                :action="getUrl"
                :data='datas'
                :disabled="loading"
                :on-progress="handleFileUploadProgress"
                :on-success="handleFileSuccess"
                :auto-upload="false"
                drag
            >
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">
                    将文件拖到此处，或
                    <em>点击上传</em>
                </div>
                <div class="el-upload__tip" slot="tip">
                    <el-link type="info" class="downloadss" @click="importTemplate">下载模板</el-link>
                </div>
                <div class="el-upload__tip" style="color:red" slot="tip">
                    <slot name='upload'></slot>
                </div>
            </el-upload>
            
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitFileForm">确 定</el-button>
                <el-button @click="open = false">取 消</el-button>
            </div>
        </el-dialog>
           <el-dialog
      title="导入结果"
      :visible.sync="errordialog"
      width="500px"
     >
      <div  style="max-height: 500px;width: 100%;overflow-y: auto;" v-html="result">{{}}</div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="errordialog = false">取 消</el-button>
        <el-button type="primary" @click="errordialog = false">确 定</el-button>
      </span>
    </el-dialog>
    </div>
</template>

<script>
import { getToken } from "@/utils/auth";
import {jxDownload} from "@/utils/ruoyi"
export default {
    props: {
        // 上传的接口路径
        url:{
            required: true,
            type: String
        },
        // 导入按钮标题
        title: {
            required: false,
            default: '导入',
            type: String
        },
        // 弹出层标题（用户导入）
        titles: {
            required: false,
            default: '导入',
            type: String
        },
        // 上传接口数据
        datas:{
            required: false,
            default: function(){
                return {}
            },
            type: [Object, Array]
        },
        // 上传接受类型
        accept:{
            required: false,
            default: '.xlsx,.xls',
            type: String
        },
        // 
        download:{
            required: false,
            default: '',
            type: String
        },
        close:{
            required: false,
            type: Function
        },
        disabled:{
            required: false,
            type: Boolean,
            default: false
        }
    },
    data(){
        return{
            result:'',
            errordialog:false,
            // 是否禁用上传
            loading: false,
            // 设置上传的请求头部
            headers: { Authorization: "Bearer " + getToken() },
            // 是否显示弹出层（用户导入）
            open: false,
        }
    },
    computed:{
        getUrl(){
            return process.env.VUE_APP_BASE_API + this.url
        }
    },
    methods:{
        
        /** 导入按钮操作 */
        handleImport() {
            if(this.disabled) return;
            this.open = true;
        },
        // 文件上传中处理
        handleFileUploadProgress(event, file, fileList) {
            this.loading = true;
        },
        // 文件上传成功处理
        handleFileSuccess(response, file, fileList) {
            this.open = false;
            this.loading = false;
            this.$refs.upload.clearFiles();
            this.close && this.close();
            this.result = response.msg
            this.errordialog = true
            // this.$alert(response.msg, "导入结果", { dangerouslyUseHTMLString: true });
        },
        // 提交上传文件
        submitFileForm() {
            this.$refs.upload.submit();
        },
        /** 下载模板操作 */
        importTemplate() {
            if(!this.download) return;
            jxDownload(this.download)
        },
    }
}
</script>

<style lang='scss' scoped>
.downloadss{
    font-size: 18px;
    color: -webkit-link;
}
</style>