<template>
<div v-loading="loading">
    <!-- 申报后立项后的查看详情:项目Id {{$route.params.projectId}}
            <br/>获取详情接口:ProjectApi.expertDetail((xmid:项目Id))
      <br/> -->
    <ul class="details">
        <li class="noleft" v-if="data.xylxyj">
            <span class="leftTitle">立项</span>
            <div class="right">
        <li>
            <span>导师立项意见: </span>
            <div>{{data.txmdsyj && data.txmdsyj.dsyj || '-'}}</div>
        </li>
        <li>
            <span>学院立项意见: </span>
            <div>{{data.xylxyj && data.xylxyj.yijian || '-'}}</div>
        </li>
        <li>
            <span>专家组成员: </span>
            <div>{{data.xylxyj && data.xylxyj.zjzcy || '-'}}</div>
        </li>
        <li>
            <span>立项评审分数: </span>
            <div>{{data.xylxyj && data.xylxyj.dbfs || '-'}}</div>
        </li>
</div>
</li>
<li class="noleft" v-if="data.xyzqyj">
    <span class="leftTitle">中期</span>
    <div class="right">
<li>
    <span>导师中期意见: </span>
    <div>{{data.txmzq && data.txmzq.dsyj || '-'}}</div>
</li>
<li>
    <span>学院中期意见: </span>
    <div>{{data.txmzq && data.xyzqyj.yijian || '-'}}</div>
</li>
<li>
    <span>专家组成员: </span>
    <div>{{data.xyzqyj && data.xyzqyj.zjzcy || '-'}}</div>
</li>
<li>
    <span>中期评审分数: </span>
    <div>{{data.xyzqyj && data.xyzqyj.dbfs || '-'}}</div>
</li>
</div>
</li>
<!-- v-if="data.xyjtyj" -->
<li class="noleft" >
    <span class="leftTitle">结题</span>
    <div class="right">
<li>
    <span>导师结题意见: </span>
    <div>{{data.txmjt && data.txmjt.dsyj || '-'}}</div>
</li>
<li>
    <span>学院结题意见: </span>
    <div>{{(data.txmjt && (data.txmjt.xyyj||'-')) ||(data.xyjtyj && (data.xyjtyj.yijian||'-'))}}</div>
</li>
<li>
    <span>专家组成员: </span>
    <div>{{data.xyjtyj && data.xyjtyj.zjzcy || '-'}}</div>
</li>
<li>
    <span>结题评审分数: </span>
    <div>{{data.xyjtyj && data.xyjtyj.dbfs || '-'}}</div>
</li>
</div>
</li>

<li>
    <span class="leftTitle">项目成果：</span>
    <div class="right"><el-button @click="toStep4" type="text">查看项目成果</el-button></div>
</li>
<li v-if="data.txmjtfj">
    <span class="leftTitle">结题附件：</span>
    <div class="right">
        <p v-for="item in data.txmjtfj" :key="item.id"><a :href="item.relpath">{{item.filename}}</a></p>
    </div>
</li>

<li v-for="_list in list" :key="_list.title">
    <span class="leftTitle">{{_list.title}}</span>
    <div class="right">
        <personDetail v-if="_list.key" :formdata="data" :value="_list.value" :keys="_list.key" :type="_list.type" />
        <div v-else-if="_list.download">
            <a style="color:#1890ff;" :href="data[_list.value].url" :download="data[_list.value].name">{{data[_list.value].name}}</a>
        </div>
        <CKReview v-else :html="data[_list.value]" />
    </div>
</li>
<!-- <li>
    <span class="leftTitle">申请经费：</span>
    <div class="right">{{data.txmBaseAll && data.txmBaseAll.shenqjf || '-'}}</div>
</li> -->
<li>
    <span class="leftTitle">项目经费预算与用途：</span>
    <div class="right">
        <el-table border :data="money" border style="width: 100%">
            <el-table-column prop="title" label="开支科目" width="180">
            </el-table-column>
            <el-table-column prop="value" label="预算经费(元)" width="180">
            </el-table-column>
            <el-table-column prop="remark" label="主要用途"> </el-table-column>
        </el-table>
    </div>
</li>
</ul>

</div>
</template>

<script>
import personDetail from "@/views/jxStuProject/common/personDetail";
import CKReview from "@/components/CKReview";
import {ObjectUpdate} from "@/utils/jxUtil"
import reviewFactory from "@/views/jxStuProject/common/reviewFactory"
export default {
    //row "id","type","xmejlb"
    props:{row:{require:false,default:function(){return {}},type:Object}},
    components: {
        personDetail,
        CKReview
    },
    data() {
        return {
            loading: false,
            data: {},
            money: [],
            list: [],
        }
    },
    async created() {
        let _params = this.$route.params
        _params = ObjectUpdate({projectId:'',type:'',xmejlb:''},_params,{...this.row,projectId:this.row?.id})
        this.loading = true;
        let data = await reviewFactory(_params.projectId, _params.type||1, _params.xmejlb)
        this.list = data.list
        this.data = data.data
        this.data.txmjtfj = this.data.txmjtfj?.filter(item=>item?.id)
        this.money = data.money
        this.loading = false
    },
    methods:{
        toStep4(){
        let url ='/jxStuProject/results'
        let step4={
            1:'/innovation/nation2/step4',
            2:'/innovation/province2/step4',
            3:'/kysj/step4',
            41:'/school/SRTP/step4',
            42:'/academy/srtp/step4',
        }
        if(this.$store.getters.role=='student'|| this.$store.getters.role=='blacklist'){
            url ='/jxStuProject/results'
        }else if(this.$store.getters.role=='daoshi'){
            url ='/results1s'
        }
        else if(this.data.xmlb==4){
            url = step4[this.data.xmejlb]
        }else{
            url= step4[this.data.xmlb]
        }
         this.$router.push(url)
        }
    },
}
</script>

<style lang="scss" scoped>
.details {
    margin: 0 100px;
    border: 1px solid #eee;

    li {
        border-bottom: 1px solid #eee;
        display: flex;
        justify-content: flex-start;
        align-items: center;

        &.noleft {
            .right {
                padding-left: 0;

                span,
                div {
                    padding-left: 10px;
                }
            }
        }

        .leftTitle {
            padding: 10px 10px 10px 0;
            width: 20%;
            text-align: right;
        }

        .right {
            padding: 10px 0 10px 10px;
            width: 80%;
            height: auto;
            min-height: 43px;
            border-left: 1px solid #eee;
        }
    }
}
</style>
