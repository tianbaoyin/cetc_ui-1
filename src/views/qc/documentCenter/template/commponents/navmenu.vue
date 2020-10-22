<template>
  <div>
    <el-card class="box-card">
      <div slot="header">
        <span style="font-size:18px;color:#006400">文档库</span>
        <el-tooltip class="item" effect="dark" content="刷新文档库" placement="right-start">
          <el-button
            type="primary"
            style="float: right; padding: 5px 5px;margin-left:5px"
            icon="el-icon-refresh"
            circle
            @click="getFoldTree"
          />
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="新增文档库" placement="right-start">
          <el-button
            type="primary"
            style="float: right; padding: 5px 5px"
            icon="el-icon-plus"
            circle
            @click="openDialog"
          />
        </el-tooltip>
      </div>
      <div>
        <el-input
          v-model="filterText"
          size="small "
          clearable
          placeholder="输入关键字进行过滤"
        >
          <el-button slot="append" icon="el-icon-search" size="mini" circle @click="treeFilter()" />
        </el-input>
        <el-divider />
        <!--  accordion -->
        <el-tree
          ref="tree"
          v-loading="treeloading"
          node-key="id"
          :data="treeData"
          :props="defaultProps"
          :expand-on-click-node="false"
          :filter-node-method="filterNode"
          :default-expanded-keys="expanded"
          highlight-current
          class="project-tree"
          @node-click="handleNodeClick"
          @node-expand="handleNodeExpand"
          @node-collapse="handleNodeCollapse"
        >
          <span slot-scope="{ node, data }" class="custom-tree-node">
            <span><i class="el-icon-folder" /> {{ node.label }}</span>
            <span>
              <el-button
                type="text"
                size="mini"
                icon="el-icon-edit"
                @click="() => handleEditTemplate(data)"
              />
              <el-button
                type="text"
                size="mini"
                icon="el-icon-plus"
                @click="() => handleCreateFolderOnNode(node,data)"
              />
              <el-button
                type="text"
                size="mini"
                icon="el-icon-delete"
                @click="()=>handleDeleteTemplate(data)"
              />
            </span>
          </span>
        </el-tree>
      </div>
    </el-card>
    <el-dialog
      v-dialogDrag
      :title="title"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      width="800px"
    >
      <el-form
        ref="folderForm"
        :model="folder"
        label-width="100px"
        :rules="folderRules"
      >
        <el-form-item label="父级">
          <el-cascader
            ref="folderCascader"
            v-model="folder.parentId"
            style="width:100%"
            clearable
            filterable
            :props="{label:'docName',value:'id',checkStrictly: true}"
            :options="treeData"
            @change="handleChangeFolder"
          />
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number
            v-model="folder.sort"
            :min="1"
            :max="10000"
            label="排序"
            style="width:100%"
          />
        </el-form-item>
        <el-form-item label="文件名称" prop="docName">
          <el-input v-model="folder.docName" autocomplete="off" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogVisible = false">取 消</el-button>
        <el-button size="small" type="primary" @click="handleAddFolder">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { findDocumentTemplates, saveDocumentTemplate, deleteDocumentTemplate, updateTemplate } from '@/api/document/documentTemplate.js'
