<template>
  <div style="height:800px">
    <div class="filter-container">
      <el-input v-model="pageEntity.name" style="width: 210px;" class="filter-item" size="small" placeholder="请填写项目名称（模糊查找）" />
      <el-button
        type="primary"
        size="small"
        icon="el-icon-search"
        class="filter-item"
        @click="pageList()"
      >
        搜索
      </el-button>
      <el-button
        type="primary"
        size="small"
        icon="el-icon-plus"
        class="filter-item"
        @click="add()"
      >
        获取数据源
      </el-button>
    </div>
    <el-table
      :data="tableData"
      style="width: 100%"
    >
      <el-table-column
        prop="date"
        label="日期"
        width="180"
      />
      <el-table-column
        prop="name"
        label="姓名"
        width="180"
      />
      <el-table-column
        prop="address"
        label="地址"
      />
    </el-table>
    <el-drawer
      size="70%"
      :visible.sync="drawer"
      :before-close="handleClose"
    >
      <span slot="title" style="color:#696969;font-size:20px"><svg-icon icon-class="leida" />    SQA数据接入</span>
      <history />
    </el-drawer>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: [{
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1517 弄'
      }, {
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1519 弄'
      }, {
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1516 弄'
      }],
      pageEntity: {
        pageNum: 1,
        pageSize: 10

      },
      drawer: false
    }
  },
  methods: {
    add() {
      this.drawer = true
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {})
    }

  }
}
</script>
 <style >
:focus {
   outline: 0;
 }
</style>
