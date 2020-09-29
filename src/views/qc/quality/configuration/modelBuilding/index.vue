<template>
  <div class="app-container">
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane label="需求评审阶段" name="first">
        <first />
      </el-tab-pane>
      <el-tab-pane label="单元和集成测试阶段" name="second">单元和集成测试阶段。。。</el-tab-pane>
      <el-tab-pane label="配置项测试阶段" name="third">配置项测试阶段。。。</el-tab-pane>
      <el-tab-pane label="系统测试阶段" name="fourth">系统测试阶段。。。</el-tab-pane>
      <el-tab-pane label="验收阶段" name="five">验收阶段。。。</el-tab-pane>
      <el-tab-pane label="升级改造阶段" name="six">升级改造阶段。。。</el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import first from '@/views/qc/quality/configuration/modelBuilding/commponents/first.vue'
export default {
  components: {
    first
  },
  data() {
    return {
      activeName: 'first'
    }
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event)
    }
  }
}
</script>
