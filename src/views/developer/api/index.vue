<template>
  <div>
    <!-- <img src="@/assets/dashboard_images/cetc4.png" width="100%"> -->
    <iframe id="myiframe" :src="baseurl+'/swagger-ui.html'" width="100%" frameborder="0" />

  </div>
</template>

<script>
export default {
  data() {
    return {
      baseurl: process.env.VUE_APP_BASE_API
    }
  },
  created() {
    this.setHeigth()
  },

  mounted() {
    /**
     * iframe-宽高自适应显示
     */
    const oIframe = document.getElementById('myiframe')

    let deviceHeight = document.documentElement.clientHeight

    oIframe.style.height = (Number(deviceHeight) - 88) + 'px' // 数字是页面布局高度差
    window.onresize = function() {
      deviceHeight = document.documentElement.clientHeight
      oIframe.style.height = (Number(deviceHeight)) - 88 + 'px' // 数字是页面布局高度差
    }
  },
  methods: {
    setHeigth() {

    }
  }

}
</script>
