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
        @click="pageList()"
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
      />
      <el-table-column
        prop="docType"
        label="模板类型"
        width="120"
      />
      <el-table-column
        prop="createBy"
        label="创建者"
        width="120"
      />
      <el-table-column
        label="模板创建时间"
      >
        <template slot-scope="scope">
          {{ scope.row.createDate | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}
        </template>
      </el-table-column>
      <el-table-column
        label="备注"
        prop="remarks"
      />
      <el-table-column
        label="操作"
        width="200"
        fixed="right"
      >
        <template slot-scope="{row}">
          <el-tooltip class="item" effect="dark" content="修改" placement="top-start">
            <el-button
              type="primary"
              size="small"
              icon="el-icon-edit"
              circle
              @click="handleUpdateTemplate(row)"
            />
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="编辑模板" placement="top-start">
            <el-button
              type="info"
              size="small"
              icon="el-icon-tickets"
              circle
              @click="openPageOffice(row)"
            />
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="top-start">
            <el-button
              type="danger"
              size="small"
              icon="el-icon-delete"
              circle
              @click="handleDeleteTemplate(row)"
            />
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="下载" placement="top-start">
            <el-button
              type="success"
              size="small"
              circle
              icon="el-icon-download"
              @click="downloadTemplate(row)"
            />
          </el-tooltip>
        </template>
      </el-table-column>

    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="pageEntity.pageNum" :limit.sync="pageEntity.pageSize" @pagination="pageList()" />

    <el-dialog
      title="文档模板定义"
      :visible.sync="dialogFormVisible"
      width="800px"
      :close-on-click-modal="false"
      :before-close="handleCloseDialog"
    >
      <el-tabs v-model="activeTab" @tab-click="changeTabs">
        <el-tab-pane label="新建模板" name="first">
          <el-form :model="template" label-width="100px">
            <el-form-item label="模板名称">
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
            <el-form-item label="备注">
              <el-input
                v-model="template.remarks"
                type="textarea"
                rows="6"
                placeholder="这里描述下模板"
                maxlength="250"
                show-word-limit
              />
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="上传本地模板" name="second">
          <el-row>
            <el-col :span="12">
              <el-upload
                ref="upload"
                drag
                accept=".doc,.docx"
                :action="url"
                :multiple="false"
                :limit="1"
                :before-upload="beforeUpload"
                :on-success="onSuccess"
                :before-remove="beforeRemove"
              >
                <i class="el-icon-upload" />
                <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                <div slot="tip" class="el-upload__tip">只能上传doc/docx文件</div>
              </el-upload>
            </el-col>
            <el-col :span="12">
              <el-input
                v-model="template.remarks"
                rows="8"
                type="textarea"
                placeholder="这里描述下模板"
                maxlength="250"
                show-word-limit
              />
            </el-col>
          </el-row>
        </el-tab-pane>
      </el-tabs>

      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="clearForm">取 消</el-button>
        <el-button size="small" :disabled="disabledSubmit" type="primary" @click="saveDocumentTemplate()">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog
      title="模板更新"
      :close-on-click-modal="false"
      :visible.sync="updateTemplateDialogVisible"
      width="600"
      :before-close="handleCloseupdateTemplate"
    >
      <el-tabs v-model="updateTemplateTabs">
        <el-tab-pane label="基本信息" name="first">
          <el-form
            ref="templateForm"
            :model="template"
            label-width="100px"
            :rules="templateRules"
          >
            <el-form-item label="模板名称" prop="docName">
              <el-input v-model="template.docName" autocomplete="off" placeholder="请输入模板名称">
                <template slot="append">{{ template.docType }}</template>
              </el-input>
            </el-form-item>

            <el-form-item label="备注">
              <el-input
                v-model="template.remarks"
                type="textarea"
                rows="6"
                placeholder="这里描述下模板"
                maxlength="250"
                show-word-limit
              />
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="自定义字段" name="second">
          <span style="color:#eb9fbc">生成文档时需要手工填写的字段<span>
            <br><br>
            <el-checkbox-group v-model="checkedLabels" @change="handleCheckedChange">
              <el-checkbox label="产品型号" />
              <el-checkbox label="产品代号" />
              <el-checkbox label="产品用途" />
              <el-checkbox label="软件用途" />
              <el-checkbox label="需方" />
              <el-checkbox label="开发方" />
              <el-checkbox label="运行环境" />
              <el-checkbox label="文档概述" />
            </el-checkbox-group>
          </span></span></el-tab-pane>

      </el-tabs>

      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="clearUpdateForm">取 消</el-button>
        <el-button size="small" type="primary" @click="updateTemplate('templateForm')">确 定</el-button>
      </span>

    </el-dialog>
  </div>
</template>

<script>
import { uploadDocTemplateUrl, openOfficeUri, downloadDocTemplateUrl } from '@/settings.js'
import { findPageDocumentTemplates, saveDocumentTemplate, deleteDocumentTemplateById, checkFileExist, updateTemplate } from '@/api/document/documentTemplate.js'
import pagination from '@/components/Pagination'
export default {
  components: {
    pagination
  },
  data() {
    return {
      checkedLabels: [],
      updateTemplateTabs: 'first',
      // 更新模板的模态框
      updateTemplateDialogVisible: false,
      // 模板保存的路径
      url: uploadDocTemplateUrl,
      tableLoading: true,
      // 默认不能提交
      disabledSubmit: true,
      // 新增模板默认位置
      activeTab: 'first',
      dialogFormVisible: false,
      formLabelWidth: '120px',
      template: {
        docName: '',
        docType: '.doc',
        remarks: '',
        checkedLabels: ''
      },
      templateRules: {
        docName: [{ required: true, message: '请输入文档名称', trigger: 'blur' }]
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
      if (newvalue.length > 0) {
        this.disabledSubmit = false
      } else {
        this.disabledSubmit = true
      }
    }
  },
  created() {
    this.pageList()
  },
  methods: {
    // 测试用方法
    handleCheckedChange() {
      this.template.checkedLabels = this.checkedLabels.toString()
    },
    pageList() {
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
          this.pageList()
          this.clearForm()
          if (response.flag) {
            this.$message.success('保存模板成功')
          } else {
            this.$message.error('保存模板失败')
          }
        }).catch(() => {

        })
      }).catch(() => {
        this.$message.info('已取消提交')
      })
    },
    handleUpdateTemplate(row) {
      // 初始化模板
      this.template.docName = row.docName
      this.template.docType = row.docType
      this.template.id = row.id
      this.template.docLocation = row.docLocation
      this.template.remarks = row.remarks
      this.updateTemplateDialogVisible = true
      this.checkedLabels = []
      if (row.checkedLabels) {
        this.checkedLabels = row.checkedLabels.split(',')
      }
    },
    updateTemplate(form) {
      this.updateTemplateDialogVisible = false
      console.log(this.template)
      this.$refs[form].validate((valid) => {
        if (valid) {
          updateTemplate(this.template).then(res => {
            this.$message.success('更行成功')
            this.pageList()
            this.clearUpdateForm()
          }).catch(() => {
            this.$message.error('更新失败')
          })
        }
      })
    },
    handleCloseupdateTemplate(done) {
      this.clearUpdateForm()
      done()
    },
    clearUpdateForm() {
      this.updateTemplateDialogVisible = false
      this.updateTemplateTabs = 'first' // 初始化tabs位置
      this.template = {
        id: null,
        docLocation: null,
        docName: '',
        docType: '.doc',
        remarks: '',
        checkedLabels: ''
      }
    },
    openPageOffice(row) {
      window.location.href = "javascript:POBrowser.openWindowModeless('" + openOfficeUri + '/word?templateId=' + row.id + "','width=1200px;height=800px;');"
    },

    handleDeleteTemplate(row) {
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
        this.pageList()
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
      // 清空上传文件列表
      if (this.$refs.upload) {
        this.$refs.upload.clearFiles()
      }
      this.dialogFormVisible = false
      this.activeTab = 'first'
      this.template = {
        docName: '',
        docType: '.doc',
        remarks: ''
      }
    },
    beforeUpload(file) {
      const fileType = file.name.substring(file.name.lastIndexOf('.') + 1)
      if (fileType !== 'docx' && fileType !== 'doc') {
        this.$message.error('请选择.docx或.doc文件')
        return false
      }
    },
    beforeRemove(file, fileList) {
      this.template.docName = ''
      this.template.docType = ''
      this.template.docLocation = null
      this.template.remarks = ''
    },
    onSuccess(response, file, fileList) {
      if (response.flag) {
        this.template.docName = file.name.substring(0, file.name.lastIndexOf('.'))
        this.template.docType = file.name.substring(file.name.lastIndexOf('.'))
        this.template.docLocation = response.data
      } else {
        console.log('文件上传失败')
      }
    },
    downloadTemplate(row) {
      checkFileExist({ 'path': row.docLocation }).then(res => {
        if (res.flag) {
          location.href = downloadDocTemplateUrl + '/documentTemplate/downloadTemplate?path=' + encodeURIComponent(row.docLocation)
        } else {
          this.$confirm('该模板不存在，是否删除该条记录？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.deleteTemplate(row)
          }).catch(() => {

          })
        }
      }).catch(() => {
        this.$message.error('模板准备失败，请稍后再试')
      })
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
    background-color: #532436;
  }

  .el-carousel__item:nth-child(2n+1) {
    background-color: #d3dce6;
  }
</style>
