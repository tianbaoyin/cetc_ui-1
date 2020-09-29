<template>
  <div class="app-container">

    <div style="width:80%; ">
      <el-form
        ref="codeForm"
        :rules="rules"
        :model="code"
        width="500px"
        label-width="20%"
      >
        <el-form-item
          prop="value"
          label="令号"
        >
          <el-input v-model="code.value" placeholder="请填写令号" :disabled="isedit" @input="upcase" />
        </el-form-item>

        <el-form-item
          prop="name"
          label="产品名称"
        >
          <el-input v-model="code.name" placeholder="请填写产品名称" />
        </el-form-item>

        <el-form-item
          prop="parentId"
          label="领域"
        >
          <el-select v-model="code.parentId" el-select :disabled="isedit" filterable placeholder="请选择所属领域" style="width:100%">
            <el-option
              v-for="item in kingdomList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item
          label="产品序号"
        >
          <el-input v-model="code.num" disabled />
        </el-form-item>

        <el-form-item
          label="组长"
        >
          <el-select v-model="code.header" el-select filterable placeholder="请选择组长" style="width:100%">
            <el-option
              v-for="item in userList"
              :key="item.id"
              :label="item.fullname"
              :value="item.username"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="创建时间"
          prop="createDate"
        >
          <el-date-picker
            v-model="code.createDate"
            type="date"
            placeholder="选择日期"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            v-waves
            type="primary"
            :disabled="disableOption"
            @click="handlerSubmit"
          >
            保存
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import { getNum, addCode, updateCode, checkCode } from '@/api/project/code.js'
import { findAllKingdom } from '@/api/project/kingdom.js'
import { findUserListIsNotSys } from '@/api/user.js'
import waves from '@/directive/waves'
export default {
  name: 'CodeEdit',
  directives: { waves },
  props: {
    optiontype: {
      type: String,
      required: true,
      default: ''
    },
    query: {
      type: Object,
      require: true,
      default: Object
    },
    drawercount: {
      type: Number,
      required: true,
      default: 0
    }
  },
  data() {
    const checkCodeValue = (rule, value, callback) => {
      if (value) {
        if (value.trim().length <= 0) {
          callback(new Error('产品令号不能为空'))
        }
        checkCode({ value: value }).then(res => {
          if (this.code.id) { // 更新
            if (res.data) { // 存在
              if (this.oldValue === value) {
                callback()
              } else {
                callback(new Error('该产品令号已存在'))
              }
            } else { // 不存在
              callback()
            }
          } else { // 新增
            if (res.data) {
              callback(new Error('该产品令号已存在'))
            } else {
              callback()
            }
          }
        }).catch(() => {
          callback(new Error('产品令号校验失败'))
        })
      } else {
        callback(new Error('产品令号不能为空'))
      }
    }
    const checkName = (rule, value, callback) => {
      if (value) {
        if (value.trim().length <= 0) {
          callback(new Error('产品名称不能为空'))
        }
        callback()
      } else {
        callback(new Error('产品名称不能为空'))
      }
    }
    return {
      disableOption: true,
      isedit: true,
      oldValue: '',
      title: '令号',
      code: {
        kingdom: '',
        name: '',
        parentId: '',
        num: '',
        apply: false,
        value: '',
        header: '',
        scope: '',
        createDate: new Date()
      },
      userList: [],
      kingdomList: [],
      kingdomMap: new Map(),
      rules: {
        parentId: [{ required: true, message: '请选择领域', trigger: 'change' }],
        name: [
          { required: true, message: '请输入产品名称', trigger: 'blur' },
          { validator: checkName, trigger: 'blur' },
          { max: 20, message: '产品名称不能大于20个字符', trigger: 'blur' }

        ],
        value: [
          { required: true, validator: checkCodeValue, trigger: 'blur' },
          { max: 20, message: '产品令号不能大于20个字符', trigger: 'blur' }
        ],
        createDate: [
          { required: true, message: '请选择创建时间', trigger: 'change' }
        ]

      }

    }
  },

  computed: {
    splicingScope() {
      // 返回域（领域名称+产品令号）
      const scope = this.kingdomMap.get(this.code.parentId) ? this.kingdomMap.get(this.code.parentId) : ''
      const codeValue = this.code.value ? this.code.value : ''
      return scope + codeValue
    }
  },
  watch: {
    splicingScope(val) {
      this.code.scope = val
    },
    drawercount() {
      this.initpage()
    }

  },
  created() {
    this.getKingdom()
    this.getUserList()
    this.initpage()
  },
  methods: {
    initpage() {
      this.disableOption = false
      if (this.$refs.codeForm) {
        this.$refs.codeForm.resetFields()
      }
      // 初始化
      this.code = {
        kingdom: '',
        name: '',
        parentId: '',
        num: '',
        apply: null,
        value: '',
        header: '',
        scope: '',
        createDate: new Date()
      }
      if (this.optiontype === 'add') {
        this.title = '令号添加'
        this.isedit = false
        this.getNum()
      } else {
        this.isedit = false
        this.title = '令号编辑'
        this.code = this.query
        this.oldValue = this.code.value
        if (this.code.apply) {
          this.isedit = true
        } else {
          this.isedit = false
        }
      }
    },
    getNum() {
      getNum().then(res => {
        this.code.num = res.data
        this.disableOption = false
      }).catch(() => {

      })
    },
    upcase(val) {
      this.code.value = val.toUpperCase()
    },
    getKingdom() {
      const map = new Map()
      findAllKingdom().then(res => {
        this.kingdomList = res.data
        // 封装领域map
        res.data.forEach(function(d, i) {
          map.set(d.id, d.name)
        })
        this.kingdomMap = map
      }).catch(() => {

      })
    },
    getUserList() {
      findUserListIsNotSys().then(res => {
        this.userList = res.data
      }).catch()
    },
    toSave() {
      this.$confirm('是否确认提交?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.submitForm()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消提交'
        })
      })
    },
    handlerSubmit() {
      this.$refs.codeForm.validate((valid) => {
        if (valid) {
          this.toSave()
        }
      })
    },
    submitForm() {
      this.disableOption = true
      this.code.kingdom = this.kingdomMap.get(this.code.parentId)
      if (this.code.id) { // 更新
        updateCode(this.code).then(res => {
          this.$message.success('保存成功')
          this.$emit('closeDraw')
        }).catch(() => {
          this.disableOption = false
        })
      } else { // 新增
        addCode(this.code).then(res => {
          this.$message.success('保存成功')
          this.$emit('closeDraw')
        }).catch(() => {
          this.disableOption = false
          this.$message.error('提交失败')
        })
      }
    }
  }
}
</script>
