<template>
  <div class="app-container">
    <el-input v-model="pageEntity.paramName" placeholder="参数名称" style="width: 200px;" class="filter-item" size="small" />
    <el-button class="filter-item" type="primary" size="small" icon="el-icon-search" @click="handleFilter">
      搜索
    </el-button>
    <el-button v-permission="['root','sys_manager_param_add']" class="filter-item" type="primary" size="small" icon="el-icon-plus" @click="handleSave">
      新增
    </el-button>
    <el-divider />
    <el-table
      v-loading="definitionLoading"
      :data="params"
      border
      stripe
      style="width: 100%"
    >
      <el-table-column
        align="center"
        type="index"
        label="序号"
        width="100"
      />
      <el-table-column
        prop="paramName"
        label="参数名称"
        width="300"
      />
      <el-table-column
        prop="paramKey"
        label="参数键名"
        width="300"
      />
      <el-table-column
        prop="paramValue"
        label="参数键值"
      />
      <el-table-column
        prop="remarks"
        label="备注"
      />
      <el-table-column
        prop="paramSys"
        label="系统参数"
        align="center"
        width="80"
      >
        <template slot-scope="scope">
          <el-tag
            v-show="!scope.row.paramSys"
            type="primary"
            disable-transitions
          >否</el-tag>
          <el-tag
            v-show="scope.row.paramSys"
            type="danger"
            disable-transitions
          >是</el-tag>
        </template>

      </el-table-column>
      <el-table-column
        align="center"
        label="操作"
        width="200"
        fixed="right"
      >
        <template slot-scope="{row}">
          <el-button v-permission="['root','sys_manager_param_edit']" type="primary" size="small" icon="el-icon-edit" @click="handleUpdate(row)">编辑</el-button>
          <el-button v-permission="['root','sys_manager_param_delete']" :disabled="row.paramSys" type="danger" size="small" icon="el-icon-delete" @click="handleDelete(row)">删除</el-button>

        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="pageEntity.pageNum" :limit.sync="pageEntity.pageSize" @pagination="handleFilter()" />

    <el-dialog v-dialogDrag :title="title" :visible.sync="dialogFormVisible" :before-close="clearCache">
      <el-form ref="paramValue" :model="param" :rules="checkRules">
        <el-form-item label="参数名称" prop="paramName" :label-width="formLabelWidth">
          <el-input ref="paramName" v-model="param.paramName" :disabled="param.paramSys&&param.id!=null" autocomplete="off" />
        </el-form-item>
        <el-form-item label="参数键名" prop="paramKey" :label-width="formLabelWidth">
          <el-input v-model="param.paramKey" :disabled="param.paramSys&&param.id!=null" autocomplete="off" />
        </el-form-item>
        <el-form-item label="参数键值" prop="paramValue" :label-width="formLabelWidth">
          <el-input v-model="param.paramValue" autocomplete="off" />
        </el-form-item>
        <el-form-item label="系统参数" prop="paramSys" :label-width="formLabelWidth">
          <template>
            <el-radio v-model="param.paramSys" :disabled="param.paramSys&&param.id!=null" :label="true">是</el-radio>
            <el-radio v-model="param.paramSys" :disabled="param.paramSys&&param.id!=null" :label="false">否</el-radio>
          </template>
        </el-form-item>
        <el-form-item label="描述" :label-width="formLabelWidth">
          <el-input v-model="param.remarks" type="textarea" autocomplete="off" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveParam()">保 存</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import pagination from '@/components/Pagination'
import permission from '@/directive/permission/index.js'
import { queryPageParams, saveParam, queryById, updateById, queryByKey, deleteById } from '@/api/param'
export default {
  name: 'Params',
  directives: { permission },
  components: { pagination },
  data() {
    const validateParamName = (rule, value, callback) => {
      if (value != null && value !== '') {
        callback()
      } else {
        callback(new Error('参数名称不能为空'))
      }
    }

    const validateParamKey = (rule, value, callback) => {
      if (value != null && value !== '') {
        queryByKey(this.param.paramKey).then(response => {
          if (response.data != null && response.data.id !== this.param.id) {
            callback(new Error('参数键名已存在'))
          } else {
            callback()
          }
        }).catch(() => {
          callback(new Error('参数键名校验失败'))
        })
      } else {
        callback(new Error('参数键名不能为空'))
      }
    }
    const validateParamValue = (rule, value, callback) => {
      if (value != null && value !== '') {
        callback()
      } else {
        callback(new Error('参数键值不能为空'))
      }
    }

    const validateParamSys = (rule, value, callback) => {
      if (value != null) {
        callback()
      } else {
        callback(new Error('系统参数不能为空'))
      }
    }
    return {
      params: [],
      total: 0,
      title: '新建',
      dialogFormVisible: false,
      formLabelWidth: '120px',
      definitionLoading: false,
      pageEntity: {
        pageNum: 1,
        pageSize: 10,
        paramName: null
      },
      checkRules: {
        paramName: [{ required: true, trigger: 'blur', validator: validateParamName }],
        paramKey: [{ required: true, trigger: 'blur', validator: validateParamKey }],
        paramValue: [{ required: true, trigger: 'blur', validator: validateParamValue }],
        paramSys: [{ required: true, trigger: 'blur', validator: validateParamSys }]

      },
      param: {
        id: null,
        paramName: null,
        paramKey: null,
        paramValue: null,
        paramSys: false,
        remarks: null

      }
    }
  },
  created() {
    this.handleFilter()
  },
  methods: {
    clearCache(done) {
      done()
      this.$refs['paramValue'].resetFields()
    },
    handleFilter() {
      this.definitionLoading = true
      queryPageParams(this.pageEntity).then(response => {
        this.params = response.data.list
        this.total = response.data.total
        this.definitionLoading = false
      }).catch(() => {
        this.definitionLoading = false
      })
    },
    handleSave() {
      this.title = '新建'
      this.param = {
        id: null,
        paramName: null,
        paramKey: null,
        paramValue: null,
        paramSys: false

      }
      this.dialogFormVisible = true
    },
    handleUpdate(row) {
      this.title = '编辑'
      queryById(row.id).then(response => {
        this.param = response.data
        this.dialogFormVisible = true
      }).catch(() => {

      })
    },

    saveParam() {
      this.$refs.paramValue.validate((valid) => {
        if (valid) {
          if (this.param.id == null) {
            this.definitionLoading = true
            saveParam(this.param).then(response => {
              this.handleFilter()
              this.dialogFormVisible = false
              this.definitionLoading = false
              this.$message.success('保存系统参数成功')
            }).catch(() => {
              this.definitionLoading = false
              this.$message.error('保存系统参数失败')
            })
          } else {
            this.definitionLoading = true
            updateById(this.param).then(response => {
              this.handleFilter()
              this.dialogFormVisible = false
              this.definitionLoading = false
              this.$message.success('修改系统参数成功')
            }).catch(() => {
              this.definitionLoading = false
              this.$message.error('修改系统参数失败')
            })
          }
        } else {
          return false
        }
      })
    },

    handleDelete(row) {
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteById(row.id).then(response => {
          this.handleFilter()
          this.$message.success('删除参数信息成功')
        }).catch(() => {
          this.handleFilter()
          this.$message.error('删除参数信息失败')
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }

  }
}
</script>
