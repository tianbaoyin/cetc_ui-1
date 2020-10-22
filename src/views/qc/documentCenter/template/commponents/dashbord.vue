<template>
  <div>
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
        @click="handleSearch"
      >
        搜索
      </el-button>
      <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click">
        <div class="avatar-wrapper">
          <el-button
            type="primary"
            size="small"
            class="filter-item"
            @click="findFolders"
          >
            新增
            <i class="el-icon-caret-bottom" />
          </el-button>
        </div>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item @click.native="handleCreateFolder()">
            <span style="display:block;">创建目录</span>
          </el-dropdown-item>
          <el-dropdown-item divided @click.native="handleCreateTemplate()">
            <span style="display:block;">创建模板</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <div v-show="!searchFlag" class="filter-container">
      <div class="filter-item">
        <span style="color:#406892;font-size:14px">当前仓库：</span>
      </div>
      <div class="filter-item">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item v-for="(item,index) in folderNames" :key="index">{{ item }}</el-breadcrumb-item>

        </el-breadcrumb>
      </div>
    </div>

    <el-table
      v-loading="tableLoading"
      row-key="id"
      stripe
      border
      highlight-current-row
      :data="documentTemplates"
      :tree-props="{children: 'childrens', hasChildren: 'hasChildren'}"
      :expand-row-keys="expand"
      @expand-change="expandChange"
    >
      <el-table-column
        v-if="searchFlag"
        label="模板路径"
        min-width="100px"
      >
        <template slot-scope="scope">
          <el-cascader
            ref="documentCascader1"
            v-model="scope.row.parentId"
            disabled
            style="width:100%;"
            :props="{label:'docName',value:'id',checkStrictly: true}"
            :options="documentTreeData"
            @change="handleChangeFolder('documentCascader1')"
          />
        </template>
      </el-table-column>
      <el-table-column
        label="模板名称"
      >
        <template slot-scope="scope">
          <i v-if="scope.row.folder" class="el-icon-folder" />
          {{ scope.row.docName }}
        </template>
      </el-table-column>
      <el-table-column
        label="类型"
        width="120"
      >
        <template slot-scope="scope">
          <el-tag v-if=" scope.row.docType" type="success">{{ scope.row.docType }}</el-tag>
          <el-tag v-else type="warning">文件夹</el-tag>
        </template>
      </el-table-column>
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

          <el-tooltip class="item" effect="dark" content="删除" placement="top-start">
            <el-button
              type="danger"
              size="small"
              icon="el-icon-delete"
              circle
              @click="handleDeleteTemplate(row)"
            />
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="编辑模板" placement="top-start">
            <el-button
              v-show="!row.folder"
              type="success"
              size="small"
              icon="el-icon-tickets"
              circle
              @click="openPageOffice(row)"
            />
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="下载" placement="top-start">
            <el-button
              v-show="!row.folder"
              type="warning"
              size="small"
              circle
              icon="el-icon-download"
              @click="downloadTemplate(row)"
            />
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="新增" placement="top-start">
            <el-dropdown v-show="row.folder" style="margin-left:10px" class="avatar-container menu-item hover-effect" trigger="click">
              <div class="avatar-wrapper">
                <el-button
                  size="small"
                  class="filter-item"
                  circle
                  icon="el-icon-caret-bottom"
                  @click="findFolders"
                />
              </div>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="handleCreateFolder(row)">
                  <span style="display:block;">创建目录</span>
                </el-dropdown-item>
                <el-dropdown-item divided @click.native="handleCreateTemplate(row)">
                  <span style="display:block;">创建模板</span>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="pageEntity.pageNum" :limit.sync="pageEntity.pageSize" @pagination="handleSearch()" />
    <!-- 新建 -->
    <el-dialog
      v-dialogDrag
      :title="title"
      :visible.sync="dialogFormVisible"
      width="800px"
      :close-on-click-modal="false"
      :before-close="handleCloseDialog"
    >
      <!-- 文件夹 -->
      <el-form
        v-show="template.folder"
        ref="templateForm"
        :model="template"
        label-width="100px"
        :rules="templateRules"
      >
        <el-form-item label="父级">
          <el-cascader
            ref="documentCascader1"
            v-model="template.parentId"
            filterable
            style="width:100%"
            :props="{label:'docName',value:'id',checkStrictly: true}"
            :options="documentTreeData"
            @change="handleChangeFolder('documentCascader1')"
          />
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number
            v-model="template.sort"
            :min="1"
            :max="10000"
            label="排序"
            style="width:100%"
          />
        </el-form-item>
        <el-form-item label="文件名称" prop="docName">
          <el-input v-model="template.docName" autocomplete="off" />
        </el-form-item>
      </el-form>
      <!-- 模板 -->
      <el-tabs
        v-show="!template.folder"
        v-model="activeTab"
        @tab-click="changeTabs"
      >
        <el-tab-pane label="新建模板" name="first">
          <el-form :model="template" label-width="100px">
            <el-form-item label="父级">
              <el-cascader
                ref="documentCascader2"
                v-model="template.parentId"
                filterable
                style="width:100%"
                :props="{label:'docName',value:'id',checkStrictly: true}"
                :options="documentTreeData"
                @change="handleChangeFolder('documentCascader2')"
              />
            </el-form-item>
            <el-form-item label="排序">
              <el-input-number
                v-model="template.sort"
                :min="1"
                :max="10000"
                label="排序"
                style="width:100%"
              />
            </el-form-item>
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
              <div>
                <el-cascader
                  ref="documentCascader3"
                  v-model="template.parentId"
                  filterable
                  placeholder="父级目录"
                  :props="{label:'docName',value:'id',checkStrictly: true}"
                  :options="documentTreeData"
                  @change="handleChangeFolder('documentCascader3')"
                />
                <el-input-number
                  v-model="template.sort"
                  :min="1"
                  :max="10000"
                  placeholder="排序"
                  style="width:160px"
                />
              </div>
              <br>
              <el-input
                v-model="template.remarks"
                rows="5"
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
    <!-- 更新模板 -->
    <el-dialog
      v-dialogDrag
      :title="title"
      :close-on-click-modal="false"
      :visible.sync="updateTemplateDialogVisible"
      width="600"
      :before-close="handleCloseupdateTemplate"
    >
      <el-form
        v-show="template.folder"
        ref="templateForm"
        :model="template"
        label-width="100px"
        :rules="templateRules"
      >
        <el-form-item label="父级">
          <el-cascader
            ref="documentCascader4"
            v-model="template.parentId"
            filterable
            style="width:100%"
            :props="{label:'docName',value:'id',checkStrictly: true}"
            :options="documentTreeData"
            @change="handleChangeFolder('documentCascader4')"
          />
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number
            v-model="template.sort"
            :min="1"
            :max="10000"
            label="排序"
            style="width:100%"
          />
        </el-form-item>
        <el-form-item label="文件名称" prop="docName">
          <el-input v-model="template.docName" autocomplete="off" />
        </el-form-item>
      </el-form>
      <el-tabs v-show="!template.folder" v-model="updateTemplateTabs">
        <el-tab-pane label="基本信息" name="first">
          <el-form
            ref="templateForm"
            :model="template"
            label-width="100px"
            :rules="templateRules"
          >
            <el-form-item label="父级">
              <el-cascader
                ref="documentCascader5"
                v-model="template.parentId"
                filterable
                style="width:100%"
                :props="{label:'docName',value:'id',checkStrictly: true}"
                :options="documentTreeData"
                @change="handleChangeFolder('documentCascader5')"
              />
            </el-form-item>
            <el-form-item label="排序">
              <el-input-number
                v-model="template.sort"
                :min="1"
                :max="10000"
                label="排序"
                style="width:100%"
              />
            </el-form-item>
            <el-form-item label="模板名称" prop="docName">
              <el-input v-model="template.docName" autocomplete="off" placeholder="请输入模板名称">
                <template slot="append">{{ template.docType }}</template>
              </el-input>
            </el-form-item>

            <el-form-item label="备注">
              <el-input
                v-model="template.remarks"
                type="textarea"
                rows="4"
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
            <el-checkbox-group v-model="checkedLabels">
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
import { saveDocumentTemplate, deleteDocumentTemplate, checkFileExist, updateTemplate, findDocumentTemplates, findDocumentTree, findPageDocumentTemplates } from '@/api/document/documentTemplate.js'
import { toTreeData } from '@/utils/data-to-tree'
import pagination from '@/components/Pagination'
export default {
  components: {
    pagination
  },
  props: {
    currentNode: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      title: '',
      documentTreeData: [],
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
        parentId: -1, // 默认-1
        docName: '',
        docType: '.doc',
        remarks: '',
        checkedLabels: '',
        folder: false // 默认创建的是文档
      },
      templateRules: {
        docName: [{ required: true, message: '请输入文档名称', trigger: 'blur' }]
      },
      documentTemplates: [],
      pageEntity: {
        pageNum: 1,
        pageSize: 10,
        docName: '',
        folder: false
      },
      total: 0,
      searchFlag: false,
      folderNames: ['根'],
      expand: []
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
    },
    'currentNode': function(newvalue) {
      this.template.parentId = newvalue.data.id
      this.template.sort = newvalue.childNodes.length + 1
      this.getTreeData()
      this.folderNames = parentList(newvalue, [])
    }

  },
  created() {
    this.getTreeData()
    this.findFolders()
  },
  methods: {

    handleSearch() {
      console.log(this.pageEntity)

      if (this.pageEntity.docName) {
        this.tableLoading = true
        findPageDocumentTemplates(this.pageEntity).then(res => {
          console.log(res)
          this.documentTemplates = res.data.list
          this.total = res.data.total
          this.searchFlag = true
          this.tableLoading = false
        }).catch(_ => {
          this.$message.error('查询失败')
          this.tableLoading = false
        })
      } else {
        this.getTreeData()
      }
    },
    expandChange(row, flag) {
      if (flag) {
        this.addExpand(row.id)
      } else {
        const index = this.expand.indexOf(row.id)
        this.expand.splice(index, 1)
      }
    },
    addExpand(data) {
      // 很坑，这里需要push字符串才能有效
      const i = data + ''
      const index = this.expand.indexOf(i)
      if (index < 0) {
        this.expand.push(i)
      }
    },
    getTreeData() {
      this.searchFlag = false
      this.tableLoading = true
      let parentId = -1 // 默认parentID是-1
      this.total = 0
      if (this.currentNode.data) {
        parentId = this.currentNode.data.id
      }
      findDocumentTree(parentId).then(res => {
        this.documentTemplates = res.data
        this.tableLoading = false
      }).catch(_ => {
        this.tableLoading = false
        this.$message.error('文档库查询失败')
      })
    },
    findFolders() {
      findDocumentTemplates({ folder: true }).then(res => {
        this.documentTreeData = toTreeData(res.data)
      }).catch(_ => {
        this.$message.error('文件夹查询失败')
      })
    },
    // 文件夹相关
    handleCreateFolder(data) {
      if (data) {
        this.template.parentId = data.id
        this.template.sort = data.childrens.length + 1
      }
      this.title = '新增目录'
      this.template.folder = true
      this.template.docType = ''
      this.dialogFormVisible = true
    },
    handleCreateTemplate(data) {
      if (data) {
        this.template.parentId = data.id
      }
      this.title = '新增模板'
      this.template.folder = false
      this.template.docType = '.doc'
      this.dialogFormVisible = true
    },
    handleChangeFolder(cascader) {
      const template = this.$refs[cascader].getCheckedNodes()[0]
      this.template.sort = template.children.length + 1
      this.template.parentId = template.data.id
    },
    saveDocumentTemplate(dialog) {
      this.$confirm('确认提交？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        saveDocumentTemplate(this.template).then(response => {
          this.dialogFormVisible = false
          this.addExpand(this.template.parentId)
          this.getTreeData()
          this.clearForm()
          if (response.flag) {
            this.$message.success('保存成功')
          } else {
            this.$message.error('保存失败')
          }
        }).catch(() => {

        })
      }).catch(() => {
        this.$message.info('已取消提交')
      })
    },
    handleUpdateTemplate(row) {
      this.title = '编辑文件夹'
      this.template = { ...row }
      this.updateTemplateDialogVisible = true

      // 初始化模板
      if (!row.folder) { // 文件夹
        this.title = '编辑模板'
        this.template.docType = row.docType
        this.template.docLocation = row.docLocation
        this.template.remarks = row.remarks
        this.checkedLabels = []
        if (row.checkedLabels) {
          this.checkedLabels = row.checkedLabels.split(',')
        }
      }
    },
    updateTemplate(form) {
      this.updateTemplateDialogVisible = false

      this.$refs[form].validate((valid) => {
        if (valid) {
          updateTemplate(this.template).then(res => {
            this.$message.success('更行成功')
            this.addExpand(this.template.parentId)
            this.getTreeData()
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
      this.resetTemplate()
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
    deleteTemplate(data) {
      deleteDocumentTemplate(data).then(() => {
        this.$message.success('删除成功')
        this.getTreeData()
      }).catch(() => {
        this.$message.error('删除失败')
      })
    },
    changeTabs(tab, event) {
      // 暂时留着

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
      if (this.$refs.templateForm) {
        // 移除校验规则
        this.$refs.templateForm.clearValidate()
      }
      this.dialogFormVisible = false
      this.activeTab = 'first'
      this.resetTemplate()
    },
    beforeUpload(file) {
      const fileType = file.name.substring(file.name.lastIndexOf('.') + 1)
      if (fileType !== 'docx' && fileType !== 'doc') {
        this.$message.error('请选择.docx或.doc文件')
        return false
      }
    },
    beforeRemove(file, fileList) {
      this.resetTemplate()
    },
    onSuccess(response, file, fileList) {
      if (response.flag) {
        const fullname = file.name
        this.template.docName = fullname.substring(0, fullname.lastIndexOf('.'))
        this.template.docType = fullname.substring(fullname.lastIndexOf('.'))
        this.template.docLocation = response.data
      } else {
        this.$message.error('文件上传失败')
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
    },
    resetTemplate() {
      if (this.currentNode.data) {
        this.template = {
          parentId: this.currentNode.data.id,
          sort: this.currentNode.childNodes.length + 1,
          docName: '',
          docType: '.doc',
          docLocation: '',
          remarks: '',
          folder: false

        }
      } else {
        this.template = {
          parentId: -1,
          docName: '',
          docType: '.doc',
          docLocation: '',
          remarks: '',
          folder: false

        }
      }
    }
  }
}
// 递归获取父文件名称
function parentList(data, array) {
  if (data.data.docName) {
    array.unshift(data.data.docName)
  }
  if (data.parent != null) {
    parentList(data.parent, array)
  }
  return array
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
