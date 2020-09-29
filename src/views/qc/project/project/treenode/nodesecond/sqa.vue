<template>
  <div style="height:800px">
    <el-input v-model="pageEntity.workSource" placeholder="任务来源" style="width: 200px;" size="small" class="filter-item" @keyup.enter.native="pageList" />
    <el-button type="primary" size="small" class="filter-item" icon="el-icon-search" @click="pageList">搜索</el-button>
    <el-button type="primary" size="small" icon="el-icon-plus" @click="save()">新增</el-button>
    <el-drawer
      size="85%"
      :visible.sync="drawer"
      :with-header="true"
      :before-close="handleClose"
    >
      <div>
        <sqaEdit :query="sqa" :drawercount="drawerCount" @closeDraw="closeDraw" />
      </div>
    </el-drawer>
    <el-divider />
    <el-table
      v-loading="loading"
      :data="sqaList"
      border
      stripe
    >
      <el-table-column label="序号" type="index" align="center" width="80px" />
      <el-table-column label="项目领域" prop="scope" align="center" width="200px" />
      <el-table-column label="被审查物名称" prop="checkObject" align="center" width="200px" />
      <el-table-column label="产品代号" prop="code" align="center" width="200px" />
      <el-table-column label="问题数" prop="matterCount" align="center" />
      <el-table-column label="完成状况" prop="completeStatus" align="center">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.completeStatus == 0" type="danger">未完成</el-tag>
          <el-tag v-else type="primary">已完成</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="被考核单位" prop="checkGroup" align="center" width="180px" />
      <el-table-column label="质量工作考核人" prop="qcCheckBy" align="center" width="200px" />
      <el-table-column label="分配给" prop="allocationTo" align="center" width="200px" />
      <el-table-column label="系统/配置项名称" prop="systemOrConfigurationItems" align="center" width="220px" />
      <el-table-column label="SQA检查月份" align="center" width="220px">
        <template slot-scope="scope">
          <span>{{ scope.row.sqaCheckMonth | parseTime('{y}-{m}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" fixed="right" width="200px">
        <template slot-scope="scope">
          <el-button type="primary" size="small" icon="el-icon-edit" @click="update(scope.row)">编辑</el-button>
          <el-button type="danger" size="small" icon="el-icon-delete" @click="handledelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="pageEntity.pageNum" :limit.sync="pageEntity.pageSize" @pagination="pageList()" />
  </div>
</template>

<script>
import pagination from '@/components/Pagination'
import { pageByParent, deleteByid } from '@/api/project/sqa.js'
import sqaEdit from '@/views/qc/project/project/treenode/nodesecond/sqaedit/index.vue'

export default {
  name: 'Sqa',
  components: {
    pagination,
    sqaEdit
  },
  props: {
    node: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      drawer: false,
      drawerCount: 0,
      sqa: {},
      loading: false,
      total: 0,
      sqaList: [],
      pageEntity: {
        workSource: '',
        codeId: this.node.id,
        pageNum: 1,
        pageSize: 10
      }
    }
  },
  watch: {
    // node节点点击时就更新
    node() {
      this.pageEntity.codeId = this.node.id
      this.pageList()
    }
  },
  created() {
    this.pageList()
  },
  methods: {
    closeDraw() {
      this.drawer = false
      this.pageList()
    },
    handleClose() {
      this.drawer = false
      this.pageList()
    },
    pageList() {
      console.warn(this.node)
      this.loading = true
      pageByParent(this.pageEntity).then(res => {
        console.warn(this.pageEntity)
        this.loading = false
        this.total = res.data.total
        this.sqaList = res.data.list
      }).catch(() => {

      })
    },
    save() {
      this.drawerCount = this.drawerCount + 1
      this.drawer = true
      this.sqa = {}
      this.sqa.codeId = this.node.id
      this.sqa.code = this.node.name
    },
    update(data) {
      this.drawerCount = this.drawerCount + 1
      this.drawer = true
      this.sqa = data
    },
    handledelete(data) {
      this.$confirm('此操作将永久删除该数据,是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteByid(data.id).then(res => {
          this.pageList()
          this.$message.success('删除成功!')
        }).catch(() => {
          this.$message.error('删除失败!')
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss">
    .el-drawer{

    overflow: scroll
    }

</style>
