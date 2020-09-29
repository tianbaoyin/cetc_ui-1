<template>
  <div class="app-container">
    <el-row :gutter="5">
      <el-col :span="5">
        <el-card class="box-card">
          <div slot="header">
            <span style="font-size:18px;color:#006400">{{ treetitle }}</span>
            <el-tooltip class="item" effect="dark" content="过滤无关节点" placement="right-start">
              <el-button
                type="primary"
                style="float: right; padding: 5px 5px;margin-left:5px"
                icon="el-icon-star-off"
                circle
                @click="checkMyData()"
              />
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="刷新所有项目" placement="right-start">
              <el-button
                type="primary"
                style="float: right; padding: 5px 5px"
                icon="el-icon-refresh"
                circle
                @click="refresh"
              />
            </el-tooltip>
          </div>
          <div>
            <el-input
              v-model="filterText"
              size="mini"
              clearable
              placeholder="输入关键字进行过滤"
            >

              <el-button slot="append" icon="el-icon-search" size="mini" circle @click="treeFilter()" />
            </el-input>

            <el-divider />
            <el-tree
              ref="tree"
              v-loading="treeloading"
              accordion
              :data="treeData"
              highlight-current
              class="project-tree"
              :props="props"
              :filter-node-method="filterNode"
              :expand-on-click-node="false"
              @node-click="handleNodeClick"
            >
              <span slot-scope="{ node}" class="custom-tree-node">
                <span>{{ node.label }}</span>
                <span v-if="node.data.operate">
                  <svg-icon icon-class="dooropen" />

                </span>
              </span>

            </el-tree>
          </div>
        </el-card>
      </el-col>
      <el-col :span="19">
        <el-row>
          <el-col :span="12">
            <div v-if="title" style="color:#008B8B;height:28px">
              <i class="el-icon-position" />
              {{ title }}
            </div>
          </el-col>
          <el-col :span="12">
            <el-button
              v-show="current"
              icon="el-icon-close"
              circle
              style="float: right; padding: 6px 6px"
              @click="closepage"
            />
          </el-col>
        </el-row>

        <initTabs v-if="current === null" />
        <kingTabs v-if="current === 'k'" :node="currentNode" />
        <codeTabs v-if="current === 'c'" :node="currentNode" />
        <projectTabs v-if="current === 'p'" :node="currentNode" />
      </el-col>
    </el-row>

  </div>
</template>
<script>
import { findProjectTree } from '@/api/project/project.js'
import { findMyProjectTree } from '@/api/project/project.js'
import initTabs from '@/views/qc/project/project/treenode/nodezero/index.vue'
import kingTabs from '@/views/qc/project/project/treenode/nodefirst/kingdomTabs'
import codeTabs from '@/views/qc/project/project/treenode/nodesecond/codeTabs'
import projectTabs from '@/views/qc/project/project/treenode/nodethird/projectTabs'
import { checkCodeRole } from '@/api/project/code.js'
import { checkProjectRole } from '@/api/project/project.js'
export default {
  name: 'ProjectIndex',
  components: {
    initTabs,
    codeTabs,
    projectTabs,
    kingTabs

  },
  inject: ['reload'],
  data() {
    return {
      openPanel: true, // 重新加载
      showRightMenu: false,
      title: '项目管理',
      filterText: '',
      current: null,
      treeData: [],
      currentNode: {},
      props: {
        label: 'label',
        children: 'children'
      },
      treetitle: '项目总览',
      treeloading: false
    }
  },
  created() {
    this.findProjectTree()
  },
  methods: {
    treeFilter() {
      this.treeloading = true
      this.$refs.tree.filter(this.filterText)
      this.treeloading = false
    },

    findProjectTree() {
      this.treetitle = '项目总览'
      this.treeloading = true
      findProjectTree().then(response => {
        this.treeData = response.data
        this.treeloading = false
      }).catch(() => {
        this.treeloading = false
      })
    },
    refresh() {
      this.findProjectTree()
    },
    checkMyData() {
      this.treetitle = '我的项目'
      this.treeloading = true
      findMyProjectTree(this.treeData).then(response => {
        this.treeData = response.data
        this.treeloading = false
      }).catch(() => {
        this.treeloading = false
        console.log('项目树过滤失败')
      })
    },
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    closepage() {
      this.title = '项目管理'
      this.current = null
    },
    handleNodeClick(val, node, data) {
      if (node.level === 1) {
        this.current = null
        this.title = '项目管理'
      } else if (node.level === 2) {
        this.current = 'k'
        this.currentNode = node.data
        this.title = node.parent.data.name + '>' + node.data.name
      } else if (node.level === 3) {
        checkCodeRole(node.data.id).then(response => {
          if (response.data) {
            console.log(node)
            this.title = node.parent.parent.data.name + '>' + node.parent.data.name + '>' + node.data.label
            this.current = 'c'
            this.currentNode = node.data
          } else {
            this.$alert('你没有权限打开', '提示', {
              confirmButtonText: '确定',
              callback: action => {
                //
              }
            })
          }
        }).catch(() => {

        })
      } else {
        checkProjectRole(node.data.id).then(response => {
          if (response.data) {
            this.title = node.parent.parent.parent.data.name + '>' + node.parent.parent.data.name + '>' + node.parent.data.label + '>' + node.data.name
            this.current = 'p'
            this.currentNode = node.data
          } else {
            this.$alert('你没有权限打开', '提示', {
              confirmButtonText: '确定',
              callback: action => {
              }
            })
          }
        }).catch(() => {
          console.error('权限校验失败')
        })
      }
    }
  }
}
</script>
<style lang="scss" scoped>
  .project-tree{
      height:760px;
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

<style >
    .el-card .el-card__header {
    background-color: #FCFCFC;
    padding: 8px 20px;
  }

</style>
