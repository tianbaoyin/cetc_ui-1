<template>
  <div>

    <el-form
      ref="form"
      :rules="rules"
      :model="projectExcute"
      label-width="150px"
      style="margin-right:10px"
    >
      <el-collapse v-model="activeNames">
        <el-collapse-item title="测试执行信息" name="1">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item
                prop="excuteLocal"
                label="测试执行地点"
              >
                <el-input v-model="projectExcute.excuteLocal" maxlength="126" placeholder="测试执行地点" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                prop="useTime"
                label="测试执行时间"
              >
                <el-input v-model="projectExcute.useTime" placeholder="测试所用时间">
                  <template slot="append">小时</template>
                </el-input>

              </el-form-item>
            </el-col>

          </el-row>

          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item
                label="测试执行人数"
              >
                <el-input-number
                  v-model="projectExcute.excuters"
                  :min="1"
                  :max="10000"
                  label="测试执行人数"
                  style="width:100%"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="测试用例执行数量"
              >
                <el-input-number
                  v-model="projectExcute.examples"
                  style="width:100%"
                  :min="1"
                  :max="100000"
                  label="测试执行数量"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-collapse-item>

        <el-collapse-item title="执行问题信息" name="2">

          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item
                prop="testQus"
                label="测试问题数据"
              >
                <el-select v-model="projectExcute.testQus" style="width:100%" placeholder="测试问题数据">
                  <el-option
                    v-for="item in options1"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item
                prop="testType"
                label="测试类型"
              >
                <el-select v-model="projectExcute.testType" style="width:100%" placeholder="测试类型">
                  <el-option
                    v-for="item in options2"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="8">
              <el-form-item
                label="责任部门"
              >
                <el-select v-model="projectExcute.zerenbumen" style="width:100%" placeholder="责任部门">
                  <el-option
                    v-for="item in options3"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>

          </el-row>

          <el-row :gutter="20">

            <el-col :span="8">
              <el-form-item
                label="设计问题数"
              >
                <el-input-number
                  v-model="projectExcute.designQusNum"
                  style="width:100%"
                  :min="-1"
                  :max="100000"
                  label="设计问题数"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item
                label="程序问题数"
              >
                <el-input-number
                  v-model="projectExcute.codeQusNum"
                  :min="-1"
                  :max="10000"
                  label="程序问题数"
                  style="width:100%"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item
                label="文档问题数"
              >
                <el-input-number
                  v-model="projectExcute.docQusNum"
                  style="width:100%"
                  :min="-1"
                  :max="100000"
                  label="文档问题数"
                />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item
                label="编码问题数"
              >
                <el-input-number
                  v-model="projectExcute.bianmaQusNum"
                  :min="-1"
                  :max="10000"
                  label="编码问题数"
                  style="width:100%"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item
                label="其它问题数"
              >
                <el-input-number
                  v-model="projectExcute.qitaQusNum"
                  style="width:100%"
                  :min="-1"
                  :max="100000"
                  label="其它问题数"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item
                label="关键问题数"
              >
                <el-input-number
                  v-model="projectExcute.guanjianQusNum"
                  :min="-1"
                  :max="10000"
                  label="关键问题数"
                  style="width:100%"
                />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">

            <el-col :span="8">
              <el-form-item
                label="重要问题数"
              >
                <el-input-number
                  v-model="projectExcute.zhongyaoQusNum"
                  style="width:100%"
                  :min="-1"
                  :max="100000"
                  label="重要问题数"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item
                label="一般问题数"
              >
                <el-input-number
                  v-model="projectExcute.yibanQusNum"
                  :min="-1"
                  :max="10000"
                  label="一般问题数"
                  style="width:100%"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item
                label="建议改进数"
              >
                <el-input-number
                  v-model="projectExcute.jianyigaijinQusNum"
                  style="width:100%"
                  :min="-1"
                  :max="100000"
                  label="建议改进数"
                />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item
                label="代码规模（千行）"
              >
                <el-input-number
                  v-model="projectExcute.daimaguimo"
                  :min="-1"
                  :max="10000"
                  label="代码规模（千行）"
                  style="width:100%"
                />
              </el-form-item>
            </el-col>

            <el-col :span="8">
              <el-form-item
                label="软件测试问题总"
              >
                <el-input-number
                  v-model="projectExcute.testQusNum"
                  :min="-1"
                  :max="10000"
                  label="软件测试问题总"
                  style="width:100%"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item
                label="软件开发人员"
              >
                <el-input
                  v-model="projectExcute.rjkfman"
                  style="width:100%"

                  label="软件开发人员"
                />
              </el-form-item>
            </el-col>
          </el-row>

        </el-collapse-item>
      </el-collapse>
    </el-form>

  </div>
