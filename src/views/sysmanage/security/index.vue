<template>
  <div class="app-container">
    <el-table
      v-loading="definitionLoading"
      :data="tableData"
      border
      highlight-current-row
      stripe
      style="width: 100%"
    >
      <el-table-column align="center" type="index" label="序号" width="80" />
      <el-table-column prop="username" align="center" label="用户名" width="160" />
      <el-table-column prop="fullname" align="center" label="姓名" width="160" />
      <el-table-column prop="deptName" align="center" label="部门" width="250" />
      <el-table-column align="center" label="性别" width="80">
        <template slot-scope="scope">
          <el-tag
            v-show="scope.row.sex"
            type="primary"
            disable-transitions
          >男</el-tag>
          <el-tag
            v-show="!scope.row.sex"
            type="danger"
            disable-transitions
          >女</el-tag>
        </template>

      </el-table-column>
      <el-table-column align="center" label="类型" width="100">
        <template slot-scope="scope">
          <el-tag
            v-show="!scope.row.type"
            type="primary"
            disable-transitions
          >普通用户</el-tag>
          <el-tag
            v-show="scope.row.type"
            type="danger"
            disable-transitions
          >内置用户</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="是否锁定" width="100">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.status" :disabled="scope.row.status" active-color="#13ce66" inactive-color="#ff4949" @change="handleLocked(scope.row.username)" />
        </template>
      </el-table-column>

      <el-table-column align="center" label="创建时间">
        <template slot-scope="scope">
          <span>{{ scope.row.updateTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>

      <el-table-column
        align="center"
        label="操作"
        width="180"
        fixed="right"
      >
        <template slot-scope="{row}">
          <el-button v-show="getLogCheck(row)" type="primary" size="small" icon="el-icon-document" @click="queryLog(row)">日志审计</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="queryEntity.pageNum" :limit.sync="queryEntity.pageSize" @pagination="handleFilter()" />

    <el-drawer
      size="70%"
      title="日志审查"
      :visible.sync="drawer"
      :before-close="handleClose"
    >
      <securityLog :suser="security" />
    </el-drawer>
  </div>
</template>

<script>

import { mapGetters } from 'vuex'
import pagination from '@/components/Pagination'
import { queryPageUsers, unLocked } from '@/api/user'
import securityLog from '@/views/sysmanage/security/components/index.vue'
export default {
  name: 'SecurityUser',
  components: { pagination, securityLog },

  data() {
    return {
      tableData: [],
      queryEntity: {
        deptId: '',
        username: '',
        fullname: '',
        pageNum: 1,
        pageSize: 10,
        userType: 1
      },
      total: 0,
      drawer: false,
      security: null,
      mb: true
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'name', // 用户名
      'username' // 登录名
    ])
  },
  created() {
    this.handleFilter()
  },
  methods: {
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
          this.handleFilter()
        })
        .catch(_ => {})
    },
    handleFilter() {
      this.definitionLoading = true
      queryPageUsers(this.queryEntity).then(response => {
        this.total = response.data.total
        this.tableData = response.data.list
        this.definitionLoading = false
      }).catch(() => {
        this.definitionLoading = false
      })
    },
    handleLocked(username) {
      this.$confirm('此操作将解锁用户并初始化密码，是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        unLocked(username).then(response => {
          this.$message.success('用户解锁成功')
        }).catch(() => {
          this.$message.error('用户解锁失败')
        })
        this.handleFilter()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消解锁'
        })
        this.handleFilter()
      })
    },
    queryLog(row) {
      this.security = row.username
      this.drawer = true
    },
    getLogCheck(row) {
      if (this.username === 'auditadmin' && (row.username === 'sysadmin' || row.username === 'secadmin')) {
        return true
      } else if (this.username === 'secadmin' && row.username === 'auditadmin') {
        return true
      } else if (this.username === 'admin') {
        return true
      } else {
        return false
      }
    }

  }
}
</script>
<style >
:focus {
  outline: 0;
}
</style>
