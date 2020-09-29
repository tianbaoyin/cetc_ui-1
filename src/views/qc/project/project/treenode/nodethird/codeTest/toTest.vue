<template>
  <div>
    <el-form
      :model="test"
      label-width="100px"
    >
      <el-form-item
        label="描述"
      >
        <el-input
          v-model="test.name"
          style="width:50%"
          placeholder="本次测试的描述信息"
        />
      </el-form-item>
      <el-form-item label="测试工具" prop="resource">
        <el-radio-group v-model="test.tool">
          <el-radio name="testbed" label="testbed" />
          <el-radio name="ctest" disabled label="c++test" />
          <el-radio name="coverity" disabled label="coverity" />
          <el-radio name="klockwork" disabled label="klockwork" />
        </el-radio-group>
      </el-form-item>
      <el-form-item label="检查策略" prop="resource">
        <el-radio-group v-model="test.strategy">
          <el-radio name="statictest" label="	静态代码测试" />
          <el-radio name="dynamictest" disabled label="动态代码测试" />
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <template>
          <el-button v-waves type="primary">提交</el-button>
        </template>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import waves from '@/directive/waves'
export default {
  name: 'ToTest',
  directives: { waves },
  data() {
    return {
      test: {
        tool: 'testbed',
        strategy: 'statictest'
      }
    }
  }
}
</script>
