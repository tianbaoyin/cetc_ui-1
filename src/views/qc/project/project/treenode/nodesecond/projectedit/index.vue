<template>
  <div>

    <div style="width:80%; ">
      <el-form
        ref="projectForm"
        :model="project"
        :rules="rules"
        width="500px"
        label-width="20%"
      >
        <el-form-item
          prop="name"
          label="项目名称"
        >
          <el-input v-model="project.name" />
        </el-form-item>
        <el-form-item
          label="所属令号"
        >
          <el-input v-model="project.code" disabled />
        </el-form-item>
        <el-form-item
          prop="testGrade"
          label="测试级别"
        >
          <el-select
            v-model="project.testGrade"
            placeholder="请选择"
            style="width:100%"
            @change="setNum"
          >
            <el-option
              v-for="item in testGradeList"
              :key="item.id"
              :label="item.key"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          prop="testType"
          label="测试类型"
        >
          <el-checkbox-group v-model="selected ">
            <el-checkbox v-for="testType in testTypeList" :key="testType.id" :label="testType.id">{{ testType.key }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item
          label="测试负责人"
        >
          <el-select v-model="project.testLeader" filterable placeholder="请选择" style="width:100%">
            <el-option
              v-for="item in userList"
              :key="item.id"
              :label="item.fullname"
              :value="item.username"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="项目序号"
        >
          <el-input v-model="project.num" disabled />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="btnLoading" @click="save">保存</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import { findUserListIsNotSys } from '@/api/user.js'
import { queryDicValuesByDicType } from '@/api/dicValue.js'
import { addProject, updateProject, getTestType, getProjectNum, hasProject } from '@/api/project/project.js'
export default {
  name: 'ProjectEdit',
  props: {
    query: {
      type: Object,
      required: true
    },
    drawercount: {
      type: Number,
      required: true,
      default: 0
    }
  },
  data() {
    const selectedTestType = (rule, value, callback) => {
      if (this.project.testType.length <= 0) {
        callback(new Error('请选择测试类型'))
      } else {
        callback()
      }
    }
    const checkName = (rule, value, callback) => {
      if (value) {
        if (value.trim().length <= 0) {
          callback(new Error('项目名称不能为空'))
        } else {
          hasProject({ name: value, parentId: this.query.parentId }).then(res => {
            if (this.project.id) { // 更新
              if (res.data) { // 存在
                if (this.oldName === value) {
                  callback()
                } else {
                  callback(new Error('该令号已存在该项目名称'))
                }
              } else { // 不存在
                callback()
              }
            } else { // 新增
              if (res.data) {
                callback(new Error('该令号已存在该项目名称'))
              } else {
                callback()
              }
            }
          }).catch(() => {
            callback(new Error('项目名称校验失败'))
          })
        }
      } else {
        callback(new Error('项目名称不能为空'))
      }
    }
    return {
      title: '添加',
      btnLoading: false,
      code: {},
      oldName: '',
      project: {
        parentId: Number,
        name: '',
        code: '',
        apply: false,
        testGrade: '',
        testType: [],
        testLeader: '',
        num: ''
      },
      userList: [],
      testGradeList: [],
      preNum: '',
      selected: [],
      rules: {
        name: [
          { required: true, validator: checkName, trigger: 'blur' },
          { max: 20, message: '产品令号不能大于20个字符', trigger: 'blur' }
        ],
        testGrade: [{ required: true, message: '请选择测试级别', trigger: 'blur' }],
        testType: [{ validator: selectedTestType, message: '请选择测试类型', trigger: 'change' }]
      },
      testTypeList: [],
      testGradeMap: new Map([
        ['单元测试', '301'],
        ['集成测试', '201'],
        ['系统测试', '001'],
        ['配置项测试', '101'],
        ['补充测试', '401']
      ])

    }
  },
  watch: {
    selected(val) {
      this.project.testType = val
    },
    drawercount() {
      this.initPage()
    }
  },

  created() {
    // 查询用户
    findUserListIsNotSys().then(res => {
      this.userList = res.data
    }).catch(() => {
      console.warn('用户查询失败')
    })
    // 查询测试级别
    queryDicValuesByDicType('testGrade').then(res => {
      this.testGradeList = res.data
    }).catch(() => {
      console.warn('测试级别查询失败')
    })
    // 查询类型
    queryDicValuesByDicType('testType').then(res => {
      this.testTypeList = res.data
    }).catch(() => {
      console.warn('测试类型查询失败')
    })
    // 初始化参数
    this.initPage()
  },
  methods: {
    initPage() {
      this.clearCache()
      this.selected = []
      this.btnLoading = false

      // 如果不是新增，则查询状态
      if (this.query && this.query.id) {
        this.project = this.query
        this.title = '编辑'
        this.oldName = this.project.name
        getTestType(this.project.id).then(res => {
          this.selected = res.data
        }).catch(() => {
          this.$message.error('查询测试类型失败！')
        })
      } else {
        this.project = {
          parentId: Number,
          name: '',
          code: '',
          apply: false,
          testGrade: '',
          testType: [],
          testLeader: '',
          num: ''
        }
        this.project.code = this.query.code
        this.project.parentId = this.query.parentId
      }
    },
    clearCache() {
      if (this.$refs['projectForm']) {
        this.$refs['projectForm'].resetFields()
      }
    },
    setNum(data) {
      const num = this.testGradeMap.get(data)
      this.setProjectNum(num)
    },
    save() {
      this.$refs.projectForm.validate((valid) => {
        if (valid) {
          this.$confirm('是否确认提交?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.submitForm(this.project)
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消提交'
            })
          })
        }
      })
    },
    submitForm(data) {
      this.btnLoading = true
      if (data.id) {
        updateProject(data).then(res => {
          this.btnLoading = false
          this.$message.success('保存成功')
          this.$refs.projectForm.resetFields()
          this.selected = []
          this.$emit('closeDraw')
        }).catch(() => {
          this.$message.error('保存失败')
        })
      } else {
        addProject(data).then(res => {
          this.btnLoading = false
          this.$message.success('保存成功')
          this.$refs.projectForm.resetFields()
          this.selected = []
          this.$emit('closeDraw')
        }).catch(() => {
          this.$message.error('保存失败')
        })
      }
    },
    setProjectNum(num) {
      getProjectNum(this.project.parentId).then(res => {
        this.project.num = res.data + num
      }).catch(() => {

      })
    }
  }
}
</script>
