<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button class="filter-item" type="primary" size="small" icon="el-icon-s-management" @click="download">模板生成</el-button>
      <el-button class="filter-item" type="primary" size="small" icon="el-icon-s-management" @click="submitUpload">数据解析</el-button>
    </div>
    <div class="app-container">
      <el-row :gutter="12">
        <el-card shadow="hover">

          <el-upload
            ref="upload"
            class="upload-demo"
            drag
            action="http://localhost:82/api-project/compensate/importTemplate"
            :file-list="fileList"
            :limit="1"
            :headers="headers"
            :on-exceed="handleExceed"
            :on-success="uploadSuccess"
            :auto-upload="false"
          >
            <i class="el-icon-upload" />
            <div class="el-upload__text">将填写完数据的模板文件拖到此处或者<em>点击选取</em></div>
          </el-upload>
        </el-card>

      </el-row>
    </div>
  </div>
</template>
<script>
import { getToken } from '@/utils/auth'
export default {
  name: 'Compensate',

  data() {
    return {
      headers: { Authorization: 'Bearer' + getToken() },
      fileList: []
    }
  },

  created() {

  },
  methods: {
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    },
    submitUpload() {
      this.$refs.upload.submit()
    },
    download() {
      location.href = 'http://localhost:82/api-project/compensate/download'
    },
    uploadSuccess(response, file, fileList) {
      this.fileList = []
      if (response.flag) {
        this.$message({
          message: '数据导入成功',
          type: 'success'
        })
      } else {
        this.$message.error(response.message)
      }
    }
  }
}

</script>
