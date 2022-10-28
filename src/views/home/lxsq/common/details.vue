<template>
    <div class="details">
        <p class="name" >
            <span  @click="getDetail">{{data.xsxm || data.dsxm || 'NONAME'}}</span>
            <small v-if="data.ryzt===1||data.qrzt==1" >（已确认）</small>
            <small v-else-if="data.ryzt===2||data.qrzt==-1" class="red">（已拒绝){{data.dsyj}}</small>
        </p>

        <el-dialog :visible.sync="show" title="详情" width="1000" append-to-body>
            <el-form class="detailsform" ref="editForm" v-if="obj" label-width="170px">
                <!-- 学生 -->
                <template v-if="this.data.xh">
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
                        <span v-for="(item,i) in obj.hjqkList" :key="i">
                            {{item}}
                        </span>
                    </el-form-item>
                    <el-form-item label="主要课外活动：">
                        <span v-for="(item,i) in obj.tzykwhdList" :key="i">
                            {{item}}
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
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
import api from '@/api/retrieval'
export default {
    props: ['data'],
    data(){
        return{
            obj: '',
            show: false,

        }
    },
    methods:{
        getDetail(){
            if(this.data.jgh){
                // 获取导师详情
                api.teacherDetailByxh({ jgh: this.data.jgh }).then(data => {
                    this.obj = data && data.data || ''
                    if(!this.obj) return this.$message.warning('未获取到详情')
                    this.show = true
                });

            }else if(this.data.xh){
                // 获取学生信息
                api.studentDetailByxh({ xh: this.data.xh }).then(data => {
                    this.obj = data && data.data || ''
                    if(!this.obj) return this.$message.warning('未获取到详情')
                    this.show = true
                });
            }

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