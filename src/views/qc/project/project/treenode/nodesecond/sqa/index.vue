<template>
  <div style="height:800px">
    <el-table
      v-loading="tableLoading"
      :data="tableData"
      stripe
      border
      style="width: 100%"
    >
      <el-table-column
        v-for="item in tableColumnList"
        :key="item.name"
        :label="item.label"
        width="150"
        :property="item.name"
        :show-overflow-tooltip="true"
      >
        <template slot-scope="scope">
          <span>{{ scope.row[scope.column.property] }}</span>
        </template>
      </el-table-column>

      <el-table-column
        align="center"
        width="120px"
        label="操作"
        fixed="right"
      >
        <template slot-scope="scope">
          <el-button size="mini" type="danger" icon="el-icon-delete" @click="findSqa(scope.row)">查看</el-button>
        </template>

      </el-table-column>

    </el-table>
  </div>
</template>

<script>

import { findSQAInfo } from '@/api/hpalm/sqa.js'

export default {
  props: {
    node: {
      type: Object,
      required: true
    },
    tab2: {
      type: String,
      requird: true,
      default: ''
    },
    sqadicfields: {
      type: Array,
      required: true
    }

  },
  data() {
    return {
      tableLoading: false,
      tableColumnList: [{ prop: 'id', propName: '编号' }],
      tableData: []

    }
  },
  watch: {
    node() {
      if (this.tab2 === 'sqa') {
        this.findSQAInfo()
      }
    },
    tab2(val) {
      if (val === 'sqa') {
        this.findSQAInfo()
      }
    }
  },
  created() {
    this.findSQAInfo()
  },

  methods: {
    findSqa(row) {
      console.log(row)
    },
    findSQAInfo() {
      this.tableLoading = true
      findSQAInfo(this.sqadicfields, this.node.id).then(response => {
        this.tableColumnList = response.data.tableColumnList
        this.tableData = response.data.tableData
        this.tableLoading = false
      }).catch(() => {
        this.tableLoading = false
      })
    }
  }
}
</script>
 <style >
:focus {
   outline: 0;
 }
</style>
