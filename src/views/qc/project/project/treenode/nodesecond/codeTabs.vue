<template>
  <div>
    <el-tabs v-model="activeName2" type="border-card">
      <el-tab-pane lazy label="子项目管理" name="codeProjectManager">
        <projectManagement :node="node" :tab2="activeName2" />
      </el-tab-pane>
      <el-tab-pane lazy label="文档审查" name="documentCheck">
        <documentCheck :node="node" :tab2="activeName2" />
      </el-tab-pane>
      <el-tab-pane lazy label="SQA" name="sqa">
        <sqa :node="node" :tab2="activeName2" />
      </el-tab-pane>

      <el-tab-pane lazy label="令号信息" name="fifth">
        <codeInfo :node="node" :tab2="activeName2" />
      </el-tab-pane>
    </el-tabs>

  </div>
</template>
<script>
import projectManagement from '@/views/qc/project/project/treenode/nodesecond/projectManagement.vue'
import documentCheck from '@/views/qc/project/project/treenode/nodesecond/documentCheck.vue'
import sqa from '@/views/qc/project/project/treenode/nodesecond/sqa/index.vue'
// import projectCount from '@/views/qc/project/project/treenode/nodesecond/count/index.vue'
// import sqa1 from '@/views/qc/project/project/treenode/nodesecond/sqa.vue'
import codeInfo from '@/views/qc/project/project/treenode/nodesecond/codeInfo.vue'
import checkPermission from '@/utils/permission'

export default {
  name: 'CodeTabs',
  components: {
    projectManagement,
    documentCheck,
    sqa,
    // projectCount,
    // sqa1,
    codeInfo
  },
  props: {
    node: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      activeName2: 'codeProjectManager'
    }
  },
  methods: {
    checkPermission,
    handleSelect(key, keyPath) {
      console.log(key)
    },
    chickProject(newpath) {
      this.$router.replace({ path: newpath })
    }
  }

}
</script>
