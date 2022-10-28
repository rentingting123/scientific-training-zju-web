<template>
  <div class="newDetail">
    <div class="middle">
      <!-- <titles :title='title' :title1='ggDetail && ggDetail.title || ""' :path='path' back='true' /> -->
      <div style="text-align: center;margin:0 0  20px 0">
        <h1 style="color:rgb(255, 125, 87)">{{ ggDetail.title }}</h1>
      </div>
      <div class="mess">
        <span>编辑：{{ (ggDetail && ggDetail.creator) || "" }}</span>
        <!-- <span>编辑：{{ggDetail && ggDetail.fbr || ''}}</span> -->
        <span>日期：{{ ggDetail && ggDetail.releaseTime | date }}</span>
        <!-- <span>日期：{{ggDetail && ggDetail.fbsj | date}}</span> -->
        <span>点击数：{{ (ggDetail && ggDetail.clickCount) || 0 }}</span>
        <!-- <span>点击数：{{ggDetail && ggDetail.lookcount || 0}}</span> -->
      </div>

      <div v-if="ggDetail.pdfInfo">
        <el-button-group>
          <el-button
            type="primary"
            icon="el-icon-arrow-left"
            size="mini"
            @click="prePage"
            >上一页</el-button
          >
          <el-button type="primary" size="mini" @click="nextPage"
            >下一页<i class="el-icon-arrow-right el-icon--right"></i
          ></el-button>
        </el-button-group>
        <div style="margintop: 10px; color: #409eff">
          {{ pageNum }} / {{ pageTotalNum }}
        </div>
        <PDF
          :page="pageNum"
          :src="ggDetail.pdfInfo"
          @progress="loadedRatio = $event"
          @num-pages="pageTotalNum = $event"
        ></PDF>
      </div>
      <CKReview v-else :html="ggDetail && ggDetail.content" />
      <!-- <div v-html="ggDetail&&ggDetail.content"></div> -->
    </div>
    <!-- <div class="left">
             <div class="box">
                <h title="常见问题"  :more='true' path='/home/ques'></h>
            <links  type="4" :size="2"  />
            </div>
            <div class="box">
                <h title="相关链接" :more='true'  path='/home/aboutlink'></h>
            <links type="9" :size="2" />
            </div>
            <div class="box">
                <h title="相关下载" :more='true'  path='/home/download'></h>
            <links type="5" :size="2" />
            </div>
        </div> -->
  </div>
</template>

<script>
import h from "../common/h";
import questions from "../common/questions";
import files from "../common/files";
import links from "../common/links";
import titles from "../common/titles";
import NewsAPI from "@/api/jxNotice/index";
import moment from "moment";
import CKReview from "@/components/CKReview";
import PDF from "vue-pdf";
export default {
  components: {
    h,
    PDF,
    questions,
    CKReview,
    files,
    links,
    titles
  },
  data() {
    return {
      id: "",
      ggDetail: {},
      type: "",
      title: "",
      path: ""
    };
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      this.id = this.$route.params.id;
      this.type = this.$route.query.type || "";
      if (!this.id) return;
      this.getDetail();
    },
    getDetail() {
      const params = {
        id: this.id
      };
      // /schoolmanager/expertReview/homeDetail/298
      NewsAPI.mhyxtggDetail({ ...params }).then(res => {
        if (res.code == 200) {
          // console.log(res);
          this.ggDetail = (res && res.data) || {};
        }
      });
    }
  },
  filters: {
    date(val) {
      if (!val) return "";
      return moment(val).format("YYYY-MM-DD HH:mm:ss");
    }
  },
  watch: {
    $route(val) {
      this.init();
    },
    type: {
      immediate: true,
      handler(val) {
        if (val == 1) {
          this.title = "指南流程";
          this.path = "/home/guide";
        } else if (val == 2) {
          this.title = "常见问题";
          this.path = "";
        } else if (val == 3) {
          this.title = "相关文件";
          this.path = "";
        } else if (val == 4) {
          this.title = "相关链接";
          this.path = "";
        } else if (val == 5) {
          this.title = "相关下载";
          this.path = "";
        } else if (val == 6) {
          this.title = "新闻动态";
          this.path = "/home/news";
        } else if (val == 7) {
          this.title = "新闻动态";
          this.path = "/home/news";
        } else if (val == 9) {
          this.title = "相关链接";
          this.path = "";
        } else if (val == 14) {
          this.title = "通知公告";
          this.path = "";
        } else {
          this.title = "新闻动态";
          this.path = "";
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.box {
  margin-bottom: 24px;
}
.newDetail {
  width: 1200px;
  height: auto;
  margin: 24px auto 31px;
  > div {
    display: inline-block;
    vertical-align: top;
  }
  .left {
    width: 335px;
    padding-right: 18px;
    background: #fff;
    height: 100%;
    padding: 20px;
    border-radius: 4px;
    margin-left: 24px;
  }
  .middle {
    width: 100%;
    // width: 840px;
    padding: 24px;
    padding-left: 20px;
    height: auto;
    background: #fff;
    .mess {
      /* padding: 20px 0 40px; */
      font-size: 16px;
      height: 40px;
      line-height: 40px;
      /* line-height: 40px; */
      border: 1px dashed #999999;
      text-align: center;
      margin-top: 20px;
      margin-bottom: 20px;
      span {
        margin-right: 10px;
      }
    }
  }
}
</style>
