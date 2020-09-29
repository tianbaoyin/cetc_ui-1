<template>
  <div>

    <el-tabs v-model="activeName" type="border-card">
      <el-tab-pane lazy label="项目信息" name="first">
        <projectInfo :node="node" :tab3="activeName" />
      </el-tab-pane>
      <el-tab-pane lazy label="文档审查" name="second">
        <documentCheck :node="node" :tab3="activeName" />
      </el-tab-pane>
      <el-tab-pane lazy label="代码测试" name="third">
        <codeTest :node="node" :tab3="activeName" />
      </el-tab-pane>
      <el-tab-pane lazy label="项目数据分析" name="forth">
        <dataAnalysis :node="node" :tab3="activeName" />
      </el-tab-pane>
      <el-tab-pane lazy label="项目月度报表" name="monthCommit">
        <monthCommit :node="node" :tab3="activeName" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import codeTest from '@/views/qc/project/project/treenode/nodethird/codeTest/codeTest.vue'
import dataAnalysis from '@/views/qc/project/project/treenode/nodethird/dataAnalysis.vue'
import documentCheck from '@/views/qc/project/project/treenode/nodethird/documentCheck.vue'
import projectInfo from '@/views/qc/project/project/treenode/nodethird/projectInfo/index.vue'
import monthCommit from '@/views/qc/project/project/treenode/nodethird/monthCommit/index.vue'
import checkPermission from '@/utils/permission'
export default {
  name: 'ProjectTabs',
  components: {
    codeTest,
    dataAnalysis,
    documentCheck,
    projectInfo,
    monthCommit
  },
  props: {
    node: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      activeName: 'first'
    }
  },
  methods: {
    checkPermission
  }

}
</script>

