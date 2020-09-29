<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button-group>
        <el-button v-permission="['root','process_manager_group.add']" type="primary" size="medium" icon="el-icon-plus" @click="handleAddGroup()">流程组</el-button>

      </el-button-group>
    </div>
    <el-divider />
    <el-table
      v-loading="definitionLoading"
      :data="groupList"
      border
      stripe
      highlight-current-row
      style="width: 100%"
    >

      <el-table-column
        align="center"
        type="index"
        label="序号"
        width="80"
      />
      <el-table-column
        header-align="center"
        prop="id"
        label="用户组ID"
        width="250"
      />
      <el-table-column
        header-align="center"
        prop="name"
        label="名称"
      />
      <el-table-column
        header-align="center"
        prop="type"
        label="类型"
      />

      <el-table-column

        label="操作"
        align="center"
        width="360"
        fixed="right"
      >
        <template slot-scope="scope">

          <el-button v-permission="['root','process_manager_group.edit']" type="primary" icon="el-icon-edit" size="small" @click="handleUpdateGroup(scope.row)">编辑</el-button>
          <el-button v-permission="['root','process_manager_group.delete']" type="danger" icon="el-icon-delete" size="small" @click="deleteGroupById(scope.row)">删除</el-button>
          <el-button v-permission="['root','process_manager_group.user']" type="success" icon="el-icon-plus" size="small" @click="handleAddGroupUser(scope.row)">添加组用户</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="pageEntity.pageNum" :limit.sync="pageEntity.pageSize" @pagination="handleFilter()" />

    <el-dialog v-dialogDrag :title="dialogTitle" :visible.sync="groupDialogFormVisible" :before-close="clearCache" :close-on-click-modal="false">
      <el-form ref="group" :model="group" :rules="checkRules">
        <el-form-item label="用户组ID" :label-width="formLabelWidth" prop="id">
          <el-input v-model="group.id" autocomplete="off" :disabled="isUpdate" />
        </el-form-item>
        <el-form-item label="名称" :label-width="formLabelWidth" prop="name">
          <el-input v-model="group.name" autocomplete="off" />
        </el-form-item>
        <el-form-item label="类型" :label-width="formLabelWidth" prop="type">
          <el-input v-model="group.type" autocomplete="off" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button v-show="!isUpdate" type="primary" @click="addGroup()">确 定</el-button>
        <el-button v-show="isUpdate" type="primary" @click="updateGroup()">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog
      v-dialogDrag
      title="添加组用户"
      width="1200px"
      :visible.sync="addGroupUserDialogFormVisible"
      :close-on-click-modal="false"
    >
      <el-form>
        <div style="text-align: center">

          <el-transfer
            v-model="selectedUserIds"
            style="text-align: left; display: inline-block"
            filterable
            :filter-method="filterMethod"
            filter-placeholder="请输入用户姓名"
            :data="options"
            :titles="['系统用户', '流程组用户']"
          />

        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addGroupUserDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUserGroup()">确 定</el-button>
      </div>
    </el-dialog>

    <!-- <el-drawer
      title="工作流用户"
      :with-header="false"
      size="50%"
      :visible.sync="drawer"
    >
      <div style="padding:20px;color:blue">工作流用户</div>
      <div class="app-container">
        <div class="filter-container">
          <el-input v-model="pageActUserEntity.fullname" placeholder="姓名" style="width: 200px;" class="filter-item" size="medium" />
          <el-button class="filter-item" type="primary" size="medium" icon="el-icon-plus" @click="queryActUserByName()">查询</el-button>
          <el-button class="filter-item" type="primary" size="medium" icon="el-icon-plus" v-permission="['root','process_manager_activiti.user.add']"  @click="handleAddActUsers()">新增</el-button>

        </div>
        <el-table
          v-loading="drawerDefinitionLoading"
          :data="actUsers"
          border
          style="width: 100%"
        >
          <el-table-column
            prop="firstName"
            label="姓名"
          />
          <el-table-column
            prop="id"
            label="用户名"
          />
        </el-table>
        <pagination v-show="actTotal>0" :total="actTotal" :page.sync="pageActUserEntity.pageNum" :limit.sync="pageActUserEntity.pageSize" @pagination="handleAddUser()" />

      </div>
    </el-drawer> -->

  </div>
