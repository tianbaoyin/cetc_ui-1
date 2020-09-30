<template>
  <div style="height:800px">
    <form-create v-model="fApi" :rule="rule" :option="option" />
  </div>
</template>

<script>
export default {
  data() {
    return {
      fApi: {},
      // 表单生成规则
      rule: [
        {
          type: 'input',
          field: 'goods_name',
          title: '商品名称'
        },
        {
          type: 'datePicker',
          field: 'created_at',
          title: '创建时间'
        }
      ],
      // 组件参数配置
      option: {
        resetBtn: false,
        submitBtn: false,
        // 表单提交事件
        onSubmit: function(formData, fApi) {
          console.log(fApi)
          fApi.btn.loading()
          alert(JSON.stringify(formData))
        }
      }

    }
  },
  methods: {

  }
}
</script>
 <style >
:focus {
   outline: 0;
 }
</style>
