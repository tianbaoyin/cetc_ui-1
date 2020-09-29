<template>
  <div class="app-container">
    <el-button v-permission="['root','permission_manager_menu_add']" size="small" waves type="primary" @click="editDialog()"><i class="el-icon-plus" /> 添加</el-button>
    <el-divider />
    <el-table
      :data="menus"
      style="width: 100%;margin-bottom: 20px;"
      row-key="id"
      border
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column label="名称" prop="name" header-align="center" />
      <el-table-column label="权限标识" prop="permission" header-align="center" />
      <el-table-column align="center" label="状态" width="100">
        <template slot-scope="scope">
          <el-tag
            v-show="scope.row.visible"
            type="primary"
            disable-transitions
            @click="editStatus(scope.row)"
          >可见</el-tag>
          <el-tag
            v-show="!scope.row.visible"
            type="danger"
            disable-transitions
            @click="editStatus(scope.row)"
          >不可见</el-tag>
        </template>

      </el-table-column>
      <el-table-column label="类型" header-align="center" align="center" width="90">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.type ==0" type="success">菜单</el-tag>
          <el-tag v-else type="info">按钮</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="排序" header-align="center" align="center" width="90">
        <template slot-scope="scope">
          <span style="color:#C71585">{{ scope.row.sort }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="更新时间"
        align="center"
        width="200"
      >
        <template slot-scope="scop">
          <span>{{ scop.row.updateTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column
        width="300"
        label="操作"
        header-align="center"
        align="center"
        fixed="right"
      >
        <template slot-scope="row">
          <el-button v-waves v-permission="['root','permission_manager_menu_edit']" type="primary" size="small" icon="el-icon-edit" @click="editDialog(row)">编辑</el-button>
          <el-button v-waves v-permission="['root','permission_manager_menu_delete']" type="danger" size="small" icon="el-icon-delete" @click="deleteMenu(row)">删除</el-button>
          <el-button v-waves v-permission="['root','permission_manager_menu_add']" type="success" size="small" icon="el-icon-plus" @click="addOnParent(row)">添加</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      v-dialogDrag
      :title="title"
      :visible.sync="dialogVisible"
      width="70%"
      :before-close="clearCache"
      :close-on-click-modal="false"
    >
      <el-form ref="menuForm" :model="menu" :rules="menuRules" label-position="right" label-width="60px">
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="名称" prop="name">
              <el-input v-model="menu.name" placeholder="权限名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="父级">
              <select-tree v-model="menu.parentId" :options="menus" :props="defaultProps" placeholder="请选择（默认根菜单）" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="12">
          <el-col :span="12">
            <el-form-item label="标识" prop="permission">
              <el-input v-model="menu.permission" placeholder="菜单标识" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-row>
              <el-col :span="12">
                <el-form-item label="类型" prop="type">
                  <el-radio-group v-model="menu.type">
                    <el-radio size="medium" :label="0" border>菜单</el-radio>
                    <el-radio size="medium" :label="1" border>按钮</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="排序">
                  <el-input-number v-model="menu.sort" controls-position="right" :min="1" :max="100" />
                </el-form-item>
              </el-col>
            </el-row>

          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button waves type="primary" @click="saveMenu()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { findAllMenus, saveMenu, deleteMenuById, updateMenuById } from '@/api/menu'
import SelectTree from '@/components/TreeSelect/index.vue'
import permission from '@/directive/permission/index.js'
import { toTreeData } from '@/utils/data-to-tree'
import waves from '@/directive/waves' // waves directive
export default {
  directives: { waves, permission },
  components: {
    SelectTree
  },
  data() {
    return {
      menus: [],
      menu: {},

      destroyonclose: true,
      title: '添加',
      dialogVisible: false,
      treedialogVisible: false,
      defaultProps: {
        parent: 'parentId',
        children: 'children',
        value: 'id',
        label: 'name'
      },
      menuRules: {
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        permission: [{ required: true, message: '请输入标识', trigger: 'blur' }],
        type: [{ required: true, message: '请输选择类型', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.findAllMenus()
  },

  methods: {

    clearCache(done) {
      this.$refs['menuForm'].resetFields()
      this.findAllMenus()
      done()
    },
    findAllMenus() {
      findAllMenus().then(res => {
        this.menus = toTreeData(res.data)
      }).catch(() => {
        this.$mesage.error('菜单加载失败')
      })
    },
    editDialog(data) {
      this.menu = { parentId: -1, parentName: '根菜单', type: 0, sort: 1 } // 初始化
      this.title = '添加'
      this.dialogVisible = true
      if (data) {
        this.title = '编辑'
        this.menu = data.row
        this.selectedMenu = this.menu.parentName

        if (!this.menu.parentName) {
          this.menu.parentId = -1
          this.menu.parentName = '根菜单'
          this.selectedMenu = this.menu.parentName
        }
      }
    },
    editStatus(row) {
      this.menu = { id: null, visible: true }
      this.menu.id = row.id
      this.menu.visible = !row.visible
      updateMenuById(this.menu).then(res => {
        this.findAllMenus()
        this.$message.success('修改成功')
      }).catch(() => {
        this.$message.error('修改失败')
      })
    },
    deleteMenu(data) {
      this.$confirm('删除该菜单及所有子菜单?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.delete(data.row.id)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    delete(id) {
      deleteMenuById(id).then(res => {
        this.$message.success('删除成功')
        this.findAllMenus()
      }).catch(() => {

      })
    },

    addOnParent(data) {
      this.menu = { sort: 1 } // 初始化
      this.selectedMenu = data.row.name
      this.menu.parentId = data.row.id
      this.dialogVisible = true
    },
    saveMenu() {
      this.$refs.menuForm.validate((valid) => {
        if (valid) {
          console.log(this.menu)
          // 新增和修改是两个接口
          if (this.menu.id) {
            updateMenuById(this.menu).then(res => {
              this.dialogVisible = false
              this.findAllMenus()
              this.$message.success('修改成功')
            }).catch(() => {
              this.$message.error('修改失败')
            })
          } else {
            saveMenu(this.menu).then(res => {
              this.dialogVisible = false
              this.findAllMenus()
              this.$message.success('添加成功')
            }).catch(() => {
              this.$message.error('添加失败')
            })
          }
        }
      })
    }
  }
}

</script>
