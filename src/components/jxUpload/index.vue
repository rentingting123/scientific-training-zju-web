<template>
    <div @click="fileClick"> 
        <slot/>
        <slot name="tip"/>
        <input type="file" name="file"  style="display:none" @change="fileChange" :accept="accept"/>
    </div>
</template>
<script>
import cdn from "@/components/JxFileUpload/spaceNotice";
export default {
    props:['accept','change','uploaded','size'],
    methods:{
        fileClick(e){
           e.currentTarget.lastElementChild.click()
        },
        async fileChange(e){
            let file = e.currentTarget.files[0]
               if(this.size&&(file.size/1024/1024)>this.size){
                  return   this.msgError('文件大小不能超过'+this.size+'m')
                }
            if(this.uploaded){
             let ret = await cdn.upload({ file }).then(data=>{
                 return {url:data.location,file:file}
             })
             this.uploaded(ret)
            }
            this.change&&this.change(file)
        }
    }
}
</script>
<style>
.el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>