<template>
  <div>
    <el-tabs v-model="activeName" type="border-card">
      <el-tab-pane label="子令号管理" name="first">
        <codeManagement :node="node" :firstnodetabs="activeName" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import codeManagement from '@/views/qc/project/project/treenode/nodefirst/codeMangement.vue'
import checkPermission from '@/utils/permission'
export default {
  name: 'KingdomContainer',
  components: {
    codeManagement
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
