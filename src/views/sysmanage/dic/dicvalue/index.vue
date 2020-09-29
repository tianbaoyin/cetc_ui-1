<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="pageEntity.key" placeholder="字典标签" style="width: 200px;" class="filter-item" size="medium" />
      <el-button class="filter-item" type="primary" size="medium" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>

      <el-button v-permission="['root','permission_manager_dic_value_add']" class="filter-item" type="primary" size="medium" icon="el-icon-plus" @click="handleSave">
        新增
      </el-button>
    </div>
    <el-table
      v-loading="definitionLoading"
      :data="dicValues"
      border
      style="width: 100%"
      stripe
    >
      <el-table-column
        align="center"
        type="index"
        label="序号"
        width="100"
      />
      <el-table-column
        prop="key"
        label="字典标签"
        width="180"
      />
      <el-table-column
        prop="value"
        label="字典键值"
        width="180"
      />
      <el-table-column
        prop="order"
        align="center"
        label="排序号"
        width="80"
      />
      <el-table-column
        prop="sys"
        align="center"
        label="系统内置"
        width="80"
      >
        <template slot-scope="scope">
          <el-tag
            v-show="scope.row.sys"
            type="danger"
            disable-transitions
          >是</el-tag>
          <el-tag
            v-show="!scope.row.sys"
            type="primary"
            disable-transitions
          >否</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="status"
        align="center"
        label="状态"
        width="80"
      >
        <template slot-scope="scope">
          <el-tag
            v-show="scope.row.status"
            type="primary"
            disable-transitions
          >启用</el-tag>
          <el-tag
            v-show="!scope.row.status"
            type="danger"
            disable-transitions
          >停用</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="updateTime"
        label="更新时间"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.updateTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="remarks"
        label="备注信息"
      />

      <el-table-column align="center" label="操作" width="300">
        <template slot-scope="{row}">
          <el-button v-permission="['root','permission_manager_dic_value_edit']" type="primary" size="small" icon="el-icon-edit" @click="handleUpdate(row)">编辑</el-button>
          <el-button v-permission="['root','permission_manager_dic_value_delete']" type="primary" size="small" icon="el-icon-delete" @click="deleteById(row)">删除</el-button>

        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="pageEntity.pageNum" :limit.sync="pageEntity.pageSize" @pagination="handleFilter()" />

    <el-dialog v-dialogDrag :title="title" :visible.sync="dialogFormVisible" :before-close="clearCache" :close-on-click-modal="false">
      <el-form ref="dicValue" :model="dicValue" :rules="checkRules">
        <el-form-item label="字典标签" :label-width="formLabelWidth" prop="key">
          <el-input v-model="dicValue.key" autocomplete="off" />
        </el-form-item>
        <el-form-item label="字典键值" :label-width="formLabelWidth" prop="value">
          <el-input v-model="dicValue.value" autocomplete="off" />
        </el-form-item>
        <el-form-item label="排序号" :label-width="formLabelWidth" prop="order">
          <el-input v-model="dicValue.order" autocomplete="off" />
        </el-form-item>
        <el-form-item label="系统内置" prop="sys" :label-width="formLabelWidth">
          <template>
            <el-radio v-model="dicValue.sys" :label="true">是</el-radio>
            <el-radio v-model="dicValue.sys" :label="false">否</el-radio>
          </template>
        </el-form-item>
        <el-form-item label="备注信息" :label-width="formLabelWidth">
          <el-input v-model="dicValue.remarks" autocomplete="off" />
        </el-form-item>
        <el-form-item label="状态" prop="status" :label-width="formLabelWidth">
          <el-switch v-model="dicValue.status" active-color="#13ce66" inactive-color="#ff4949" />
        </el-form-item>

      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveDicValue()">保 存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import permission from '@/directive/permission/index.js'
import pagination from '@/components/Pagination'
import { queryPageDicValues, saveDicValue, queryById, updateDicValue, queryByKey, deleteById } from '@/api/dicValue'

