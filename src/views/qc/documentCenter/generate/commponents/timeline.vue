<template>
  <div>
    <el-button type="primary" icon="el-icon-office-building" @click="dialogVisible = true">快速生成文档</el-button>
    <el-divider />
    <el-timeline :reverse="reverse">
      <el-timeline-item
        v-for="(activity, index) in activities"
        :key="index"
        :timestamp="activity.timestamp"
      >
        {{ activity.content }}
      </el-timeline-item>
    </el-timeline>

    <el-dialog
      title="模板选择"
      :visible.sync="dialogVisible"
      width="30%"
      :close-on-click-modal="false"
    >
      <el-form
        ref="templateForm"
        :model="templateForm"
        :rules="templateRules"
      >
        <el-form-item prop="template">
          <el-select
            v-model="templateForm.template"
            placeholder="请选择模板"
            style="width:100%"
            filterable
          >
            <el-option
              v-for="(item,index) in templates"
              :key="index"
              :label="item.docName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleSubmit">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="文档生成进度"
      :visible.sync="progressDialogVisible"
      width="30%"
      :close-on-click-modal="false"
      :show-close="false"
    >
      <el-steps :active="active" simple>
        <el-step title="计算项目数据" icon="el-icon-s-flag">e</el-step>
        <el-step title="生成项目文档" icon="el-icon-s-flag" />
        <el-step title="下载" icon="el-icon-download" />
      </el-steps>
      <br>
      <div style="margin-left: 36%">
        <el-progress
          type="circle"
          :percentage="percentage"
          :show-text="false"
        />
      </div>
    </el-dialog>
    <el-drawer
      title="填写信息"
      :visible.sync="drawer"
      :with-header="false"
    >
      <div class="app-container">
        <el-card style="min-height:500px">
          <div slot="header" class="clearfix">
            <span>自定义字段</span>
          </div>
          <el-form v-model="customField" label-width="100px">
            <el-form-item v-for="(item,index) in customField" :key="index" :label="item.key">
              <el-input v-model="item.value" type="text" />
            </el-form-item>
          </el-form>
        </el-card>
        <el-divider />
        <div>
          <el-button type="primary" class="button" @click="createDoc">生成并下载</el-button>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import { findAllDocumentTemplates } from '@/api/document/documentTemplate.js'

export default {
  data() {
    return {
      active: 1,
      templateForm: {
        template: ''
      },
      templateRules: {
        template: [{ required: true, message: '请选择模板', trigger: 'change' }]
      },
      templatemap: {}, // 模板的键值对，因为select不能传递对象，所以用此查询模板的具体信息
      percentage: 0, // 进度条值
      docSource: {},
      templates: [],
      customField: [],
      node: {},
      dialogVisible: false,
      progressDialogVisible: false,
      drawer: false,
      reverse: true,
      activities: [{
        content: '张三生成系统测试报告',
        timestamp: '2018-04-15'
      }, {
        content: '李四系统测试计划',
        timestamp: '2018-04-13'
      }, {
        content: '王五系统测试说明',
        timestamp: '2018-04-11'
      }]
    }
  },
  created() {
    this.findAllDocumentTemplates()
  },
  methods: {

    // 查询所有的文档模板
    findAllDocumentTemplates() {
      findAllDocumentTemplates().then(res => {
        this.templates = res.data
        // 将文档存入map
        const map = new Map()
        res.data.forEach(item => {
          map.set(item.id, item)
        })
        this.templatemap = map
      }).catch(_ => {
        this.$message.error('文档模板查询失败')
      })
    },
    handleSubmit() {
      this.$refs.templateForm.validate((valid) => {
        if (valid) {
          this.preGenerate()
          this.dialogVisible = false
          this.drawer = true
          this.customField = []
          const template = this.templatemap.get(this.templateForm.template)
          if (template.checkedLabels) {
            const array = template.checkedLabels.split(',')
            array.forEach(item => {
              this.customField.push({ key: item, value: '' })
            })
            console.log(this.customField)
          }
        }
      })
    },
    preGenerate() {
      // 让后台准备数据，保存到Redis中，用户填写完信息后就可以直接在Redis中取数据了')
      const uuid = '123456789' // 模拟一个随机数,作为redis的key
      this.$emit('lisntePreCreate', uuid)
    },
    createDoc() {
      this.drawer = false
      this.progressDialogVisible = true
      const interval = setInterval(() => {
        if (this.percentage < 100) {
          this.percentage++
        } else {
          this.percentage = 0
          this.active = 2
          this.progressDialogVisible = false
          clearInterval(interval)
        }
      }, 100)
    }
  }
}

</script>

<style>

</style>
