<template>

  <div class="app-container">
    <div class="filter-container">
      <el-select
        v-model="queryEntity.flag"
        size="small"
        placeholder="是否异常"
        style="width: 120px"
        class="filter-item"
        clearable
      >
        <el-option label="是" :value="0" />
        <el-option label="否" :value="1" />
      </el-select>
      <el-input v-model="queryEntity.fullname" size="small" placeholder="操作用户" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />

      <el-input v-model="queryEntity.module" size="small" placeholder="日志标题" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="queryEntity.serviceClient" size="small" placeholder="服务端" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="queryEntity.remoteIp" size="small" placeholder="登录地址" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-date-picker
        v-model="queryEntity.startTime"
        type="datetime"
        placeholder="选择日期时间"
        class="filter-item"
        size="small"
      />

      <el-date-picker
        v-model="queryEntity.endTime"
        type="datetime"
        placeholder="选择日期时间"
        class="filter-item"
        size="small"
      />

      <el-button size="small" class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>

      <el-button size="small" class="filter-item" type="primary" icon="el-icon-search" @click="resetLog">
        重置
      </el-button>

    </div>

    <el-table
      v-loading="definitionLoading"
      :data="loglist"
      border
      style="width: 100%"
      highlight-current-row
      stripe
    >
      <el-table-column
        align="center"
        type="index"
        label="序号"
        width="80"
      />
      <el-table-column
        align="center"

        label="是否异常"
        width="100"
      >
        <template slot-scope="scope">
          <el-tag
            v-show="scope.row.flag"
            type="primary"
            disable-transitions
          >否</el-tag>
          <el-tag
            v-show="!scope.row.flag"
            type="danger"
            disable-transitions
          >是</el-tag>
        </template>

      </el-table-column>
      <el-table-column
        header-align="center"
        prop="module"
        label="日志标题"
        width="200"
      />
      <el-table-column
        align="center"
        prop="fullname"
        label="操作用户"
        width="150"
      />
      <el-table-column
        align="center"
        prop="username"
        label="用户名"
        width="150"
      />
      <el-table-column
        align="center"
        label="操作时间"
        width="180"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.createTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>

        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="serviceClient"
        label="服务端"
        width="120"
      />
      <el-table-column
        header-align="center"
        prop="address"
        label="访问路径"
      />

      <el-table-column
        align="center"
        prop="remoteIp"
        label="登录地址"
        width="140"
      />
      <el-table-column
        align="center"
        prop="execTime"
        label="响应时间"
        width="100"
      />

      <el-table-column
        align="center"
        label="操作"
        width="120"
        fixed="right"
      >
        <template slot-scope="{row}">
          <el-button type="success" size="small" @click="handleUpdate(row)"><svg-icon icon-class="eye-open" /> 查看</el-button>

        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="queryEntity.pageNum" :limit.sync="queryEntity.pageSize" @pagination="handleFilter()" />

    <el-dialog v-dialogDrag title="日志详情" :visible.sync="dialogFormVisible" style="height:1000px" :close-on-click-modal="false">
      <el-form ref="dataForm" :model="log">
        <el-row type="flex" justify="start">
          <el-col :span="10">
            <el-form-item label="是否异常" :label-width="formLabelWidth">

              <el-select v-model="log.flag" disabled>
                <el-option label="是" :value="false" />
                <el-option label="否" :value="true" />
              </el-select>

            </el-form-item>

          </el-col>

          <el-col :span="10">
            <el-form-item label="日志标题" :label-width="formLabelWidth">
              <el-input v-model="log.module" autocomplete="off" readonly />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" justify="start">
          <el-col :span="10">
            <el-form-item label="操作用户" :label-width="formLabelWidth">
              <el-input v-model="log.fullname" autocomplete="off" readonly />
            </el-form-item>

          </el-col>

          <el-col :span="10">
            <el-form-item label="用户名" :label-width="formLabelWidth">
              <el-input v-model="log.username" autocomplete="off" readonly />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row type="flex" justify="start">
          <el-col :span="10">
            <el-form-item label="服务端" :label-width="formLabelWidth">
              <el-input v-model="log.serviceClient" autocomplete="off" readonly />
            </el-form-item>

          </el-col>

          <el-col :span="10">
            <el-form-item label="访问路径" :label-width="formLabelWidth">
              <el-input v-model="log.address" autocomplete="off" readonly />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row type="flex" justify="start">
          <el-col :span="10">
            <el-form-item label="登录地址" :label-width="formLabelWidth">
              <el-input v-model="log.remoteIp" autocomplete="off" readonly />
            </el-form-item>

          </el-col>

          <el-col :span="10">
            <el-form-item label="响应时间" :label-width="formLabelWidth">
              <el-input v-model="log.execTime" autocomplete="off" readonly />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" justify="start">

          <el-col :span="10">
            <el-form-item label="操作时间" :label-width="formLabelWidth">
              <el-date-picker v-model="log.createTime" style="width:100%" type="datetime" format="yyyy-MM-dd HH:mm:ss" autocomplete="off" readonly />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row type="flex" justify="start">
          <el-col :span="20">
            <el-form-item label="浏览器信息" :label-width="formLabelWidth">
              <el-input v-model="log.params" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" autocomplete="off" readonly />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row type="flex" justify="start">
          <el-col :span="20">
            <el-form-item label="异常信息" :label-width="formLabelWidth">
              <el-input v-model="log.remark" autocomplete="off" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" readonly />
            </el-form-item>

          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogFormVisible = false">关闭</el-button>
      </div>
    </el-dialog>

  </div>

</template>

<script>
import pagination from '@/components/Pagination'
import { queryPageLogs, findPageLogs } from '@/api/log'
export default {
  name: 'Logtable',
  components: { pagination },

  data() {
    return {
      definitionLoading: true,
      total: 0,
      loglist: null,

      log: {
        flag: true,
        username: '',
        module: '',
        serviceClient: '',
        remoteIp: '',
        remark: '',
        address: '',
        method: '',
        execTime: '',
        params: '',
        createTime: ''

      },

      queryEntity: {
        flag: null,
        username: '',
        fullname: '',
        module: '',
        serviceClient: '',
        remoteIp: '',
        startTime: null,
        endTime: null,
        pageNum: 1,
        pageSize: 10
      },

      pageEntity: {
        pageNum: 1,
        pageSize: 10
      },
      dialogFormVisible: false,

      formLabelWidth: '120px'

    }
  },
  created() {
    this.handleFilter()
  },

  methods: {

    handleFilter() {
      this.definitionLoading = true
      queryPageLogs(this.queryEntity).then(response => {
        this.total = response.data.total
        this.loglist = response.data.list
        this.definitionLoading = false
      }).catch(() => {
        this.definitionLoading = false
      })
    },

    findPageLogs() {
      this.pageEntity.pageSize = this.queryEntity.pageSize
      this.pageEntity.pageNum = this.queryEntity.pageNum
      this.definitionLoading = true
      findPageLogs(this.pageEntity).then(response => {
        this.total = response.data.total
        this.loglist = response.data.list
        this.definitionLoading = false
      }).catch(() => {
        this.definitionLoading = false
      })
    },

    handleUpdate(row) {
      this.log = Object.assign({}, row) // copy obj

      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },

    resetLog() {
      this.queryEntity = {
        flag: null,
        username: '',
        module: '',
        serviceClient: '',
        remoteIp: '',
        startTime: null,
        endTime: null,
        pageNum: 1,
        pageSize: 10
      }
    }

  }
}
</script>