</template>
<script>
import { queryDicValuesByDicType } from '@/api/dicValue.js'
import { addProjectExcute, updateProjectExcute } from '@/api/project/projectExcute.js'
export default {
  name: 'TestExecuteAdd',
  props: {
    projectexcute: {
      type: Object,
      required: true
    },
    pagecount: {
      type: Number,
      required: true,
      default: 0
    },
    monthCommitForm: {
      type: Object,
      required: true
    }
  },
  data() {
    const valdateUseTime = (rule, value, callback) => {
      if (Number(value)) {
        callback()
      } else {
        callback(new Error('请输入数字'))
      }
    }
    return {
      projectExcute: {
        monthCommitId: this.monthCommitForm.id
      },
      testExcQus: {
        monthCommitId: this.monthCommitForm.id
      },
      activeNames: ['1'],
      ceshiwentishujuKey: 'month_commit_testproblem_data',
      ceshileixingKey: 'month_commit_testtype',
      zerenbumen: 'month_commit_resp_dept',
      options1: [],
      options2: [],
      options3: [],
      rules: {
        useTime: [{ validator: valdateUseTime, trigger: 'blur' }],
        excuteLocal: [{ required: true, message: '测试执行地点不能为空', trigger: 'blur' }]
      }

    }
  },
  watch: {
    pagecount() {
      this.initPage()
    }
  },
  created() {
    this.initPage()
    this.queryDicValuesByDicType1(this.ceshiwentishujuKey)
    this.queryDicValuesByDicType2(this.ceshileixingKey)
    this.queryDicValuesByDicType3(this.zerenbumen)
  },
  methods: {
    queryDicValuesByDicType1(dic) {
      queryDicValuesByDicType(dic).then(response => {
        this.options1 = response.data
      }).catch(() => {

      })
    },

    queryDicValuesByDicType2(dic) {
      queryDicValuesByDicType(dic).then(response => {
        this.options2 = response.data
      }).catch(() => {

      })
    },

    queryDicValuesByDicType3(dic) {
      queryDicValuesByDicType(dic).then(response => {
        this.options3 = response.data
      }).catch(() => {

      })
    },

    initPage() {
      this.projectExcute = this.projectexcute

      if (this.$refs.form) {
        this.$refs.form.resetFields()
      }
    },
    toSubmit() {
      this.$confirm('确认提交, 是否继续?', '提示', {
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
    submitForm() {
      this.$refs.form.validate((valida) => {
        if (valida) {
          if (this.projectExcute.id) {
            // 更新
            updateProjectExcute(this.projectExcute).then(res => {
              this.$message.success('提交成功')
              this.$emit('closeDrawer')
            }).catch(() => {
              this.$message.error('提交失败')
            })
          } else {
            this.projectExcute.monthCommitId = this.monthCommitForm.id
            console.log(this.projectExcute)
            addProjectExcute(this.projectExcute).then(res => {
              this.$message.success('提交成功')
              this.$emit('closeDrawer')
            }).catch(() => {
              this.$message.error('提交失败')
            })
          }
        }
      })
    }
  }
}

</script>
