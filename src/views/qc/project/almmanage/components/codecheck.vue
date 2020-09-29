<template>
  <div class="app-container">
    <div class="filter-container">

      <el-button class="filter-item" :type="isNew?'primary':'info'" size="small" icon="el-icon-s-management" @click="handleFilter()">待签收</el-button>
      <el-button class="filter-item" :type="isNew?'info':'primary'" size="small" icon="el-icon-s-cooperation" @click="findHistoryTasksByAssign()">历史签收</el-button>
    </div>

    <el-table
      v-loading="loading"
      :data="codeApplyList"
      border
      stripe
      style="width: 100%"
    >
      <el-table-column
        type="index"
        label="序号"
        width="100"
      />
      <el-table-column

        prop="applyTitle"
        label="alm域名"
        width="250"
      />
      <el-table-column

        prop="owner"
        label="发起人"
        width="150"
      />
      <el-table-column

        prop="taskName"
        label="当前节点"
      />
      <el-table-column

        label="流程发起时间"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.processStartTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column

        label="流程到达时间"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.createTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>

      <el-table-column
        v-if="endTimeColumnShow"

        label="完成审批时间"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.endTime">{{ scope.row.endTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column

        label="操作"
        fixed="right"
        width="300px"
      >
        <template slot-scope="{row}">
          <el-button type="primary" icon="el-icon-s-management" size="small" @click="searchCode(row)"> 任务详情</el-button>
          <el-button type="primary" icon="el-icon-c-scale-to-original" size="small" @click="searchApply(row)">回执单</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="pageEntity.pageNum" :limit.sync="pageEntity.pageSize" @pagination="handleFilter()" />
    <el-dialog
      v-dialogDrag
      title="回执单"
      :visible.sync="checkDialogVisible"
      :close-on-click-modal="false"
    >
      <el-form :model="check">
        <el-form-item label="alm域名" :label-width="formLabelWidth">
          <el-input v-model="check.scope" disabled placeholder="请输入内容">
            <template slot="append">

              <el-tooltip class="item" effect="dark" :content="check.scope" placement="top-start">
                <el-button @click="copyScope(check.scope,$event)">复制</el-button>
              </el-tooltip>

            </template>
          </el-input>

        </el-form-item>

        <el-form-item label="已完成" :label-width="formLabelWidth">
          <el-switch
            v-model="check.flag"
            disabled
            active-color="#13ce66"
            inactive-color="#ff4949"
          />
        </el-form-item>
        <el-form-item label="备注" :label-width="formLabelWidth">
          <el-input
            v-model="check.comments"
            type="textarea"
            autocomplete="off"
            rows="4"
            maxlength="254"
            show-word-limit
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" :disabled="isHistory" :loading="commitButtonLoading" @click="handleAgree()">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="令号详情" :visible.sync="codeFormVisible" :close-on-click-modal="false">
      <el-form :model="code">
        <el-form-item label="领域" :label-width="formLabelWidth">
          <el-input v-model="code.kingdom" disabled autocomplete="off" />
        </el-form-item>
        <el-form-item label="产品名称" :label-width="formLabelWidth">
          <el-input v-model="code.name" disabled autocomplete="off" />
        </el-form-item>
        <el-form-item label="令号" :label-width="formLabelWidth">
          <el-input v-model="code.value" disabled autocomplete="off" />
        </el-form-item>
        <el-form-item label="序号" :label-width="formLabelWidth">
          <el-input v-model="code.num" disabled autocomplete="off" />
        </el-form-item>
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
        <el-form-item label="备注" :label-width="formLabelWidth">
          <el-input v-model="code.remarks" type="textarea" rows="2" disabled autocomplete="off" />
        </el-form-item>

      </el-form>
    </el-dialog>

  </div>
</template>
<script>
import clipboard from '@/utils/clipboard'
import { findTasksByAssign } from '@/api/activiti/myprocess'
import { handleCheck, findHistoryTaskByAssign } from '@/api/activiti/mycheck'
import { findCodeById } from '@/api/project/code'
import { findAllUser } from '@/api/user.js'
import pagination from '@/components/Pagination'
export default {
  name: 'Codecheck',
  components: {
    pagination
  },
  data() {
    return {
      isNew: true,
      commitButtonLoading: false,
      processCodekey: 'cetc_code_apply',
      loading: false,
      taskName: '新建ALM域',
      formLabelWidth: '86px',
      endTimeColumnShow: false,
      userList: [],
      isHistory: false,
      total: 0,
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
      pageEntity: {
        pageNum: 1,
        pageSize: 10
      },
      codeFormVisible: false,
      check: {
        id: null,
        flag: true,
        scope: null,
        bussinesskey: null,
        comments: null
      },
      codeApplyList: []

    }
  },

  created() {
    this.handleFilter()
    this.getUserList()
  },
  methods: {
    copyScope(val, event) {
      clipboard(val, event)
    },
    handleFilter() {
      this.isNew = true
      this.endTimeColumnShow = false
      this.isHistory = false
      this.loading = true
      findTasksByAssign(this.processCodekey, this.pageEntity).then(response => {
        this.total = response.data.total
        this.codeApplyList = response.data.list
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },

    findHistoryTasksByAssign() {
      this.isNew = false
      this.endTimeColumnShow = true
      this.isHistory = true
      this.loading = true
      findHistoryTaskByAssign(this.processCodekey, this.taskName, this.pageEntity).then(response => {
        this.total = response.data.total
        this.codeApplyList = response.data.list
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },

    searchApply(row) {
      this.commitButtonLoading = false
      this.checkDialogVisible = true
      this.check.id = row.id
      this.check.scope = row.applyTitle
      this.check.flag = true
    },

    searchCode(row) {
      findCodeById(Number(row.buisnessKey)).then(response => {
        if (response.data != null) {
          this.code = response.data
          this.codeFormVisible = true
        } else {
          this.$message.error('该令号信息已经删除')
        }
      }).catch(() => {

      })
    },
    getUserList() {
      findAllUser().then(res => {
        this.userList = res.data
      }).catch()
    },
    handleAgree() {
      this.commitButtonLoading = true

      handleCheck(this.check.id, this.check).then(response => {
        this.handleFilter()
        this.commitButtonLoading = false
        this.checkDialogVisible = false
        this.$message.success('提交成功')
      }).catch(() => {
        this.commitButtonLoading = false
        this.$message.error('提交失败')
        this.agreeClick = true
      })
    }

  }
}
</script>
