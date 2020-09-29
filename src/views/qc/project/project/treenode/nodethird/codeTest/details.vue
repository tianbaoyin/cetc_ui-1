<template>
  <div class="app-container">
    <el-tabs v-model="activeName">
      <el-tab-pane label="源码库" name="first">
        <testsource :query="query" />
      </el-tab-pane>
      <el-tab-pane label="手动检测" name="second">
        <totest />
      </el-tab-pane>
      <el-tab-pane label="测试结果" name="third">
        <testresult />
      </el-tab-pane>
    </el-tabs>
  </div>

</template>
<script>
import testsource from '@/views/qc/project/project/treenode/nodethird/codeTest/testSource.vue'
import testresult from '@/views/qc/project/project/treenode/nodethird/codeTest/testResult.vue'
import totest from '@/views/qc/project/project/treenode/nodethird/codeTest/toTest.vue'
export default {
  name: 'CodeTestDetails',
  components: {
    testsource,
    testresult,
    totest
  },
  props: {
    query: {
      type: Object,
      require: true,
      default: Object
    },
    drawercount: {
      type: Number,
      required: true,
      default: 0
    }
  },
  data() {
    return {
      activeName: 'first'
    }
  },
  watch: {
    drawercount() {
      console.log(this.query)
    }
  },
  created() {
    console.log(this.query)
  },
  methods: {

  }
}
</script>
