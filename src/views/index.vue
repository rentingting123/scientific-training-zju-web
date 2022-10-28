<template>
  <div class="app-container home">
    <el-row :gutter="20">
      <el-col :sm="24" :lg="24" class="btnbox" v-hasRole="['admin','tadmin']">
        <el-button type="primary" @click="editWriting">编辑文案</el-button>
      </el-col>
      <el-col :sm="24" :lg="24">
      <div class="notice" style="height:auto;width:1150px;margin:15px auto;border:1px solid #f1f2f3;padding:30px 15px;background:#f7f8f9;">
          <div style="color:#333;font-weight:600;text-align:center;margin-bottom:10px;">特别提醒</div>
          <div style="padding:10px 20px;">
             <CKReview v-if="editorValue" :html="editorValue"  />
             <div v-else>暂无</div>
            <!-- 1. 为确保顺利申报，请使用火狐、谷歌、IE10及以上、360最新版浏览器进行申报，并去掉浏览器的 ”兼容性视图”。<br/>
            2. 项目申报人为全日制在校本科生，只能申报一个项目。<br/>
            3. 学院原则上要根据学校给定的四级大学生科研训练预分配名额进行评审及报送，根据评审结果调整本学院学生申报项目的级别。<br/>
               <p style="text-indent: 2em;font-weight:300;">
             本科生报名，浙江大学本科生科研训练和学科竞赛管理系统网站（http://kyjs.zju.edu.cn/kyxl）
             各学院（系）本科教学科、研究生教学管理部门负责本学院学生申报、评审及具体实施工作，请学生查阅相应学院网站进行联系。<br/>
            （一）国创创新训练项目、省创本科生项目、校SRTP学校联系人：本科生院教务处实践教学办公室安老师；电话：88206238；EMAIL：<a style="color:#1890ff;font-weight:bold" href="mailto:anqinying@zju.edu.cn">anqinying@zju.edu.cn</a>；地点:紫金港校区东1B-110办公室。
            <br/>（二）省创研究生项目学校联系人：党委研究生工作部吴老师；电话：88208147；EMAIL：<a style="color:#1890ff;font-weight:bold" href="mailto:wujiao_@zju.edu.cn">wujiao_@zju.edu.cn</a>；地点: 紫金港校区西区研究生教育综合楼815。
          <br/>（三）国创创业训练项目学校联系人：校团委周老师；电话：88206213； EMAIL：<a style="color:#1890ff;font-weight:bold" href="mailto:zhouxinpeng@zju.edu.cn">zhouxinpeng@zju.edu.cn</a>；地点: 紫金港校区西区学生服务中心（尧坤楼）403室。
           <br/> （四）国创创业实践项目学校联系人：党委学工部（创新创业学院）刘老师；电话： 88981157；EMAIL：<a style="color:#1890ff;font-weight:bold" href="mailto:liuxin0703@zju.edu.cn">liuxin0703@zju.edu.cn</a>；地点:紫金港小剧场B座218室。
            <br/>（五）浙江大学本科生科研训练和学科竞赛管理系统技术服务：白羽，电话：0571-81902943，19106856371。
          </p> -->
          </div>
          <!-- <div style="padding: 0px 20px;font-size:14px;line-height:24px;">
          本科生报名，浙江大学本科生科研训练和学科竞赛管理系统网站（http://kyjs.zju.edu.cn/kyxl）。<br/>
          各学院（系）本科教学科、研究生教学管理部门负责本学院学生申报、评审及具体实施工作，请学生查阅相应学院网站进行联系。<br/>
          国创-创新训练项目、省创本科生项目、校SRTP、科研实践项目学校联系人：本科生院教务处实践教学办公室安老师，电话：88206238，EMAIL：anqinying@zju.edu.cn，地点：紫金港东1B-110室。<br/>
          省创研究生项目学校联系人：党委研究生工作部吴老师，电话：88208147，MAIL：wujiao_@zju.edu.cn，地点: 紫金港校区西区研究生教育综合楼815。<br/>
          国创-创业训练项目学校联系人：校团委任老师，电话：88206671，EMAIL：chuangzju@126.com，地点：紫金港小剧场B座317室。<br/>
          国创-创业实践项目学校联系人：党委学工部梁老师，电话：88981157，EMAIL：liangss@zju.edu.cn，地点：紫金港小剧场B座218室。
          </div> -->
        </div>
       
      </el-col>
    </el-row>
    <el-dialog
      title="编辑文案"
      :close-on-click-modal="false"
      :visible.sync="dialogVisible"
      width="80%">
       <ckeditor
          tag-name="textarea"
          :editor="editor"
          :value="editorValue"
          :config="editorConfig"
          @blur="onBlur"
          @ready="onEditorReady"
          @input="onEditorInput"
          @destroy="onEditorDestroy"
        ></ckeditor>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitEditor()">保存</el-button>
      </span>
    </el-dialog>
   
  </div>
