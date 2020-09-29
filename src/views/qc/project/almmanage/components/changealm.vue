<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="pageEntity.name"
        style="width: 250px;"
        class="filter-item"
        size="small"
        placeholder="项目名称(精确查找)"
        clearable
      />
      <el-input
        v-model="pageEntity.num"
        style="width: 250px;"
        class="filter-item"
        size="small"
        placeholder="项目序号（精确查找）"
        clearable
      />
      <el-select
        v-model="pageEntity.zy"
        class="filter-item"
        size="small"
        clearable
        placeholder="是否在研（精确查找）"
      >
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-input
        v-model="pageEntity.almProjectName"
        style="width: 250px;"
        class="filter-item"
        size="small"
        placeholder="alm项目名称（精确查找）"
        clearable
      />
      <el-button
        type="primary"
        size="small"
        icon="el-icon-search"
        class="filter-item"
        @click="handleFilter()"
      >
        搜索
      </el-button>

    </div>
    <el-table
      :data="tableData"
      stripe
      border
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column
        type="index"
        label="序号"
        width="80px"
      />
      <el-table-column
        prop="kingdom"
        label="所属领域"
        width="120"
      />
      <el-table-column
        prop="code"
        label="上级令号"
      />
      <el-table-column
        prop="name"
        label="项目名称"
      />
      <el-table-column
        prop="num"
        label="项目序号"
      />
      <el-table-column
        prop="testGrade"
        label="测试级别"
      />
      <el-table-column
        label="测试负责人"
        width="120"
      >
        <template slot-scope="scope">
          <el-popover
            placement="top-start"
            width="300"
            trigger="click"
          >
            <el-form
              v-loading="userLoading"
              label-width="80px"
            >
              <el-form-item label="用户名">
                {{ user.username }}
              </el-form-item>
              <el-form-item label="真实姓名">
                {{ user.fullname }}
              </el-form-item>
              <el-form-item label="性别">
                <span v-if="user.sex">男</span>
                <span v-else>女</span>
              </el-form-item>
              <el-form-item v-if="user.createTime" label="创建日期">
                {{ user.createTime | parseTime('{y}-{m}-{d}') }}
              </el-form-item>
            </el-form>
            <el-tag slot="reference" @click="getUser(scope.row.testLeader)"> {{ scope.row.testLeader }}</el-tag>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column
        label="是否在研"
        width="80"
      >
        <template slot-scope="scope">
          <el-tag v-if="scope.row.zy" type="success">是</el-tag>
          <el-tag v-else type="danger">否</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="alm域名"
        width="250px"
      >
        <template slot-scope="{row}">
          <template v-if="row.edit">
            <el-input v-model="row.almDomainName" style="width:200px" size="small" />
          </template>
          <span v-else>{{ row.almDomainName }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="alm项目名"
        width="250px"
      >
        <template slot-scope="{row}">
          <template v-if="row.edit">
            <el-input v-model="row.almProjectName" style="width:200px" size="small" />

          </template>
          <span v-else>{{ row.almProjectName }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="250">
        <template slot-scope="{row}">
          <el-button
            v-if="row.edit"
            type="success"
            size="small"
            icon="el-icon-document"
            @click="confirmEdit(row)"
          >
            确定
          </el-button>
          <el-button
            v-if="row.edit"
            type="success"
            size="small"
            icon="el-icon-document"
            @click="cancelEdit(row)"
          >
            取消
          </el-button>
          <el-button
            v-else
            type="primary"
            size="small"
            icon="el-icon-edit"
            @click="edit(row)"
          >
            修改
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="pageEntity.pageNum" :limit.sync="pageEntity.pageSize" @pagination="handleFilter()" />

  </div>
</template>

<script>
import { findProjectsByStatusReady, updateProject } from '@/api/project/project'
import pagination from '@/components/Pagination'
import { getByUsername } from '@/api/user.js'
export default {
  name: 'Changealm',
  components: {
    pagination
  },
  data() {
    return {
      pageEntity: {
        pageNum: 1,
        pageSize: 10,
        name: null,
        num: null,
        zy: null,
        almProjectName: null
      },
      options: [{
        value: true,
        label: '是'
      },
      {
        value: false,
        label: '否'
      }
      ],
      total: 0,
      tableData: [],
      userLoading: false,
      user: {}
    }
  },
  created() {
    this.handleFilter()
  },
  methods: {
    edit(row) {
      row.edit = true
      row.originalDomainName = row.almDomainName
      row.originalProjectName = row.almProjectName

      console.log(row)
    },
    handleFilter() {
      findProjectsByStatusReady(this.pageEntity).then(response => {
        const temp = response.data.list
        temp.forEach(item => {
          item.edit = false
        })
        this.tableData = temp
        this.total = response.data.total
      }).catch(() => {

      })
    },
    getUser(name) {
      this.userLoading = true
      getByUsername(name).then(res => {
        if (res.data) {
          this.user = res.data
        } else {
          this.$message.warning('该用户不存')
        }
        this.userLoading = false
      }).catch(() => {
        this.userLoading = false
        this.$message.error('获取用户失败')
      })
    },

    cancelEdit(row) {
      row.almDomainName = row.originalDomainName
      row.almProjectName = row.originalProjectName
      console.log(row)
      row.edit = false
      this.$message({
        message: '取消成功',
        type: 'success'
      })
    },
    confirmEdit(row) {
      row.edit = false
      Object.keys(row).forEach((key) => {
        if (key === 'edit' || key === 'originalDomainName' || key === 'originalProjectName') {
          delete (row[key])
        }
      })
      updateProject(row).then(response => {
        this.$message({
          message: '修改成功',
          type: 'success'
        })
      }).catch(() => {
        this.$message({
          message: '修改失败',
          type: 'error'
        })
      })
    }
  }
}
</script>
