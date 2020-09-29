<template>
  <div style="height:800px; overflow:auto">
    <div class="filter-container">
      <el-button
        type="primary"
        size="small"
        icon="el-icon-search"
        class="filter-item"
        @click="handleAddMonthCommit()"
      >
        新增
      </el-button>
      <el-drawer
        title="我是标题"
        :visible.sync="drawer"
        :before-close="handleClose"
        size="70%"
        append-to-body
      >
        <span slot="title" style="color:#696969;font-size:20px"><svg-icon icon-class="leida" /> 项目月度报表</span>

        <addMonthCommit :node="node" :month-commit-form="monthCommitForm" />

      </el-drawer>

      <el-timeline v-loading="loading">
        <el-timeline-item
          v-for="(activity, index) in activities"
          :key="index"
          :icon="activity.icon"
          :type="activity.type"
          :color="activity.color"
          :size="activity.size"

          placement="top"
        >
          <el-card>
            <div slot="header" class="clearfix">
              <span>{{ activity.commitTimeStr }}月度报表</span>
              <el-button style="float: right; padding: 5px 5px ;margin-left:10px" type="danger" icon="el-icon-delete" circle @click="deleteById(activity.id)" />
              <el-button style="float: right; padding: 5px 5px ;margin-left:10px" type="primary" icon="el-icon-date" circle @click="handleEditMonthCommit(activity)" />
              <el-button style="float: right; padding: 5px 5px" type="primary" icon="el-icon-edit" circle @click="handleUpdate(activity.id)" />
            </div>
            <h4>{{ activity.commitMan }}提交于{{ activity.createTimeStr }}</h4>
            <p> {{ activity.remarks }}</p>
          </el-card>
        </el-timeline-item>
      </el-timeline>

    </div>

    <el-dialog v-dialogDrag title="项目月度报表" :before-close="beforeClose" :close-on-click-modal="false" :visible.sync="dialogFormVisible">
      <el-form ref="ruleForm" :rules="rules" :model="monthCommitForm">
        <el-row>
          <el-col :span="12">
            <el-form-item label="上报人" :label-width="formLabelWidth" prop="commitMan">
              <el-select v-model="monthCommitForm.commitMan" disabled filterable clearable style="width:100%" placeholder="请输入内容">
                <el-option
                  v-for="item in users"
                  :key="item.username"
                  :label="item.fullname"
                  :value="item.username"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="上报月份" :label-width="formLabelWidth" prop="commitTime">
              <el-date-picker
                v-model="monthCommitForm.commitTime"
                style="width:100%"
                type="month"
                placeholder="选择月"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="备注" :label-width="formLabelWidth" prop="remarks">
              <el-input
                v-model="monthCommitForm.remarks"
                maxlength="300"
                show-word-limit
                type="textarea"
                rows="4"
                style="width:100%"
                placeholder="请输入内容"
              />
            </el-form-item>
          </el-col>

        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="save()">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>

import store from '@/store'
import { findUserListIsNotSys } from '@/api/user.js'
import { add, findAll, deleteById, findById, update } from '@/api/project/projectMonthCommit.js'
import addMonthCommit from '@/views/qc/project/project/treenode/nodethird/monthCommit/components/addMonthCommit.vue'
export default {
  components: {
    addMonthCommit

  },
  props: {
    node: {
      type: Object,
      required: true
    },
    tab3: {
      type: String,
      requird: true,
      default: ''
    }

  },

  data() {
    return {
      activities: [],
      drawer: false,
      dialogFormVisible: false,
      formLabelWidth: '120px',
      users: [],
      monthCommitForm: {
        id: null,
        commitMan: '',
        commitTime: '',
        projectId: null,
        remarks: null

      },
      rules: {
        commitTime: [
          { required: true, message: '请选择上报时间', trigger: 'change' }
        ]
      },
      loading: false
    }
  },

  watch: {
    node(val) {
      this.findAll()
    },
    tab3(val) {
      this.findAll()
    }

  },

  created() {
    this.findAllUsers()
    this.findAll()
  },
  methods: {
    findAllUsers() {
      findUserListIsNotSys().then(response => {
        this.users = response.data
      }).catch(() => {

      })
    },
    findAll() {
      this.loading = true
      findAll(this.node.id).then(response => {
        this.activities = response.data
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },

    save() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.monthCommitForm.projectId = this.node.id
          if (this.monthCommitForm.id) {
            update(this.monthCommitForm).then(response => {
              this.dialogFormVisible = false
              this.$message.success('保存成功')
              this.findAll()
            }).catch(() => {

            })
          } else {
            add(this.monthCommitForm).then(response => {
              this.dialogFormVisible = false
              this.$message.success('保存成功')
              this.findAll()
            }).catch(() => {

            })
          }
        }
      })
    },
    deleteById(id) {
      deleteById(id).then(response => {
        this.$message.success('删除成功')
        this.findAll()
      }).catch(() => {
        this.findAll()
      })
    },

    handleAddMonthCommit() {
      this.monthCommitForm = {
        commitMan: store.getters.username,
        commitTime: '',
        projectId: null,
        remarks: ''

      }
      this.clearCache()
      this.dialogFormVisible = true
    },

    handleUpdate(id) {
      findById(id).then(response => {
        console.log(response.data)
        this.monthCommitForm = response.data
        this.dialogFormVisible = true
      }).catch(() => {

      })
    },

    beforeClose(done) {
      this.$confirm('确认关闭').then(_ => {
        this.clearCache()
        done()
      }).catch(_ => {
        this.$message.info('取消关闭')
      })
    },

    clearCache() {
      if (this.$refs['ruleForm']) {
        this.$refs['ruleForm'].resetFields()
      }
    },
    handleEditMonthCommit(activity) {
      this.drawer = true
      this.monthCommitForm = {
        id: activity.id,
        commitMan: '',
        commitTime: '',
        projectId: null,
        remarks: null,
        rjxq: activity.rjxq,
        csxq: activity.csxq,
        csyl: activity.csyl
      }
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
          this.findAll()
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
