<template>
    <div class="details">
        <p class="name" >
            <span  @click="getDetail">{{data.xsxm || data.dsxm || data.xm || 'NONAME'}}</span>
            <small v-if="data.ryzt==1||data.qrzt==1" >（已确认）</small>
            <small v-else-if="data.ryzt==-1||data.qrzt==-1" class="red">（已拒绝){{data.dsyj}}</small>
        </p>

        <el-dialog :visible.sync="show" title="详情" width="1000" append-to-body>
            <el-form class="detailsform" ref="editForm" v-if="obj" label-width="170px">
                
                <el-tabs v-model="activeName" @tab-click="handleClick">
                   <el-tab-pane label="个人信息" name="first">
                        <!-- 学生 -->
                <template  v-if="this.data.xh">
                    <el-form-item label="学号：">
                        {{obj.xh}}
                    </el-form-item>
                    <el-form-item label="姓名：">
                        {{obj.xm || '-'}}
                    </el-form-item>
                    <el-form-item label="学院：">
                        {{obj.xymc || '-'}}
                    </el-form-item>
                    <el-form-item label="年级：">
                        {{obj.njmc || '-'}}
                    </el-form-item>
                    <el-form-item label="专业：">
                        {{obj.zymc || '-'}}
                    </el-form-item>
                    <el-form-item label="班级：">
                        {{obj.bjmc || '-'}}
                    </el-form-item>
                    <el-form-item label="所有课程累计绩点：">
                        {{obj.sykcd || '-'}}
                    </el-form-item>
                    <el-form-item label="主修专业课程累计绩点：">
                        {{obj.zxkcd || '-'}}
                    </el-form-item>
                    <el-form-item label="已获主修专业累计学分：">
                        {{obj.yhdkcd || '-'}}
                    </el-form-item>
                    <el-form-item label="学年排名：">
                        {{obj.xnpm || '-'}}
                    </el-form-item>
                    <el-form-item label="未获得学分课程：">
                        {{obj.whdkc || '-'}}
                    </el-form-item>
                    <el-form-item label="获奖情况：">
                        <div  v-for="(item,i) in obj.hjqkList" :key="i">
                           
                            <div>
                                <span style="display: inline-block;min-width: 240px;margin-right: 20px;">
                                    <strong>获奖名称：</strong>{{item.hjmc}}
                                </span>
                                <span style="display: inline-block;min-width:240px">
                                   <strong> 等级：</strong>{{item.hjdj}}
                                </span>
                            </div>
                        </div>
                    </el-form-item>
                    <el-form-item label="主要课外活动：">
                        <span v-for="(item,i) in obj.tzykwhdList" :key="i">
                            {{item.zykwhd + '  '}}
                        </span>
                    </el-form-item>
                    <el-form-item label="自我介绍：">
                        {{obj.zwjs || '-'}}
                    </el-form-item>
                </template>
                 <!-- 导师 -->
                <template v-if="this.data.jgh">
                    <el-form-item label="学工号/用户名：">
                        {{obj.jgh}}
                    </el-form-item>
                    <el-form-item label="姓名：">
                        {{obj.xm || '-'}}
                    </el-form-item>
                    <el-form-item label="性别：">
                        {{obj.xb || '-'}}
                    </el-form-item>
                    <el-form-item label="学位：">
                        {{obj.xw || '-'}}
                    </el-form-item>
                    <el-form-item label="职称：">
                        {{obj.zc || '-'}}
                    </el-form-item>
                    <el-form-item label="院系：">
                        {{obj.xymc || '-'}}
                    </el-form-item>
                    <el-form-item label="联系方式：">
                        {{obj.lxfs || '-'}}
                    </el-form-item>
                    <el-form-item label="邮箱：">
                        {{obj.email || '-'}}
                    </el-form-item>
                    <el-form-item label="研究方向：">
                        {{obj.yjfx || '-'}}
                    </el-form-item>
                    <el-form-item label="近三年成果：">
                        {{obj.yearavg || '-'}}
                    </el-form-item>
                    <el-form-item label="近三年要求：">
                        {{obj.yq || '-'}}
                    </el-form-item>
                </template>
                   </el-tab-pane>
                   <el-tab-pane label="项目申报历史" name="second">
                       <div v-if="this.data.xh">
                           <el-table
                              v-loading="loading"
                              :data="stuList"
                              border
                            >
                             <el-table-column
                               prop="shenqingsj"
                               label="年份"
                               width="180">
                               <template  slot-scope="{row}">
                                    {{row.shenqingsj | date}}
                               </template>
                             </el-table-column>
                             <el-table-column
                               prop="xiangmumc"
                               label="项目名称"
                               width="180">
                             </el-table-column>
                             <el-table-column
                               prop="xmejlb"
                               label="项目类别">
                             </el-table-column>
                             <el-table-column
                               prop="xslb"
                               label="角色">
                             </el-table-column>
                             <el-table-column
                               label="状态">
                               <template slot-scope="{row}">
                                   <span v-if="row.isfb != 1"> {{row.isfb}}</span>
                                   <span v-else> {{row.xmzt}}</span>
                               </template >
                             </el-table-column>
                             <!-- <el-table-column
                               prop="address"
                               label="操作">
                                <template  slot-scope="{row}">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="onReview(row)"
                >查看</el-button
              >
          </template>
                             </el-table-column> -->
                            </el-table>
                            <el-pagination
                            style="width:100%;text-align:center"
                                  @size-change="handleSizeChange"
                                  @current-change="handleCurrentChange"
                                  current-page.sync="1"
                                  :page-size="stuparams.pageSize"
                                  layout=" prev, pager, next"
                                  :total="stutotal">
                                </el-pagination>
                       </div>
                       <div v-if="this.data.jgh">
                            <el-table
                              v-loading="loading"
                              :data="teaList"
                              border
                            >
                             <el-table-column
                               prop="shenqingsj"
                               label="年份"
                               width="180">
                               <template  slot-scope="{row}">
                                    {{row.shenqingsj | date}}
                               </template>
                             </el-table-column>
                             <el-table-column
                               prop="xiangmumc"
                               label="项目名称"
                               width="180">
                             </el-table-column>
                             <el-table-column
                               prop="xmejlb"
                               label="项目类别">
                             </el-table-column>
                             <el-table-column
                               prop="xslb"
                               label="角色">
                             </el-table-column>
                             <el-table-column
                               label="状态">
                               <template slot-scope="{row}">
                                   <span v-if="row.isfb != 1"> {{row.isfb}}</span>
                                   <span v-else> {{row.xmzt}}</span>
                               </template >
                             </el-table-column>
                             <!-- <el-table-column
                               prop="address"
                               label="操作">
                                <template  slot-scope="{row}">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="onReview(row)"
                >查看</el-button
              >
          </template>
                             </el-table-column> -->
                            </el-table>
                             <el-pagination
                              style="width:100%;text-align:center"
                                  @size-change="handleSizeChange1"
                                  @current-change="handleCurrentChange1"
                                  current-page.sync="1"
                                  :page-size="teaparams.pageSize"
                                  layout=" prev, pager, next"
                                  :total="teatotal">
                                </el-pagination>
                       </div>
                   </el-tab-pane>
                </el-tabs>
               
               
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
import moment from "moment";
import { studentDetailByxh } from "@/api/jxbasedata/student";
import { teacherDetailByxh, sfDetail } from "@/api/jxbasedata/teacher";
export default {
    props: ['data'],
    data(){
        return{
            loading:false,
            obj: '',
            show: false,
            activeName:'first',
            ProjectList:[],
            stuparams:{
                pageSize:5,
                pageNum:1,
                fzxsxh:undefined
            },
             teaparams:{
                pageSize:5,
                pageNum:1,
                fzdsjgh:undefined
            },
            stuList:[],
            teaList:[],
            stutotal:0,
            teatotal:0,
            statusOptions:[],
            xmztpes:[]
        }
    },
    created(){
      
    },
    methods:{
        getdoc(){
               this.getDicts("qrzt").then(response => {
      this.statusOptions = response.data;
    });
    this.getDicts("getLB2MapForAdd").then(res => {
         this.xmztpes = res.data
        });
        },
        statusFormat(row, column) {
      return this.selectDictLabel(this.statusOptions, row);
    },
    statusFormatxmzt(row, column) {
      return this.selectDictLabel(this.xmztpes, row);
    },
         handleSizeChange(val) { },
      handleCurrentChange(val) {
          this.stuparams.pageNum = val
        this.getstulist()
      },
      handleSizeChange1(val) {},
      handleCurrentChange1(val) {
          this.teaparams.pageNum = val
        this.gettealist()
      },
          handleClick(tab, event) {
        // console.log(tab, event);
      },
      getstulist(){
          this.stuparams.fzxsxh = this.data.xh
           sfDetail(this.stuparams).then(data => {
               data.rows.forEach(item => {
                   if(item.xmejlb !== '无'){
                       item.xmejlb = this.statusFormatxmzt(item.xmejlb)
                   }
                  item.xmzt  = this.statusFormat(item.xmzt)
              })
                    this.stuList = data.rows
                    this.stutotal = data.total
                })
      },
      gettealist(){
          this.teaparams.fzdsjgh = this.data.jgh
          sfDetail(this.teaparams).then(data => {
              data.rows.forEach(item => {
                   if(item.xmejlb !== '无'){
                       item.xmejlb = this.statusFormatxmzt(item.xmejlb)
                   }
                  item.xmzt  = this.statusFormat(item.xmzt)
              })
                    this.teaList = data.rows
                    this.teatotal = data.total
                })
      },
        /** 查看按钮操作 */
    onReview(row) {
      let path = `/innovation/preView/${row.id}/${row.xmejlb}/${row.type}`
      ,addTag={}
      addTag[path] = row.xiangmumc
      this.$store.dispatch('tagsView/updateRemotePathName',addTag)
      this.$router.push(path)
    },
        getDetail(){
            this.getdoc()
            if(this.data.jgh){
                // 获取导师详情
                teacherDetailByxh({ jgh: this.data.jgh }).then(data => {
                    this.obj = data && data.data || ''
                    if(!this.obj) return this.$message.warning('未获取到详情')
                    this.show = true
                });
                this.gettealist()
            }else if(this.data.xh){
                // 获取学生信息
                studentDetailByxh({ xh: this.data.xh }).then(data => {
                    this.obj = data && data.data || ''
                    if(!this.obj) return this.$message.warning('未获取到详情')
                    this.show = true
                });
                this.getstulist()
            }else{
                this.msgError('缺失教工号或者学号！')
            }

        }
    },
     filters: {
    date(val) {
         if (!val) return "";
         return moment(val).format("YYYY-MM-DD");
       }
     }
}
</script>

<style lang='scss' scoped>
.details{
    display: inline-block;
    vertical-align: middle;
    margin-right: 8px;
    .name{
        color: #1890ff;
        cursor: pointer;
        small{
            margin-left: 20px;
            color: green;
            &.red{
                color: red;
            }
        }
    }
    
}
::v-deep .detailsform .el-form-item{
    margin-bottom: 12px;
}
</style>