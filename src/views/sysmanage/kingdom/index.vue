<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        size="small"
        icon="el-icon-plus"
        @click="kingdomDialog"
      >
        新增
      </el-button>
    </div>
    <el-table
      v-loading="loading"
      :data="kingdomList"
      border
      stripe
    >
      <el-table-column
        label="序号"
        align="center"
        type="index"
        width="80"
      />
      <el-table-column
        prop="name"
        label="名称"
        header-align="center"
      />
      <el-table-column label="创建日期" align="center">
        <template slot-scope="scope">
          {{ scope.row.createDate | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}
        </template>
      </el-table-column>
      <el-table-column label="创建人" align="center">
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
              <el-form-item label="创建日期">
                {{ user.createTime | parseTime('{y}-{m}-{d}') }}
              </el-form-item>
            </el-form>
            <el-tag slot="reference" @click="getUser(scope.row.createBy)"> {{ scope.row.createBy }}</el-tag>
          </el-popover>

        </template>
      </el-table-column>
      <el-table-column label="更新日期" align="center">
        <template slot-scope="scope">
          {{ scope.row.updateDate | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}
        </template>
      </el-table-column>
      <el-table-column label="更新人" align="center">
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
            <el-tag slot="reference" @click="getUser(scope.row.updateBy)"> {{ scope.row.updateBy }}</el-tag>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        width="200px"
        fixed="right"
      >
        <template slot-scope="scope">
          <el-button
            v-waves
            type="primary"
            size="small"
            icon="el-icon-edit"
            @click="kingdomDialog(scope)"
          >
            编辑
          </el-button>
          <el-button
            v-waves
            type="danger"
            size="small"
            icon="el-icon-delete"
            @click="deleteById(scope.row)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="pageEntity.pageNum" :limit.sync="pageEntity.pageSize" @pagination="pageList()" />
    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      :before-close="closeDialog"
      :close-on-click-modal="false"
      width="30%"
    >
      <el-form
        ref="kingdomForm"
        :model="kingdom"
        :rules="rules"
        label-width="50px"
      >
        <el-form-item label="名称" prop="name">
          <el-input v-model="kingdom.name" placeholder="领域名称" />
        </el-form-item>

      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button
          v-waves
          type="primary"
          :loading="submitLoading"
          @click="savaKingdom"
        >
          确 定
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { checkCode } from '@/api/project/code.js'
import { getPage, findByName, addKingdom, updateKingdom, deleteKindom } from '@/api/project/kingdom.js'
import { getByUsername } from '@/api/user.js'
import pagination from '@/components/Pagination'
import waves from '@/directive/waves'
export default {
  name: 'KingdomManagement',
  components: {
    pagination
  },
  directives: { waves },
  data() {
    const checkName = (rule, value, callback) => {
      if (value) {
        if (value.trim().length <= 0) {
          callback(new Error('名称不能为空'))
        } else {
          findByName(value).then(res => {
            if (this.kingdom.id) { // 更新
              if (res.data) { // 存在
                if (this.oldName === value) {
                  callback()
                } else {
                  callback(new Error('名称已存在'))
                }
              } else { // 不存在
                callback()
              }
            } else { // 新增
              if (res.data) {
                callback(new Error('名称已存在'))
              } else {
                callback()
              }
            }
          }).catch(() => {
            callback(new Error('名称校验失败'))
          })
        }
      } else {
        callback(new Error('名称不能为空'))
      }
    }
    return {
      title: '新增',
      loading: false,
      userLoading: false,
      submitLoading: false,
      oldName: '',
      kingdomList: [],
      kingdom: {
        name: ''
      },
      dialogVisible: false,
      total: 0,
      pageEntity: {
        pageNum: 1,
        pageSize: 10
      },
      user: {},
      rules: {
        name: [
          { required: true, validator: checkName, trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.pageList()
  },

  methods: {
    pageList() {
      this.loading = true
      getPage(this.pageEntity).then(res => {
        this.total = res.data.total
        this.kingdomList = res.data.list
        this.loading = false
      }).catch(() => {
        this.$message.error('查询领域失败')
        this.loading = false
      })
    },
    closeDialog(done) {
      this.$refs.kingdomForm.resetFields()
      this.pageList()
      done()
    },
    kingdomDialog(data) {
      this.submitLoading = false
      this.dialogVisible = true
      if (data.row) {
        this.title = '编辑'
        this.kingdom = data.row
        this.oldName = data.row.name
      } else {
        this.kingdom = {}
        this.title = '新增'
      }
    },
    savaKingdom() {
      this.$refs.kingdomForm.validate((valid) => {
        if (valid) {
          this.dialogVisible = false
          this.submitLoading = true
          if (this.kingdom.id) {
            updateKingdom(this.kingdom).then(res => {
              this.$message.success('保存成功')
              this.pageList()
            }).catch(() => {
              this.$message.error('保存失败')
            })
          } else {
            addKingdom(this.kingdom).then(res => {
              this.$message.success('保存成功')
              this.pageList()
            }).catch(() => {
              this.$message.error('保存失败')
            })
          }
        }
      })
    },
    deleteById(data) {
      checkCode({ parentId: data.id }).then(res => {
        if (res.data) {
          this.$alert('请先删除该领域下的所有令号！！！', '提示', {
            confirmButtonText: '确定'
          })
        } else {
          this.$confirm('确认删除?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.deleteKindom(data.id)
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            })
          })
        }
      }).catch(error => {
        console.error(error)
      })
    },
    deleteKindom(id) {
      deleteKindom(id).then(res => {
        this.$message.success('删除成功')
        this.pageList()
      }).catch(() => {
        this.$message.error('删除失败')
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
        this.$message.error('用户获取失败')
      })
    }

  }

}
</script>
