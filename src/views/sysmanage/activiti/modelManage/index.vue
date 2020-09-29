<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button type="primary" size="small" icon="el-icon-plus" class="filter-item" @click="addBpmn()">模型设计</el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :data="modelList"
      border
      highlight-current-row
      stripe
    >
      <el-table-column
        type="index"
        width="50"
        align="center"
        label="序号"
      />
      <el-table-column
        header-align="center"
        prop="id"
        label="模型编号"
      />
      <el-table-column
        align="center"
        prop="revision"
        label="版本"
        width="80"
      />
      <el-table-column
        header-align="center"
        prop="name"
        label="模型名称"
      />
      <el-table-column
        header-align="center"
        prop="key"
        label="模型key"
      />
      <el-table-column
        align="center"
        label="更新时间"
        width="200"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.lastUpdateTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="操作"
        width="380"
        fixed="right"
      >
        <template slot-scope="scope">
          <el-button
            v-waves
            v-permission="['root','process_manager_model_edit']"
            size="small"
            type="primary"
            :disabled="scope.row.persistentState.deploymentId != null"
            icon="el-icon-edit"
            @click="edit(scope.row)"
          >编辑</el-button>
          <el-button
            v-waves
            v-permission="['root','process_manager_model_deploy']"
            size="small"
            type="success"
            :disabled="scope.row.persistentState.deploymentId != null"
            icon="el-icon-magic-stick"
            @click="publishModel(scope.row)"
          >发布</el-button>
          <el-button
            v-waves
            v-permission="['root','process_manager_model_revoke']"
            size="small"
            type="warning"
            :disabled="scope.row.persistentState.deploymentId == null"
            icon="el-icon-switch-button"
            @click="revokePublishModel(scope.row)"
          >撤销</el-button>
          <el-button
            v-waves
            v-permission="['root','process_manager_model_delete']"
            size="small"
            type="danger"
            icon="el-icon-delete"
            @click="deleteModel(scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize" @pagination="ifindModelList()" />
    <el-drawer
      size="90%"
      :visible.sync="drawer"
      :before-close="beforCloseDrawer"
      :with-header="true"
    >
      <iframe id="myiframe" :src="createUrl" width="100%" height="100%" border="0" />
    </el-drawer>
    <el-dialog
      title="模型名称"
      :visible.sync="dialogVisible"
      :before-close="closeDialog"
      width="30%"
      :close-on-click-modal="false"
    >
      <el-form
        ref="bpmnForm"
        :model="bpmnForm"
        :rules="rules"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item
          label="模型名称"
          prop="name"
        >
          <el-input v-model="bpmnForm.name" />
        </el-form-item>
        <el-form-item
          label="模型key"
          prop="key"
        >
          <el-input v-model="bpmnForm.key" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" @click="createBpmn">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>
<script>
import { findModelList, publish, delModel, revokePublish } from '@/api/activiti/workflow'
import permission from '@/directive/permission/index.js'
import pagination from '@/components/Pagination' // secondary package based on el-pagination
import waves from '@/directive/waves' // waves directive
import { bpmnUrl } from '@/settings.js'
export default {
  name: 'ModelManage',
  components: { pagination },
  directives: { waves, permission },
  data() {
    return {
      drawer: false,
      total: 0,
      modelList: [],
      listLoading: true,
      buttonLoading: false,
      dialogVisible: false,
      createUrl: '',
      listQuery: {
        pageNum: 1,
        pageSize: 10
      },
      bpmnForm: {
        name: '',
        key: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入模型名称', trigger: 'blur' },
          { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' }
        ],
        key: [
          { required: true, message: '请输入模型Key', trigger: 'blur' },
          { min: 3, message: '长度在大于3个字符', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.ifindModelList()
  },
  methods: {
    addBpmn() {
      this.dialogVisible = true
      this.createUrl = ''
      this.bpmnForm = {}
    },
    beforCloseDrawer(done) {
      done()
      this.ifindModelList()
    },
    ifindModelList() {
      this.listLoading = true
      findModelList(this.listQuery).then(response => {
        if (response.flag) {
          this.total = response.data.total // 设置页面总数
          this.modelList = response.data.list
        } else {
          this.$message.error('查询失败')
        }
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
    },
    handleTabClick(tab, event) {
      switch (Number(tab.index)) {
        case 0:
          this.ifindModelList()
          break
        case 1:
          this.dialogVisible = true
          this.createUrl = ''
          this.bpmnForm = {}
          break
      }
    },
    closeDialog() {
      this.dialogVisible = false
    },
    createBpmn() {
      this.$refs.bpmnForm.validate((valid) => {
        if (valid) {
          this.dialogVisible = false
          this.drawer = true
          this.createUrl = bpmnUrl + '/create?name=' + this.bpmnForm.name + '&key=' + this.bpmnForm.key
        }
      })
    },
    edit(row) {
      this.drawer = true
      this.createUrl = bpmnUrl + '/editor?modelId=' + row.id
    },
    publishModel(row) {
      publish(row.id).then(response => {
        if (response.code !== 20000) {
          this.$message.error(response.message)
        } else {
          this.$message({
            message: '发布成功',
            type: 'success'
          })
        }
        this.ifindModelList()
      }).catch(() => {
        this.$message.error('发布失败')
      })
    },
    revokePublishModel(row) {
      revokePublish(row.id).then(response => {
        if (response.code !== 20000) {
          this.$message.error(response.message)
        } else {
          this.$message({
            message: '撤销成功',
            type: 'success'
          })
        }
        this.ifindModelList()
      }).catch(() => {
        this.$message.error('撤销失败')
      })
    },
    deleteModel(row) {
      delModel(row.id).then(response => {
        if (response.flag) {
          this.ifindModelList()
          this.$message({
            message: response.message,
            type: 'success'
          })
        } else {
          this.$message.error('删除失败')
        }
      }).catch(() => {
        this.$message.error('删除失败')
      })
    }
  }
}

</script>

