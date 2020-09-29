<template>
  <div v-if="showCard" class="app-container">
    <el-divider content-position="left">
      <svg-icon icon-class="supervise" />
      <span style="color:#336633;font-size:20px">{{ title }}</span>
    </el-divider>
    <div>
      <el-form
        ref="sqaForm"
        :rules="rules"
        :model="sqa"
        size="small"
        label-width="30%"
      >
        <el-row type="flex" :gutter="40" justify="start">
          <el-col :span="8"><el-form-item label="总清单序号:" prop="totalNum">
            <el-input v-model="sqa.totalNum" disabled style="width:200px;" /></el-form-item></el-col>
          <el-col :span="8"><el-form-item label="项目领域:" prop="scope">
            <el-input v-model="sqa.scope" disabled style="width:200px;" /></el-form-item></el-col>
          <el-col :span="8"><el-form-item label="产品代号:" prop="code">
            <el-input v-model="sqa.code" disabled style="width:200px;" /></el-form-item></el-col>
        </el-row>
        <el-row type="flex" :gutter="40" justify="start">
          <el-col :span="8"><el-form-item label="被审查物名称:" prop="checkObject">
            <el-input v-model="sqa.checkObject" style="width:200px;" /></el-form-item></el-col>
          <el-col :span="8"><el-form-item label="被考核单位:" prop="checkGroup">
            <el-select v-model="sqa.checkGroup" el-select style="width:200px;" placeholder="请选择">
              <el-option
                v-for="dept in deptList"
                :key="dept.id"
                :label="dept.key"
                :value="dept.value"
              />
            </el-select>
          </el-form-item></el-col>
          <el-col :span="8"><el-form-item label="类别:" prop="classification">
            <el-input v-model="sqa.classification" style="width:200px;" /></el-form-item></el-col>
        </el-row>
        <el-row type="flex" :gutter="40" justify="start">
          <el-col :span="8"><el-form-item label="分管首席:" prop="seat">
            <el-input v-model="sqa.seat" style="width:200px;" /></el-form-item></el-col>
          <el-col :span="8"><el-form-item label="部分分管人:" prop="departmentLeader">
            <el-input v-model="sqa.departmentLeader" style="width:200px;" /></el-form-item></el-col>
          <el-col :span="8"><el-form-item label="分管部领导:" prop="leader">
            <el-input v-model="sqa.leader" style="width:200px;" /></el-form-item></el-col>
        </el-row>
        <el-row type="flex" :gutter="40" justify="start">
          <el-col :span="8"><el-form-item label="任务确定时间:" prop="workEnsure">
            <el-input v-model="sqa.workEnsure" style="width:200px;" /></el-form-item></el-col>
          <el-col :span="8"><el-form-item label="OA首次通过时间:" prop="oaFirstNotice">
            <el-input v-model="sqa.oaFirstNotice" style="width:200px;" /></el-form-item></el-col>
          <el-col :span="8"><el-form-item label="要求完成时间:" prop="requiredCompletion">
            <el-input v-model="sqa.requiredCompletion" style="width:200px;" /></el-form-item></el-col>
        </el-row>
        <el-row type="flex" :gutter="40" justify="start">
          <el-col :span="8"><el-form-item label="质量工作考核人:" prop="qcCheckBy">
            <el-input v-model="sqa.qcCheckBy" style="width:200px;" /></el-form-item></el-col>
          <el-col :span="8"><el-form-item label="审核人:" prop="checkBy">
            <el-input v-model="sqa.checkBy" style="width:200px;" /></el-form-item></el-col>
          <el-col :span="8"><el-form-item label="完成状况:" prop="completeStatus">
            <el-select v-model="sqa.completeStatus" placeholder="请选择" style="width:200px;">
              <el-option label="未完成" value="0" />
              <el-option label="已完成" value="1" />
            </el-select>
          </el-form-item></el-col>
        </el-row>
        <el-row type="flex" :gutter="40" justify="start">
          <el-col :span="8"><el-form-item label="任务来源:" prop="workSource">
            <el-input v-model="sqa.workSource" style="width:200px;" /></el-form-item></el-col>
          <el-col :span="8"><el-form-item label="问题个数:" prop="matterCount">
            <el-input v-model="sqa.matterCount" style="width:200px;" type="number" /></el-form-item></el-col>
          <el-col :span="8"><el-form-item label="分配给:" prop="allocationTo">
            <el-input v-model="sqa.allocationTo" style="width:200px;" /></el-form-item></el-col>
        </el-row>
        <el-row type="flex" :gutter="40" justify="start">
          <el-col :span="8"><el-form-item label="系统/配置项名称:" prop="systemOrConfigurationItems">

            <el-select v-model="sqa.systemOrConfigurationItems" el-select placeholder="请选择" style="width:200px;">
              <el-option
                v-for="systemName in systemNameList"
                :key="systemName.id"
                :label="systemName.key"
                :value="systemName.value"
              />
            </el-select>
          </el-form-item></el-col>
          <el-col :span="8"><el-form-item label="SQA检查月份:" prop="sqaCheckMonth">
            <el-date-picker v-model="sqa.sqaCheckMonth" type="month" placeholder="选择月" style="width:200px;" /></el-form-item></el-col>
          <el-col :span="8"><el-form-item label="是否自身原因:" prop="reasonSelf">
            <el-select v-model="sqa.reasonSelf" placeholder="请选择" style="width:200px;">
              <el-option label="是" value="0" />
              <el-option label="否" value="1" />
            </el-select>
          </el-form-item></el-col>
        </el-row>
        <el-row type="flex" :gutter="40" justify="start">
          <el-col :span="3"><el-form-item label="完成标志:" label-width="90%" prop="completeIden" /></el-col>
          <el-col :span="20"><el-input v-model="sqa.completeIden" type="textarea" style="width:1000px;" /></el-col>
        </el-row>
        <el-row type="flex" :gutter="40" justify="start">
          <el-col :span="3"><el-form-item label="未完成或计划取消原因:" prop="uncompleteDesc" label-width="97%" /></el-col>
          <el-col :span="20"><el-input v-model="sqa.uncompleteDesc" type="textarea" style="width:1000px;" /></el-col>
        </el-row>
        <el-row type="flex" :gutter="40" justify="start">
          <el-col :span="3"><el-form-item label="考核项目简述:" prop="checkWorkDesc" label-width="90%" /></el-col>
          <el-col :span="20"><el-input v-model="sqa.checkWorkDesc" type="textarea" style="width:1000px;" /></el-col>
        </el-row>
        <el-row type="flex" :gutter="40" justify="start">
          <el-col :span="3"><el-form-item label="备注:" prop="remarks" label-width="90%" /></el-col>
          <el-col :span="20"><el-input v-model="sqa.remarks" type="textarea" style="width:1000px;" /></el-col>
        </el-row>
      </el-form>
      <div v-show="showval" slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="btnLoading" @click="toSave">保存</el-button>
        <el-button type="primary" @click="resetForm">重置</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import { findCodeById } from '@/api/project/code.js'
