<template>
  <div style="height:800px">
    <div class="filter-container">
      <el-select
        v-model="pageEntity.testGrade"
        clearable
        el-select
        placeholder="请选择测试级别（精确查找）"
        style="width:210px"
        class="filter-item"
        size="small"
      >
        <el-option
          v-for="item in testGradeList"
          :key="item.id"
          :label="item.key"
          :value="item.value"
        />
      </el-select>
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
        新增
      </el-button>
    </div>
    <el-drawer
      size="50%"
      :visible.sync="drawer"
      :with-header="true"
      :before-close="drawerClose"
    >
      <span slot="title" style="color:#696969;font-size:20px"><svg-icon icon-class="leida" />    项目编辑</span>
      <el-divider content-position="left" />
      <div>
        <projectEdit :query="project" :drawercount="drawerCount" @closeDraw="closeDraw" />
      </div>
    </el-drawer>
    <el-table
      v-loading="loading"
      :data="projectList"
      border
      stripe
      max-height="600"
    >
      <el-table-column
        type="index"
        label="序号"
        width="80"
      />
      <el-table-column
        prop="name"
        label="项目名称"
        width="160"
      />
      <el-table-column
        label="所属令号"
        width="130"
      >
        <template slot-scope="scope">
          <el-tag @click="searchCode(scope.row)"> {{ scope.row.code }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="测试负责人"
        width="100"
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
            <el-tag slot="reference" @click="getUser(scope.row.testLeader)"> {{ scope.row.testLeader }}</el-tag>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column

        width="90"
        prop="testGrade"
        label="测试级别"
      />
      <el-table-column
        label="是否申请"
      >
        <template slot-scope="scope">
          <el-tag v-if="scope.row.apply" type="success" @click="searchProcessImageUrl(scope.row)">已申请</el-tag>
          <el-tag v-else type="danger">未申请</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        width="80px"
        label="状态"
      >
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status" type="success">已审批</el-tag>
          <el-tag v-else type="danger">未审批</el-tag>
        </template>
      </el-table-column>

      <el-table-column
        label="是否在研"
        width="80"
      >
        <template slot-scope="{row}">
          <el-switch
            v-model="row.zy"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="updateZy(row)"
          />
        </template>
      </el-table-column>

      <el-table-column
        width="160"
        label="更新时间"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.updateDate">
            {{ scope.row.updateDate | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}
          </span>
        </template>
      </el-table-column>
      <el-table-column

        label="操作"
        width="220"
        fixed="right"
      >
        <template slot-scope="scope">
          <el-tooltip content=" 编辑" placement="top">
            <el-button

              size="small"
              type="primary"
              icon="el-icon-edit"
              circle
              @click="update(scope.row)"
            />
          </el-tooltip>
          <el-tooltip content="申请" placement="top">
            <el-button

              size="small"
              type="success"
              icon="el-icon-phone"
              circle
              @click="handleCommitApply(scope.row)"
            />
          </el-tooltip>
          <el-tooltip content="删除" placement="top">
            <el-button

              size="small"
              type="danger"
              icon="el-icon-delete"
              circle
              @click="toDelProject(scope.row)"
            />
          </el-tooltip>
          <el-tooltip content="项目节点操作权限分配" placement="top">
            <el-button

              size="small"
              type="info"
              icon="el-icon-share"
              circle
              @click="openDialogVisual(scope.row)"
            />
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="pageEntity.pageNum" :limit.sync="pageEntity.pageSize" @pagination="pageList()" />
    <el-dialog
      v-dialogDrag
      title="申请单"
      :visible.sync="commitDialogVisible"
      width="1000px"
      :close-on-click-modal="false"
    >
      <el-form ref="checker" :model="commit" :rules="checkRules">
        <el-form-item
          label="项目审批人"
          :label-width="formLabelWidth"
          prop="checkedUsername"
        >
          <el-select
            v-model="commit.checkedUsername"
            el-select
            placeholder="项目审批人员"
          >
            <el-option
              v-for="item in groupCheckUsers"
              :key="item.username"
              :label="item.fullname"
              :value="item.username"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="备注"
          :label-width="formLabelWidth"
        >
          <el-input
            v-model="commit.notes"
            type="textarea"
            autocomplete="off"
            rows="4"
            maxlength="254"
            show-word-limit
            placeholder="您可以在此填写申请项目的一些备注信息，这样有利于审批人员了解您的项目内容。。。"
            style="width:80%"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button v-preventReClick type="primary" :loading="saveApplyButton" @click="commitApply()">提交</el-button>
      </div>
    </el-dialog>
    <el-dialog
      v-dialogDrag
      title="当前流程"
      :visible.sync="imageDialogVisible"
      modal
      width="70%"
      :close-on-click-modal="false"
    >
      <el-form :model="currentProcess">
        <el-collapse v-model="activeName2" accordion>
          <el-collapse-item title="流程运行图" name="1">
            <el-form-item label="" :label-width="formLabelWidth">
              <img :src="currentProcess.processImageUrl">
            </el-form-item>
          </el-collapse-item>
          <el-collapse-item title="进度详情" name="2">
            <el-form-item label="" :label-width="formLabelWidth">
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
    <el-dialog
      v-dialogDrag
      title="项目节点操作权限分配"
      :visible.sync="dialogVisual"
      width="1200px"
      :close-on-click-modal="false"
    >
      <div style="text-align: center">
        <el-transfer
          v-model="visableList"
          v-loading="transferLoading"
          style="text-align: left; display: inline-block"
          filterable
          filter-placeholder="请输入姓名"
          :titles="['待选人员', '已选人员']"
          :data="transferUserList"
        />
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button v-preventReClick type="primary" @click="setVisual">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog v-dialogDrag title="令号详情" append-to-body :visible.sync="codeFormVisible" :close-on-click-modal="false">
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
  </div>
</template>
<script>
import { queryDicValuesByDicType } from '@/api/dicValue.js'
import pagination from '@/components/Pagination'
import { pageByParent, delProject, commitApply, setProjectVisual, findProjectVisual, handleProjectIsZy } from '@/api/project/project.js'
import { generateImageByBussinessKey, findExecByBussinessId } from '@/api/activiti/myprocess'
import { findGroupUsers } from '@/api/activiti/processuser'
import { findUserByList, findUserListIsNotSys, findAllUser } from '@/api/user'
import { getByUsername } from '@/api/user.js'
import projectEdit from '@/views/qc/project/project/treenode/nodesecond/projectedit/index.vue'
import permission from '@/directive/permission/index.js' // 权限判断指令
import { findCodeById } from '@/api/project/code'
export default {
  name: 'ProjectManagement',
  directives: { permission },
  components: {
    pagination,
    projectEdit
  },
  props: {
    node: {
      type: Object,
      required: true
    },
    tab2: {
      type: String,
      required: true,
      default: ''
    }

  },
  data() {
    return {
      userLoading: false,
      saveApplyButton: false,
      testGradeList: [],
      dialogVisual: false,
      visableList: [],
      transferUserList: [],
      transferLoading: false,
      project: {},
      drawer: false,
      drawerCount: 0,
      commitDialogVisible: false,
      groupKey: 'activiti_project_checkers',
      commit: {
        checkedUsername: null,
        businesskey: null,
        notes: ''
      },
      currentProcess: {
        currentChecker: '',
        processImageUrl: ''
      },
      code: {
        kingdom: null,
        name: null,
        value: null,
        num: null,
        remarks: null,
        leader: null,
        header: null
      },
      codeFormVisible: false,
      loading: false,
      projectList: [],
      total: 0,
      imageDialogVisible: false,
      activeName2: '1',
      execInfos: [],
      formLabelWidth: '120px',
      processkey: 'cetc_project_apply',
      groupCheckUsers: [],
      user: {},
      userList: [],
      pageEntity: {
        pageNum: 1,
        pageSize: 10,
        parentId: ''
      },
      checkRules: {
        checkedUsername: [{ required: true, trigger: 'change', message: '请选择项目审批人' }]
      }

    }
  },

  watch: {
    // node节点点击时就更新
    node() {
      this.pageList()
    },
    tab2(val) {
      if (val === 'codeProjectManager') {
        this.pageList()
      }
    }
  },
  created() {
    this.pageList()
    this.getUserList()
    findUserListIsNotSys().then(res => {
      const transferUserList = []
      res.data.forEach(function(d, i) {
        transferUserList.push({
          label: d.fullname,
          key: d.username
        })
      })
      this.transferUserList = transferUserList
    }).catch(() => {
      this.$message.error('查询用户失败')
    })
    // 查询测试级别
    queryDicValuesByDicType('testGrade').then(res => {
      this.testGradeList = res.data
    }).catch(() => {
      console.warn('测试级别查询失败')
    })
  },
  methods: {
    getUserList() {
      findAllUser().then(res => {
        this.userList = res.data
      }).catch()
    },
    setVisual() {
      const map = { 'project': this.project, 'visual': this.visableList }
      setProjectVisual(map).then(res => {
        this.$message.success('设置成功')
        this.dialogVisual = false
      }).catch(() => {
        this.$message.error('设置失败')
      })
    },
    openDialogVisual(data) {
      this.dialogVisual = true
      this.transferLoading = true
      this.project = data
      findProjectVisual(data.id).then(res => {
        this.visableList = res.data
        this.transferLoading = false
      }).catch(() => {
        this.$message.error('查询可视人员失败')
      })
    },
    closeDraw() {
      this.drawer = false
      this.pageList()
    },
    add() {
      this.drawerCount = this.drawerCount + 1
      this.drawer = true
      this.project = {}
      this.project.parentId = this.node.id
      this.project.code = this.node.label
    },
    update(data) {
      this.drawerCount = this.drawerCount + 1
      this.drawer = true
      this.project = data
    },
    searchCode(row) {
      findCodeById(row.parentId).then(response => {
        if (response.data != null) {
          this.code = response.data
          this.codeFormVisible = true
        } else {
          this.$message.error('该令号信息已经删除')
        }
      }).catch(() => {

      })
    },
    updateZy(row) {
      if (row.zy) {
        this.zytshi = '此操作将开启该项目, 是否继续?'
      } else {
        this.zytshi = '此操作将关闭此项目, 是否继续?'
      }
      this.$confirm(this.zytshi, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        handleProjectIsZy(row).then(response => {
          this.$message({
            type: 'success',
            message: '操作成功!'
          })
        }).catch(() => {

        })
      }).catch(() => {
        row.zy = !row.zy
      })
    },
    pageList() {
      this.loading = true
      this.pageEntity.parentId = this.node.id
      pageByParent(this.pageEntity).then(res => {
        this.loading = false
        this.total = res.data.total
        this.projectList = res.data.list
      }).catch(() => {
        this.$message.error('查询失败')
      })
    },
    drawerClose(done) {
      this.$confirm('确认关闭？').then(() => {
        this.pageList()
        done()
      }).catch(() => {
        this.$message.info('取消关闭')
      })
    },
    closeDraw2(done) {
      this.pageList()
      done()
    },

    toDelProject(data) {
      this.$confirm('删除项目后将会删除项目下所有内容，确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.delProject(data.id)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    delProject(id) {
      delProject(id).then(res => {
        this.$message.success('删除成功')
        this.pageList()
      }).catch(() => {
        this.$mesage.error('删除失败')
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
        this.userLoading = false
        this.$message.error('获取用户失败')
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
          this.commit.checkedUsername = null
          this.commit.notes = ''
          this.commitDialogVisible = true
        }).catch(() => {
          console.error('查询审批人失败')
        })
      } else {
        this.$alert('这个项目已经提交申请，请不要重复提交', '提示', {
          confirmButtonText: '确定',
          callback: action => {

          }
        })
      }
    },
    findUsernamesByList(usernames) {
      findUserByList(usernames).then(response => {
        this.groupCheckUsers = response.data
      }).catch(() => {
        this.$message.error('查询审批用户失败')
      })
    },
    commitApply() {
      this.saveApplyButton = true
      this.$refs.checker.validate((valid) => {
        if (valid) {
          commitApply(this.commit).then(response => {
            this.commitDialogVisible = false
            this.saveApplyButton = false
            this.$message.success('提交申请成功')
            this.pageList()
          }).catch(() => {
            this.$message.error('提交申请失败')
            this.saveApplyButton = false
            this.pageList()
          })
        } else {
          this.saveApplyButton = false
          return false
        }
      })
    },
    searchProcessImageUrl(row) {
      if (!row.compensate) {
        generateImageByBussinessKey(this.processkey, row.id).then(response => {
          this.activeName2 = '1'
          this.currentProcess.processImageUrl = response.data
          this.execInfos = []
          this.queryExecInfo(row)
          this.imageDialogVisible = true
        }).catch(() => {
          this.$message.error('查询流程进度失败')
        })
      } else {
        this.$alert('历史补偿数据，不可追踪', '提示', {
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
<style >
    .el-transfer-panel{
        width: 350px;
    }
    :focus {
   outline: 0;
 }
</style>
