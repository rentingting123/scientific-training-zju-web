<template>
    <div class="navs">
        <div>
            <ul>
                <li @click="toyindaoye()" v-if="hasPreview == 1">
                    主页
                </li>
                <li v-for="item in lists" :key="item.name" :class="{'on':item.path==path}" @click="toPath(item.path)">
                    {{item.name}}
                </li>
            </ul>

                 <el-dropdown v-if="roles.length>0" trigger="click">
                  <el-button size="small" type="primary" @click.native="()=>{$router.push('/index')}">
                        项目申报
                        <!-- <i class="el-icon-arrow-down el-icon--right"></i> -->
                  </el-button>
            </el-dropdown>
            <div v-else class="button" @click="toLogin">
                登录/申报
                <!-- 项目申报 -->
            </div>


        </div>
    </div>
</template>

<script>
import { getToken } from '@/utils/auth'
import { mapGetters } from 'vuex'
import config from '@/settings'
export default {
    data(){
        return{
            hasPreview:1,
            lists:[
                {
                    name: '首页',
                    path: '/home/',
                },
                {
                    name: '通知公告',
                    path: '/home/announcement',
                },
                {
                    name: '流程指南',
                    path: '/home/guide',
                },
                {
                    name: '常见问题',
                    path: '/home/ques',
                },
                // {
                //     name: '新闻动态',
                //     path: '/home/news',
                // },
                // {
                //     name: '科研训练',
                //     path: '/home/sc',
                // },
                 
                 
                // {
                //     name: '学科竞赛',
                //     path: '/home/cc',
                // },
                
                {
                    name: '相关下载',
                    path: '/home/download',
                },
            ]
        }
    },
    created(){
         this.getConfigKey("hasPreview").then(response => {
                this.hasPreview = response.msg
            });
    },
    computed: {
        toyindaoye(){
            location.href=config.PREVIEWHOST
        },
        path(){
            let path = this.$route.path
            if(path.includes('/home/news/')){
                if(this.$route.query.type==11){
                     path = '/home/guide'
                }else if(this.$route.query.type==5){
                     path = '/home/download'
                }else if(this.$route.query.type==9){
                     path = '/home/sc'
                }else if(this.$route.query.type==14){
                     path = '/home/announcement'
                }else if(this.$route.query.type==44){
                     path = '/home/ques'
                }else{
                     path = '/home/news'
                }
            }
            else if(path.includes('/home/cc')){
                path='/home/cc'
            }
            else if(path.includes('/home/guide')){
                path='/home/guide'
            }
            else if(path.includes('/home/announcement')){
                path='/home/announcement'
            }
            else if(path.includes('/home/download')){
                path='/home/download'
            }
             else if(path.includes('/home/ques')){
                path='/home/ques'
            }
            return path
        },
         ...mapGetters([
             'roles','name'
            ]),
    },
    methods:{
    
        toPath(path){
            this.$router.push(path)
        },
        toLogin(){
            if(getToken()){
                this.$router.push('/index')
            }else{
                location.href = 'https://zjuam.zju.edu.cn/cas/oauth2.0/authorize?response_type=code&client_id=gbsmpcoXWoT8MnZx4Z&redirect_uri=http://kyjs.zju.edu.cn/kyjs?name=kyxl';
                // this.$router.push('/login')
            }
        },
         async logout() {
            this.$confirm('确定注销并退出系统吗？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.$store.dispatch('LogOut').then(() => {
                  location.href=config.LOGINOUT
              })
            })
        }
    }
}
</script>

<style lang='scss' scoped>
.el-button--primary{
      width: 114px;
    height: 35px;
    text-align: center;
    background: #fff;
    border-radius: 4px;
    font-size: 18px;
    font-weight: 800;
    color: #0041AB;
    line-height: 6px;
    cursor: pointer;
    border: none;
}
.el-popper[x-placement^=bottom]{
        border: none;
    margin-top: 8px;
    /* font-size: 14px; */
    overflow: hidden;
    border-radius: 4px;
}
.el-popper[x-placement^=bottom] .popper__arrow{
    display: none;
}
.el-dropdown-menu--medium .el-dropdown-menu__item.el-dropdown-menu__item--divided{
    color: #1A56FC;
    background-color: #1A56FC;
    margin-top: 0;
    padding: 0 30px;
    height: 40px;
    border: none;
    font-size: 10px;
}
.el-dropdown-menu--medium .el-dropdown-menu__item.el-dropdown-menu__item--divided:before{
    background-color: #1A56FC;
}
::v-deep .popper__arrow{
    display: none;
}
.el-popper[x-placement^=bottom] .popper__arrow{
    display: none !important;
}
ul{
    list-style: none;
    padding: 0;
    margin: 0;
}
.navs{
    width: 100%;
    height: 48px;
    background: #0041AB;
    >div{
        width: 1200px;
        height: 100%;
        margin: 0 auto;
        display: flex;
        justify-content: space-between;
        align-items: center;
        ul{
            display: flex;
            justify-items: flex-start;
            align-items: center;
            li{
                width: 135px;
                height: 48px;
                line-height: 48px;
                cursor: pointer;
                text-align: center;
                font-size: 18px;
                font-weight: 400;
                margin-right: 50px;
                color: #FFFFFF;
                &:last-child{
                    margin-right: 0;
                }
                &.on{
                    color: #E58001;
                    border-bottom: 3px solid;
                }
                &:hover{
                    color: #E58001;
                    // border-bottom: 3px solid;
                }
            }
        }
        .button{
                width: 114px;
                height: 35px;
                text-align: center;
                background: #fff;
                border-radius: 4px;
                font-size: 18px;
                font-weight: 800;
                color: #0041AB;
                line-height: 35px;
                letter-spacing: 1px;
                cursor: pointer;
            img{
               width: 14px;
               margin-right: 6px; 
            }

        }
    }
}
</style>