<template>
  <div>
    <el-upload
      class="upload-demo"
      action=""
      :on-preview="handlePreview"
      :on-remove="handleRemove"
      :before-remove="beforeRemove"
      multiple
      :limit="3"
      :on-exceed="handleExceed"
      :file-list="fileList"
    >
      <el-button size="small" type="primary">点击上传</el-button>
    </el-upload>
    <el-divider />
    <el-button-group>
      <el-button v-waves size="small" type="primary" icon="el-icon-edit">可疑文件</el-button>
      <el-button v-waves size="small" type="primary" icon="el-icon-tickets">文件列表</el-button>
      <el-button v-waves size="small" type="primary" icon="el-icon-refresh">刷新</el-button>
    </el-button-group>
    <el-divider />
    <el-table
      :data="tableData"
      border
      stripe
      style="width: 100%"
    >
      <el-table-column
        prop="date"
        label="总行数"
      />
      <el-table-column
        prop="name"
        label="代码行数"
        width="180"
      />
      <el-table-column
        prop="address"
        label="注释行数"
      />
      <el-table-column
        prop="address"
        label="空白数"
      />
    </el-table>

  </div>
</template>
<script>
import waves from '@/directive/waves'
export default {
  name: 'TestCodeSource',
  directives: { waves },
  props: {
    query: {
      type: Object,
      require: true,
      default: Object
    }
  },
  data() {
    return {
      fileList: [],
      tableData: []
    }
  },
  methods: {
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    handlePreview(file) {
      console.log(file)
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`)
    }
  }
}
</script>
