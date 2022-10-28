<template>
  <div class="app-container">
    <el-form
      :model="queryForm"
      ref="queryForm"
      :inline="true"
      v-show="showSearch"
      label-width="88px"
    >
      <el-form-item label="工号" prop="xh">
        <el-input
          v-model="queryForm.xh"
          size="small"
        />
      </el-form-item>
      <el-form-item label="姓名" prop="xm">
        <el-input 
          v-model="queryForm.xm"
          size="small"
        />
      </el-form-item>
      <el-form-item label="学院" prop="xy">
        <el-select v-model="queryForm.xy" filterable placeholder="请选择">
          <el-option
            v-for="item in xyList"
            :key="item.xybh"
            :label="item.xymc"
            :value="item.xybh">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="mini" @click="handleSearch">搜索</el-button>
         <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
            >重置</el-button>
      </el-form-item>
    </el-form>
    
    <!-- 功能按钮 -->
    <el-row :gutter="10" class="mb8">
      <el-button
        type="primary"
        size="mini"
        @click="handleAdd"
      >新增</el-button>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getData"></right-toolbar>
    </el-row>
    
    <el-table border :data="listData" :v-loading="loading">
      <el-table-column label="学院" align="center" prop="xy">
        <template slot-scope="scope">
          {{getXyName(scope.row.xy)}}
        </template>
      </el-table-column>
      <el-table-column label="教工号" align="center" prop="xh" />
      <el-table-column label="姓名" align="center" prop="xm" />
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button size="mini" type="text" @click="edit(scope.row)">编辑</el-button>
          <el-button size="mini" type="text" @click="deleteA(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryForm.pageNum"
      :limit.sync="queryForm.pageSize"
      @pagination="getData"
    />
    
    <el-dialog title="新增/修改学院管理员" :before-close="cancel" :visible.sync="showDialog" width="500px">
      <el-form ref="editForm" :model="editForm" label-width="100px">
        <el-form-item :rules="[{ required: true, message: '请输入教工号', trigger: 'blur' }]" label="教工号">
          <el-input @input="getNameById" v-model="editForm.xh" />
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="editForm.xm" />
        </el-form-item>
        <el-form-item label="学院">
          <el-select :value="editForm.xy" @change="onChange"  filterable placeholder="请选择">
            <el-option
              v-for="item in xyList"
              :key="item.xybh"
              :label="item.xymc"
              :value="item.xybh">
            </el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="管理类型">
          <el-checkbox-group v-if="gllxList && gllxList.length" 
            v-model="editForm.fpqx">
            <el-checkbox v-for="item in gllxList" :label="item.dictValue" :key="item.dictValue">
              {{item.dictLabel}}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item> -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submit">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import AcademyAdminAPI from '@/api/jxbasedata/academyAdmin'
import StuApi from "@/api/jxStuProject/index";
export default {
  data() {
    return {
      xyList: [],
      queryForm: {
        pageNum: 1,
        pageSize: 20,
        xh: '',
        xm:'',
        xy: ''
      },
      total: 0,
      editForm: {
        xh: '',
        xm:'',
        xy: '',
        fpqx:[]
      },
      gllxList: [],
      showSearch: true,
      listData: [],
      showDialog: false,
      loading: false
    };
  },
  created() {
    this.getXy();
    this.getData();
    this.getDicts("kyxl_gllx").then(response => {
      this.gllxList = response.data;
    });
  },
  methods: {
    getXyName(code) {
      const result = this.xyList.filter(each => each.xybh == code)
      
      if(result && result.length) {
        return result[0].xymc;
      } else {
        return '';
      }
    },
    
    onChange(val) {
      // console.log('val', val)
      this.editForm.xy = val
    },
        //更具教工号获取教师
    getNameById() {
      if(!this.editForm.xh) return 
      StuApi.getNameById({ jgh: this.editForm.xh }).then(
        data => {
          this.editForm.xm = data.data?.xm;
          this.editForm.xy = data.data?.xy
        }
      ).catch(err=>{
        this.editForm.xm=""
        this.editForm.xy=""
      });
    },
    
    submit() {
      const params = Object.assign({}, this.editForm, { fpqx: this.editForm.fpqx.join(',') })
      if(this.editForm.id) {
        // edit
        AcademyAdminAPI.edit(params).then(res => {
          if(res.code == 200) {
            this.msgSuccess('操作成功')
            this.cancel();
            this.getData();
          } else {
            this.msgError(res.msg || '操作失败')
          }
        })
      } else {
        // add
        AcademyAdminAPI.add(params).then(res => {
          if(res.code == 200) {
            this.msgSuccess('操作成功');
            this.cancel();
            this.getData();
          } else {
            this.msgError(res.msg || '操作失败');
          }
        })
      }
    },
    
    getXy() {
      AcademyAdminAPI.getXy().then(res => {
        if (res.code == 200) {
          this.xyList = res.data;
        }
      })
    },
    
    cancel() {
      this.showDialog = false;
    },
    
    handleAdd() {
      this.showDialog = true;
    },
    
    edit(row) {
      this.showDialog = true;
      this.editForm = Object.assign({}, this.editForm, row)
      if (!row.fpqx) {
        this.editForm.fpqx = []
      } else {
        this.editForm.fpqx = row.fpqx.split(',')
      }
    },
     resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    deleteA(row) {
       this.$confirm(
        '是否确认删除"' + row.xm + '"的管理员？',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).then(()=>{
        const params = {
          ids: [row.id]
        }
          return AcademyAdminAPI.delete(params)

        }).then(res => {
          if(res.code == 200) {
            this.msgSuccess('操作成功')
            this.getData();
          } else {
            this.msgError(res.msg || '操作失败')
          }
      })
    },
    
    getData() {
      AcademyAdminAPI.getAcademyAdminList(this.queryForm).then(res => {
        if(res.code == 200) {
          this.total = res.total;
          this.listData = res.rows
        }
      })
    },
    
    handleSearch() {
      this.getData();
    }
  }
};
</script>
<style></style>
