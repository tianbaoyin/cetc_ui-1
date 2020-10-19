<template>
  <div class="app-container">
    <el-row :gutter="12">
      <el-col :span="6">
        <el-card v-loading="loading1" shadow="hover">
          <div slot="header" style="font-size:18px;color:#006400">
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

      <el-col :span="18">
        <el-card v-loading="loading2" shadow="hover">
          <div slot="header" style="font-size:18px;color:#006400">
            <span>alm站点配置</span>
          </div>
          <el-form :model="almSiteConfig" label-width="100px">
            <el-row :gutter="20">
              <el-col :span="8">
                <input type="password" name="username" style="position: absolute;left: -10000px;">

                <el-form-item label="站点地址">
                  <el-input v-model="almSiteConfig.url" placeholder="http://0.0.0.0:8080/qcbin" />
                </el-form-item>

              </el-col>
              <el-col :span="8">
                <input type="password" name="username" style="position: absolute;left: -10000px;">

                <el-form-item label="管理员帐户">
                  <el-input v-model="almSiteConfig.username" placeholder="请输入alm的管理员帐户" />
                </el-form-item>

              </el-col>

              <el-col :span="8">
                <input type="password" name="username" style="position: absolute;left: -10000px;">

                <el-form-item label="管理员密码">
                  <el-input v-model="almSiteConfig.password" placeholder="请输入alm管理员的密码" show-password />
                </el-form-item>

              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="8">
                <el-form-item label="数据库类型">
                  <el-input v-model="almSiteConfig.dbType" placeholder="请输入ALM数据库类型" />
                </el-form-item>

              </el-col>
              <el-col :span="8">
                <el-form-item label="数据库IP">
                  <el-input v-model="almSiteConfig.dbAddress" placeholder="请输入alm数据库IP" />
                </el-form-item>

              </el-col>
              <el-col :span="8">
                <el-form-item label="数据库端口号">
                  <el-input v-model="almSiteConfig.dbPort" placeholder="请输入alm数据库端口号" />
                </el-form-item>

              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="8">
                <el-form-item label="数据库名称">
                  <el-input v-model="almSiteConfig.dbName" placeholder="请输入ALM数据库名称" />
                </el-form-item>

              </el-col>
              <el-col :span="8">
                <el-form-item label="数据库用户名">
                  <el-input v-model="almSiteConfig.dbUser" placeholder="请输入alm数据库用户名" />
                </el-form-item>

              </el-col>
              <el-col :span="8">
                <el-form-item label="数据库密码">
                  <el-input v-model="almSiteConfig.dbPassword" placeholder="请输入alm数据库密码" />
                </el-form-item>

              </el-col>
            </el-row>
            <el-form-item>
              <el-button type="primary" :loading="commitButtonLoading2" @click="saveAlmSiteConfig()">保存</el-button>
              <el-button>重置</el-button>
            </el-form-item>

          </el-form>
        </el-card>
      </el-col>

    </el-row>
  </div>
</template>
<script>
import { findAlmConfig, saveAlmConfig, saveAlmSiteConfig, findAlmSiteConfig } from '@/api/hpalm/alm.js'
export default {
  name: 'Almconfig',

  data() {
    return {
      almConfig: {
        url: null,
        username: null,
        password: null
      },

      almSiteConfig: {
        url: null,
        username: null,
        password: null,
        dbType: null,
        dbAddress: null,
        dbPort: null,
        dbName: null,
        dbUser: null,
        dbPassword: null

      },
      commitButtonLoading: false,
      commitButtonLoading2: false,
      loading1: true,
      loading2: false
    }
  },

  created() {
    this.handleFilter()
    this.findAlmSiteConfig()
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

    findAlmSiteConfig() {
      this.loading2 = true
      findAlmSiteConfig().then(response => {
        this.almSiteConfig = response.data
        this.loading2 = false
      }).catch(() => {
        this.loading2 = false
      })
    },

    saveAlmConfig() {
      this.commitButtonLoading = true
      saveAlmConfig(this.almConfig).then(response => {
        this.handleFilter()
        this.$message.success('保存成功')
        this.commitButtonLoading = false
      }).catch(() => {
        this.$message.error('保存失败')
        this.commitButtonLoading = false
      })
    },

    saveAlmSiteConfig() {
      this.commitButtonLoading2 = true
      saveAlmSiteConfig(this.almSiteConfig).then(response => {
        this.findAlmSiteConfig()
        this.$message.success('保存成功')
        this.commitButtonLoading2 = false
      }).catch(() => {
        this.$message.error('保存失败')
        this.commitButtonLoading2 = false
      })
    }

  }
}

</script>

<style >
    .el-card .el-card__header {
    background-color: #FCFCFC;
    padding: 8px 20px;
  }

</style>
