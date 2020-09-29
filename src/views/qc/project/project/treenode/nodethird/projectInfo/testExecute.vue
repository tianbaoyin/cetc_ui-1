<template>
  <div>
    <div class="filter-container">
      <el-button type="primary" size="small" icon="el-icon-plus" @click="add()">新增</el-button>
    </div>

    <el-dialog v-dialog-drag title="测试执行编辑" width="1200px" :before-close="beforeClose" :visible.sync="drawer" append-to-body>
      <testExecuteAdd ref="testExecuteAdd" :month-commit-form="monthCommitForm" :projectexcute="currentExcute" :pagecount="pageCount" @closeDrawer="closeDrawer" />
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="toSubmit">确 定</el-button>
      </div>
    </el-dialog>

    <el-table
      v-loading="tableLoading"
      :data="projectExcuteList"
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
        label="所属令号"
        prop="kingdom"
      />
      <el-table-column
        label="所属令号"
        prop="code"
      />
      <el-table-column

        label="所属项目"
        prop="project"
      />
      <el-table-column

        label="执行时间"
        prop="useTime"
      />
      <el-table-column

        label="执行地点"
        prop="excuteLocal"
      />
      <el-table-column

        label="执行人数"
        prop="excuters"
      />
      <el-table-column

        label="执行用例数"
        prop="examples"
      />
      <el-table-column
        width="200px"
        label="操作"
      >
        <template slot-scope="scope">
          <el-button size="mini" type="primary" icon="el-icon-edit" @click="update(scope.row)">编辑 </el-button>
          <el-button size="mini" type="danger" icon="el-icon-delete" @click="toDelete(scope.row)">删除 </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="searchEntity.pageNum" :limit.sync="searchEntity.pageSize" @pagination="pageList()" />
  </div>
</template>
<script>
import { projectExcutePageList, deleteExcute } from '@/api/project/projectExcute.js'
import pagination from '@/components/Pagination'
import testExecuteAdd from '@/views/qc/project/project/treenode/nodethird/projectInfo/testExecuteAdd.vue'
import permission from '@/directive/permission/index.js' // 权限判断指令
import checkPermission from '@/utils/permission'
export default {
  name: 'TestExecute',
  directives: { permission },
  components: {
    testExecuteAdd,
    pagination
  },
  props: {
    node: {
      type: Object,
      required: true
    },

    monthCommitForm: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      pageCount: 0,
      drawer: false,
      tableLoading: true,
      projectExcuteList: [],
      total: 0,
      searchEntity: {
        pageNum: 1,
        pageSize: 10,
        projectId: this.node.id,
        monthCommitId: this.monthCommitForm.id
      },
      currentExcute: {},
      projectExcute: {
        projectId: this.node.id,
        name: '',
        useTime: '',
        excuteLocal: '',
        excuters: '',
        examples: '',
        passFlag: false
      }

    }
  },
  watch: {
    node() {
      this.searchEntity.projectId = this.node.id
      if (this.monthCommitForm.id) {
        this.pageList()
      }
    },
    monthCommitForm() {
      this.searchEntity.projectId = this.node.id
      this.searchEntity.monthCommitId = this.monthCommitForm.id
      if (this.monthCommitForm.id) {
        this.pageList()
      }
    }
  },
  created() {
    this.pageList()
  },
  methods: {
    checkPermission,
    add() {
      this.projectExcute = {
        projectId: this.node.id,
        name: '',
        useTime: '',
        excuteLocal: '',
        excuters: '',
        examples: '',
        passFlag: false,
        designQusNum: null,
        codeQusNum: null,
        docQusNum: null,
        bianmaQusNum: null,
        qitaQusNum: null,
        guanjianQusNum: null,
        zhongyaoQusNum: null,
        yibanQusNum: null,
        jianyigaijinQusNum: null,
        daimaguimo: null,
        testQusNum: null,
        rjkfman: null
      }
      this.currentExcute = this.projectExcute
      this.pageCount = this.pageCount + 1
      this.drawer = true
    },
    update(data) {
      this.currentExcute = data
      this.pageCount = this.pageCount + 1
      this.drawer = true
    },
    beforeClose(done) {
      this.$confirm('确认关闭').then(_ => {
        this.currentExcute = {}
        this.pageList()
        done()
      }).catch(_ => {
        this.$message.info('取消关闭')
      })
    },
    pageList() {
      this.tableLoading = true
      projectExcutePageList(this.searchEntity).then(res => {
        this.tableLoading = false
        this.total = res.data.total
        this.projectExcuteList = res.data.list
      }).catch(() => {
        this.$message.error('查询测试执行失败')
      })
    },
    toSubmit() {
      this.$refs.testExecuteAdd.toSubmit()
    },
    toDelete(data) {
      this.$confirm('确认删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteExcute(data.id)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    deleteExcute(id) {
      deleteExcute(id).then(res => {
        this.$message.success('删除成功')
        this.pageList()
      }).catch(() => {
        this.$message.error('删除失败')
      })
    },
    closeDrawer() {
      this.drawer = false
      this.pageList()
    }
  }
}
</script>
 <style >
:focus {
   outline: 0;
 }
</style>
