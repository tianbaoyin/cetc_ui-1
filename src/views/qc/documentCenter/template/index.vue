<template>
  <div class="app-container">
    <el-row :gutter="4">
      <el-col :span="6">
        <navmenu @lisnteTreeCLick="changFolder" />
      </el-col>
      <el-col :span="18">
        <dashbord :current-node="currentNode" />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import navmenu from '@/views/qc/documentCenter/template/commponents/navmenu.vue'
import dashbord from '@/views/qc/documentCenter/template/commponents/dashbord.vue'
export default {
  components: {
    navmenu,
    dashbord
  },
  data() {
    return {
      currentNode: {}
    }
  },
  methods: {
    changFolder(node) {
      this.currentNode = node
    }
  }
}
</script>

<style>

</style>
