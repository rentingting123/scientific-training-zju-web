<template>
    <div class="app-container">
        <el-table border :data="listData">
            <el-table-column
                label="项目类型"
                align="center"
                prop="xmlx"
            />
            <!-- <el-table-column 
                label="学科类型"
                align="center"
                prop="xklb"
            /> -->
            <el-table-column label="最大金额" align="center">
                <template slot-scope="scope">
                    <el-input 
                        v-model="scope.row.jf"
                        style="width: 100px"
                    />
                    <el-button
                        size="mini"
                        type="text"
                        @click="handleEdit(scope.row)"
                        v-hasPermi="['system:setjf:save']"
                    >设置</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>
<script>
import FundsAPI from '@/api/jxsyscig/funds';

export default {
    data() {
        return {
            listData: [],
            maxValue: ''
        }
    },
    created() {
        this.getData();
    },
    methods: {
        handleEdit(row) {
            const params = [{
                id: row.id,
                jf: row.jf
            }];
            
            FundsAPI.setConfig(params).then(res => {
                if(res.code == 200) {
                    this.msgSuccess('设置成功')
                } else {
                    this.msgError(res.msg || '操作失败')
                }
            })
        },
        
        getData() {
            FundsAPI.getData().then(res => {
                if(res.code == 200) {
                    this.listData = res.data
                }
            })
        }
    }
}
</script>
<style></style>
