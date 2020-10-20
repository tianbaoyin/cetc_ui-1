<template>
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
          @click="getFoldTree"
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
        <el-button slot="append" icon="el-icon-search" size="mini" circle />
      </el-input>
      <el-divider />
      <el-tree
        ref="tree"
        v-loading="treeloading"
        accordion
        :data="treeData"
        :props="defaultProps"
        :expand-on-click-node="false"
        highlight-current
        class="project-tree"
        @node-click="handleNodeClick"
      />
    </div>
  </el-card>
</template>

<script>
import { findFolders } from '@/api/document/documentTemplate.js'
import { toTreeData } from '@/utils/data-to-tree'
export default {
  name: 'DocumentProjectTree',
  data() {
    return {
      filterText: '',
      treeloading: true,
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'docName'
      }
    }
  },
  created() {
    this.getFoldTree()
  },
  methods: {
    getFoldTree() {
      this.treeloading = true
      findFolders().then(response => {
        this.treeData = toTreeData(response.data)
        this.treeloading = false
      }).catch(() => {
        this.treeloading = false
      })
    },
    handleNodeClick(val, node, data) {
      // 将当前的节点信息传递给父级
      this.$emit('lisnteTreeCLick', node)
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
