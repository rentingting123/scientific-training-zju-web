<template>
    <div class="newDetail">
        <!-- <div class="left">
            <h title="常见问题" :more='true' path='/'></h>
            <questions />
            <h title="相关文件" :more='true' path='/'></h>
            <files />
            <h title="相关链接" ></h>
            <links />
        </div> -->
        <div class="middle">
            <div style="text-align: center;margin:0 0  20px 0">
               <h1 style="color:rgb(255, 125, 87)">{{ ggDetail.title }}</h1>
             </div>
            <!-- <titles :title='title' :title1='ggDetail && ggDetail.ggbt || ""' :path='path' back='true' /> -->
            <div class="mess">
                <span>编辑：{{ggDetail && ggDetail.fbr || ''}}</span>
                <span>日期：{{ggDetail && ggDetail.fbsj | date}}</span>
                <span>点击数：{{ggDetail && ggDetail.lookcount || 0}}</span>
            </div>
            <div v-html="ggDetail&&ggDetail.ggnr"></div>
        </div>
    </div>
</template>


<script>
import h from '../common/h'
import questions from '../common/questions'
import files from '../common/files'
import links from '../common/links'
import titles from '../common/titles'
import NewsAPI from '@/api/jxNotice/index'
import moment from 'moment'

export default {
    components:{
        h,
        questions,
        files,
        links,
        titles,
    },
    data(){
        return{
            id: '',
            ggDetail: {},
            type: '',
            title: '',
            path: '',
        }
    },
    created(){
        this.init()
    },
    methods:{
        init(){
            this.id = this.$route.params.id
            this.type = this.$route.query.type || ''
            if(!this.id) return;
            this.getDetail()
        },
        getDetail() {
            const params = {
                id: this.id
            }
            NewsAPI.mhyxtggDetail({...params}).then(res => {
                if(res.code == 200) {
                    this.ggDetail = res && res.data || {};
                }
            })
        }
    },
    filters:{
        date(val){
            if(!val) return '';
            return moment(val).format('YYYY-MM-DD HH:mm:ss')
        }
    },
    watch:{
        $route(val){
            this.init();
        },
        type:{
            immediate: true,
            handler(val){
                if(val==1){
                    this.title = '指南流程'
                    this.path = '/home/guide'
                }else if(val==2){
                    this.title = '常见问题'
                    this.path = ''
                }else if(val==3){
                    this.title = '相关文件'
                    this.path = ''
                }else if(val==4){
                    this.title = '相关链接'
                    this.path = '/home/download'
                }else if(val==5){
                    this.title = '重点提示'
                    this.path = ''
                }else if(val==6){
                    this.title = '科研训练、科研实践'
                    this.path = '/home/sc'
                }else if(val==7){
                    this.title = '新闻动态'
                    this.path = '/home/news'
                }else if(val==8){
                    this.title = '成果展示'
                    this.path = ''
                }else{
                    this.title = '新闻动态'
                    this.path = ''
                }
            }
        }
    }
}
</script>

<style lang='scss' scoped>
.newDetail{
    width: 1200px;
    height: auto;
    margin: 24px auto 31px;
    >div{
        display: inline-block;
        vertical-align: top;
    }
    .left{
        width: 335px;
        padding-right: 18px;
        height: 100%;
    }
    .middle{
         width: 100%;
        // width: 840px;
        padding-left: 20px;
        height: auto;
        min-height: 857px;
        border-left: 1px solid #DADADA;
        .mess{
             font-size: 16px;
    height: 40px;
    line-height: 40px;
    /* line-height: 40px; */
    border: 1px dashed #999999;
    text-align: center;
    margin-top: 20px;
    margin-bottom: 20px;
            span{
                margin-right: 10px;
            }
        }
    }
}
</style>