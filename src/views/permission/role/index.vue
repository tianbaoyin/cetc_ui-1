<template>
  <div class="app-container">
    <el-button-group>
      <el-button v-permission="['root','permission_manager_role_add']" type="primary" size="medium" icon="el-icon-plus" @click="handleAddRole()">新增</el-button>
    </el-button-group>
    <el-divider />
    <el-table
      v-loading="definitionLoading"
      :data="roles"
      border
      stripe
      style="width: 100%"
    >

      <el-table-column

        align="center"
        type="index"
        label="序号"
        width="80"
      />
      <el-table-column
        align="center"
        prop="name"
        label="角色名称"
        width="180"
      />
      <el-table-column
        align="center"
        prop="code"
        label="角色标识"
      />

      <el-table-column
        align="center"
        label="创建时间"
        width="200"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.createTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>

        </template>
      </el-table-column>

      <el-table-column
        align="center"
        label="修改时间"
        width="200"
      >
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
          <el-tooltip class="item" effect="dark" content="查看" placement="top-start">
            <el-button v-permission="['root','permission_manager_role_check']" circle type="success" size="small" icon="el-icon-view" @click="handleCheck(row)" />
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="编辑" placement="top-start">
            <el-button v-permission="['root','permission_manager_role_update']" circle type="primary" size="small" icon="el-icon-edit" @click="handleUpdate(row)" />
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="top-start">
            <el-button v-permission="['root','permission_manager_role_delete']" circle type="danger" size="small" icon="el-icon-delete" @click="handleDelete(row)" />
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="权限" placement="top-start">
            <el-button v-permission="['root','permission_manager_role_menu']" circle type="info" size="small" icon="el-icon-plus" @click="handleAssign(row)" />
          </el-tooltip>
        </template>
      </el-table-column>

    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="queryEntity.pageNum" :limit.sync="queryEntity.pageSize" @pagination="findRoles()" />

    <el-dialog
      v-dialogDrag
      :title="titleName"
      :visible.sync="dialogFormVisible"
      :before-close="clearCache"
      :close-on-click-modal="false"
    >
      <el-form ref="role" :model="role" :rules="checkRules">
        <el-form-item label="角色名称" prop="name" :label-width="formLabelWidth">
          <el-input v-model="role.name" autocomplete="off" />
        </el-form-item>

        <el-form-item label="角色标识" prop="code" :label-width="formLabelWidth">
          <el-input v-model="role.code" autocomplete="off" />
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveRole()">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog
      v-dialogDrag
      title="查看"
      :visible.sync="dialogFormVisible2"
      :close-on-click-modal="false"
    >
      <el-form :model="role">
        <el-form-item label="角色名称" :label-width="formLabelWidth">
          <el-input v-model="role.name" autocomplete="off" readonly />
        </el-form-item>

        <el-form-item label="角色标识" :label-width="formLabelWidth">
          <el-input v-model="role.code" autocomplete="off" readonly />
        </el-form-item>

        <el-form-item label="创建时间" :label-width="formLabelWidth">
          <el-date-picker v-model="role.createTime" type="datetime" format="yyyy-MM-dd HH:mm:ss" autocomplete="off" readonly />
        </el-form-item>

        <el-form-item label="修改时间" :label-width="formLabelWidth">
          <el-date-picker v-model="role.updateTime" type="datetime" format="yyyy-MM-dd HH:mm:ss" autocomplete="off" readonly />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible2 = false">关闭</el-button>
      </div>
    </el-dialog>

    <el-dialog
      v-dialogDrag
      title="分配权限"
      :visible.sync="dialogFormVisible3"
      width="20%"
      :close-on-click-modal="false"
    >
      <div style="margin-top:-20px">
        <el-tree
          ref="tree"
          v-loading="definitionLoading"
          :data="data"
          show-checkbox
          node-key="id"
          :props="defaultProps"
          check-strictly
          :default-checked-keys="checkedKeys"
        />
      </div>

      <div slot="footer" class="dialog-footer">

        <el-button @click="dialogFormVisible3 = false">取 消</el-button>
        <el-button type="primary" @click="saveCheckedNodes">确定</el-button>
      </div>
    </el-dialog>

  </div>

</template>

