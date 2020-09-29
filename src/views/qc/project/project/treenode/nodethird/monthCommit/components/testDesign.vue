<template>
  <div>
    <el-card style="width:50%" class="box-card">
      <div slot="header">
        <span style="font-size:18px;color:#6699CC">测试设计信息</span>

      </div>
      <el-form :model="testDesign" label-width="120px">

        <el-form-item label="软件需求数">
          <el-input-number v-model="testDesign.rjxq" :min="-1" :max="10" label="描述文字" />
        </el-form-item>
        <el-form-item label="测试需求数">
          <el-input-number v-model="testDesign.csxq" :min="-1" :max="10" label="描述文字" />
        </el-form-item>

        <el-form-item label="测试用例数">
          <el-input-number v-model="testDesign.csyl" :min="-1" :max="10" label="描述文字" />
        </el-form-item>

        <el-form-item>
          <div>
            <el-button type="primary" style="float:right" @click="onSubmit">保存</el-button>
          </div>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { update } from '@/api/project/projectMonthCommit.js'
export default {
  props: {
    monthCommitForm: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      testDesign: {}
    }
  },
  watch: {
    monthCommitForm() {
      this.testDesign = this.monthCommitForm
    }
  },
  created() {
    this.testDesign = this.monthCommitForm
  },
  methods: {
    onSubmit() {
      update(this.testDesign).then(response => {
        this.$message.success('保存成功')
      }).catch(() => {

      })
    }
  }
}
</script>
