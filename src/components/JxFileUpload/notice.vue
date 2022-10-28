<template>
    <div class="el-el-upload">
        <el-upload
            :class="className"
            :disabled="disabled"
            :drag="drag"
            :beforeUpload="beforeUpload"
            :before-remove="beforeRemove"
            :on-remove="remove"
            :file-list="files"
            :on-success='success'
            :show-file-list="showlist"
            :http-request = 'OssUpload'
            :accept='accept'
            :list-type ='listType'
            :on-preview="onPreview"
            :limit="limit"
            action='/'
            multiple>
            <slot></slot>
        </el-upload>
        <div class="progress" v-if="loading">
            <el-progress type="circle" :percentage="persent" :show-text="false"></el-progress>
           <p class="filename">{{filename}}</p>
        </div>

        <slot name='notice'></slot>
    </div>

</template>

<script>

import OSS from './ossUpload';
import {cloneDeep} from 'lodash'
function beforeRemoveDefault(file,fileList){}
function beforeUploadReturn(file){}

export default {
    props:{
        className:String,
        limit:{type:Number,default:20},
        onPreview:{
            type:Function,
            default:()=>{},
        },
        type:String,
        fileList:{
            type:Array,
            default:()=>([]),
        },
        onError:Function,
        onSuccess:Function,
        onRemove:Function,
        listType:String,
        showlist:{
            default:()=>(true),
            type :Boolean
        },
        beforeUpload:{
            default:beforeUploadReturn,
            type:Function
        },
        config:{
            default:()=>({}),
            type:Object
        },
        disabled:{
            default:()=>(false),
            type:Boolean
        },
        accept:String,
        drag:Boolean,
        fileKey:String,
        beforeRemove:{
            type:Function,
            default:beforeRemoveDefault
        }
    },
    data(){
        return{
            files:this.fileList.length>0 ?cloneDeep(this.fileList):[],
            persent:0,
            filename:'',
            loading:false,
            count:0
        }
    },
    //OSS.upload file callback(err,ret) progross(p)
    //OSS.delete key
    //OSS.remuse    
    methods:{
        success(res,file,list){
            // console.log(file)
        },
        progress(){
            this.count = 50;
            const h = this.$createElement;
            this.$notify({
                message: h('div', [
                    h('p',{ref:'fileName'}),
                    h('p',{ref:'success'}),
                    h('div', {style:{width:'4px',height:'5px',background:'#87D068',borderRadius:'5px'},ref:'lines'}),
                    
                ] ),
                showClose: false,
                duration: 0
            });
        },
        OssUpload(_file){
            this.progress()
       // console.log(file)
            let file = _file.file
            this.persent = 0;
            this.loading = true
            this.filename = file.name
            this.$refs.fileName.innerHTML = file.name
            OSS.upload(file,(res,ret)=>{
                this.count = 100
                this.loading = false
                if(res){
                    this.$refs.success.innerHTML = '上传失败'
                    return this.onError&&this.onError(res)
                } 
                  this.files.push({
                    name:file.name,
                    url:ret.location,
                    fileKey:ret.name
                         })
                if(this.onSuccess)this.onSuccess(ret,file,this.files)
            },(p)=>{
                this.persent = parseInt(p * 100)
                this.$refs.lines.style.width = this.persent + '%'
                if(p>=1){
                    this.$refs.success.innerHTML = '上传成功'
                    
                    setTimeout(() => {
                        this.$notify.closeAll()
                    },2000)
                    
                }
            },this.config)
            //return false
        },

        remove(file,fileList){
            if(file.fileKey)OSS.delete(file.fileKey)
            this.files = this.files.filter(_f=>_f.fileKey != file.fileKey)   
            this.onRemove&&this.onRemove(file,this.files,fileList)
        }
    },
    watch:{
        fileList(value){
            this.files = cloneDeep(value)
        }
    }
}
</script>

<style lang="scss">
.el-el-upload{
    position: relative;
    width: 360px;
    height: auto;
    // margin: 0 auto;
    margin-top: 10px;
    .progress{
        width: 100%;
        height: 180px;
        background: rgba(0,0,0,0.5);
        position: absolute !important;
        top: 0;
        left: 0;
        z-index: 200;
        .el-progress{
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translateX(-50%) translateY(-50%);
        }
    }
    .filename{
        width: 100%;
        text-align: center;
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        left: 0;
        // line-height: 180px;
        color: #ffffff;
        font-size: 16px;
    }
    .top {
        padding-top: 40px;
    }

}
.el-notification__content{
    width: 280px;
}
</style>

