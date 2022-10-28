<template>
  <div class="newDetail">
       <div class="left">
            <h title="成果展示" :more='true' path='/home/cc/0?newsType=5'></h>
            <ccNews newsType='5' size="5" />
            <h title="竞赛基地" :more='true' path='/home/cc/0?newsType=6'></h>
            <links newsType='6' size="5" />
        </div>
    <div class="middle">
      <!-- <titles
        title="学科竞赛"
        :title1="title"
        :path="path"
        back="true"
      /> -->
      <div style="text-align: center;margin:0 0  20px 0">
               <h1 style="color:rgb(255, 125, 87)">{{ ggDetail.title }}</h1>
             </div>
      <div class="mess">
        <span>编辑：{{ (ggDetail && ggDetail.newsBy) || "" }}</span>
        <span>日期：{{ ggDetail && ggDetail.createTime | date }}</span>
        <span>点击数：{{ (ggDetail && ggDetail.clickCount) || 0 }}</span>
      </div>

      <div v-if="type == 3">
        <Notice :notice="ggDetail" />
      </div>

      <div v-else>
        <div style="text-align: center;">
          <h1>{{ ggDetail.newsTitle }}</h1>
        </div>
        <div class="newsMain">
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
            <div style="marginTop: 10px; color: #409EFF">
              {{ pageNum }} / {{ pageTotalNum }}
            </div>
            <PDF
              :page="pageNum"
              :src="ggDetail.pdfInfo"
              @progress="loadedRatio = $event"
              @num-pages="pageTotalNum = $event"
            ></PDF>
          </div>
          <CKReview v-else :html="ggDetail && ggDetail.newsInfo" />
        </div>
        <topic v-if="type == 4" :competitionId="ggDetail.competitionId" />

        <!-- <div>
                           <div>相关下载：</div>
                           <el-link>{{}}</el-link>
                       </div> -->
      </div>
    </div>
  </div>
</template>

<script>
import h from "../common/h";
import CKReview from "@/components/CKReview";
import Notice from "./notice.vue";
import ccNews from '../common/ccNewsList'
import links from '../common/cclinks'
import titles from "../common/titles";
import NewsAPI from "@/api/jxNotice/cc";
import moment from "moment";
import topic from "./topic.vue";
import PDF from "vue-pdf";

export default {
  components: {
    h,
    PDF,
    CKReview,
    ccNews,
    topic,
    Notice,
    links,
    titles
  },
  data() {
    return {
      pageNum: 1,
      pageTotalNum: 1,
      loadedRatio: 0,
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
    prePage() {
      let page = this.pageNum;
      page = page > 1 ? page - 1 : this.pageTotalNum;
      this.pageNum = page;
    },

    // 下一页
    nextPage() {
      let page = this.pageNum;
      page = page < this.pageTotalNum ? page + 1 : 1;
      this.pageNum = page;
    },
    init() {
      this.id = this.$route.params.id;
      this.type = this.$route.query.type || "";
      if (!this.id) return;
      if (this.type == 3) this.getCCNoticeDetail(this.id);
      else this.getDetail();
    },
    getDetail() {
      const params = {
        competitionNewsId: this.id
      };
      NewsAPI.getCCNewsDetail({ ...params }).then(res => {
        if (res.code == 200) {
          this.ggDetail = (res && res.data) || {};
        }
      });
    },
    getCCNoticeDetail(id) {
      NewsAPI.getCCNoticeDetail(id).then(res => {
        this.ggDetail = Object.assign({}, res.data, {
          sponsorName: JSON.parse(res.data.sponsorName).join(","),
          undertakerOrganization: JSON.parse(
            res.data.undertakerOrganization
          ).join(",")
        });
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
          this.title = "新闻资讯";
          this.path = "/home/cc";
        } else if (val == 2) {
          this.title = "竞赛公示";
          this.path = "/home/cc";
        } else if (val == 3) {
          this.title = "竞赛通知";
          this.path = "/home/cc";
        } else if (val == 4) {
          this.title = "竞赛申报";
          this.path = "/home/cc";
        } else if (val == 5) {
          this.title = "重点提示";
          this.path = "";
        } else if (val == 6) {
          this.title = "科研训练、科研实践";
          this.path = "/home/sc";
        } else if (val == 7) {
          this.title = "新闻动态";
          this.path = "/home/news";
        } else if (val == 8) {
          this.title = "成果展示";
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
.newDetail {
  width: 1200px;
  height: auto;
  margin: 12px auto 31px;
  > div {
    display: inline-block;
    vertical-align: top;
  }
  .newsMain {
    border: 1px solid rgba(200, 200, 200, 1);
    padding: 40px;
    margin: 20px 0;
  }
  .left {
    width: 335px;
    padding-right: 18px;
    height: 100%;
  }
  .middle {
    width: 864px;
    padding-left: 20px;
    height: auto;
    min-height: 857px;
    border-left: 1px solid #dadada;
    .mess {
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
