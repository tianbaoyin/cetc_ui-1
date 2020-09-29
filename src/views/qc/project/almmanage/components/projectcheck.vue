<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button class="filter-item" :type="isNew?'primary':'info'" size="small" icon="el-icon-s-management" @click="handleFilter()">待审批</el-button>

      <el-button class="filter-item" :type="isNew?'info':'primary'" size="small" icon="el-icon-s-cooperation" @click="findHistoryTasksByAssign()">历史审批</el-button>
    </div>

    <el-table
      v-loading="loading"
      :data="codeApplyList"
      border
      stripe
      style="width: 100%"
    >
      <el-table-column
        align="center"
        type="index"
        label="序号"
        width="100"
      />
      <el-table-column
        header-align="center"
        prop="applyTitle"
        label="待建项目信息"
        width="400px"
      />
      <el-table-column
        align="center"
        prop="owner"
        label="发起人"
        width="150"
      />
      <el-table-column
        align="center"
        prop="taskName"
        label="当前节点"
      />
      <el-table-column
        align="center"
        label="流程发起时间"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.processStartTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="流程到达时间"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.createTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>

      <el-table-column
        v-if="endTimeColumnShow"
        align="center"
        label="完成审批时间"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.endTime">{{ scope.row.endTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="操作"
        fixed="right"
        width="300px"
      >
        <template slot-scope="{row}">
          <el-button icon="el-icon-s-management" type="primary" size="small" @click="searchProject(row)"> 项目详情</el-button>
          <el-button v-if="!isHistory" icon="el-icon-c-scale-to-original" type="primary" size="small" @click="searchApply(row)">项目审批</el-button>
          <el-button v-if="isHistory" icon="el-icon-film" type="primary" size="small" @click="searchHistoryApply(row)">审批记录</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="pageEntity.pageNum" :limit.sync="pageEntity.pageSize" @pagination="handleFilter()" />

    <el-dialog
      v-dialogDrag
      title="审批单"
      :visible.sync="checkDialogVisible"
      :close-on-click-modal="false"
    >
      <el-form :model="check">
        <el-form-item v-if="check.flag" prop="almDomain" label="alm域" :label-width="formLabelWidth">
          <el-select
            v-model="check.almDomain"
            el-select
            :disabled="isHistory"
            placeholder="请选择"
            style="width:100%"
            @change="findAlmProjects()"
          >
            <el-option
              v-for="item in almDomainList"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>

        <el-form-item
          v-if="check.flag"
          prop="almProject"
          label="alm项目"
          :label-width="formLabelWidth"
        >
          <el-select
            v-model="check.almProject"
            el-select
            :disabled="isHistory"
            placeholder="请选择"
            style="width:100%"
          >
            <el-option
              v-for="item in almProjectList"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="是否通过" :label-width="formLabelWidth">
          <el-switch
            v-model="check.flag"
            :disabled="isHistory"
            active-color="#13ce66"
            inactive-color="#ff4949"
          />
        </el-form-item>
        <el-form-item label="申请者说明" :label-width="formLabelWidth">
          <div style="border: 1px solid #E4E7ED;height:100px;border-radius: 4px;padding: 10px">
            {{ check.project }}
          </div>
        </el-form-item>

        <el-form-item label="审批者回复" :label-width="formLabelWidth">
          <el-input v-model="check.comments" :disabled="isHistory" type="textarea" autocomplete="off" rows="4" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" :disabled="isHistory" :loading="commitButtonLoading" @click="handleAgree()">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog v-dialogDrag title="项目详情" :visible.sync="projectFormVisible" :close-on-click-modal="false">
      <el-form :model="project">
        <el-form-item label="项目名称" :label-width="formLabelWidth">
          <el-input v-model="project.name" disabled autocomplete="off" />
        </el-form-item>
        <el-form-item label="所属令号" :label-width="formLabelWidth">
          <el-input v-model="project.code" disabled autocomplete="off" />
        </el-form-item>

        <el-form-item label="测试级别" :label-width="formLabelWidth">
          <el-input v-model="project.testGrade" disabled autocomplete="off" />
        </el-form-item>
        <el-form-item label="项目序号" :label-width="formLabelWidth">
          <el-input v-model="project.num" disabled autocomplete="off" />
        </el-form-item>
        <el-form-item
          label="负责人"
          :label-width="formLabelWidth"
        >
          <el-select v-model="project.testLeader" el-select filterable placeholder="请选择" disabled style="width:100%">
            <el-option
              v-for="item in userList"
              :key="item.id"
              :label="item.fullname"
              :value="item.username"
            />
          </el-select>
        </el-form-item>

      </el-form>
    </el-dialog>

  </div>