</template>

<script>
import ClassicEditor from "@/components/CKEdit/build/ckeditor";
import MyCustomUploadAdapterPlugin from '@/components/CKEdit/adapter/uploadAdapter'
import CKEditor from "@ckeditor/ckeditor5-vue2";
import CKReview from "@/components/CKReview"
import indexAPI from '@/api/systemHome/index'
export default {
  name: "index",
  data() {
    return {
      // 版本号
      version: "3.5.0",
      dialogVisible: false,
      editor: ClassicEditor,
      editorConfig: {
        extraPlugins:[MyCustomUploadAdapterPlugin]
      },
      noticeId:'',
      editorValue:""
    };
  },
  components: {
    ckeditor: CKEditor.component,
    CKReview,
  },
  mounted(){
    this.getData()
  },
  methods: {
    editWriting(){
      this.dialogVisible = true
    },
    // 查询列表
    getData(){
      indexAPI.selectIndex().then(res => {
          if(res.code == 200) {
            this.editorValue = res.data.noticeContent
            this.noticeId = res.data.noticeId
          } else {
            // this.msgError(res.msg || '操作失败')
          }
        })
    },
     // 修改列表
    submitEditor(){
      if(this.editorValue) {
        let params = {
          noticeContent: this.editorValue,
          noticeId:this.noticeId
        }
        indexAPI.updateIndex(params).then(res => {
          if(res.code == 200) {
            this.msgSuccess('操作成功')
            this.dialogVisible = false
            this.getData();
          } else {
            this.msgError(res.msg || '操作失败')
          }
        })
      } else {
        this.msgError('编辑内容不能为空');
      }
    },

    onBlur(){
    },
    onEditorInput(html){
      this.editorValue = html
    },
    onEditorDestroy(){
    },
    onEditorReady(){
      console.log('富文本')
    },
  },
};
</script>

<style scoped lang="scss">
.home {
  blockquote {
    padding: 10px 20px;
    margin: 0 0 20px;
    font-size: 17.5px;
    border-left: 5px solid #eee;
  }
  hr {
    margin-top: 20px;
    margin-bottom: 20px;
    border: 0;
    border-top: 1px solid #eee;
  }
  .col-item {
    margin-bottom: 20px;
  }

  ul {
    padding: 0;
    margin: 0;
  }

  font-family: "open sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 13px;
  color: #676a6c;
  overflow-x: hidden;

  ul {
    list-style-type: none;
  }

  h4 {
    margin-top: 0px;
  }

  h2 {
    margin-top: 10px;
    font-size: 26px;
    font-weight: 100;
  }

  p {
    margin-top: 10px;

    b {
      font-weight: 700;
    }
  }

  .update-log {
    ol {
      display: block;
      list-style-type: decimal;
      margin-block-start: 1em;
      margin-block-end: 1em;
      margin-inline-start: 0;
      margin-inline-end: 0;
      padding-inline-start: 40px;
    }
  }
  .notice{
    font-size: 16px;
    overflow: auto;
    height: 400px;
  }
}
.btnbox{
  text-align: right;
  margin-right: 100px;
}
</style>