export default {
  name: 'Dicvalue',
  directives: { permission },
  components: { pagination },
  data() {
    const validateDicValueKey = (rule, value, callback) => {
      if (value != null && value !== '') {
        queryByKey(this.dicValue).then(response => {
          if (response.data != null && response.data.id !== this.dicValue.id) {
            callback(new Error('字典标签重复，请修改'))
          } else {
            callback()
          }
        }).catch(() => {
          callback(new Error('校验字典标签重复性失败'))
        })
      } else {
        callback(new Error('字典标签不能为空'))
      }
    }

    const validateDicValueValue = (rule, value, callback) => {
      if (value != null && value !== '') {
        callback()
      } else {
        callback(new Error('字典键值不能为空'))
      }
    }

    const validateDicValueOrders = (rule, value, callback) => {
      if (value != null) {
        if (/^[1-9]\d*$/.test(value) === false) {
          callback(new Error('请输入一个整数'))
        } else {
          callback()
        }
      } else {
        callback(new Error('排序字段不能为空'))
      }
    }

    return {
      total: 0,
      title: '新增字典数据',
      pageEntity: {
        pageNum: 1,
        pageSize: 10,
        key: ''
      },
      checkRules: {
        key: [{ required: true, trigger: 'blur', validator: validateDicValueKey }],
        value: [{ required: true, trigger: 'blur', validator: validateDicValueValue }],
        order: [{ required: true, trigger: 'blur', validator: validateDicValueOrders }],
        sys: [{ required: true, trigger: 'blur', message: '系统内置不能为空' }],
        status: [{ required: true, trigger: 'blur', message: '状态不能为空' }]
      },
      dialogFormVisible: false,
      definitionLoading: false,
      formLabelWidth: '120px',
      dicValues: [],
      dicValue: {
        id: null,
        key: null,
        value: null,
        order: null,
        sys: false,
        updateTime: null,
        remarks: null,
        status: false,
        dicId: null

      }
    }
  },
  created() {
    this.handleFilter()
  },
  methods: {
    clearCache(done) {
      done()
      this.$refs['dicValue'].resetFields()
    },
    handleFilter() {
      this.definitionLoading = true
      this.dicValue.dicId = Number(this.$route.query.dicId)
      queryPageDicValues(this.dicValue.dicId, this.pageEntity).then(response => {
        this.dicValues = response.data.list
        this.total = response.data.total
        this.definitionLoading = false
      }).catch(() => {
        this.definitionLoading = false
      })
    },

    handleSave() {
      this.title = '新增字典数据'
      this.dicValue = {
        id: null,
        key: null,
        value: null,
        order: null,
        sys: false,
        updateTime: null,
        remarks: null,
        status: false,
        dicId: Number(this.$route.query.dicId)
      }
      this.dialogFormVisible = true
    },
    handleUpdate(row) {
      this.title = '修改字典数据'
      this.definitionLoading = true
      queryById(row.id).then(response => {
        this.dicValue = response.data
        this.definitionLoading = false
        this.dialogFormVisible = true
      }).catch(() => {
        this.definitionLoading = false
        this.$message.error('失败')
      })
    },
    deleteById(row) {
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteById(row.id).then(response => {
          this.handleFilter()
          this.$message.success('删除字典数据成功')
        }).catch(() => {
          this.$message.error('删除字典数据失败')
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },

    saveDicValue() {
      this.$refs.dicValue.validate((valid) => {
        if (valid) {
          if (this.dicValue.id == null) {
            this.definitionLoading = true
            saveDicValue(this.dicValue).then(response => {
              this.dialogFormVisible = false
              this.handleFilter()
              this.definitionLoading = false
              this.$message.success('保存字典数据成功')
            }).catch(() => {
              this.handleFilter()
              this.definitionLoading = false
              this.$message.error('保存字典数据失败')
            })
          } else {
            this.definitionLoading = true
            updateDicValue(this.dicValue).then(response => {
              this.dialogFormVisible = false
              this.handleFilter()
              this.definitionLoading = false
              this.$message.success('修改字典数据成功')
            }).catch(() => {
              this.definitionLoading = false
              this.$message.error('修改字典数据失败')
            })
          }
        } else {
          return false
        }
      })
    }
  }
}
</script>
