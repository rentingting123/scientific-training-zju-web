<template>
  <div class="app-container">
    <el-form :model="editForm" ref="editForm" label-width="88px">
      <el-form-item :label="ggbtText || '公告标题'">
        <el-input v-model="editForm.ggbt" />
      </el-form-item>
      <el-form-item label="发表人">
        <span>发表人</span>
      </el-form-item>
      <el-form-item label="超级链接">
        <el-input v-model="editForm.url" />
      </el-form-item>
      
      <el-form-item v-if="showImgUpload" label="新闻封面">
        <upload
          class="upload-demo"
          accept=".jpg, .png"
          name="attach"
          drag
          :showlist="false"
          :onSuccess="upSuccess"
          width="100%"
        >
          <img v-if="bannerUrl" :src="bannerUrl" width="360" height="180" />
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
        </upload>
      </el-form-item>
      
      <el-form-item v-if="showGgnr" :label="ggnrText || '公告内容'">
        <CKEditor
          v-model="editForm.ggnr"
          placeholder="请输入新闻内容"
          onlyEditor="true"
        />
         <!-- <CKEditor
          v-model="editForm.ggnr"
          placeholder="请输入新闻内容"
          maxlength=15
        /> -->
      </el-form-item>
      
      <el-form-item v-if="showTsfb" label="同时发布到">
        <el-checkbox-group v-model="editForm.tsfb">
          <el-checkbox v-for="item in tsfbList" :label="item.value" :key="item.value">
            {{item.label}}
          </el-checkbox>
        </el-checkbox-group>
      </el-form-item>
    </el-form>
    
    <div>
      <el-button type="primary" @click="submit">保存</el-button>
    </div>
  </div>
</template>
<script>
// import Editor from '@/components/Editor'
// import HzqEditor from '@/components/hzqEditor'
import NewsAPI from '@/api/jxNotice/index'
import upload from '@/components/JxFileUpload/index'
import CKEditor from "@/components/CKEdit";

export default {
  components: { CKEditor, upload },
  data() {
    return {
      tsfbList: [
        { label: '新闻动态', value: '3'},
        { label: '成果展示', value: '7'},
        { label: '科研训练', value: '9'},
        { label: '学科竞赛', value: '10'},
      ],
      editForm: {
        tsfb: []
      },
      gglxMap: {
        "1": { text: '重点提示' },
        "2": { text: '常见问题', ggbtText: '问题', ggnrText: '问题答案' },
        "3": { text: '新闻动态', ggbtText: '新闻标题', ggnrText: '新闻内容' },
        "4": { text: '相关文件', method: '' },
        "5": { text: '相关下载', method: '' },
        "6": { text: '指南流程', method: '' },
        "7": { text: '成果展示', method: '' },
        "8": { text: '相关链接', ggbtText: '链接名称' },
        "9": { text: '科研训练', method: '' },
      },
      editorOption: {},
      gglx: this.$route.query.gglx,
      bannerUrl: '',
      type: this.$route.params.id ? 'edit' : 'add',
      ggDetail: {}
    }
  },
  created() {
    if(this.type == 'edit') {
      this.getDetail()
    }
  },
  computed: {
    showGgnr() {
      let arr = ["1", "2", "3", "4", "5", "6", "7", "9"]
      return arr.indexOf(this.gglx) >= 0 ? true : false
    },
    
    showImgUpload() {
      let arr = ["3"];
      return arr.indexOf(this.gglx) >= 0 ? true : false
    },
    
    showTsfb() {
      let arr = ["1"];
      return arr.indexOf(this.gglx) >= 0 ? true : false
    },
    
    ggbtText() {
      return this.gglxMap[this.gglx].ggbtText
    },
    
    ggnrText() {
      return this.gglxMap[this.gglx].ggnrText
    }
  },
  
  methods: {
    getDetail() {
      const params = {
        id: this.$route.params.id
      }
      NewsAPI.xtggDetail({...params}).then(res => {
        if(res.code == 200) {
          this.ggDetail = res.data;
          this.editForm = Object.assign({}, this.editForm, {...res.data});
          this.editForm.tsfb = res.data?.tsfb || []
          this.bannerUrl = res.data.img;
        }
      })
    },
    
    upSuccess(res, file) {
      this.bannerUrl = res.location;
    },
    
    submit() {
      // console.log('submit', this.editForm)
      const { fbr, ggbt, ggnr, tsfb, url, id = '' } = this.editForm
      const params = {
        fbr, ggbt, url,
        gglx: this.gglx
      }
      
      if(this.showGgnr) {
        params.ggnr = ggnr;
      }
      
      if(this.showTsfb) {
        params.tsfb = tsfb;
      }
      
      if(this.showImgUpload) {
        params.img = this.bannerUrl;
      }
      
      if(this.type == 'edit') {
        params.id = id;
        
        NewsAPI.updateXtgg({...params}).then(res => {
          if(res.code == 200) {
            this.msgSuccess('修改成功');
          } else {
            this.msgError(res.msg || '操作失败')
          }
        })
      } else if(this.type == 'add') {
        NewsAPI.addXtgg({...params}).then(res => {
          if(res.code == 200) {
            this.msgSuccess('创建成功')
          } else {
            this.msgError(res.msg || '操作失败')
          }
        })
      }
      
    },
    setDaterule(val) {
      this.editForm.ggnr = val;
    }
  }
}
</script>
<style>
  
</style>
