<template>
  <div class="app-container">
    <el-divider content-position="left">
      <svg-icon icon-class="supervise" />
      <span style="color:#336633;font-size:20px">项目测试详情</span>
    </el-divider>
    <div>
      <el-form :model="project">
        <el-row type="flex" :gutter="30" justify="space-around">
          <el-col :span="5"><el-form-item label="项目名称" /></el-col>
          <el-col :span="7"><el-input v-model="project.name" type="text" readonly="readonly" /></el-col>
          <el-col :span="4"><el-form-item label="所属领域" /></el-col>
          <el-col :span="8"><el-input v-model="project.kingdom" readonly="readonly" /></el-col>
        </el-row>
        <el-row type="flex" :gutter="30" justify="space-around">
          <el-col :span="5"><el-form-item label="所属令号" /></el-col>
          <el-col :span="7"><el-input v-model="project.code" type="text" readonly="readonly" /></el-col>
          <el-col :span="4"><el-form-item label="项目状态" /></el-col>
          <el-col :span="8">
            <el-select v-model="project.status" disabled style="width:100%">
              <el-option :key="false" label="未完成" :value="false" />
              <el-option :key="true" label="进行中" :value="true" />
            </el-select>
          </el-col>
        </el-row>
        <el-row type="flex" :gutter="30" justify="space-around">
          <el-col :span="5"><el-form-item label="代码行数" /></el-col>
          <el-col :span="7"><el-input v-model="project.codeSize" type="text" readonly="readonly" /></el-col>
          <el-col :span="4"><el-form-item label="项目序号" /></el-col>
          <el-col :span="8"><el-input v-model="project.num" type="text" readonly="readonly" /></el-col>
        </el-row>
        <el-row type="flex" :gutter="30" justify="space-around">
          <el-col :span="5"><el-form-item label="测试级别" /></el-col>
          <el-col :span="7"><el-input v-model="project.testGrade" type="text" readonly="readonly" /></el-col>
          <el-col :span="4"><el-form-item label="测试负责人" /></el-col>
          <el-col :span="8"><el-input v-model="project.testLeader" type="text" readonly="readonly" /></el-col>
        </el-row>
        <el-row type="flex" :gutter="30" justify="space-around">
          <el-col :span="5"><el-form-item label="软件负责人" /></el-col>
          <el-col :span="7"><el-input v-model="project.softer" type="text" readonly="readonly" /></el-col>
          <el-col :span="4"><el-form-item label="申请状态" /></el-col>
          <el-col :span="8">
            <el-select v-model="project.applicant" disabled style="width:100%">
              <el-option :key="0" label="未申请" :value="0" />
              <el-option :key="1" label="已申请" :value="1" />
            </el-select>
          </el-col>
        </el-row>
        <el-row type="flex" :gutter="30" justify="space-around">
          <el-col :span="5"><el-form-item label="ALM同步状态" /></el-col>
          <el-col :span="7">
            <el-select v-model="project.almFlag" disabled style="width:100%">
              <el-option :key="0" label="待同步" :value="0" />
              <el-option :key="1" label="同步中" :value="1" />
              <el-option :key="2" label="同步成功" :value="2" />
              <el-option :key="3" label="同步失败" :value="3" />
              <el-option :key="4" label="驳回" :value="4" />
            </el-select>
          </el-col>
          <el-col :span="4"><el-form-item label="同步者" /></el-col>
          <el-col :span="8"><el-input v-model="project.almBy" type="text" readonly="readonly" /></el-col>
        </el-row>
        <el-row type="flex" :gutter="30" justify="space-around">
          <el-col :span="5"><el-form-item label="同步时间" /></el-col>
          <el-col :span="7"><el-input v-model="project.softer" type="text" readonly="readonly" /></el-col>
          <el-col :span="4"><el-form-item label="创建者" /></el-col>
          <el-col :span="8"><el-input v-model="project.createBy" type="text" readonly="readonly" /></el-col>
        </el-row>
        <el-row type="flex" :gutter="30" justify="space-around">
          <el-col :span="5"><el-form-item label="创建时间" /></el-col>
          <el-col :span="19"><el-date-picker
            v-model="project.createDate"
            style="width:35%"
            type="datetime"
            placeholder="选择日期时间"
            disabled
          />
          </el-col>
        </el-row>
        <el-row type="flex" :gutter="30" justify="space-around">
          <el-col :span="5"><el-form-item label="测试类型" /></el-col>
          <el-col :span="19"><el-input v-model="project.testType" type="text" readonly="readonly" /></el-col>
        </el-row>
        <el-row type="flex" :gutter="30" justify="space-around">
          <el-col :span="5"><el-form-item label="测试人员" /></el-col>
          <el-col :span="19"><el-input v-model="project.createBy" type="text" readonly="readonly" /></el-col>
        </el-row>
        <el-row type="flex" :gutter="30" justify="space-around">
          <el-col :span="5"><el-form-item label="备注" /></el-col>
          <el-col :span="19"><el-input v-model="project.remark" type="textarea" readonly="readonly" /></el-col>
        </el-row>
      </el-form>
    </div>
  </div>
</template>
<script>
import { getTestType } from '@/api/project/project.js'
import { queryById } from '@/api//dicValue.js'
export default {
  name: 'ProjectTest',
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
    return {
      project: {},
      dicValueIds: [],
      dicValues: {}
    }
  },
  created() {
    this.initPage()
  },
  methods: {
    initPage() {
      this.project = this.query
      getTestType(this.project.id).then(res => {
        this.dicValueIds = res.data
        for (var i = 0; i < this.dicValueIds.length; i++) {
          queryById(this.dicValueIds[i]).then(res => {
            this.dicValues = res.data
          }).catch(() => {

          })
        }
      }).catch(() => {

      })
    }
  }

}
</script>