</template>
<script>

import { findTasksByAssign } from '@/api/activiti/myprocess'
import { handleCheck, findHistoryTaskByAssign, findHistoryTaskVariables } from '@/api/activiti/mycheck'
import { findProjectById } from '@/api/project/project'
import { findAlmDomains, findAlmProjects } from '@/api/hpalm/alm'
import { findAllUser } from '@/api/user.js'
import pagination from '@/components/Pagination'
export default {
  name: 'Projectcheck',
  components: {
    pagination
  },

  data() {
    return {
      isNew: true,
      projectName: '',
      processCodekey: 'cetc_project_apply',
      loading: false,
      taskName: '项目一级审批',
      formLabelWidth: '120px',
      endTimeColumnShow: false,
      userList: [],
      isHistory: false,
      commitButtonLoading: false,
      total: 0,
      project: {
        parentId: Number,
        name: '',
        code: '',
        testGrade: '',
        testType: [],
        leader: '',
        num: ''
      },
      checkDialogVisible: false,
      pageEntity: {
        pageNum: 1,
        pageSize: 10
      },

      projectFormVisible: false,
      check: {
        id: null,
        flag: true,
        project: null,
        almDomain: null,
        almProject: null,
        bussinesskey: null,
        comments: null

      },
      codeApplyList: [],
      almDomainList: [],
      almProjectList: []
    }
  },

  created() {
    this.handleFilter()
    this.getUserList()
  },
  methods: {

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
      if (this.$refs['checker']) {
        this.$refs['checker'].resetFields()
      }
      this.projectName = row.applyTitle
      this.commitButtonLoading = false
      this.check = {
        id: null,
        flag: true,
        project: null,
        almDomain: null,
        almProject: null,
        bussinesskey: null,
        comments: null
      }

      this.check.id = row.id
      this.check.project = row.applyTitle
      this.check.flag = true
      this.checkDialogVisible = true
      findAlmDomains().then(response => {
        if (response.flag) {
          this.almDomainList = response.data
        } else {
          this.$message.error('alm中的领域查询失败')
        }
      }).catch(() => {

      })
    },
    searchHistoryApply(row) {
      const title = row.applyTitle
      this.projectName = title.substring(title.lastIndexOf('alm项目') + 6)
      this.commitButtonLoading = false
      findHistoryTaskVariables(row.id).then(response => {
        response.data.forEach((data, index) => {
          if (data.name === 'project') {
            this.check.project = data.value
          }
          if (data.name === 'almDomain') {
            this.check.almDomain = data.value
          }
          if (data.name === 'almProject') {
            this.check.almProject = data.value
          }
          if (data.name === 'flag') {
            this.check.flag = data.value
          }
          if (data.name === 'comments') {
            this.check.comments = data.value
          }
        })
        this.checkDialogVisible = true
      }).catch(() => {

      })
    },
    findAlmProjects() {
      findAlmProjects(this.check.almDomain).then(response => {
        this.almProjectList = response.data
      }).catch(() => {
        this.$message.error('alm中的项目查询失败')
      })
    },

    searchProject(row) {
      findProjectById(Number(row.buisnessKey)).then(response => {
        if (response.data != null) {
          this.project = response.data
          this.projectFormVisible = true
        } else {
          this.$message.info('该项目信息已经被删除')
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
        this.checkDialogVisible = false
        this.$message.success('提交成功')
        this.commitButtonLoading = false
      }).catch(() => {
        this.$message.error('提交失败')
        this.agreeClick = true
        this.commitButtonLoading = false
      })
    }

  }
}
</script>
