<template>
  <div class="app-container">

    <el-input v-model="pageEntity.dicName" placeholder="字典名称" style="width: 200px;" class="filter-item" size="medium" />
    <el-button class="filter-item" type="primary" size="medium" icon="el-icon-search" @click="fuzzyQueryDic">
      搜索
    </el-button>

    <el-button v-permission="['root','sys_manager_dic_add']" class="filter-item" type="primary" size="medium" icon="el-icon-plus" @click="handleSave">
      新增
    </el-button>
    <el-divider />
    <el-table
      v-loading="definitionLoading"
      :data="dics"
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
        prop="dicName"
        header-align="center"
        label="字典名称"
        width="350"
      />
      <el-table-column
        prop="dicType"
        header-align="center"
        label="字典类型"
        width="200"
      />
      <el-table-column
        prop="remarks"
        header-align="center"
        label="描述"
      />
      <el-table-column
        label="状态"
        width="100"
        align="center"
      >

        <template slot-scope="scope">
          <el-tag
            v-show="scope.row.status"
            type="primary"
            disable-transitions
          >正常</el-tag>
          <el-tag
            v-show="!scope.row.status"
            type="danger"
            disable-transitions
          >停用</el-tag>
        </template>
      </el-table-column>

      <el-table-column
        prop="updateTime"
        label="上次修改时间"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.updateTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="300">
        <template slot-scope="{row}">
          <el-button v-permission="['root','sys_manager_dic_edit']" type="primary" size="small" icon="el-icon-edit" @click="handleUpdate(row)">编辑</el-button>
          <el-button v-permission="['root','sys_manager_dic_delete']" type="danger" size="small" icon="el-icon-delete" @click="handleDelete(row)">删除</el-button>
          <router-link :to="'/sysmanage/dicValue/?dicId='+row.id">
            <el-button v-permission="['root','sys_manager_dic_value']" type="success" size="small" icon="el-icon-s-order">字典数据</el-button>
          </router-link>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="pageEntity.pageNum" :limit.sync="pageEntity.pageSize" @pagination="handleFilter()" />

    <el-dialog v-dialogDrag title="新增字典信息" :visible.sync="dialogFormVisible" width="40%" :before-close="clearCache" :close-on-click-modal="false">
      <el-form ref="dic" :model="dic" :rules="checkRules">
        <el-form-item label="字典名称" label-width="120px" prop="dicName">
          <el-input ref="dicName" v-model="dic.dicName" autocomplete="off" size="small" style="width:300px" />
        </el-form-item>
        <el-form-item label="字典类型" label-width="120px" prop="dicType">
          <el-input ref="dicType" v-model="dic.dicType" autocomplete="off" size="small" style="width:300px" />
        </el-form-item>
        <el-form-item label="状态" label-width="120px">
          <el-switch v-model="dic.status" active-color="#13ce66" inactive-color="#ff4949" />
        </el-form-item>
        <el-form-item label="备注信息" label-width="120px">
          <el-input v-model="dic.remarks" type="textarea" :rows="2" size="small" autocomplete="off" />
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveDic()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import permission from '@/directive/permission/index.js'
import pagination from '@/components/Pagination'
import { queryPageDics, saveDic, queryDicById, queryByDicName, queryByDicType, updateDicById, fuzzyQueryDic, deleteDicById } from '@/api/dic'
export default {
  name: 'Dic',
  directives: { permission },
  components: { pagination },
  data() {
    const validateDicName = (rule, value, callback) => {
      if (value != null && value !== '') {
        queryByDicName(value).then(response => {
          if (response.data != null && response.data.id !== this.dic.id) {
            callback(new Error('字典名称已经存在'))
          } else {
            callback()
          }
        }).catch(() => {
          callback(new Error('校验字典名称失败'))
        })
      } else {
        callback(new Error('字典名称不能为空'))
      }
    }

    const validateDicType = (rule, value, callback) => {
      if (value != null && value !== '') {
        queryByDicType(value).then(response => {
          if (response.data != null && response.data.id !== this.dic.id) {
            callback(new Error('字典类型已经存在'))
          } else {
            callback()
          }
        }).catch(() => {
          callback(new Error('校验字典类型失败'))
        })
      } else {
        callback(new Error('字典类型不能为空'))
      }
    }
    return {
      dics: [],
      dialogFormVisible: false,
      definitionLoading: false,
      dic: {
        id: null,
        dicName: null,
        dicType: null,
        createTime: null,
        updateTime: null,
        status: true,
        remarks: null
      },
      total: 0,
      pageEntity: {
        pageNum: 1,
        pageSize: 10,
        dicName: ''
      },
      checkRules: {
        dicName: [{ required: true, trigger: 'blur', validator: validateDicName }],
        dicType: [{ required: true, trigger: 'blur', validator: validateDicType }]
      }
    }
  },
  created() {
    this.handleFilter()
  },
  methods: {
    clearCache(done) {
      done()
      this.$refs['dic'].resetFields()
    },
    handleFilter() {
      this.definitionLoading = true
      queryPageDics(this.pageEntity).then(response => {
        this.total = response.data.total
        this.dics = response.data.list
        this.definitionLoading = false
      }).catch(() => {
        this.definitionLoading = false
      })
    },
    handleSave() {
      this.dic = {
        id: null,
        dicName: null,
        dicType: null,
        createTime: null,
        updateTime: null,
        status: true,
        remarks: null
      }
      this.dialogFormVisible = true
    },
    saveDic() {
      this.$refs.dic.validate((valid) => {
        if (valid) {
          if (this.dic.id != null) {
            updateDicById(this.dic).then(response => {
              this.handleFilter()
              this.dialogFormVisible = false
              this.definitionLoading = false
              this.$message.success('修改字典信息成功')
            }).catch(() => {
              this.definitionLoading = false
              this.$message.error('修改字典信息失败')
            })
          } else {
            saveDic(this.dic).then(response => {
              this.handleFilter()
              this.dialogFormVisible = false
              this.definitionLoading = false
              this.$message.success('新增字典信息成功')
            }).catch(() => {
              this.definitionLoading = false
              this.$message.error('新增字典信息失败')
            })
          }
        }
      })
    },
    handleUpdate(row) {
      this.definitionLoading = true
      queryDicById(row.id).then(response => {
        this.definitionLoading = false
        this.dic = response.data
        this.dialogFormVisible = true
      }).catch(() => {
        this.definitionLoading = false
      })
    },
    handleDelete(row) {
      this.$confirm('此操作将永久删除该数据及关联的字典数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteDicById(row.id).then(response => {
          this.handleFilter()
          this.$message.success('删除字典信息成功')
        }).catch(() => {
          this.handleFilter()
          this.$message.error('删除字典信息失败')
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    fuzzyQueryDic() {
      fuzzyQueryDic(this.pageEntity).then(response => {
        this.total = response.data.total
        this.dics = response.data.list
      }).catch(() => {
        this.$message.error('搜索数据失败')
      })
    }
  }
}
</script>

