<template>
  <div class="app-container">

    <div class="filter-container">
      <el-input
        v-model="pageEntity.docName"
        style="width: 250px;"
        class="filter-item"
        size="small"
        placeholder="请输入模板名称(模糊查找)"
        clearable
      />
      <el-button
        type="primary"
        size="small"
        icon="el-icon-search"
        class="filter-item"
        @click="handleFilter()"
      >
        搜索
      </el-button>
      <el-button
        type="primary"
        size="small"
        icon="el-icon-plus"
        class="filter-item"
        @click="dialogFormVisible = true"
      >
        模板创建
      </el-button>
    </div>

    <el-table
      v-loading="tableLoading"
      :data="documentTemplates"
      stripe
      border
      highlight-current-row
    >
      <el-table-column
        type="index"
        label="序号"
        width="100"
      />
      <el-table-column
        prop="docName"
        label="模板名称"
        width="120"
      />
      <el-table-column
        prop="docType"
        label="模板类型"
        width="120"
      />
      <el-table-column
        prop="docLocation"
        label="模板路径"
        width="300"
      />
      <el-table-column
        label="模板创建时间"
      >

        <template slot-scope="scope">
          {{ scope.row.createDate | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}
        </template>
      </el-table-column>

      <el-table-column
        label="操作"
        width="320"
        fixed="right"
      >
        <template slot-scope="{row}">
          <el-button
            type="primary"
            size="small"
            icon="el-icon-edit"
          >
            修改
          </el-button>

          <el-button
            type="primary"
            size="small"
            icon="el-icon-edit"
            @click="openPageOffice(row)"
          >
            编辑模板
          </el-button>
          <el-button
            type="danger"
            size="small"
            icon="el-icon-delete"
            @click="handleDeleteTemplate(row)"
          >
            删除
          </el-button>

        </template></el-table-column>

    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="pageEntity.pageNum" :limit.sync="pageEntity.pageSize" @pagination="handleFilter()" />

    <el-dialog title="文档模板定义" :visible.sync="dialogFormVisible" width="800px" :close-on-click-modal="false" :before-close="handleCloseDialog">
      <el-tabs v-model="activeTab" @tab-click="changeTabs">
        <el-tab-pane label="新建模板" name="first">
          <el-form :model="template">
            <el-form-item label="文档模板名称" label-width="100px">
              <el-row>
                <el-col :span="18">
                  <el-input v-model="template.docName" autocomplete="off" placeholder="请输入模板名称" />
                </el-col>
                <el-col :span="6">
                  <el-select v-model="template.docType">
                    <el-option label="doc" value=".doc" />
                    <el-option label="docx" value=".docx" />
                  </el-select>
                </el-col>
              </el-row>

            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="上传本地模板" name="second">
          <el-upload
            class="upload-demo"
            drag
            action="https://jsonplaceholder.typicode.com/posts/"
            multiple
          >
            <i class="el-icon-upload" />
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            <div slot="tip" class="el-upload__tip">只能上传doc/docx文件</div>
          </el-upload>

        </el-tab-pane>
      </el-tabs>

      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="clearForm">取 消</el-button>
        <el-button size="small" :disabled="disabledSubmit" type="primary" @click="saveDocumentTemplate()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

import { findPageDocumentTemplates, saveDocumentTemplate, deleteDocumentTemplateById } from '@/api/document/documentTemplate.js'
import pagination from '@/components/Pagination'
export default {
  components: {
    pagination
  },
  data() {
    return {
      tableLoading: true,
      // 默认不能提交
      disabledSubmit: true,
      // 新增模板默认位置
      activeTab: 'first',
      dialogFormVisible: false,
      formLabelWidth: '120px',
      template: {
        docName: '',
        docType: '.doc'

      },
      documentTemplates: [],
      total: 0,
      pageEntity: {
        docName: '',
        pageNum: 1,
        pageSize: 10

      }
    }
  },
  watch: {
    // 监听模板名称的长度如果大于1，则可以提交
    'template.docName': function(newvalue) {
      if (newvalue.length > 1) {
        this.disabledSubmit = false
      } else {
        this.disabledSubmit = true
      }
    }
  },
  created() {
    this.handleFilter()
  },
  methods: {

    handleFilter() {
      this.tableLoading = true
      findPageDocumentTemplates(this.pageEntity).then(response => {
        this.documentTemplates = response.data.list
        this.total = response.data.total
        this.tableLoading = false
      }).catch(() => {

      })
    },

    saveDocumentTemplate() {
      this.$confirm('确认提交模板？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        saveDocumentTemplate(this.template).then(response => {
          this.dialogFormVisible = false
          this.$message.success('保存模板成功')
          this.handleFilter()
          this.clearForm()
        }).catch(() => {

        })
      }).catch(() => {
        this.$message.info('已取消提交')
      })
    },

    openPageOffice(row) {
      window.location.href = "javascript:POBrowser.openWindowModeless('http://localhost:9807/word?templateId=" + row.id + "','width=1200px;height=800px;');"
    },

    handleDeleteTemplate(row) {
      console.log(row)
      this.$confirm('确认要删除模板《' + row.docName + '》？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteTemplate(row)
      }).catch(() => {
        this.$message.info('已取消删除')
      })
    },
    // 删除模板
    deleteTemplate(id) {
      deleteDocumentTemplateById(id).then(() => {
        this.$message.success('删除成功')
        this.handleFilter()
      }).catch(() => {
        this.$message.error('删除失败')
      })
    },
    changeTabs(tab, event) {
      // 只要切换tab就初始化默认值
      this.template = {
        docName: '',
        docType: '.doc'
      }
    },
    handleCloseDialog(done) {
      this.clearForm()
      done()
    },
    clearForm() {
      this.dialogFormVisible = false
      this.activeTab = 'first'
      this.template = {
        docName: '',
        docType: '.doc'
      }
    }
  }
}
</script>
<style>
  .el-carousel__item h3 {
    color: #475669;
    font-size: 14px;
    opacity: 0.75;
    line-height: 200px;
    margin: 0;
  }

  .el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
  }

  .el-carousel__item:nth-child(2n+1) {
    background-color: #d3dce6;
  }
</style>
