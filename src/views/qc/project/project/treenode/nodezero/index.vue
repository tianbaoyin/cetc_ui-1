<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card style="background:#FFEBCD">
          <div slot="header" style="text-align:center">
            <span style="font-size:18px;color:#6699CC">总令号/我的令号</span>
          </div>

          <div style="text-align:center">
            <span style="font-size:36px;color:#11919A" @click="routeWaitCommit()">{{ codes }}/{{ mycodes }}</span>
          </div>

        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card style="background:#87CEEB">
          <div slot="header" style="text-align:center">
            <span style="font-size:18px;color:#6699CC">在研令号/我的在研</span>

          </div>
          <div style="text-align:center">
            <span style="font-size:36px;color:#11919A" @click="routeWaitCheck()">{{ codezy }}/{{ mycodezy }}</span>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card style="background:#CCEEFF">
          <div slot="header" style="text-align:center">
            <span style="font-size:18px;color:#6699CC">总项目/我的项目</span>

          </div>
          <div style="text-align:center">
            <span style="font-size:36px;color:#11919A" @click="routeHasCheck()">{{ projects }}/{{ myprojects }}</span>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card style="background:#FFFACD">
          <div slot="header" style="text-align:center">
            <span style="font-size:18px;color:#6699CC">在研项目/我的项目</span>

          </div>
          <div style="text-align:center">
            <span style="font-size:36px;color:#11919A" @click="routeMyCheck()">{{ projectszy }}/{{ myprojectszy }}</span>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="12">
      <el-col :span="12">
        <codepie />
      </el-col>

      <el-col :span="12">
        <countproject />
      </el-col>
    </el-row>
    <el-row :gutter="12">
      <el-col :span="12">
        <yearcodeline />
      </el-col>
      <el-col :span="12">
        <comprehensive />
      </el-col>
    </el-row>

  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import codepie from '@/views/qc/project/project/treenode/nodezero/charts/codepie.vue'
import comprehensive from '@/views/qc/project/project/treenode/nodezero/charts/comprehensive.vue'
import countproject from '@/views/qc/project/project/treenode/nodezero/charts/countproject.vue'
import yearcodeline from '@/views/qc/project/project/treenode/nodezero/charts/yearcodeline.vue'
import { findCodeData } from '@/api/project/code.js'
import { findProjectData } from '@/api/project/project.js'
export default {
  name: 'Treezero',
  components: {
    codepie,
    comprehensive,
    countproject,
    yearcodeline
  },
  data() {
    return {
      codes: 0,
      codezy: 0,
      mycodes: 0,
      mycodezy: 0,
      projects: 0,
      projectszy: 0,
      myprojects: 0,
      myprojectszy: 0
    }
  },
  computed: {
    ...mapGetters([
      'username' // 登录名
    ])
  },

  created() {
    this.findCodeData()
    this.findProjectData()
  },
  methods: {

    findCodeData() {
      findCodeData().then(response => {
        this.codes = response.data.codes
        this.codezy = response.data.codezy
        this.mycodes = response.data.mycodes
        this.mycodezy = response.data.mycodezy
      }).catch(() => {

      })
    },

    findProjectData() {
      findProjectData().then(response => {
        this.projects = response.data.projects
        this.projectszy = response.data.projectszy
        this.myprojects = response.data.myprojects
        this.myprojectszy = response.data.myprojectszy
      }).catch(() => {

      })
    },

    routeWaitCommit() {
      this.$notify({
        title: '提示',
        message: '正在日夜开发中，敬请期待',
        type: 'success'
      })
      // this.$router.push({ path: '/cooperative/transfer/processapply', query: { activeName: 'first' }})
    },
    routeWaitCheck() {
      this.$notify({
        title: '成功',
        message: '正在日夜开发中，敬请期待',
        type: 'success'
      })
      // this.$router.push({ path: '/cooperative/transfer/processapply', query: { activeName: 'second' }})
    },
    routeHasCheck() {
      this.$notify({
        title: '成功',
        message: '正在日夜开发中，敬请期待',
        type: 'success'
      })
      // this.$router.push({ path: '/cooperative/transfer/processapply', query: { activeName: 'third' }})
    },
    routeMyCheck() {
      this.$notify({
        title: '成功',
        message: '正在日夜开发中，敬请期待',
        type: 'success'
      })
      // this.$router.push({ path: '/cooperative/transfer/mycheck' })
    }
  }

}
</script>

