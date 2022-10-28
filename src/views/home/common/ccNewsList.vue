<template>
  <div>
    <ul class="questions">
      <li v-for="item in lists" :key="item.id" @click="toDetails(item)">
        <img src="../assets/icon_question.png" alt="" srcset="" />
        <p class="dian">{{ item.name }}</p>
        <time>{{ item.createTime | date }}</time>
      </li>
    </ul>
    <el-pagination
      v-if="fullList"
      style="text-align:center"
      layout="prev, pager, next"
      :total="total"
      :current-page.sync="queryParams.pageNum"
      :page-size="queryParams.pageSize"
      @current-change="fetchList"
      hide-on-single-page
    >
    </el-pagination>
  </div>
</template>

<script>
import moment from "moment";
import network from "@/api/jxNotice/cc";
export default {
  props: ["type", "size", "newsType", "fullList"],
  data() {
    return {
      lists: [],
      total: 0,
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        type: undefined,
        newsType: undefined
      }
    };
  },
  created() {
    this.fetchList();
  },
  methods: {
    toDetails(item) {
      this.$router.push("/home/ccNews/" + item.id + "?type=" + item.type);
    },
    fetchList() {
      // 4.申报立项 3.竞赛通知
      let params ={}
      if(this.fullList){
        params =Object.assign({}, this.queryParams, {
        type: this.type == 0 ? undefined : this.type,
        newsType: this.newsType
      });
      }else{
        params= Object.assign({},{
        pageSize: this.size,
        pageNum:1,
        type: this.type == 0 ? undefined : this.type,
        newsType: this.newsType
      });

      }
      if (this.type == 3) {
        network.getCCNoticeList(params).then(res => {
          this.lists =
            res &&
            res.rows.map(item => {
              item.newsTitle = item.name;
              item.type = item.type || 3;
              return item;
            });
            this.total = res.total
        });
      } else {
        network.getCCNewsList(params).then(res => {
          this.lists = (res && res.rows) || [];
             this.total = res.total
        });
      }
    }
  },
  filters: {
    date(val) {
      if (!val) return "";
      return moment(val).format("MM-DD");
    }
  }
};
</script>

<style lang="scss" scoped>
.questions {
  width: 100%;
  padding-top: 16px;
  padding-bottom: 7px;
  overflow: hidden;
  li {
    width: 100%;
    height: 16px;
    display: flex;
    margin-bottom: 20px;
    cursor: pointer;
    img {
      display: inline-block;
      vertical-align: middle;
      width: 11px;
      height: 11px;
      margin-right: 12px;
    }
    p {
      display: inline-block;
      vertical-align: middle;
      width: 245px;
      flex: 1;
      height: 16px;
      font-size: 16px;
      font-weight: 400;
      color: #4a4a4a;
      line-height: 16px;
    }
    time {
      display: inline-block;
      vertical-align: middle;
      width: 40px;
      height: 12px;
      font-size: 12px;
      font-weight: 400;
      color: #999999;
      line-height: 18px;
      text-align: right;
    }
    &:hover {
      p,
      time {
        color: #0041ab;
      }
    }
  }
}
</style>
