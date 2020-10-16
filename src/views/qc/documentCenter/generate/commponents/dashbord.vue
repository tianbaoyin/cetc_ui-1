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
          <img src="https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png" class="image">
        </el-card>
      </el-col>
    </el-row>

    <el-card :body-style="{ padding: '0px' }">
      <div slot="header" class="clearfix">
        <span>文档生成统计</span>
      </div>
      <img src="https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png" class="image">
    </el-card>

  </div>
</template>

<script>
export default {

}
</script>

<style>

</style>
