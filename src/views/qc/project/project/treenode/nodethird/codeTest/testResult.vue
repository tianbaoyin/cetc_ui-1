<template>
  <div class="app-container">
    <el-table
      :data="tableData"
      border
      stripe
      style="width: 100%"
    >
      <el-table-column
        prop="remark"
        header-align="center"
        label="描述"
      />
      <el-table-column
        prop="createTime"
        label="提交时间"
        align="center"
        width="180"
      />
      <el-table-column
        prop="creater"
        align="center"
        label="创建者"
      />
      <el-table-column
        align="center"
        prop="status"
        label="状态"
      />
      <el-table-column
        label="操作"
        align="center"
        width="200"
        fixed="right"
      >
        <template>
          <el-button v-waves type="danger" size="small" icon="el-icon-delete">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import waves from '@/directive/waves'
export default {
  name: 'TestResult',
  directives: { waves },
  data() {
    return {
      tableData: [{ remark: '这是个测试', createTime: '2020-05-11 14:00:00', creater: '赵万马', status: '完成' }]
    }
  }
}
</script>
