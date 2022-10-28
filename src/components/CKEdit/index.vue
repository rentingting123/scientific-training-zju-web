<template>
  <div v-bind="$attrs">
<CKReview v-if="onlyReview" :html="value"  />
<el-input v-else-if="model" 
 type="textarea" @blur="onBlur"  v-bind="$attrs" :value="value" @input="onEditorInput" :placeholder='`${placeholder} -（支持word复制粘贴，非wps）`'>
</el-input>
  <ckeditor
     v-else
    v-bind="$attrs"
    tag-name="textarea"
    :editor="editor"
    :value="value"
    :config="editorConfig"
    @blur="onBlur"
    @ready="onEditorReady"
    @input="onEditorInput"
    @destroy="onEditorDestroy"
  ></ckeditor>
  <div v-if="!onlyReview" style="text-align:center;padding:10px;">
    <el-button v-if="!onlyEditor" style="margin:0 10px" @click="changeModel">切换编辑器</el-button>
    <span :style="{color:valueLength>maxlength?'red':''}" v-if="maxlength">{{`${valueLength>maxlength?'系统不保存超长内容：':'字数：'}${valueLength}/${maxlength}`}}</span>
  </div>
  </div>
</template>

<script>
import ClassicEditor from "./build/ckeditor";
import CKEditor from "@ckeditor/ckeditor5-vue2";
import CKReview from "@/components/CKReview"
import {replaceImage,removeHtmlTag,strLength,cutStr} from "@/utils/jxUtil"
import MyCustomUploadAdapterPlugin from './adapter/uploadAdapter'
export default {
  name: "app",
  //model only只显示富文本，否则默认显示文本编辑器，节约资源。
  props:["value","placeholder","maxlength","onlyEditor",'onlyReview'],
  components: {
    // Use the <ckeditor> component in this view.
    ckeditor: CKEditor.component,
    CKReview,
  },
  data() {
    return {
      //switch Editor
      valueLength:0,
      model:true,
      editor: ClassicEditor,
      editorConfig: {
          extraPlugins:[MyCustomUploadAdapterPlugin]
      }
      // ...
    };
  },
  mounted(){
    this.editorConfig.placeholder=this.placeholder
    //console.log(this.onlyEditor)
    this.model = !!!this.onlyEditor
  },
  beforeDestroy(){
     this.editor=""
  },
  watch:{
    value(val){
      if(!val) return 
      this.valueLength = strLength(replaceImage(removeHtmlTag(val)))
    }
  },

  methods:{
      onBlur(){
        console.log('blur',this.value)
        if(this.valueLength>this.maxlength)
        this.$emit("input", cutStr(replaceImage(removeHtmlTag(this.value)),this.maxlength));
      },
      changeModel(){
        if(this.model)this.model=false
        else{
          this.$confirm('切换到普通编辑器<strong><i style="color:red">会丢失</i>文本<i style="color:red">格式</i>与<i style="color:red">文件</i>内容</strong>','确认信息',{
           dangerouslyUseHTMLString: true,
           confirmButtonText:'确定',
           cancelButtonText:'取消',
          }).then(()=>{
             this.model = true
             this.$emit("input", replaceImage(removeHtmlTag(this.value)));
          }).catch(()=>{})
        }
      },
      onEditorInput(html){
           this.$emit("input", html);
      },
      onEditorDestroy(){
        
      },
      onEditorReady(){
          console.log('富文本')
          
      },
  }
};
</script>