import { getMaxIndex, add } from '@/api/project/sqa.js'
import { queryDicValuesByDicType } from '@/api/dicValue.js'
export default {
  name: 'SqaEdit',
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
    const checkOne = (rule, value, callback) => {
      if (!value || value.trim().length <= 0) {
        callback(new Error('被审查物名称不能为空'))
      } else {
        callback()
      }
    }
    const checkTwo = (rule, value, callback) => {
      if (!value || value.trim().length <= 0) {
        callback(new Error('问题个数不能为空'))
      } else {
        callback()
      }
    }
    const checkThree = (rule, value, callback) => {
      if (!value || value.trim().length <= 0) {
        callback(new Error('质量工作考核人不能为空'))
      } else {
        callback()
      }
    }
    const checkFour = (rule, value, callback) => {
      if (!value || value.trim().length <= 0) {
        callback(new Error('请输入分配给不能为空'))
      } else {
        callback()
      }
    }
    return {
      title: 'SQA添加',
      showCard: false,
      btnLoading: false,
      systemNameList: [],
      deptList: [],
      showval: true,
      sqa: {
        totalNum: '',
        scope: '',
        code: '',
        workSource: '',
        workEnsure: '',
        requiredCompletion: '',
        qcCheckBy: '',
        checkBy: '',
        checkWorkDesc: '',
        completeIden: '',
        classification: '',
        checkGroup: '',
        completeStatus: '',
        reasonSelf: '',
        uncompleteDesc: '',
        oaFirstNotice: '',
        departmentLeader: '',
        leader: '',
        seat: '',
        remarks: '',
        codeId: '',
        checkObject: '',
        matterCount: '',
        allocationTo: '',
        systemOrConfigurationItems: '',
        sqaCheckMonth: ''
      },
      rules: {
        checkObject: [{ required: true, message: '请输入被审查物名称', trigger: 'blur' }, { validator: checkOne, trigger: 'blur' }],
        checkGroup: [{ required: true, message: '请选择被考核单位', trigger: 'blur' }],
        qcCheckBy: [{ required: true, message: '请输入质量工作考核人', trigger: 'blur' }, { validator: checkThree, trigger: 'blur' }],
        completeStatus: [{ required: true, message: '请选择完成状况', trigger: 'blur' }],
        matterCount: [{ required: true, message: '请输入问题个数', trigger: 'blur' }, { validator: checkTwo, trigger: 'blur' }],
        allocationTo: [{ required: true, message: '请输入分配给', trigger: 'blur' }, { validator: checkFour, trigger: 'blur' }],
        systemOrConfigurationItems: [{ required: true, message: '请输入系统/配置项名称', trigger: 'blur' }],
        sqaCheckMonth: [{ required: true, message: '请输入SQA检查月份', trigger: 'blur' }]

      }
    }
  },
  watch: {
    drawercount() {
      this.initPage()
    }
  },
  created() {
    this.initPage()
    // 查询SQA系统配置项名称
    queryDicValuesByDicType('management_sqa_sysConfig').then(res => {
      this.systemNameList = res.data
    }).catch()
    // 查询SQA部门
    queryDicValuesByDicType('management_sqa_dept').then(res => {
      this.deptList = res.data
    }).catch()
  },

  methods: {

    initPage() {
      this.clearCache()
      this.sqa = this.query
      this.showCard = false
      if (this.sqa && this.sqa.codeId) {
        this.findByCodeId(this.sqa.codeId)
        if (this.sqa.id) {
          this.title = 'SQA编辑'
          this.showCard = true
        } else {
          this.getMax()
          this.title = 'SQA添加'
        }
      }
    },
    clearCache() {
      if (this.$refs['sqaForm']) {
        this.$refs['sqaForm'].resetFields()
      }
    },
    findByCodeId(codeId) {
      findCodeById(codeId).then(res => {
        this.sqa.scope = res.data.kingdom
      }).catch(() => {

      })
    },

    getMax() {
      getMaxIndex().then(res => {
        this.sqa.totalNum = res.data
        this.showCard = true
      }).catch(() => {

      })
    },
    toSave() {
      this.$confirm('是否确认提交?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.save()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消提交'
        })
      })
    },
    save() {
      this.$refs.sqaForm.validate((valid) => {
        if (valid) {
          this.btnLoading = true
          add(this.sqa).then(res => {
            this.$message.success(res.message)
            this.$refs.sqaForm.resetFields()
            this.$emit('closeDraw')
            this.btnLoading = false
          }).catch(() => {
            this.$message.error('保存失败')
          })
        }
      })
    },
    resetForm() {
      this.$refs.sqaForm.resetFields()
      this.findByCodeId(this.sqa.codeId)
      this.getMax()
    }

  }

}
</script>
