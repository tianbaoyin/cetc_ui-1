<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select
        v-model="pageEntity.parentId"
        filterable
        clearable
        class="filter-item"
        size="small"
        placeholder="请选择领域（精确查找）"
        style="width:200px"
      >
        <el-option
          v-for="item in kingdomList"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select>
      <el-input
        v-model="pageEntity.value"
        style="width: 200px;"
        class="filter-item"
        size="small"
        placeholder="请填写令号（精确查找）"
        clearable
      />
      <el-button
        type="primary"
        size="small"
        icon="el-icon-search"
        class="filter-item"
        @click="search()"
      >
        搜索
      </el-button>
      <el-button
        v-waves
        type="primary"
        size="small"
        icon="el-icon-plus"
        class="filter-item"
        @click="addCode()"
      >
        新增
      </el-button>
    </div>
    <el-table
      v-loading="loading"
      :data="codeList"
      stripe
      border
      highlight-current-row
    >
      <el-table-column
        type="index"
        label="序号"
        width="80"
      />
      <el-table-column
        prop="value"
        label="令号"
      />
      <el-table-column
        prop="name"
        label="产品名称"
        width="200"
      />
      <el-table-column
        prop="kingdom"
        label="领域"
      />
      <el-table-column
        prop="num"
        label="产品序号"
      />

      <el-table-column
        label="组长"
      >
        <template slot-scope="scope">
          <el-popover
            v-if="scope.row.header"
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
            <el-tag slot="reference" @click="getUser(scope.row.header)">{{ scope.row.header }}</el-tag>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column
        label="总体负责人"
      >
        <template slot-scope="scope">
          <el-popover
            v-if="scope.row.leader"
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
            <el-tag slot="reference" @click="getUser(scope.row.leader)"> {{ scope.row.leader }}</el-tag>
          </el-popover>
        </template>
      </el-table-column>

      <el-table-column
        label="是否派发"
      >
        <template slot-scope="scope">
          <el-tag v-if="scope.row.apply" v-waves type="success" @click="searchProcessImageUrl(scope.row)">已派发</el-tag>
          <el-tag v-else type="danger">未派发</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="是否签收"
        width="80"
      >
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status" type="success">已签收</el-tag>
          <el-tag v-else type="danger">未签收</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        width="180"
        label="创建时间"
      >
        <template slot-scope="scope">
          {{ scope.row.createDate | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}
        </template>
      </el-table-column>
      <el-table-column
        width="180"
        label="最近更新时间"
      >
        <template slot-scope="scope">
          {{ scope.row.updateDate | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="320"
        fixed="right"
      >
        <template slot-scope="scope">
          <el-button
            v-waves
            type="primary"
            size="small"
            icon="el-icon-edit"
            @click="updateCode(scope.row)"
          >
            编辑
          </el-button>
          <el-button
            v-waves
            icon="el-icon-phone"
            type="success"
            size="small"
            @click="handleCommitApply(scope.row)"
          >
            令号派发
          </el-button>
          <el-button
            v-waves
            icon="el-icon-delete"
            type="danger"
            size="small"
            @click="confirmDel(scope.row)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="pageEntity.pageNum" :limit.sync="pageEntity.pageSize" @pagination="pageList()" />
    <el-dialog v-dialogDrag title="令号派发单" :visible.sync="commitDialogVisible" width="1000px" :before-close="clearCacheUser" :close-on-click-modal="false">
      <el-form ref="checker" :model="commit" :rules="checkRules">
        <el-form-item label="签收人" :label-width="formLabelWidth" prop="checkedUsername">
          <el-select v-model="commit.checkedUsername" el-select placeholder="请选择签收人">
            <el-option
              v-for="item in groupCheckUsers"
              :key="item.username"
              :label="item.fullname"
              :value="item.username"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="待派发令号" :label-width="formLabelWidth" prop="scope">
          <el-input v-model="commit.scope" style="width:200px" disabled />
        </el-form-item>
        <el-form-item label="备注信息" :label-width="formLabelWidth" prop="remarks">
          <el-input
            v-model="commit.remarks"
            type="textarea"
            autocomplete="off"
            rows="4"
            maxlength="254"
            show-word-limit
            placeholder="您可以在此填写一些备注信息，这样有利于签收人了解他的工作内容。。。"
            style="width:80%"
          />
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button
          v-waves
          v-preventReClick
          type="primary"
          :loading="saveCheckButton"
          @click="commitApply()"
        >
          提交
        </el-button>
      </div>
    </el-dialog>
    <el-dialog
      v-dialogDrag
      title="派发进度查询"
      :visible.sync="imageDialogVisible"
      modal
      width="70%"
      :close-on-click-modal="false"
    >
      <el-form :model="currentProcess">
        <el-collapse v-model="activeName2" accordion>
          <el-collapse-item title="流程运行图" name="1">
            <el-form-item :label-width="formLabelWidth">
              <el-image :src="currentProcess.processImageUrl">
                <div slot="error" class="image-slot">
                  <i style="font-size:36px" class="el-icon-loading" />
                </div>
              </el-image>
            </el-form-item>
          </el-collapse-item>
          <el-collapse-item title="进度详情" name="2">
            <el-form-item :label-width="formLabelWidth">
              <el-timeline>
                <el-timeline-item
                  v-for="(execInfo, index) in execInfos"
                  :key="index"
                  :color="execInfo.color"
                  :timestamp="execInfo.startTime"
                >
                  {{ execInfo.assign }}{{ execInfo.eventName }}
                </el-timeline-item>
              </el-timeline>
            </el-form-item>
          </el-collapse-item>
        </el-collapse>
      </el-form>
    </el-dialog>
    <el-drawer
      size="60%"
      :visible.sync="drawer"
      :with-header="true"
      :before-close="drawerClose"
    >
      <span slot="title" style="color:#696969;font-size:20px"><svg-icon icon-class="leida" />    令号编辑</span>
      <el-divider />
      <div>
        <codeEdit :query="query" :optiontype="optionType" :drawercount="drawerCount" @closeDraw="closeDraw" />
      </div>
    </el-drawer>
  </div>
</template>
<script>
import codeEdit from '@/views/qc/project/code/edit/index.vue'
import permission from '@/directive/permission/index.js' // 权限判断指令
import { findPageCode, deleteCode, commitApply } from '@/api/project/code.js'
import { findProjectByCode } from '@/api/project/project.js'
import { findAllKingdom } from '@/api/project/kingdom.js'
import { findGroupUsers } from '@/api/activiti/processuser'
import { generateImageByBussinessKey, findExecByBussinessId } from '@/api/activiti/myprocess'
import { findUserByList } from '@/api/user'
import pagination from '@/components/Pagination'
import waves from '@/directive/waves'
import { getByUsername } from '@/api/user.js'
export default {
  name: 'CodeList',
  directives: { permission, waves },
  components: {
    pagination,
    codeEdit
  },
  data() {
    return {
      userLoading: false,
      saveCheckButton: false,
      drawerCount: 0,
      optionType: '',
      query: {},
      kingdomList: [],
      drawer: false,
      loading: true,
      codeList: [],
      total: 0,
      groupKey: 'activiti_code_checkers',
      commit: {
        checkedUsername: null,
        businesskey: null,
        scope: null,
        remarks: null
      },
      currentProcess: {
        currentChecker: '',
        processImageUrl: ''
      },
      imageDialogVisible: false,
      activeName2: '1',
      execInfos: [],
      commitDialogVisible: false,
      formLabelWidth: '120px',
      groupCheckUsers: [],
      processkey: 'cetc_code_apply',

      pageEntity: {
        pageNum: 1,
        pageSize: 10
      },
      checkRules: {
        checkedUsername: [{ required: true, trigger: 'change', message: '请选择任务执行人' }]
      },
      user: {}
    }
  },
  created() {
    this.pageList()
    this.getKingdom()
  },
  methods: {
    search() {
      this.pageEntity.pageNum = 1
      this.pageEntity.pageSize = 10
      this.pageList()
    },

    pageList() {
      this.loading = true
      findPageCode(this.pageEntity).then(res => {
        this.loading = false
        this.total = res.data.total
        this.codeList = res.data.list
      }).catch(() => {

      })
    },
    getKingdom() {
      findAllKingdom().then(res => {
        this.kingdomList = res.data
      }).catch(() => {
        this.$message.error()
      })
    },
    clearCacheUser(done) {
      done()
      this.$refs['checker'].resetFields()
    },
    addCode() {
      this.optionType = 'add'
      this.drawer = true
      this.drawerCount = this.drawerCount + 1
      this.query = { }
    },
    updateCode(data) {
      this.drawer = true
      this.optionType = 'update'
      this.drawerCount = this.drawerCount + 1
      this.query = data
    },
    drawerClose(done) {
      this.$confirm('确认关闭？').then(() => {
        this.pageList()
        done()
      }).catch(() => {
        this.$message.info('取消关闭')
      })
    },
    closeDraw() {
      this.drawer = false
      this.pageList()
    },
    confirmDel(data) {
      findProjectByCode(data.id).then(res => {
        if (res.data.length > 0) {
          this.$alert('请先删除该令号下的所有项目！！！', '提示', {
            confirmButtonText: '确定'
          })
        } else {
          this.$confirm('确认删除令号吗?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.delCode(data.id)
          }).catch(() => {
            this.$message.info('已取消删除')
          })
        }
      }).catch(() => {

      })
    },
    delCode(id) {
      deleteCode(id).then(res => {
        this.$message.success('删除成功')
        this.pageList()
      }).catch(() => {
        this.$message.error('删除失败')
      })
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

    handleCommitApply(row) {
      if (this.$refs['checker']) {
        this.$refs['checker'].resetFields()
      }
      if (!row.apply) {
        findGroupUsers(this.groupKey).then(response => {
          this.findUsernamesByList(response.data)
          this.commit.businesskey = row.id
          this.commit.scope = row.value
          this.commitDialogVisible = true
        }).catch(() => {
          this.$message.error('申请失败')
        })
      } else {
        this.$alert('这个令号已经派发，请不要重复派发', '提示', {
          confirmButtonText: '确定',
          callback: action => {

          }
        })
      }
    },
    commitApply() {
      this.saveCheckButton = true
      this.$refs.checker.validate((valid) => {
        if (valid) {
          commitApply(this.commit).then(response => {
            this.commit.checkedUsername = null
            this.commit.remarks = null
            this.commitDialogVisible = false
            this.saveCheckButton = false
            this.$message.success('提交申请成功')
            this.pageList()
          }).catch(() => {
            this.$message.error('提交申请失败')
            this.saveCheckButton = false
            this.pageList()
          })
        } else {
          this.saveCheckButton = false
        }
      })
    },
    findUsernamesByList(usernames) {
      findUserByList(usernames).then(response => {
        this.groupCheckUsers = response.data
      }).catch(() => {
        this.$message.error('查询审批用户失败')
      })
    },

    searchProcessImageUrl(row) {
      if (!row.compensate) {
        this.imageDialogVisible = true
        generateImageByBussinessKey(this.processkey, row.id).then(response => {
          this.activeName2 = '1'
          this.currentProcess.processImageUrl = response.data
          this.execInfos = []
          this.queryExecInfo(row)
        }).catch(() => {
          this.$message.error('查询流程进度失败')
        })
      } else {
        this.$alert('历史补偿数据无法追踪', '提示', {
          confirmButtonText: '确定',
          callback: action => {

          }
        })
      }
    },

    queryExecInfo(row) {
      findExecByBussinessId(this.processkey, row.id).then(response => {
        this.execInfos = response.data
      }).catch(() => {
        this.$message.error('查询流程进度失败')
      })
    }

  }
}
</script>

<style>
:focus {
   outline: 0;
 }
</style>
