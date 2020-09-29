<template>
  <div style="height:800px">
    <div class="filter-container">
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        size="small"
        icon="el-icon-plus"
        @click="dialogFormVisible=true"
      >
        新增
      </el-button>
    </div>
    <el-table
      v-loading="loading"
      :data="codeTestList"
      border
      stripe
    >
      <el-table-column
        align="center"
        type="index"
        label="序号"
        width="80"
      />
      <el-table-column
        label="标识"
        prop="testName"
        min-width="200"
        header-align="center"
      />
      <el-table-column
        label="所属项目"
        prop="project"
        width="120"
        align="center"
      />
      <el-table-column
        label="创建者"
        prop="creater"
        width="120"
        align="center"
      />
      <el-table-column
        label="修改时间"
        prop="updateTime"
        width="180"
        align="center"
      >
        <template slot-scope="scope">
          {{ scope.row.updateTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}
        </template>
      </el-table-column>
      <el-table-column
        label="修改时间"
        prop="updateTime"
        width="180"
        align="center"
      >
        <template slot-scope="scope">
          {{ scope.row.updateTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        width="270"
        fixed="right"
      >
        <template slot-scope="scope">
          <el-button v-waves type="primary" size="small" icon="el-icon-edit" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button v-waves type="success" size="small" icon="el-icon-tickets" @click="handleDatils(scope.row)">详情</el-button>
          <el-button v-waves type="danger" size="small" icon="el-icon-delete" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="searchEntity.pageNum" :limit.sync="searchEntity.pageSize" @pagination="pageList()" />
    <el-dialog
      v-dialogDrag
      width="30%"
      title="编辑"
      :before-close="beforeClose"
      :visible.sync="dialogFormVisible"
      :close-on-click-modal="false"
    >
      <el-form
        ref="codeTestForm"
        :rules="rules"
        :model="codeTest"
      >
        <el-form-item
          prop="testName"
          label="测试名称"
          width="100px"
          label-width="20%"
        >
          <el-input
            v-model="codeTest.testName"
            autocomplete="off"
          />
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleSubmit">确 定</el-button>
      </div>
    </el-dialog>
    <el-drawer
      size="60%"
      :visible.sync="drawer"
      :with-header="true"
      :before-close="drawerClose"
    >
      <div>
        <codetestdatils :query="query" :drawercount="drawerCount" @closeDraw="closeDraw" />
      </div>
    </el-drawer>
  </div>
</template>
<script>
import { addCodeTest, codeTestPageList, updateCodeTest, deleteCodeTest } from '@/api/project/codeTest.js'
import codetestdatils from '@/views/qc/project/project/treenode/nodethird/codeTest/details.vue'
import waves from '@/directive/waves'
import pagination from '@/components/Pagination'
export default {
  name: 'CodeTest',
  directives: { waves },
  components: {
    pagination,
    codetestdatils
  },
  props: {
    node: {
      type: Object,
      required: true
    },
    tab3: {
      type: String,
      requird: true,
      default: ''
    }
  },
  data() {
    return {
      query: {},
      drawerCount: 0,
      drawer: false,
      dialogFormVisible: false,
      loading: true,
      codeTestList: [],
      codeTest: {
        testName: ''
      },
      total: 0,
      searchEntity: {
        pageNum: 1,
        pageSize: 10,
        parentId: '',
        testName: ''
      },
      rules: {
        testName: [
          { required: true, message: '请输入名称', trigger: 'blur' },
          { min: 3, max: 25, message: '长度在 3 到 25 个字符', trigger: 'blur' }
        ]
      }

    }
  },
  watch: {
    node() {
      this.pageList()
    },
    tab3(val) {
      if (val === 'third') {
        this.pageList()
      }
    }
  },
  created() {
    this.pageList()
  },
  methods: {
    handleDatils(data) {
      this.drawer = true
      this.query = data
      this.drawerCount++
    },
    drawerClose(done) {
      done()
    },
    closeDraw() {

    },
    handleDelete(data) {
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteCodeTest(data)
      }).catch(() => {
        this.$message.info('已取消删除')
      })
    },
    deleteCodeTest(data) {
      deleteCodeTest(data).then(res => {
        this.$message.success('删除成功')
        this.pageList()
      }).catch(() => {
        this.$message.error('删除失败')
      })
    },
    handleEdit(data) {
      this.codeTest = data
      this.dialogFormVisible = true
    },
    beforeClose(done) {
      this.$refs.codeTestForm.resetFields()
      done()
    },
    handleSubmit() {
      this.$refs.codeTestForm.validate((valid) => {
        if (valid) {
          if (this.codeTest.id) {
            updateCodeTest(this.codeTest).then(res => {
              this.$message.success('更新成功')
              this.dialogFormVisible = false
              this.pageList()
            }).catch(() => {
              this.$message.error('更新失败')
              this.pageList()
            })
          } else {
            this.codeTest.parentId = this.node.id
            this.codeTest.project = this.node.label
            addCodeTest(this.codeTest).then(res => {
              this.dialogFormVisible = false
              this.$message.success('保存成功')
              this.pageList()
            }).catch(() => {
              this.$message.error('保存失败')
            })
          }
        }
      })
    },
    pageList() {
      this.loading = true
      this.searchEntity.parentId = this.node.id
      codeTestPageList(this.searchEntity).then(res => {
        this.loading = false
        this.total = res.data.total
        this.codeTestList = res.data.list
      }).catch(() => {
        this.loading = false
        this.$message.error('查询代码测试失败')
      })
    }

  }
}
</script>

