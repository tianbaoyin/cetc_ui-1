<template>
  <div class="app-container">

    <div class="filter-container">
      <el-input

        style="width: 250px;"
        class="filter-item"
        size="small"
        placeholder="请输入令号(精确查找)"
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
        icon="el-icon-search"
        class="filter-item"
        @click="createTemplate()"
      >
        新建模板
      </el-button>
    </div>

    <el-table
      :data="documentTemplates"
      style="width: 100%"
      height="250"
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

        </template></el-table-column>

    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="pageEntity.pageNum" :limit.sync="pageEntity.pageSize" @pagination="handleFilter()" />

    <el-dialog title="文档模板定义" :visible.sync="dialogFormVisible">
      <el-form :model="template">
        <el-form-item label="文档模板名称" :label-width="formLabelWidth">
          <el-input v-model="template.docName" autocomplete="off" />
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveDocumentTemplate()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

import { findPageDocumentTemplates, saveDocumentTemplate } from '@/api/document/documentTemplate.js'
import pagination from '@/components/Pagination'
export default {
  components: {
    pagination
  },
  data() {
    return {
      dialogFormVisible: false,
      formLabelWidth: '120px',
      template: {
        docName: '',
        docType: ''

      },
      documentTemplates: [],
      total: 0,
      pageEntity: {
        pageNum: 1,
        pageSize: 10

      }
    }
  },
  created() {
    this.handleFilter()
  },
  methods: {

    handleFilter() {
      findPageDocumentTemplates(this.pageEntity).then(response => {
        console.log(response.data.list)
        this.documentTemplates = response.data.list
        this.total = response.data.total
      }).catch(() => {

      })
    },

    saveDocumentTemplate() {
      saveDocumentTemplate(this.template).then(response => {
        this.dialogFormVisible = false
        this.$message.success('保存模板成功')
        this.handleFilter()
      }).catch(() => {

      })
    },

    createTemplate() {
      this.dialogFormVisible = true
    },

    openPageOffice(row) {
      window.location.href = "javascript:POBrowser.openWindowModeless('http://localhost:9807/word?templateId=" + row.id + "','width=1200px;height=800px;');"
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
