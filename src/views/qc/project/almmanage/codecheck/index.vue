<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="pageEntity.title"
        style="width: 250px;"
        class="filter-item"
        size="small"
        placeholder="请输入令号(精确查找)"
        clearable
      />
      <el-button
        type="primary"
        size="small"
        icon="el-icon-search"
        class="filter-item"
        @click="handleFilter()"
      >
        搜索
      </el-button>

      <el-button
        type="primary"
        size="small"
        icon="el-icon-search"
        class="filter-item"
        @click="getHistory()"
      >
        历史签收
      </el-button>
    </div>
    <el-table
      v-loading="tableLoading"
      stripe
      border
      highlight-current-row
      :data="tableData"
      style="width: 100%"
    >
      <el-table-column
        type="index"
        label="序号"
        width="100"
      />
      <el-table-column
        prop="applyTitle"
        label="待签收令号"
      >
        <template slot-scope="scope">
          <el-tag @click="searchCode(scope.row)"> {{ scope.row.applyTitle }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="业务名称"
        width="180"
      >令号签收
      </el-table-column>
      <el-table-column
        prop="taskName"
        label="节点任务"
      />
      <el-table-column
        prop="owner"
        label="令号派发人"
      >
        <template slot-scope="scope">
          <el-popover
            placement="top-start"
            width="300"
            trigger="click"
          >
            <el-form
              v-loading="userLoading"
              label-width="80px"
            >
              <el-form-item label="用户名">
                {{ user.username }}
              </el-form-item>
              <el-form-item label="姓名">
                {{ user.fullname }}
              </el-form-item>
              <el-form-item label="性别">
                <span v-if="user.sex">男</span>
                <span v-else>女</span>
              </el-form-item>
              <el-form-item v-if="user.createTime" label="创建日期">
                {{ user.createTime | parseTime('{y}-{m}-{d}') }}
              </el-form-item>
            </el-form>
            <el-tag slot="reference" @click="getUser(scope.row.owner)"> {{ scope.row.owner }}</el-tag>
          </el-popover>
        </template>

      </el-table-column>
      <el-table-column
        label="流程发起时间"
      >
        <template slot-scope="scope">
          {{ scope.row.processStartTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}
        </template>
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="流程到达时间"
      >
        <template slot-scope="scope">
          {{ scope.row.createTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="320"
        fixed="right"
      >
        <template slot-scope="{row}">
          <el-button
            type="primary"
            size="small"
            icon="el-icon-edit"
            @click="searchCode(row)"
          >
            详情查看
          </el-button>

          <el-button
            type="primary"
            size="small"
            icon="el-icon-edit"
            @click="searchApply(row)"
          >
            签收
          </el-button>

        </template></el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="pageEntity.pageNum" :limit.sync="pageEntity.pageSize" @pagination="handleFilter()" />

    <el-dialog v-dialogDrag title="令号详情" :visible.sync="codeFormVisible" :close-on-click-modal="false">
      <el-form :model="code">
        <el-row :gutter="20">
          <el-col :span="12">    <el-form-item label="领域" :label-width="formLabelWidth">
            <el-input v-model="code.kingdom" disabled autocomplete="off" />
          </el-form-item></el-col>
          <el-col :span="12">
            <el-form-item label="令号" :label-width="formLabelWidth">
              <el-input v-model="code.value" disabled autocomplete="off" />
            </el-form-item></el-col>
        </el-row>

        <el-row :gutter="20">

          <el-col :span="12"><el-form-item label="产品名称" :label-width="formLabelWidth">
            <el-input v-model="code.name" disabled autocomplete="off" />
          </el-form-item></el-col>
          <el-col :span="12">   <el-form-item label="产品序号" :label-width="formLabelWidth">
            <el-input v-model="code.num" disabled autocomplete="off" />
          </el-form-item></el-col>
        </el-row>

        <el-row :gutter="20">

          <el-col :span="12"><el-form-item label="alm域" :label-width="formLabelWidth">
            <el-input v-model="code.scope" disabled autocomplete="off" />
          </el-form-item></el-col>
          <el-col :span="12">
            <el-form-item
              label="组长"
              :label-width="formLabelWidth"
            >
              <el-select v-model="code.header" el-select filterable placeholder="请选择" disabled style="width:100%">
                <el-option
                  v-for="item in userList"
                  :key="item.id"
                  :label="item.fullname"
                  :value="item.username"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="备注" :label-width="formLabelWidth">
          <el-input
            v-model="code.remarks"
            type="textarea"
            autocomplete="off"
            rows="4"
            maxlength="254"
            show-word-limit
            placeholder="无"
            disabled
          />
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="codeFormVisible=false">关闭</el-button>
      </div>
    </el-dialog>
    <el-dialog
      v-dialogDrag
      title="令号签收单"
      :visible.sync="checkDialogVisible"
      :close-on-click-modal="false"
    >
      <el-form :model="check">
        <el-form-item label="待签收令号" :label-width="formLabelWidth">
          <el-input v-model="check.scope" disabled placeholder="请输入内容" />

        </el-form-item>

        <el-form-item label="是否签收" :label-width="formLabelWidth">
          <el-switch
            v-model="check.flag"
            disabled
            active-color="#13ce66"
            inactive-color="#ff4949"
          />
        </el-form-item>
        <el-form-item label="签收备注" :label-width="formLabelWidth">
          <el-input
            v-model="check.comments"
            type="textarea"
            autocomplete="off"
            rows="4"
            maxlength="254"
            show-word-limit
            placeholder="您可以在此针对您的工作填写一些备注信息"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button v-preventReClick :loading="saveCheckButton" type="primary" @click="handleAgree()">确 定</el-button>
      </div>
    </el-dialog>
    <el-drawer
      size="70%"
      :visible.sync="drawer"
      :before-close="handleClose"
    >
      <span slot="title" style="color:#696969;font-size:20px"><svg-icon icon-class="leida" />    历史签收</span>
      <history />
    </el-drawer></div>
</template>

<script>
import { findTasksByAssign } from '@/api/activiti/myprocess'
import { getByUsername } from '@/api/user.js'
import { findCodeById } from '@/api/project/code'
import { findAllUser } from '@/api/user.js'
import { handleCheck } from '@/api/activiti/mycheck'
import history from '@/views/qc/project/almmanage/codecheck/components/history.vue'
import pagination from '@/components/Pagination'
export default {
  name: 'CodeCheck',
  components: {
    pagination,
    history
  },
  data() {
    return {
      pageEntity: {
        pageNum: 1,
        pageSize: 10,
        title: null
      },
      total: 0,
      processCodekey: 'cetc_code_apply',
      formLabelWidth: '86px',
      tableData: [],
      saveCheckButton: false,
      userLoading: false,
      user: {},
      userList: [],
      codeFormVisible: false,
      tableLoading: false,
      code: {
        kingdom: null,
        name: null,
        value: null,
        num: null,
        remarks: null,
        leader: null,
        header: null
      },
      checkDialogVisible: false,
      check: {
        id: null,
        flag: true,
        scope: null,
        bussinesskey: null,
        comments: null
      },
      drawer: false
    }
  },
  created() {
    this.handleFilter()
    this.getUserList()
  },
  methods: {
    handleFilter() {
      this.tableLoading = true
      findTasksByAssign(this.processCodekey, this.pageEntity).then(response => {
        this.total = response.data.total
        this.tableData = response.data.list
        this.tableLoading = false
      }).catch(() => {
        this.tableLoading = false
      })
    },
    getHistory() {
      this.drawer = true
    },
    getUserList() {
      findAllUser().then(res => {
        this.userList = res.data
      }).catch()
    },
    getUser(name) {
      this.userLoading = true
      getByUsername(name).then(res => {
        if (res.data) {
          this.user = res.data
        } else {
          this.$message.warning('该用户不存')
        }
        this.userLoading = false
      }).catch(() => {
        this.$message.error('用户获取失败')
        this.userLoading = false
      })
    },

    searchApply(row) {
      this.checkDialogVisible = true
      this.check.id = row.id
      this.check.scope = row.applyTitle
      this.check.flag = true
    },
    searchCode(row) {
      findCodeById(Number(row.buisnessKey)).then(response => {
        if (response.data != null) {
          console.log(response.data)
          this.code = response.data
          this.codeFormVisible = true
        } else {
          this.$message.warn('该令号信息已经删除')
        }
      }).catch(() => {

      })
    },
    handleAgree() {
      this.saveCheckButton = true
      handleCheck(this.check.id, this.check).then(response => {
        this.handleFilter()
        this.checkDialogVisible = false
        this.$message.success('提交成功')
      }).catch(() => {
        this.$message.error('提交失败')
        this.agreeClick = true
      })
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
