<template>
  <div class="dashboard-container">
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card style="background:#FFEBCD">
          <div slot="header" style="text-align:center">
            <span style="font-size:18px;color:#6699CC">在研令号</span>

          </div>

          <div style="text-align:center">
            <span style="font-size:36px;color:#11919A" @click="routeWaitCommit()">8654</span>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card style="background:#87CEEB">
          <div slot="header" style="text-align:center">
            <span style="font-size:18px;color:#6699CC">在研的测试项目</span>

          </div>
          <div style="text-align:center">
            <span style="font-size:36px;color:#11919A" @click="routeWaitCheck()">46528</span>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card style="background:#CCEEFF">
          <div slot="header" style="text-align:center">
            <span style="font-size:18px;color:#6699CC">软件测试用例数</span>

          </div>
          <div style="text-align:center">
            <span style="font-size:36px;color:#11919A" @click="routeHasCheck()">15</span>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card style="background:#FFFACD">
          <div slot="header" style="text-align:center">
            <span style="font-size:18px;color:#6699CC">软件缺陷数</span>

          </div>
          <div style="text-align:center">
            <span style="font-size:36px;color:#11919A" @click="routeMyCheck()">58</span>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script>

export default {
  data() {
    return {
      waitCommit: 0,
      waitCheck: 0,
      hasCheck: 0,
      myCheck: 0
    }
  },
  created() {

  },
  methods: {

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

  <style lang="scss" scoped>
    .dashboard {
    &-container {
    margin: 20px;

    }
    &-text {
    font-size: 30px;
    line-height: 46px;
    }
    }

    .el-row {
    margin-bottom: 20px;
    &:last-child {
    margin-bottom: 0;
    }
    }
    .el-col {
    border-radius: 4px;
    }
    .bg-purple-dark {
    background: #99a9bf;
    }
    .bg-purple {
    background: #d3dce6;
    }
    .bg-purple-light {
    background: #e5e9f2;
    }
    .grid-content {
    border-radius: 4px;
    min-height: 36px;
    }
    .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
    }
         .el-card .el-card__header {
    background-color: #FCFCFC;
    padding: 8px 20px;
  }
  </style>

<style >
    .el-card .el-card__header {
    background-color: #FCFCFC;
    padding: 8px 20px;
  }

</style>
