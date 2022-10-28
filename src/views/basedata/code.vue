<template>
    <div class="app-container">
        <el-row :gutter="10" class="mb8">
            <el-col>
                <el-button
                    type="primary"
                    plain
                    icon="el-icon-plus"
                    @click="handleAdd()"
                    size="small"
                >新增公共代码</el-button>
                <el-button
                    type="success"
                    plain
                    @click="toRoot"
                    icon="el-icon-back"
                    size="small"
                >一级公共代码</el-button>
            </el-col>
        </el-row>
        
        <el-table border :data="listData">
            <el-table-column label="代码名称" align="center" prop="codeName" />
            <el-table-column label="状态" align="center" prop="isavail">
                <template slot-scope="scope">
                    {{scope.row.isavail ? '启用' : '不启用'}}
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                    <el-button
                      size="mini"
                      type="text"
                      @click="toChild(scope.row.id)"
                    >查看子类</el-button>
                    <!-- todo 权限 -->
                    <el-button
                      size="mini"
                      type="text"
                      @click="handleAdd(scope.row)"
                    >添加子类</el-button>
                    <el-button
                      size="mini"
                      type="text"
                      @click="move(scope.row, 'up')"
                    >上移</el-button>
                    <el-button
                      size="mini"
                      type="text"
                      @click="move(scope.row, 'down')"
                    >下移</el-button>
                    <el-button
                      size="mini"
                      type="text"
                      @click="edit(scope.row)"
                    >编辑</el-button>
                  </template>
            </el-table-column>
        </el-table>
        
        <!-- 新增父类/子类公共代码 -->
        <el-dialog title="新增/编辑公共代码" :before-close="cancel" :visible.sync="showDialog" width="500px">
            <el-form ref="form" :model="form" label-width="100px">
                <el-form-item label="公共代码名称">
                    <el-input v-model="form.codeName" />
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submit">确 定</el-button>
                <el-button @click="cancel">取 消</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
// /dev-api/user/codeList
import CodeAPI from '@/api/jxbasedata/code'

export default {
    data() {
        return {
            showDialog: false,
            // 新增 model
            form: {},
            listData: [],
            parent: 0,
            editId: null
        }
    },
    created() {
        this.getData();
    },
    methods: {
        move(row, sortStr) {
            const params = {
                id: row.id,
                sortStr
            }
            CodeAPI.updateSort(params).then(res => {
                if(res.code == 200) {
                    this.msgSuccess('操作成功')
                } else {
                    this.msgError(res.msg || '操作失败')
                }
            })
        },
        
        toRoot() {
            this.$router.push('/basedata/code')
        },
        toChild(id) {
            this.$router.push(`/basedata/code/${id}`);
        },
        edit(row) {
            this.showDialog = true;
            this.editId = row.id || 0;
            this.form = Object.assign({}, this.form, { codeName: row.codeName })
        },
        reset() {
            this.editId = 0;
            this.parent = 0;
        },
        getData() {
            const params = {
                parent: this.$route.params.id || '0'
            }
            CodeAPI.getCodeList(params).then(response => {
                if(response.code == 200) {
                    this.showDialog = false
                    this.listData = response.data || []
                } else {
                    this.msgError(response.msg || '操作失败')
                }
            });
        },
        handleAdd(row) {
            this.parent = (row && row.id) || 0;
            this.showDialog = true;
        },
        // 新增
        submit() {
            this.$refs["form"].validate(valid => {
                if(valid) {
                    if(this.editId) {
                        // 编辑
                        const params = {
                            codekey: this.editId,
                            id: this.editId,
                            ...this.form
                        }
                        CodeAPI.editCode(params).then(res => {
                            if(res.code == 200) {
                                this.showDialog = false;
                                this.msgSuccess('操作成功')
                                this.getData()
                            } else {
                                this.msgError(res.msg || '操作失败')
                            }
                        })
                    } else {
                        // 新增
                        const params = {
                            parent: this.parent,
                            ...this.form
                        }
                        CodeAPI.addCode(params).then(response => {
                            if(response.code == 200) {
                                this.showDialog = false;
                                this.msgSuccess('操作成功')
                            } else {
                                this.msgError(response.msg || '操作失败')
                            }
                        })
                    }
                }
            })
        },
        cancel() {
            this.showDialog = false;
            this.reset();
        }
    }
}
</script>
<style>
    
</style>
