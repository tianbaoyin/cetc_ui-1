<template>
  <div class="app-container">

    <el-input v-model="queryEntity.fullname" placeholder="请输入用户的真实姓名" style="width: 200px;" size="small" class="filter-item" @keyup.enter.native="handleFilter" />
    <el-button class="filter-item" type="primary" size="small" icon="el-icon-search" @click="handleFilter">
      搜索
    </el-button>

    <el-button class="filter-item" type="primary" size="small" icon="el-icon-refresh-right" @click="reset">
      重置
    </el-button>

    <el-button v-permission="['permission_manager_user_add']" class="filter-item" type="primary" size="small" icon="el-icon-plus" @click="handleSave">
      新增
    </el-button>

    <el-divider />
    <el-table v-loading="definitionLoading" :data="tableData" border highlight-current-row stripe style="width: 100%">
      <el-table-column align="center" type="index" label="序号" width="80" />
      <el-table-column prop="username" align="center" label="用户名" />
      <el-table-column prop="fullname" align="center" label="姓名" />
      <el-table-column prop="phone" align="center" label="手机" />
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
      <el-table-column align="center" label="启用" width="100">
        <template slot-scope="scope">
          <el-tag
            v-show="scope.row.enabled"
            type="primary"
            disable-transitions
          >是</el-tag>
          <el-tag
            v-show="!scope.row.enabled"
            type="danger"
            disable-transitions
          >否</el-tag>
        </template>

      </el-table-column>
      <el-table-column v-if="checkPermission(['root','permission_manager_user_lock'])" align="center" label="是否锁定" width="100">
        <template slot-scope="scope">
          <el-switch v-if="scope.row.type" v-model="scope.row.status" :disabled="scope.row.status" active-color="#13ce66" inactive-color="#ff4949" @change="handleLocked(scope.row.username)" />
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建时间">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="修改时间">
        <template slot-scope="scope">
          <span>{{ scope.row.updateTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="操作"
        width="240"
        fixed="right"
      >
        <template slot-scope="{row}">
          <el-tooltip class="item" effect="dark" content="修改用户" placement="top-start">
            <el-button v-permission="['root','permission_manager_user_update']" type="primary" size="small" icon="el-icon-edit" circle @click="handleUpdate(row)" />
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除用户" placement="top-start">
            <el-button v-permission="['root','permission_manager_user_delete']" type="danger" size="small" icon="el-icon-delete" circle @click="handleDelete(row)" />
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="分配角色" placement="top-start">
            <el-button v-permission="['root','permission_manager_user_addrole']" type="info" size="small" circle @click="handleRole(row)"><svg-icon icon-class="role" /> </el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="启用帐户" placement="top-start">
            <el-button v-permission="['root','permission_manager_user_enabled']" type="success" size="small" icon="el-icon-circle-check" circle @click="handleEnabled(row)" />
          </el-tooltip>

        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="queryEntity.pageNum" :limit.sync="queryEntity.pageSize" @pagination="handleFilter()" />
    <el-dialog
      v-dialogDrag
      :title="dialogTitle"
      :visible.sync="dialogFormVisible"
      :before-close="clearCache"
      :close-on-click-modal="false"
    >
      <el-form ref="user" :model="user" :rules="checkRules">
        <input type="password" name="username" style="position: absolute;left: -10000px;">
        <el-form-item label="用户名" :label-width="formLabelWidth" prop="username">
          <el-input ref="username" v-model="user.username" type="text" :disabled="isUpdate" autocomplete="off" />
        </el-form-item>
        <input type="password" name="username" style="position: absolute;left: -10000px;">
        <el-form-item label="密码" :label-width="formLabelWidth" prop="password">
          <el-input ref="password" v-model="user.password" type="password" show-password autocomplete="off" />
        </el-form-item>

        <el-form-item label="姓名" :label-width="formLabelWidth" prop="fullname">
          <el-input v-model="user.fullname" autocomplete="off" />
        </el-form-item>

        <el-form-item label="性别" :label-width="formLabelWidth">
          <template>
            <el-radio v-model="user.sex" :label="true">男</el-radio>
            <el-radio v-model="user.sex" :label="false">女</el-radio>
          </template>
        </el-form-item>

        <el-form-item label="手机" :label-width="formLabelWidth">
          <el-input v-model="user.phone" autocomplete="off" />
        </el-form-item>
        <div v-if="typeshow">
          <el-form-item label="内置" :label-width="formLabelWidth">
            <el-switch v-model="user.type" active-color="#13ce66" inactive-color="#ff4949" />
          </el-form-item>
        </div>

      </el-form>
      <div slot="footer" class="dialog-footer">

        <el-button type="primary" :loading="buttonLoading" @click="saveUser">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog
      v-dialogDrag
      v-loading="definitionLoading"
      :title="dialogTitle"
      :visible.sync="roleDialogFormVisible"
      :close-on-click-modal="false"
    >
      <el-form>

        <el-form-item label="角色" :label-width="formLabelWidth">
          <el-select v-model="checkedRoles" el-select multiple placeholder="请选择" style="width:80%">
            <el-option
              v-for="item in roles"
              :key="item.roleId"
              :label="item.name"
              :value="item.roleId"
            />
          </el-select>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="roleDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveRoleByUserId()">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog
      v-dialogDrag
      :title="dialogTitle"
      :visible.sync="enabledDialogFormVisible"
      :close-on-click-modal="false"
      width="30%"
    >
      <el-form>
        <el-form-item label="状态" :label-width="formLabelWidth">
          <template>
            <el-radio v-model="user.enabled" :label="true" border>开启</el-radio>
            <el-radio v-model="user.enabled" :label="false" border>停用</el-radio>

          </template>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="buttonLoading" @click="saveEnabled">确 定</el-button>
      </div>
    </el-dialog>

  </div>

</template>

<script>
import permission from '@/directive/permission/index.js'
import pagination from '@/components/Pagination'
import { mapGetters } from 'vuex'
import { queryPageUsers, findByUserId, saveUser, deleteByUserId, saveRoleByUserId, unLocked,
  checkUsername, saveUpdatedUser, enabledUser } from '@/api/user.js'
import { findAllRoles } from '@/api/role'
import checkPermission from '@/utils/permission'
export default {
  name: 'Usertable',
  directives: { permission },
  components: { pagination },

  data() {
    const validateUsername = (rule, value, callback) => {
      if (this.user.id == null) {
        if (value != null && value.length > 3 && value.indexOf(' ') < 0) {
          checkUsername(value).then(response => {
            if (response.data) {
              callback(new Error('用户名已存在'))
            } else {
              callback()
            }
          }).catch(() => {
            callback(new Error('用户名校验失败'))
          })
        } else {
          callback(new Error('用户名不能为空且长度不小于4位'))
        }
      } else {
        callback()
      }
    }
    return {
      isUpdate: false,
      dialogTitle: '编辑',
      definitionLoading: false,
      buttonLoading: false,
      dialogFormVisible: false,
      roleDialogFormVisible: false,
      enabledDialogFormVisible: false,

      total: 0,
      tableData: null,
      queryEntity: {
        username: '',
        fullname: '',
        pageNum: 1,
        pageSize: 10
      },
      typeshow: false,
      checkRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [
          { required: true, trigger: 'blur', message: '请输入密码' },
          { min: 6, max: 100, message: '密码长度不小于6位', trigger: 'blur' }
        ],
        fullname: [
          { required: true, trigger: 'blur', message: '请输入真实姓名' },
          { max: 20, message: '用户名不大于20个字符', trigger: 'blur' }
        ]
      },
      user: {
        id: null,
        username: null,
        password: null,
        fullname: null,
        phone: null,
        sex: null,
        status: false,
        enabled: null,
        type: false
      },
      locked: false,
      formLabelWidth: '120px',
      roles: [],
      checkedRoles: []

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
    this.findAllRoles()
  },

  methods: {
    checkPermission,
    handleUpdate(row) {
      if (row.type && this.username !== 'admin') {
        this.$alert('系统内置用户不可修改', '提示', {
          confirmButtonText: '确定',
          callback: action => {
          },
          type: 'warning'
        })
      } else {
        this.dialogTitle = '编辑'
        this.buttonLoading = false
        this.isUpdate = true
        this.user = Object.assign({}, row)
        if (this.username === 'admin') {
          this.typeshow = true
        } else {
          this.typeshow = false
        }
        this.dialogFormVisible = true
      }
    },

    clearCache(done) {
      done()
      this.$refs['user'].resetFields()
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
    reset() {
      this.queryEntity = {
        username: '',
        fullname: '',
        pageNum: 1,
        pageSize: 10
      }
    },
    handleSave() {
      this.dialogTitle = '新增'
      this.isUpdate = false
      this.buttonLoading = false
      this.user = {
        id: null,
        username: null,
        fullname: '',
        phone: '',
        type: false,
        sex: true
      }
      if (this.username === 'admin') {
        this.typeshow = true
      } else {
        this.typeshow = false
      }

      this.dialogFormVisible = true
    },
    handleRole(row) {
      if (row.type && this.username !== 'admin') {
        this.$alert('系统内置用户不可修改角色', '提示', {
          confirmButtonText: '确定',
          callback: action => {
          },
          type: 'warning'
        })
      } else {
        this.dialogTitle = '分配角色'
        this.definitionLoading = true
        this.user = Object.assign({}, row)
        findByUserId(this.user.id).then(response => {
          const result = response.data
          this.checkedRoles = []
          for (const item of result) {
            this.checkedRoles.push(item.roleId)
          }
          this.roleDialogFormVisible = true
          this.definitionLoading = false
        }).catch(() => {
          this.$message.error('查询已有角色失败')
          this.definitionLoading = false
        })
      }
    },

    handleEnabled(row) {
      this.dialogTitle = '启用/停用'
      this.buttonLoading = false
      if (row.type && this.username !== 'admin') {
        this.$alert('系统内置用户不可停用', '提示', {
          confirmButtonText: '确定',
          callback: action => {
          },
          type: 'warning'
        })
      } else {
        this.user = Object.assign({}, row)
        this.enabledDialogFormVisible = true
      }
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
    handleDelete(row) {
      if (row.type && this.username !== 'admin') {
        this.$alert('系统内置用户不可删除', '提示', {
          confirmButtonText: '确定',
          callback: action => {
          },
          type: 'warning'
        })
      } else {
        this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.user = Object.assign({}, row)
          deleteByUserId(this.user.id).then(response => {
            this.handleFilter()
            this.$message({
              type: 'success',
              message: '删除用户成功!'
            })
          }).catch(() => {
            this.$message.error('删除用户失败')
          })
        }

        ).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      }
    },

    saveUser() {
      this.buttonLoading = true
      this.$refs.user.validate((valid) => {
        if (valid) {
          if (this.user.id != null) {
            saveUpdatedUser(this.user).then(response => {
              this.dialogFormVisible = false
              this.buttonLoading = false
              this.handleFilter()
              this.$message({
                type: 'success',
                message: '修改用户成功'
              })
            }).catch(() => {
              this.dialogFormVisible = false
              this.buttonLoading = false
              this.$message.error('修改用户失败')
            })
          } else {
            saveUser(this.user).then(response => {
              this.dialogFormVisible = false
              this.buttonLoading = false
              this.handleFilter()
              this.$message({
                type: 'success',
                message: '添加用户成功'
              })
            }).catch(() => {
              this.dialogFormVisible = false
              this.buttonLoading = false
              this.$message.error('添加用户失败')
            })
          }
        } else {
          this.buttonLoading = false
          return false
        }
      })
    },

    saveRoleByUserId() {
      saveRoleByUserId(this.user.id, this.checkedRoles).then(response => {
        this.$message({
          type: 'success',
          message: '操作成功!'
        })
        this.roleDialogFormVisible = false
      }).catch(() => {
        this.$message.error('操作失败')
        this.roleDialogFormVisible = false
      })
    },

    saveEnabled() {
      this.buttonLoading = true
      enabledUser(this.user).then(response => {
        this.enabledDialogFormVisible = false
        this.buttonLoading = false
        this.handleFilter()
        if (this.user.enabled) {
          this.$message.success('激活用户成功!')
        } else {
          this.$message.success('停用用户成功!')
        }
      }).catch(() => {
        this.enabledDialogFormVisible = false
        this.buttonLoading = false
        if (this.user.enabled) {
          this.$message.error('激活用户失败')
        } else {
          this.$message.error('停用用户失败')
        }
      })
    },

    saveLocked() {

    },

    findAllRoles() {
      findAllRoles().then(response => {
        this.roles = response.data
      }).catch(() => {
        this.$message.error('查询所有角色失败')
      })
    }

  }
}
</script>
