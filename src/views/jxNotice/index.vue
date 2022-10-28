<template>
  <div class="app-container">
    <el-form v-if="showSearch" :model="queryForm" ref="queryForm" :inline="true" label-width="88px">
      <el-form-item label="公告标题" prop="ggbt">
        <el-input
          v-model="queryForm.ggbt"
        />
      </el-form-item>
      <el-form-item label="公告创建人" prop="fbr">
        <el-input 
          v-model="queryForm.fbr"
        />
      </el-form-item>
      <el-form-item label="创建时间" prop="fbsj">
        <el-date-picker
          v-model="queryForm.fbsj"
          type="date"
          placeholder="创建时间"
        ></el-date-picker>
      </el-form-item>
      <!-- todo 搜索权限 -->
      <el-form-item label="角色">
        <el-select v-model="queryForm.role" prop="role">
          <el-option
            v-for="item in roleList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="院系" prop="xy">
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
        <el-button type="primary" size="mini" @click="getData">搜索</el-button>
      </el-form-item>
    </el-form>
    
    <!-- 功能按钮 -->
    <el-row :gutter="10" class="mb8">
      <el-button
        type="primary"
        size="mini"
        @click="handleAdd"
      >{{addType}}</el-button>
      <right-toolbar :showSearch.sync="showSearch"></right-toolbar>
    </el-row>
    
    <el-table border :data="listData">
      <el-table-column width="60" label="编号" align="center" prop="id"></el-table-column>
      <el-table-column label="标题" align="center" prop="ggbt"></el-table-column>
      <el-table-column width="100" label="创建人" align="center" prop="fbr"></el-table-column>
      <el-table-column width="220" label="创建日期" align="center">
        <template slot-scope="scope">
          {{scope.row.fbsj | format}}
        </template>
      </el-table-column>
      <el-table-column width="200" label="操作" align="center">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            @click="toDetail(scope.row)"
          >查看</el-button>
          <el-button
            size="mini"
            type="text"
            @click="toEdit(scope.row)"
          >编辑</el-button>
          <el-button
            size="mini"
            type="text"
            @click="toDelete(scope.row)"
          >删除</el-button>
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
  </div>
</template>
<script>
import AcademyAdminAPI from '@/api/jxbasedata/academyAdmin'
import NoticeAPI from '@/api/jxNotice/index'
import moment from 'moment'

export default {
  data() {
    return {
      listData: [],
      queryForm: {
        pageNum: 1,
        pageSize: 20
      },
      roleList: [
        { label: '院校管理员', value: '1' },
        { label: '超级管理员', value: '2' }
      ],
      total: 0,
      showSearch: true,
      loading: false,
      showDialog: false,
      xyList: [],
      gglxMap: {
        "1": { text: '新增重点提示', method: '' },
        "2": { text: '新增常见问题', method: '' },
        "3": { text: '新增新闻动态', method: '' },
        "4": { text: '新增相关文件', method: '' },
        "5": { text: '新增相关下载', method: '' },
        "6": { text: '新增指南流程', method: '' },
        "7": { text: '新增成果展示', method: '' },
        "8": { text: '新增相关链接', method: '' },
        "9": { text: '新增科研训练', method: '' },
      },
      gglx: this.$route.params.gglx,
      showSearch: false
    }
  },
  created() {
    this.getXy();
    this.getData();
  },
  filters: {
    format(val) {
      return moment(val).format('YYYY-MM-DD hh:mm:ss')
    }
  },
  computed: {
    addType() {
      
      return this.gglxMap[this.gglx].text;
    },
    addMethod() {
      let gglx = $route.params.gglx;
      
      return this.gglxMap[gglx].method;
    }
  },
  methods: {
    getData() {
      const { fbsj } = this.queryForm;
      const params = Object.assign({}, { gglx: this.gglx }, {...this.queryForm});
      params.fbsj = fbsj ? moment(fbsj).format('YYYY-MM-DD') : '';
      
      NoticeAPI.getXtggList({...params}).then(res => {
        if(res.code == 200) {
          this.listData = res.rows;
          this.total = res.total;
        }
      })
    },
    
    toEdit(row) {
      this.$router.push(`/jxNotice/edit/${row.id}?gglx=${this.gglx}`)
    },
    
    toDetail(row) {
      this.$router.push(`/jxNotice/detail/${row.id}?gglx=${this.gglx}`)
    },
    
    toDelete(row) {
      const params = {
        ids: [row.id]
      }
      this.$confirm('确定删除吗？', '提示', { type: 'warning' }).then(
        () => {
          NoticeAPI.deleteXtgg({...params}).then(res => {
            if(res.code == 200) {
              this.msgSuccess('删除成功')
              this.getData()
            } else {
              this.msgError(res.msg || '操作失败')
            }
          });
        }
      )
    },
    
    handleAdd() {
      this.$router.push(`/jxNotice/add?gglx=${this.gglx}`)
    },
    
    getXy() {
      AcademyAdminAPI.getXy().then(res => {
        if (res.code == 200) {
          this.xyList = res.data;
        }
      })
    },
  }
}
</script>
<style>
  
</style>
