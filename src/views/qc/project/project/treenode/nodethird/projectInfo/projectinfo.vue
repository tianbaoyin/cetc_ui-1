<template>
  <div>
    <el-form
      ref="form"
      :rules="rules"
      :model="project"
      label-width="180px"
    >
      <el-row>
        <el-col :span="12">
          <el-form-item label="项目名称">
            <el-input v-model="project.name" :disabled="true" />
          </el-form-item>
          <el-form-item label="所属领域">
            <el-input v-model="project.kingdom" :disabled="true" />
          </el-form-item>
          <el-form-item label="所属令号">
            <el-input v-model="project.code" :disabled="true" />
          </el-form-item>

          <el-form-item label="项目创建人">
            <el-select v-model="project.createBy" el-select disabled style="width:100%">
              <el-option
                v-for="item in userList"
                :key="item.id"
                :label="item.fullname"
                :value="item.username"
              />
            </el-select>

          </el-form-item>
          <el-form-item label="创建日期">
            <el-date-picker
              v-model="project.createDate"
              :disabled="true"
              type="datetime"
              style="width:100%"
              placeholder="选择日期时间"
            />
          </el-form-item>
          <el-form-item label="测试总体负责人">
            <el-select v-model="project.testLeader" disabled style="width:100%" placeholder="未指定">
              <el-option
                v-for="item in userList"
                :key="item.id"
                :label="item.fullname"
                :value="item.username"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="软件负责人">
            <el-input v-model="project.softer" /></el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="项目序号">
            <el-input v-model="project.num" :disabled="true" />
          </el-form-item>
          <el-form-item label="ALM域名称">
            <el-input v-model="project.almDomainName" />
          </el-form-item>
          <el-form-item label="ALM项目名称">
            <el-input v-model="project.almProjectName" />
          </el-form-item>
          <el-form-item label="测试级别">
            <el-input v-model="project.testGrade" :disabled="true" />
          </el-form-item>
          <el-form-item label="测试负责人">
            <el-select v-model="project.testLeader" disabled style="width:100%" placeholder="未指定">
              <el-option
                v-for="item in userList"
                :key="item.id"
                :label="item.fullname"
                :value="item.username"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            label="代码行数"
            prop="codeSize"
          >
            <el-input v-model="project.codeSize">
              <template slot="append">千行</template>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="参与人员">

        <el-select
          v-model="project.joins"
          multiple
          filterable
          allow-create
          default-first-option
          placeholder="请选择参与人员"
          style="width:100%"
        >
          <el-option
            v-for="item in userList"
            :key="item.id"
            :label="item.fullname"
            :value="item.username"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="updateProjectAndJoins">确认</el-button>
      </el-form-item>
    </el-form>
  </div>

</template>
<script>
import { findProjectById, updateProjectAndJoins } from '@/api/project/project.js'
import { findUserListIsNotSys } from '@/api/user.js'
import permission from '@/directive/permission/index.js' // 权限判断指令
export default {
  name: 'ProjectInfo',
  directives: { permission },
  props: {
    node: {
      type: Object,
      required: true
    }
  },
  data() {
    const valdateCodeSize = (rule, value, callback) => {
      if (Number(value)) {
        callback()
      } else {
        callback(new Error('请输入数字'))
      }
    }
    return {
      project: {},
      userList: [],
      rules: {
        codeSize: [{ validator: valdateCodeSize, trigger: 'blur' }]
      }

    }
  },
  watch: {
    node() {
      this.findProjectById()
    }
  },
  created() {
    findUserListIsNotSys().then(res => {
      this.userList = res.data
    }).catch(() => {
      this.$message.error('查询人员失败')
    })
    this.findProjectById()
  },
  methods: {
    findProjectById() {
      findProjectById(this.node.id).then(res => {
        this.project = res.data
      }).catch(() => {
        this.$message.error('项目信息获取失败')
      })
    },
    updateProjectAndJoins() {
      this.$refs.form.validate((validate) => {
        if (validate) {
          console.log('校验通过')
          updateProjectAndJoins(this.project).then(res => {
            this.$message.success('保存成功')
          }).catch(() => {
            this.$message.error('保存失败')
          })
        }
      })
    }
  }

}
</script>