import { toTreeData } from '@/utils/data-to-tree'
export default {
  name: 'DocumentProjectTree',
  data() {
    return {
      title: '新增',
      filterText: '',
      dialogVisible: false,
      treeloading: true,
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'docName'
      },
      folder: {
        parentId: -1, // 默认-1
        docName: '',
        remarks: '',
        sort: 1,
        folder: true // 默认创建的是文档
      },
      folderRules: {
        docName: [{ required: true, message: '请输入文件夹名称', trigger: 'blur' }]
      },
      expanded: []

    }
  },
  created() {
    this.getFoldTree()
  },
  methods: {
    getFoldTree() {
      this.treeloading = true
      findDocumentTemplates({ folder: true }).then(response => {
        this.treeData = toTreeData(response.data)
        this.treeloading = false
      }).catch(() => {
        this.treeloading = false
      })
    },
    treeFilter() {
      this.treeloading = true
      this.$refs.tree.filter(this.filterText)
      this.treeloading = false
    },
    filterNode(value, data) {
      if (!value) return true
      return data.docName.indexOf(value) !== -1
    },
    openDialog() {
      this.dialogVisible = true
      this.resetfolder()
    },
    handleNodeClick(val, node, data) {
      // 将当前的节点信息传递给父级
      this.$emit('lisnteTreeCLick', node)
    },

    handleNodeExpand(val, node, data) {
      // 节点被展开时触发的事件
      this.addExpanded(val.id)
    },
    addExpanded(val) {
      const index = this.expanded.indexOf(val)
      if (index < 0) {
        this.expanded.push(val)
      }
    },
    handleNodeCollapse(val, node, data) {
      const index = this.expanded.indexOf(val.id)
      this.expanded.splice(index, 1)
    },
    handleAddFolder() {
      this.$refs.folderForm.validate(valid => {
        if (valid) {
          this.$confirm('确认提交？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            if (this.folder.id && this.folder.id !== '') {
              console.log('更新')
              this.updateFolder()
            } else {
              console.log('新增')
              this.createFolder()
            }
          }).catch(() => {
            this.$message.info('已取消提交')
          })
        }
      })
    },
    updateFolder() {
      updateTemplate(this.folder).then(res => {
        this.dialogVisible = false
        this.addExpanded(this.folder.parentId)
        this.getFoldTree()
        this.resetfolder()
        this.$message.success('文件夹更新成功！')
      }).catch(_ => {
        this.resetfolder()
        this.$message.error('文件夹更新失败！')
      })
    },
    createFolder() {
      saveDocumentTemplate(this.folder).then(res => {
        this.dialogVisible = false
        this.addExpanded(this.folder.parentId)
        this.getFoldTree()
        this.resetfolder()
        this.$message.success('文件夹创建成功！')
      }).catch(_ => {
        this.resetfolder()
        this.$message.error('文件夹创建失败！')
      })
    },

    handleChangeFolder(value) {
      const folder = this.$refs['folderCascader'].getCheckedNodes()
      console.log(folder)
      this.folder.parentId = value[value.length - 1]
      this.folder.sort = folder[0].children.length + 1
    },
    handleEditTemplate(data) {
      this.resetfolder()
      this.title = '编辑'
      this.folder = { ...data }
      this.dialogVisible = true
    },
    handleCreateFolderOnNode(node, data) {
      this.folder.parentId = data.id
      this.folder.sort = node.childNodes.length + 1
      this.dialogVisible = true
    },
    handleDeleteTemplate(data) {
      findDocumentTemplates({ parentId: data.id }).then(res => {
        if (res.data.length > 0) {
          this.$alert('删除此文件夹需要先删除该文件夹下所有文件', '提示', {
            confirmButtonText: '确定'
          })
        } else {
          this.$confirm('确认要删除《' + data.docName + '》？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.deleteTemplate(data)
          }).catch(() => {
            this.$message.info('已取消删除')
          })
        }
      }).catch(_ => {

      })
    },
    // 删除
    deleteTemplate(data) {
      deleteDocumentTemplate(data).then(() => {
        this.$message.success('删除成功')
        this.getFoldTree()
      }).catch(() => {
        this.$message.error('删除失败')
      })
    },
    // 初始化表单
    resetfolder() {
      if (this.$refs.folderForm) {
        this.$refs.folderForm.resetFields()
      }
      this.title = '新增'
      this.folder = {
        parentId: -1, // 默认-1
        docName: '',
        remarks: '',
        folder: true // 默认创建的是文档
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .project-tree{
      height:660px;
       overflow:auto
  }
    /* 菜单滚动条 */
  .project-tree::-webkit-scrollbar {
    z-index: 11;
    width: 6px;
  }
  .project-tree::-webkit-scrollbar-track,
  .project-tree::-webkit-scrollbar-corner {
    background: #fff;
  }
  .project-tree::-webkit-scrollbar-thumb {
    border-radius: 5px;
    width: 6px;
    background: #b4bccc;
  }
  .project-tree::-webkit-scrollbar-track-piece {
    background: #fff;
    width: 6px;
  }
 .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
</style>

<style scoped>
    .el-card .el-card__header {
    background-color: #FCFCFC;
    padding: 8px 20px;
  }
</style>
