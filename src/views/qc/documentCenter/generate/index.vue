<template>
  <div class="app-container">
    <el-row :gutter="6">
      <el-col :span="6">
        <navmenu @lisnteTreeCLick="handleTreeChange" />
      </el-col>
      <el-col :span="18">
        <dashbord v-if="flag" />
        <documentTimeLine v-else :node="currentNode" @lisntePreCreate="handleCreateDoc" />
      </el-col>
    </el-row>

  </div>
</template>

<script>
import navmenu from '@/views/qc/documentCenter/generate/commponents/navmenu.vue'
import dashbord from '@/views/qc/documentCenter/generate/commponents/dashbord.vue'
import documentTimeLine from '@/views/qc/documentCenter/generate/commponents/timeline.vue'
export default {
  name: 'DocumentCenterGenerate',
  components: {
    navmenu,
    dashbord,
    documentTimeLine
  },
  data() {
    return {
      flag: true,
      currentNode: {}
    }
  },
  methods: {
    handleTreeChange(data) {
      this.flag = false
      this.currentNode = data
      console.log('树组件传来的值：', data)
    },
    handleCreateDoc(uuid) {
      console.log('让我告诉后台要准备的数据然后存在' + uuid, this.currentNode)
    }
  }

}
</script>

<style>

</style>
