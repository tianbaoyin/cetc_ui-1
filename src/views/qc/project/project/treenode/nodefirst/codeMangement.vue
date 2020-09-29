<template>
  <div style="height:800px">
    <div class="filter-container">
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
    </div>
    <el-table
      v-loading="loading"
      :data="codeList"
      border
      height="600"
      highlight-current-row
      stripe
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

        prop="num"
        label="产品序号"
      />
      <el-table-column

        prop="name"
        label="产品名称"
      />
      <el-table-column

        prop="kingdom"
        label="领域"
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
            <el-tag slot="reference" type="text" @click="getUser(scope.row.header)"> {{ scope.row.header }}</el-tag>
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
        label="状态"
        width="80"
      >
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status" type="success">已签收</el-tag>
          <el-tag v-else type="danger">未签收</el-tag>

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
          {{ scope.row.createDate | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}
        </template>
      </el-table-column>
      <el-table-column
        v-if="checkPermission(['root','project_manager_project_code_distribution'])"
        label="操作"
        width="120"
        fixed="right"
      >
        <template slot-scope="scope">
          <el-button
            v-waves
            size="small"
            type="primary"
            icon="el-icon-share"
            @click="leaderDialog(scope.row)"
          >
            分配
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="pageEntity.pageNum" :limit.sync="pageEntity.pageSize" @pagination="getCodePage()" />
    <el-dialog
      v-dialogDrag
      title="令号节点操作权限分配"
      :visible.sync="dialogVisible"
      :before-close="handlerClose"
      width="1200px"
      :close-on-click-modal="false"
    >
      <el-form
        ref="codeForm"
        :model="code"
        :rules="codeRole"
      >
        <el-form-item
          label="总体负责人"
          prop="leader"
          label-width="120px"
        >
          <el-select
            v-model="code.leader"
            filterable
            placeholder="请选择总体负责人（可搜索）"
            style="width:900px"
          >
            <el-option
              v-for="item in userLst"
              :key="item.id"
              :label="item.fullname"
              :value="item.username"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="其它人员"
          label-width="120px"
        >
          <el-transfer
            v-model="visableList"
            style="text-align: left; display: inline-block"
            filterable
            filter-placeholder="请输入姓名"
            :titles="['待选人员', '已选人员']"
            :data="transferUserList"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="setLeader">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import waves from '@/directive/waves'
import pagination from '@/components/Pagination'
import { findPageCodeWithReady, setLeader, findVisableUser } from '@/api/project/code.js'
import { findUserListIsNotSys, getByUsername } from '@/api/user.js'
import permission from '@/directive/permission/index.js' // 权限判断指令
import checkPermission from '@/utils/permission'
import { handleCodeIsZy } from '@/api/project/code.js'
export default {
  name: 'CodeMangement',
  components: {
    pagination
  },
  directives: { waves, permission },

  props: {
    node: {
      type: Object,
      required: true
    },
    firstnodetabs: {
      type: String,
      required: true
    }
  },

  data() {
    return {
      userLoading: false,
      code: {
        id: '',
        leader: ''
      },
      visableList: [],
      activeName: 'first',
      dialogVisible: false,
      loading: false,
      codeList: [],
      user: {},
      userLst: [],
      transferUserList: [],
      total: 0,
      pageEntity: {
        pageNum: 1,
        pageSize: 10,
        parentId: '',
        value: ''
      },
      zytshi: '',
      codeRole: {
        leader: [{ required: true, message: '请选择总体负责人', trigger: 'change' }]
      }

    }
  },
  computed: {
    ...mapGetters([
      'username' // 登录名
    ])
  },
  watch: {
    node() {
      this.getCodePage()
    },
    firstnodetabs(val) {
      if (val === 'first') {
        this.getCodePage()
      }
    }
  },
  created() {
    this.getAllUser()
    this.getCodePage()
  },
  methods: {
    checkPermission,
    search() {
      this.pageEntity.pageNum = 1
      this.pageEntity.pageSize = 10
      this.getCodePage()
    },
    getCodePage() {
      this.loading = true
      if (this.node && this.node.id) {
        this.pageEntity.parentId = this.node.id
        findPageCodeWithReady(this.pageEntity).then(res => {
          this.loading = false
          this.total = res.data.total
          this.codeList = res.data.list
        }).catch(() => {
          this.$message.error('获取令号列表失败')
        })
      }
    },
    handlerClose(done) {
      this.getCodePage()
      done()
    },
    updateZy(row) {
      if (row.zy) {
        this.zytshi = '此操作将开启令号及该令号下所有项目, 是否继续?'
      } else {
        this.zytshi = '此操作将关闭令号及该令号下所有项目, 是否继续?'
      }
      this.$confirm(this.zytshi, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        handleCodeIsZy(row).then(response => {
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
    getAllUser() {
      findUserListIsNotSys().then(res => {
        this.userLst = res.data
        const transferUserList = []
        res.data.forEach(function(d, i) {
          transferUserList.push({
            label: d.fullname,
            key: d.username
          })
        })
        this.transferUserList = transferUserList
      }).catch(() => {
        this.$message.error('用户获取失败')
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
        this.$message.error('用户信息获取失败')
      })
    },
    leaderDialog(data) {
      if (this.$refs.codeForm) {
        this.$refs.codeForm.resetFields()
      }
      findVisableUser(data.id).then(res => {
        this.visableList = res.data
        this.dialogVisible = true
        this.code = data
      }).catch(() => {
        this.$message.error('查询可视人员失败')
      })
    },
    setLeader() {
      this.$refs.codeForm.validate((valid) => {
        if (valid) {
          const code = { 'id': this.code.id, 'leader': this.code.leader, 'visableList': this.visableList }
          setLeader(code).then(res => {
            this.dialogVisible = false
            this.$message.success('设置成功')
            this.getCodePage()
          }).catch(() => {
            this.$message.error('设置设置失败')
          })
        }
      })
    }
  }
}
</script>

