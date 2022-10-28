<template>
  <div class="editor">
    <quill-editor class="ql-editor" v-model="stateData1" :ref="index" :options="editorOption"></quill-editor>

    <!-- 图片点击上传 -->
    <upload accept=".jpg, .png, .gif, .jpeg" :onSuccess="success" :showlist="false" :config="{fileType:2}" class="upload">
      <el-button size="small" type="primary" :id="`${index}imglink`" style="display:none">图片点击上传</el-button>
    </upload>
    <!-- 万能点击上传 -->
    <upload :onSuccess="success" :showlist="false" :config="{fileType:2}" class="upload">
      <el-button size="small" type="primary" :id="`${index}videolink`" style="display:none">万能点击上传</el-button>
    </upload>
    <!-- pdf点击上传 -->
    <upload accept='.pdf' :onSuccess="success" :showlist="false" :config="{fileType:2}" class="upload">
      <el-button size="small" type="primary" :id="`${index}pdflink`" style="display:none">pdf点击上传</el-button>
    </upload>
    <!-- 视频点击上传 -->
    <upload accept='.mp4, .mp3' :onSuccess="success" :showlist="false" :config="{fileType:2}" class="upload">
      <el-button size="small" type="primary" :id="`${index}MP4link`" style="display:none">视频点击上传</el-button>
    </upload>

  </div>
</template>

<script>
import upload from '@/components/JxFileUpload/index'
import util from '@/utils/jxUtil'

import quillConfig from './quill-config.js'

export default {
props:{
    stateData:String,
    setDate:Function,
    fileKey:{
      default:'editFile',
      type:String,
    }
},
computed:{
    stateData1:{
        get(){
            return this.stateData
        },
        set(val){
            return this.setDate&&this.setDate(val)
        }
    }
},
components:{
    upload
},
  data() {
    return {
      editorOption: quillConfig,
      index:util.randomChar(10),
    }
  },
  mounted() {
    quillConfig.initButton();
    // 为图片ICON绑定事件 getModule 为编辑器的内部属性
    this.$refs[this.index].quill.getModule("toolbar").addHandler("image", this.imgHandler.bind(this,['image','img']));
    this.$refs[this.index].quill.getModule('toolbar').addHandler('sourceEditor', this.imgHandler.bind(this,['sourceEditor','video']))  // 为视频ICON绑定事件
    this.$refs[this.index].quill.getModule('toolbar').addHandler('pdfEditor', this.imgHandler.bind(this,['pdfEditor','pdf']))  // 为pdf绑定事件
    this.$refs[this.index].quill.getModule('toolbar').addHandler('video', this.imgHandler.bind(this,['video','MP4']))  // 为mp4绑定事件
  },
  methods: {
    imgHandler([imgHandler, type], state) {
      this.addRange = this.$refs[this.index].quill.getSelection();
      if (state) {
        const fileInput = document.getElementById(`${this.index}${type}link`);
        fileInput.click(); // 加一个触发事件
      }
      this.uploadType = imgHandler;
    },
    
    success(e, file, fileList) {
      this.fullscreenLoading = false;
      let url = e.location;
      if (url != null && url.length > 0) {
        // 将文件上传后的URL地址插入到编辑器文本中
        let value = url;
        let quill = this.$refs[this.index].quill
        let length = quill.getSelection().index || 0;

        this.addRange = this.$refs[this.index].quill.getSelection();
        value = value.indexOf("http") !== -1 ? value : "http:" + value;
        if(this.uploadType==="image"){
          quill.insertEmbed(length, this.uploadType, value, "image"); // 调用编辑器的 insertEmbed 方法，插入URL
          quill.setSelection(length + 1) //焦点定位
        }else if(this.uploadType === "sourceEditor"){
          let fileNameLength = file.name.length
          quill.insertEmbed(length, 'link', {href:value, innerText:file.name}, "api")
          quill.setSelection(length + fileNameLength)
        }else if(this.uploadType === "pdfEditor"){
          let id = util.randomChar(6)
          quill.insertEmbed(length,"pdf",{src:value,id: id}, "api"); // 调用编辑器的 insertEmbed 方法，插入URL
          quill.setSelection(length + 2)
        }else if(this.uploadType === "video"){
          let id = util.randomChar(6)
          quill.insertEmbed(length,"video",{src:value,id: id}, "api"); // 调用编辑器的 insertEmbed 方法，插入URL
          quill.setSelection(length + 1)
        }
      }
    //   this.$refs["upload"].clearFiles(); // 插入成功后清除input的内容
    }
  }
};
</script>

<style lang="scss" scoped>
.editor{
  position: relative;
  height: calc(100vh - 52px);
  overflow: hidden;
}
.upload{
    position: absolute;
    font-size: 0px;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
}

</style>
<style lang="scss">
.ql-editor{
  font-family: "PingFang SC", "Source Han Sans", "Microsoft Yahei", "Heiti SC";
  
  .ql-toolbar{
    font-family: "PingFang SC", "Source Han Sans", "Microsoft Yahei", "Heiti SC";
  }
  .ql-container{
    height: calc(100vh - 52px - 120px);
    overflow: auto;
    font-family: "PingFang SC", "Source Han Sans", "Microsoft Yahei", "Heiti SC";
  }
}
.ql-sourceEditor{
  background: url("https://web.moocollege.com/mooc/hzq/competition/competition/%E9%99%84%E4%BB%B6.svg") no-repeat !important;
  background-size: 24px auto !important;
  background-position: center center !important;
}
.ql-pdfEditor{
  background: url("https://web.moocollege.com/mooc/hzq/competition/competition/pdf1.svg") no-repeat !important;
  background-size: 16px 16px;
  background-position: center center !important;
}
</style>

