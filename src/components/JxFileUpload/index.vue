<template>
    <div class="el-el-upload" :style="{width:`${width || '360px'}`,height:`${height||'auto'}`}">
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
            :on-exceed='onExceed'
            :list-type ='listType'
            :on-preview="onPreview"
            :limit="limit"
            action='/'
            :multiple='multiple'>
            <slot></slot>
        </el-upload>
        <div class="progress" :style="{width:`${width || '100%'}`,height:`${height||'180px'}`}" v-if="loading">
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
        width:String,
        height:String,
        className:String,
        limit:{type:Number,default:20},
        onPreview:{
            type:Function,
            default:()=>{},
        },
        onExceed: {
            type: Function,
            default: () => {}
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
        multiple:{
            default:()=>(true),
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
            loading:false
        }
    },
    //OSS.upload file callback(err,ret) progross(p)
    //OSS.delete key
    //OSS.remuse
    methods:{
        success(res,file,list){
            // console.log(file)
        },
        OssUpload(_file){
       // console.log(file)
            let file = _file.file
            this.persent = 0;
            this.loading = true
            this.filename = file.name
            OSS.upload(file,(res,ret)=>{
                this.loading = false
                if(res) return this.onError&&this.onError(res)
                  this.files.push({
                    name:file.name,
                    url:ret.location,
                    fileKey:ret.name
                         })
                if(this.onSuccess)this.onSuccess(ret,file,this.files)

            },(p)=>{
                this.persent = parseInt(p * 100)
            },this.config)
            //return false
        },

        remove(file,fileList){

            // if(file.fileKey)OSS.delete(file.fileKey)
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


<style lang="scss" scoped>
.el-el-upload{
    position: relative;
    // margin: 0 auto;
    margin-top: 10px;
    .progress{
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
</style>