<script>
import pagination from '@/components/Pagination'
import permission from '@/directive/permission/index.js'
import { mapGetters } from 'vuex'
import { findPageRoles, saveRole, deleteRoleById, insertRoleMenus, findMenuIdsByRoleId } from '@/api/role'
import { findAllMenusVisble } from '@/api/menu'
import { toTreeData } from '@/utils/data-to-tree'
export default {
  name: 'RolePage',
  directives: { permission },
  components: { pagination },
  data() {
    return {
      data: [],
      checkedKeys: [],
      defaultProps: {
        parent: 'parentId',
        children: 'children',
        value: 'id',
        label: 'name'
      },
      definitionLoading: true,
      total: 0,
      roles: null,
      queryEntity: {
        pageNum: 1,
        pageSize: 10
      },
      checkRules: {
        name: [{ required: true, trigger: 'blur', message: '请输入角色名称' }],
        code: [{ required: true, trigger: 'blur', message: '请输入角色标识' }]
      },
      dialogFormVisible: false,
      dialogFormVisible2: false,
      dialogFormVisible3: false,
      titleName: '新建角色',
      role: {
        roleId: null,
        name: '',
        code: '',
        createTime: null,
        updateTime: null
      },
      formLabelWidth: '120px'
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
    this.findRoles()
  },
  methods: {
    clearCache(done) {
      this.$refs['role'].resetFields()
      this.findRoles()
      done()
    },
    saveCheckedNodes() {
      this.dialogFormVisible3 = false
      insertRoleMenus(this.role.roleId, this.$refs.tree.getCheckedKeys()).then(response => {
        this.$message({
          type: 'success',
          message: '保存成功!'
        })
      }).catch(() => {
        this.$message.error('保存失败')
      })
    },

    handleAddRole() {
      this.titleName = '新建角色'
      this.role = {
        roleId: null,
        name: '',
        code: '',
        createTime: null,
        updateTime: null
      }
      this.dialogFormVisible = true
    },

    handleCheck(row) {
      this.titleName = '查看'
      this.role = Object.assign({}, row)
      this.dialogFormVisible2 = true
    },
    handleUpdate(row) {
      console.log(row)
      if (this.username !== 'admin' && (row.code === 'sysadmin' || row.code === 'auditadmin' || row.code === 'secadmin')) {
        this.$alert('系统内置角色不可修改', '提示', {
          confirmButtonText: '确定',
          callback: action => {
          },
          type: 'warning'
        })
      } else {
        this.titleName = '编辑'
        this.role = Object.assign({}, row)
        this.dialogFormVisible = true
      }
    },
    handleDelete(row) {
      if (this.username !== 'admin' && (row.code === 'sysadmin' || row.code === 'auditadmin' || row.code === 'secadmin')) {
        this.$alert('系统内置角色不可删除', '提示', {
          confirmButtonText: '确定',
          callback: action => {
          },
          type: 'warning'
        })
      } else {
        this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.role = Object.assign({}, row)
          deleteRoleById(this.role.roleId).then(response => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.findRoles()
          }).catch(() => {
            this.$message.error('删除失败')
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      }
    },
    handleAssign(row) {
      if (this.username !== 'admin' && (row.code === 'sysadmin' || row.code === 'auditadmin' || row.code === 'secadmin')) {
        this.$alert('系统内置角色不可更改', '提示', {
          confirmButtonText: '确定',
          callback: action => {
          },
          type: 'warning'
        })
      } else {
        this.definitionLoading = true
        this.checkedKeys = []
        this.dialogFormVisible3 = true
        this.role = Object.assign({}, row)
        this.findTree()
        findMenuIdsByRoleId(this.role.roleId).then(response => {
          this.checkedKeys = response.data
          this.definitionLoading = false
        }).catch(() => {
          this.definitionLoading = false
        })
      }
    },

    findTree() {
      findAllMenusVisble().then(res => {
        this.data = toTreeData(res.data)
      }).catch(() => {
        this.$mesage.error('菜单加载失败')
      })
    },

    findRoles() {
      findPageRoles(this.queryEntity).then(response => {
        this.total = response.data.total
        this.roles = response.data.list
        this.definitionLoading = false
      }).catch(() => {
        this.definitionLoading = false
      })
    },

    saveRole() {
      this.$refs.role.validate((valid) => {
        if (valid) {
          this.dialogFormVisible = false
          saveRole(this.role).then(response => {
            this.$message({
              message: response.message,
              type: 'success'
            })
            this.findRoles()
          }).catch(() => {
            this.$message.error('添加失败')
          })
        } else {
          return false
        }
      })
    }

  }

}
</script>

