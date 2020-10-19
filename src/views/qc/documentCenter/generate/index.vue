<template>
  <div class="app-container">
    <el-row :gutter="6">
      <el-col :span="6">
        <navmenu @lisnteTreeCLick="handleTreeChange" />
      </el-col>
      <el-col :span="18">
        <dashbord v-if="flag" />
        <documentTimeLine v-else :node="currentNode" @lisntePreCreate="handleCreateDoc" @listenShowDashbord="showDashbord" />
      </el-col>
    </el-row>

  </div>
</template>

<script>
import navmenu from '@/views/qc/documentCenter/generate/commponents/navmenu.vue'
import dashbord from '@/views/qc/documentCenter/generate/commponents/dashbord.vue'
import documentTimeLine from '@/views/qc/documentCenter/generate/commponents/timeline.vue'
import { findCodeById } from '@/api/project/code.js'
import { findProjectById } from '@/api/project/project.js'
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
      console.log(1)
      if (data.level > 2) {
        this.flag = false
        this.currentNode = data
        this.currentNode = this.getDetail(data.level, data.data.id)
        console.log(2)
      }
    },
    handleCreateDoc(uuid) {
      console.log('让我告诉后台要准备的数据然后存在' + uuid, this.currentNode)
    },
    showDashbord() {
      this.flag = true
    },
    getDetail(type, id) {
      const promise = new Promise((resolve, reject) => {
        console.log(3)
        switch (type) {
          case 3 :
            findCodeById(id).then(res => {
              console.log(4)
              resolve(res.data)
            }).catch(_ => {
              reject('项目查询失败')
            })
            break
          case 4:
            findProjectById(id).then(res => {
              console.log(5)
              resolve(res.data)
            }).catch(_ => {
              reject('项目查查询失败')
            })
            console.log('查询项目', id)
        }
      })
      return promise
    }
  }

}
</script>

<style>

</style>
