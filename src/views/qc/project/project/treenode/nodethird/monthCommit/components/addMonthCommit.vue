<template>
  <div class="app-container">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="测试执行信息" name="testExec">
        <testexecute :node="node" :month-commit-form="monthCommitForm" />
      </el-tab-pane>
      <el-tab-pane label="测试设计信息" name="testDesign">
        <testDesign :node="node" :month-commit-form="monthCommitForm" />
      </el-tab-pane>

    </el-tabs>
  </div>
</template>
<script>

import testexecute from '@/views/qc/project/project/treenode/nodethird/projectInfo/testExecute.vue'
import testDesign from '@/views/qc/project/project/treenode/nodethird/monthCommit/components/testDesign.vue'
export default {
  components: {
    testexecute,
    testDesign
  },
  props: {
    node: {
      type: Object,
      required: true
    },
    monthCommitForm: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      activeName: 'testExec'
    }
  },
  watch: {
    monthCommitForm() {
      this.activeName = 'testExec'
    }
  },

  created() {
    this.activeName = 'testExec'
  },

  methods: {
    handleClick(tab, event) {
      console.log(tab, event)
    }
  }
}
</script>
