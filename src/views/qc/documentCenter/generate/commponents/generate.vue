<template>
  <div>
    <el-steps :active="activeStep" simple>
      <el-step title="开始" icon="el-icon-s-flag" />
      <el-step title="提交数据" icon="el-icon-s-flag" />
      <el-step title="填写自定义表单" icon="el-icon-document-add" />
      <el-step title="下载" icon="el-icon-download" />
    </el-steps>
    <el-divider />
    <div style="width:50%;margin:0 auto">
      <el-card v-show="activeStep==1" class="box-card">
        <el-page-header content="基本信息" @back="goBack" />
        <el-divider />
        <el-form
          v-model="docSource"
          label-width="100px"
        >
          <el-form-item label="领域">
            <el-select
              v-model="docSource.kingdom"
              placeholder="请选择领域"
              style="width:100%"
              @change="findCodeByKingdom"
            >
              <el-option
                v-for="item in kingdomList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="令号">
            <el-select
              v-model="docSource.code"
              placeholder="请选择令号"
              style="width:100%"
              @change="findProjectByCode"
            >
              <el-option
                v-for="(item,index) in codeList"
                :key="index"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="项目">
            <el-select v-model="docSource.project" placeholder="请选择项目" style="width:100%">
              <el-option
                v-for="(item,index) in projectList"
                :key="index"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="模板">
            <el-select
              v-model="docSource.template"
              placeholder="请选择模板"
              style="width:100%"
              filterable
              @change="handleCheckTemplate"
            >
              <el-option
                v-for="(item,index) in templates"
                :key="index"
                :label="item.docName"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSubmit">提交数据</el-button>
          </el-form-item>
        </el-form>
      </el-card>
      <el-card v-show="activeStep==2" class="box-card">
        <el-page-header content="自定义字段" @back="goBack" />
        <el-divider />
        <el-form v-if="customField.length>0" v-model="customField" label-width="100px">
          <el-form-item v-for="(item,index) in customField" :key="index" :label="item.key">
            <el-input v-model="item.value" type="text" />
          </el-form-item>
        </el-form>
        <span v-else>没有自定义字段</span>
        <div class="bottom ">
          <el-button type="primary" class="button" @click="handleCreateDoc">生成并下载</el-button>
        </div>
      </el-card>
      <el-card v-show="activeStep==3" class="box-card">
        <el-page-header content="文档生成中" @back="goBack" />
        <el-divider />
        <div style="margin-left:40%">
          <el-progress type="circle" :percentage="25" />
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import { findAllDocumentTemplates } from '@/api/document/documentTemplate.js'
import { findCodeByKingdom } from '@/api/project/code.js'
import { findProjectByCode } from '@/api/project/project.js'
import { findAllKingdom } from '@/api/project/kingdom.js'
export default {
  data() {
    return {
      //
      fieldMap: new Map([
        ['产品名称', 'text'],
        ['产品型号', 'text '],
        ['产品代号', 'text '],
        ['产品用途', 'textarea '],
        ['软件用途', 'textarea '],
        ['需方', 'textarea '],
        ['开发方', 'textarea '],
        ['运行环境', 'textarea '],
        ['文档概述', 'textarea '],
        ['标准约定', 'textarea '],
        ['工作产品审核', 'textarea '],
        ['活动审核审核', 'textarea ']
      ]),
      templates: [], // 模板
      templatemap: {}, // 模板的键值对，因为select不能传递对象，所以用此查询模板的具体信息
      kingdomList: [],
      codeList: [],
      projectList: [],
      customField: [],
      activeStep: 1,
      docSource: {
        kingdom: '',
        code: null,
        project: null,
        template: null,
        customFiled: {}
      },
      templateDate: {}
    }
  },
  created() {
    this.findAllKingdom()
    this.findAllDocumentTemplates()
  },
  methods: {
    findAllKingdom() {
      findAllKingdom().then(res => {
        this.kingdomList = res.data
      }).catch(_ => {
        this.$message.error('领域查询失败')
      })
    },
    findCodeByKingdom(data) {
      this.codeList = []
      this.projectList = []
      findCodeByKingdom(data).then(res => {
        this.codeList = res.data
      }).catch(_ => {
        this.$message.error('令号查询失败')
      })
    },
    findProjectByCode(data) {
      this.projectList = []
      findProjectByCode(data).then(res => {
        this.projectList = res.data
      }).catch(_ => {
        this.$message.error('项目查询失败')
      })
    },
    // 查询所有的文档模板
    findAllDocumentTemplates() {
      findAllDocumentTemplates().then(res => {
        this.templates = res.data
        const map = new Map()
        res.data.forEach(item => {
          map.set(item.id, item)
        })
        this.templatemap = map
      }).catch(_ => {
        this.$message.error('文档模板查询失败')
      })
    },
    handleCheckTemplate(data) {
      this.customField = []
      const template = this.templatemap.get(data)
      if (template.checkedLabels) {
        const array = template.checkedLabels.split(',')
        array.forEach(item => {
          this.customField.push({ key: item, value: '' })
        })
        console.log(this.customField)
      }
    },
    handleSubmit() {
      this.activeStep = 2
      this.flag = false
    },
    handleCreateDoc() {
      const map = new Map()
      this.customField.forEach(item => {
        map.set(item.key, item.value)
      })
      this.docSource.customField = map

      console.log(this.docSource)
      this.activeStep = 3
    },
    goBack() {
      if (this.activeStep > 1) {
        this.activeStep--
      }
      const mes = this.getInputType('产品名称')
      console.log(mes)
    },
    getInputType(data) {
      console.log('参数', data)
      const inputType = this.fieldMap.get(data)
      return inputType
    }

  }
}
</script>

<style>

</style>
