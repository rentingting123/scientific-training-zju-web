<template>
  <div class="noticeall">
    <div class="msgBox">
      <label class="title">竞赛名称</label>:
      <div class="info">{{ notice.name }}</div>

      <el-tag type="success">{{state[notice.state]}}</el-tag>
    </div>

    <div class="msgBox">
      <label class="title">期届杯</label>:
      <div class="info">{{ notice.expiration }}</div>
    </div>

    <div class="msgBox">
      <label class="title">比赛地点</label>:
      <div class="info">{{ notice.address }}</div>
    </div>

    <div class="msgBox">
      <label class="title">竞赛时间</label>:
      <div class="info">
        {{ `${notice.competitionStartTime} 至 ${notice.competitionEndTime}` }}
      </div>
    </div>

    <div class="msgBox">
      <label class="title">报名时间</label>:
      <div class="info">
        {{ `${notice.enrollStartTime} 至 ${notice.enrollEndTime}` }}
      </div>
    </div>

    <div class="msgBox">
      <label class="title">主办单位</label>:
      <div class="info">
       {{notice.sponsorName}}
      </div>
    </div>

    <div class="msgBox">
      <label class="title">承办单位</label>:
      <div class="info">
      {{notice.undertakerOrganization}}
      </div>
    </div>

    <div class="msgBox">
      <label class="title">参数人数</label>:
      <div class="info">
        {{notice.participant}}人
      </div>
    </div>

    <div class="msgBox">
      <label class="title">竞赛介绍</label>:
      <div class="info">
        {{notice.introduce}}
      </div>
    </div>

    <div class="msgBox">
      <label class="title">相关通知</label>:
      <div class="info">
        <el-link style="margin-right:20px" target="_blank" v-for="(file,i) in notice.noticeUrl"  :href="file.url" :key="i">
            {{file.name}}
        </el-link>
    </div>
    </div>
    <div class="msgBox">
      <label class="title"></label>
      <div class="info">
          <el-button type="primary">
              <span @click="signup(notice.enrollUrl)">我要报名</span>
          </el-button>
          <el-button :disabled="!teamCount" @click="dialogVisible=true" type="primary">
              查看参赛队({{teamCount}})
          </el-button>
      </div>
    </div>
    <jxdialog 
     title="报名团队详情"
    :visible.sync="dialogVisible">
        <el-table border :data="teamColumn">
            <el-table-column v-for="t in teamTable" :key="t.name" :property="t.key" :label="t.name"></el-table-column>
        </el-table>
           <pagination
                v-show="teamCount>0"
                :total="teamCount"
                :page.sync="queryForm.pageNum"
                :limit.sync="queryForm.pageSize"
                @pagination="selectTeamById"
                />
    </jxdialog>
  </div>
</template>

<script>
import NewsAPI from '@/api/jxNotice/cc'
import jxdialog from '@/components/jxDialog'
export default {
  props: ["notice"],
  components:{jxdialog},
  data() {
    return {
        teamCount:0,
        dialogVisible:false,
        state:{
            0:'报名未开始',
            1:'竞赛报名中',
            2:'竞赛未开始',
            3:'竞赛中',   
            4:'已结束'
        },
        teamTable:[
            {
                key:'groupId',
                name:'编号'
            },
            {
                key:'name',
                name:'姓名'
            },
            {
                key:'studentNumber',
                name:'学号'
            },
            {
                key:'college',
                name:'学院'
            },
            {
                key:'major',
                name:'专业'
            },{key:'role',name:'身份'}
        ],
        teamColumn:[],
        queryForm:{
            competitionId:'',
            pageNum: 1,
            pageSize: 20
        }
    };
  },
  mounted(){
     
  },
  watch:{
      notice:{
          handler(val){
              this.queryForm.competitionId=val.competitionId
              this.selectTeamById()
          }
      }
  },
  methods:{
      signup(url){
          let _url = url.indexOf('http')>-1?url:'http://'+url
          window.open(_url,"_self")
      },
      more(){},
      selectTeamById(){
          NewsAPI.getSignupNumber(this.queryForm).then(data=>{
              this.teamCount=data.total
              this.teamColumn=data.rows
          })
      }
  },
  
};
</script>

<style lang="scss" scoped>
.noticeall {
    padding: 0 20px;
  .msgBox {
    display: flex;
    align-items: center;
    padding-bottom: 20px;
    .title {
      display: block;
      width: 80px;
      text-align: justify;
      text-align-last: justify;
    }
    .info {
      flex: 1;
      margin-left: 16px;
    }
  }
}
</style>
