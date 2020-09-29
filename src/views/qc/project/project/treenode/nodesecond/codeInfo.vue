<template>
  <div style="height:780px">
    <el-divider content-position="left"><h1 style="color:grey">{{ code.value }}</h1></el-divider>
    <div v-loading="loading" style="margin: 0 auto;width:900px">
      <el-row>
        <el-col :span="12">
          <el-form
            ref="codeForm"
            :model="code"
            class="demo-ruleForm"
            label-position="right"
            label-width="20%"
          >
            <el-form-item label="领域:">
              <span class="text">
                {{ code.kingdom }}
              </span>
            </el-form-item>
            <el-form-item label="产品名称:">
              <span class="text">
                {{ code.name }}
              </span>
            </el-form-item>

            <el-form-item label="Alm域:">
              <span class="text">
                {{ code.scope }}
              </span>
            </el-form-item>
            <el-form-item label="是否在研:">
              <el-switch
                v-model="code.zy"
                active-color="#13ce66"
                inactive-color="#ff4949"
                @change="updateZy()"
              />
            </el-form-item>
            <el-form-item label="创建时间:">
              <span class="text">
                {{ code.createDate | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}
              </span>
            </el-form-item>

            <el-form-item label="创建人:">
              <el-tag
                v-show="code.createBy"

                @click="showdetile( code.createBy)"
              >
                {{ code.createBy }}
              </el-tag>

            </el-form-item>

            <el-form-item label="组长:">
              <el-tag
                v-show="code.header"

                @click="showdetile( code.header)"
              >
                {{ code.header }}
              </el-tag>
            </el-form-item>
            <el-form-item label="总体负责人:">
              <el-tag
                v-show=" code.leader"

                @click="showdetile( code.leader)"
              >
                {{ code.leader }}
              </el-tag>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="12">
          <el-form
            ref="stakeholderForm"
            :model="stakeholder"
            label-position="right"
            label-width="20%"
          >
            <el-form-item label="软件负责人:">
              <el-input v-model="stakeholder.softMan" placeholder="请输入内容" style="width:300px;" />
            </el-form-item>
            <el-form-item label="电讯负责人:">
              <el-input v-model="stakeholder.signalMan" placeholder="请输入内容" style="width:300px;" />
            </el-form-item>
            <el-form-item label="质量师:">
              <el-input v-model="stakeholder.qualityer" placeholder="请输入内容" style="width:300px;" />
            </el-form-item>
            <el-form-item label="项目主管:">
              <el-input v-model="stakeholder.projectMan" placeholder="请输入内容" style="width:300px;" />
            </el-form-item>
            <el-form-item>
              <el-button v-permission="['root','project_manager_project_second_info_confirm']" type="primary" @click="submitForm">确认</el-button>
            </el-form-item>
          </el-form>

        </el-col>
      </el-row>
    </div>
    <el-dialog
      v-loading="userLoading"
      title="用户详情"
      :visible.sync="dialogVisible"
      width="420px"
      :close-on-click-modal="false"
    >
      <div style="margin-left:30px">
        <el-form>
          <el-form-item label="用户名" label-width="60px">
            <el-input v-model="user.username" disabled />
          </el-form-item>
          <el-form-item label="姓名" label-width="60px">
            <el-input v-model="user.fullname" disabled />
          </el-form-item>
          <el-form-item label="电话" label-width="60px">
            <el-input v-model="user.phone " disabled />
          </el-form-item>
          <el-form-item label="性别" label-width="60px">
            <el-tag v-if="user.sex" type="success">男</el-tag>
            <el-tag v-else type="danger">女</el-tag>
          </el-form-item>
        </el-form>
      </div>

    </el-dialog>

  </div>
</template>
<script>
import { getByUsername } from '@/api/user.js'
import permission from '@/directive/permission/index.js' // 权限判断指令
import { findCodeById, updateCode, handleCodeIsZy } from '@/api/project/code.js'
export default {
  name: 'CodeInfo',
  directives: { permission },
  props: {
    node: {
      type: Object,
      required: true
    },
    tab2: {
      type: String,
      requird: true,
      default: ''
    }
  },
  data() {
    return {
      dialogVisible: false,
      userLoading: true,
      user: {},
      loading: true,
      code: {},
      stakeholder: {
        softMan: '',
        signalMan: '',
        qualityer: '',
        projectMan: ''
      },
      zytshi: ''
    }
  },
  watch: {
    node() {
      this.getCode()
    },
    tab2(val) {
      if (val === 'fifth') {
        this.getCode()
      }
    }
  },
  created() {
    this.getCode()
  },
  methods: {
    getCode() {
      this.loading = true
      findCodeById(this.node.id).then(res => {
        this.code = res.data
        this.stakeholder.id = this.code.id
        this.stakeholder.softMan = this.code.softMan
        this.stakeholder.signalMan = this.code.signalMan
        this.stakeholder.qualityer = this.code.qualityer
        this.stakeholder.projectMan = this.code.projectMan
        this.loading = false
      }).catch(() => {
        this.loading = false
        console.error('令号信息获取失败')
      })
    },
    submitForm() {
      updateCode(this.stakeholder).then(res => {
        this.$message.success('提交成功')
      }).catch(() => {
        this.$message.success('提交失败')
      })
    },
    showdetile(val) {
      if (val != null) {
        getByUsername(val).then(res => {
          if (res.data) {
            this.dialogVisible = true
            this.user = res.data
          } else {
            this.$message.error('用户不存在')
          }
        }).catch(() => {
          this.$message.error('用户获取失败')
        })
      }
    },

    updateZy() {
      if (this.code.zy) {
        this.zytshi = '此操作将开启令号, 是否继续?'
      } else {
        this.zytshi = '此操作将关闭令号和该令号下所有项目, 是否继续?'
      }
      this.$confirm(this.zytshi, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        handleCodeIsZy(this.code).then(response => {
          this.$message({
            type: 'success',
            message: '操作成功!'
          })
        }).catch(() => {

        })
      }).catch(action => {
        this.code.zy = !this.code.zy
      })
    }

  }
}
</script>
<style scoped>
   .text{
     font-size: 16px;
     color: #4682B4;

   }
</style>
