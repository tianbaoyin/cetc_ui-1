<template>
  <div class="app-container">
    <el-row :gutter="12">
      <el-col :span="8">
        <el-card v-loading="loading1" shadow="hover">
          <div slot="header" style="font-size:24px;color:#33CC33" class="clearfix">
            <span>alm基础配置</span>
          </div>
          <el-form :model="almConfig" label-width="80px">
            <el-form-item label="alm地址">
              <el-input v-model="almConfig.url" placeholder="http://0.0.0.0:8080/qcbin" />
            </el-form-item>
            <el-form-item label="alm用户名">
              <el-input v-model="almConfig.username" placeholder="用户名" />
            </el-form-item>
            <input type="password" name="username" style="position: absolute;left: -10000px;">

            <el-form-item label="alm密码">
              <el-input v-model="almConfig.password" show-password />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" :loading="commitButtonLoading" @click="saveAlmConfig()">保存</el-button>
              <el-button>重置</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>

    </el-row>
  </div>
</template>
<script>
import { findAlmConfig, saveAlmConfig } from '@/api/hpalm/alm.js'
export default {
  name: 'Almconfig',

  data() {
    return {
      almConfig: {
        url: null,
        username: null,
        password: null
      },
      commitButtonLoading: false,
      loading1: true

    }
  },

  created() {
    this.handleFilter()
  },
  methods: {
    handleFilter() {
      this.loading1 = true
      findAlmConfig().then(response => {
        this.loading1 = false
        if (response.data != null) {
          this.almConfig = response.data
        }
      }).catch(() => {
        this.$message.error('查询ALM配置失败')
        this.loading1 = false
      })
    },

    saveAlmConfig() {
      this.commitButtonLoading = true
      saveAlmConfig(this.almConfig).then(response => {
        this.$message.success('保存成功')
        this.commitButtonLoading = false
      }).catch(() => {
        this.$message.error('保存失败')
        this.commitButtonLoading = false
      })
    }
  }
}

</script>
