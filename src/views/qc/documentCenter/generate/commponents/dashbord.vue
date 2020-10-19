<template>
  <div>
    <el-row :gutter="4">
      <el-col :span="12">
        <el-card>
          <div slot="header" style="text-align:center">
            <span style="font-size:18px;">模板数量</span>
          </div>
          <div style="text-align:center">
            <span style="font-size:36px;color:#11919A">24</span>
          </div>
        </el-card>
        <br>
        <el-card>
          <div slot="header" style="text-align:center">
            <span style="font-size:18px;">今日模板生成数量</span>
          </div>
          <div style="text-align:center">
            <span style="font-size:36px;color:#11919A">24</span>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card :body-style="{ padding: '0px' }">
          <div slot="header" class="clearfix">
            <span>高频使用模板</span>
          </div>
          <bar />
        </el-card>
      </el-col>
    </el-row>

    <el-card :body-style="{ padding: '0px' }">
      <div slot="header" class="clearfix">
        <span>文档生成统计</span>
      </div>
      <line />
    </el-card>

  </div>
</template>

<script>
import bar from '@/views/qc/documentCenter/generate/commponents/bar.vue'
// import line from '@/views/qc/documentCenter/generate/commponents/line.vue'
export default {
  components: {
    bar
    // line
  }
}
</script>

<style>

</style>