</template>

<script>
import pagination from '@/components/Pagination'
import permission from '@/directive/permission/index.js'
import { queryAllUsers } from '@/api/user'
import { findGroups, addGroup, findGroupById, updateGroupById, deleteGroupById, addUserGroup, addActUsers, queryByName, findAllTransferActUsers,
  findGroupUsers, findPageActUsers, findAllActUsers } from '@/api/activiti/processuser'
import waves from '@/directive/waves' // waves directive
export default {
  name: 'ProcessUser',
  components: { pagination },
  directives: { waves, permission },
  data() {
    const validateGroupId = (rule, value, callback) => {
      if (!this.isUpdate) {
        if (value != null) {
          findGroupById(value).then(response => {
            if (response.data) {
              callback(new Error('用户组ID已存在'))
            } else {
              callback()
            }
          }).catch(() => {
            callback(new Error('用户组ID校验失败'))
          })
        } else {
          callback(new Error('用户组ID不能为空'))
        }
      } else {
        callback()
      }
    }
    return {
      definitionLoading: false,
      drawerDefinitionLoading: false,
      sysUsers: [],
      selectedSysUserIds: [],
      options: [],
      actUsers: [],
      drawer: false,
      selectedUserIds: [],
      groupDialogFormVisible: false,
      sysUserDialogFormVisible: false,
      addGroupUserDialogFormVisible: false,
      dialogTitle: '新建流程用户组',
      total: 0,
      actTotal: 0,
      isUpdate: false,
      formLabelWidth: '120px',
      groupList: null,
      checkRules: {
        id: [{ required: true, trigger: 'blur', validator: validateGroupId }],
        name: [{ required: true, trigger: 'blur', message: '请输入名称' }],
        type: [{ required: true, trigger: 'blur', message: '请输入类型' }]
      },
      queryUserEntity: {
        fullname: ''
      },
      pageEntity: {
        pageNum: 1,
        pageSize: 10
      },
      pageActUserEntity: {
        pageNum: 1,
        pageSize: 10,
        fullname: ''
      },
      group: {
        id: null,
        name: null,
        type: null
      }
    }
  },
  created() {
    this.handleFilter()
  },
  methods: {
    clearCache(done) {
      done()
      this.$refs['group'].resetFields()
    },
    handleFilter() {
      this.definitionLoading = true
      findGroups(this.pageEntity).then(response => {
        this.total = response.data.total
        this.groupList = response.data.list
        this.definitionLoading = false
      }).catch(() => {
        this.definitionLoading = false
      })
    },
    handleAddGroup() {
      this.groupDialogFormVisible = true
      this.isUpdate = false
      this.dialogTitle = '新建流程用户组'
      this.group = {
        id: null,
        name: null,
        type: null
      }
    },
    handleUpdateGroup(row) {
      this.group = Object.assign({}, row)
      this.isUpdate = true
      this.dialogTitle = '编辑流程用户组'
      this.groupDialogFormVisible = true
    },
    handleAddUser() {
      this.drawerDefinitionLoading = true
      findPageActUsers(this.pageActUserEntity).then(response => {
        this.actUsers = response.data.list
        this.actTotal = response.data.total
        this.drawerDefinitionLoading = false
        this.drawer = true
      }).catch(() => {
        this.drawerDefinitionLoading = false
        this.$message.error('查询系统用户失败')
      })
    },
    addGroup() {
      this.definitionLoading = true
      this.$refs.group.validate((valid) => {
        if (valid) {
          addGroup(this.group).then(response => {
            this.definitionLoading = false
            this.groupDialogFormVisible = false
            if (response.flag) {
              this.$message.success('添加用户组成功')
            } else {
              this.$message.error('添加用户组失败')
            }
            this.handleFilter()
          }).catch(() => {
            this.handleFilter()
            this.definitionLoading = false
            this.groupDialogFormVisible = false
          })
        } else {
          this.definitionLoading = false
          return false
        }
      })
    },

    updateGroup() {
      this.definitionLoading = true
      this.$refs.group.validate((valid) => {
        if (valid) {
          updateGroupById(this.group).then(response => {
            this.definitionLoading = false
            this.groupDialogFormVisible = false
            if (response.flag) {
              this.$message.success('修改用户组成功')
            } else {
              this.$message.error('修改用户组失败')
            }
            this.handleFilter()
          }).catch(() => {
            this.handleFilter()
            this.definitionLoading = false
            this.groupDialogFormVisible = false
          })
        } else {
          this.definitionLoading = false
          return false
        }
      })
    },

    deleteGroupById(row) {
      this.$confirm('此操作将永久删除该数据及关联的字典数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.group = Object.assign({}, row)
        this.definitionLoading = true
        deleteGroupById(this.group.id).then(response => {
          this.$message.success('删除用户组成功')
          this.definitionLoading = false
          this.handleFilter()
        }).catch(() => {
          this.definitionLoading = false
          this.$message.success('删除用户组失败')
          this.handleFilter()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    handleAddActUsers() {
      this.definitionLoading = true
      this.sysUsers = []
      this.findAllActUsers()

      queryAllUsers(this.queryUserEntity).then(response => {
        this.sysUsers = response.data
        this.sysUserDialogFormVisible = true
        this.definitionLoading = false
      }).catch(() => {
        this.$message.error('查询系统用户失败')
        this.definitionLoading = false
      })
    },
    findAllActUsers() {
      findAllActUsers().then(response => {
        this.selectedSysUserIds = response.data
      }).catch(() => {
      })
    },
    saveActUsers() {
      this.definitionLoading = true
      addActUsers(this.selectedSysUserIds).then(response => {
        this.handleAddUser()
        this.definitionLoading = false
        this.$message.success('保存工作流用户成功')
      }).catch(() => {
        this.handleAddUser()
        this.$message.error('保存工作流用户失败')
        this.definitionLoading = false
      })
    },
    handleAddGroupUser(row) {
      this.definitionLoading = true
      this.options = []
      this.findGroupUsers(row)
      findAllTransferActUsers().then(response => {
        this.options = response.data
        this.addGroupUserDialogFormVisible = true
        this.definitionLoading = false
      }).catch(() => {
        this.definitionLoading = false
      })
    },
    queryActUserByName() {
      this.drawerDefinitionLoading = true
      queryByName(this.pageActUserEntity).then(response => {
        this.actUsers = response.data.list
        this.actTotal = response.data.total
        this.drawerDefinitionLoading = false
      }).catch(() => {
        this.$message.error('搜索工作流用户失败')
      })
    },
    findGroupUsers(row) {
      this.group = Object.assign({}, row)
      findGroupUsers(this.group.id).then(response => {
        this.selectedUserIds = response.data
      }).catch(() => {
        this.$message.error('查询用户组用户失败')
      })
    },

    addUserGroup() {
      this.definitionLoading = true
      addUserGroup(this.group.id, this.selectedUserIds).then(response => {
        this.definitionLoading = false
        this.$message.success('添加组用户成功')
      }).catch(() => {
        this.definitionLoading = false
        this.$message.error('添加组用户失败')
      })
    },
    filterMethod(query, item) {
      return item.label.indexOf(query) > -1
    }

  }

}
</script>

<style>
    .el-transfer-panel{
        width: 400px;
    }
</style>

