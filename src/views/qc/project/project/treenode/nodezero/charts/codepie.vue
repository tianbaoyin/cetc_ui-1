<template>
  <div>
    <el-card v-loading="pieLoading" shadow="hover">
      <div slot="header">
        <span style="font-size:18px;color:#6699CC">基于领域的令号分布统计</span>
      </div>
      <div id="pie" style="height: 300px;width: 600px;margin: 0 auto " />
    </el-card>
  </div>
</template>

<script>
import echarts from 'echarts'
import 'echarts/theme/macarons.js'
import { countOfKingdom } from '@/api/project/code.js'
export default {
  name: 'CodeOfKingdom',
  data() {
    return {
      pieLoading: true,
      charts: '',
      kingdomList: [],
      countData: [],
      kingdomMap: new Map()
    }
  },
  created() {
    this.countOfKingdom()
  },
  mounted() {

  },
  methods: {
    drawPie() {
      if (document.getElementById('pie')) {
        this.charts = echarts.init(document.getElementById('pie'), 'macarons')
        this.charts.setOption({
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
          },
          legend: {
            orient: 'vertical',
            top: '40px',
            x: 'left',
            data: this.kingdomList
          },
          toolbox: {
            show: true,
            feature: {
              dataView: { show: false, readOnly: false },
              magicType: {
                show: false,
                type: ['pie', 'funnel'],
                option: {
                  funnel: {
                    x: '25%',
                    width: '50%',
                    funnelAlign: 'left',
                    max: 1548
                  }
                }
              },
              restore: { show: true },
              saveAsImage: { show: true }
            }
          },
          calculable: true,
          series: [
            {
              name: '令号统计',
              type: 'pie',
              radius: '55%',
              center: ['55%', '55%'],
              itemStyle: {
                normal: {
                  label: {
                    show: true,
                    position: 'outer',
                    textStyle: {
                      fontWeight: 300,
                      fontSize: 14
                    },
                    formatter: '{d}%'
                  }
                }
              },
              data: this.countData
            }
          ]
        })
      }
    },
    countOfKingdom() {
      this.pieLoading = true
      countOfKingdom().then(res => {
        const kingdomList = []
        const countData = []
        // 将对象转换为Map
        const map = new Map(Object.entries(res.data))
        this.kingdomMap = map
        map.forEach(function(value, key, map) {
          kingdomList.push(key)
          countData.push({ name: key, value: value })
        })
        this.kingdomList = kingdomList
        this.countData = countData
        this.drawPie()
        this.pieLoading = false
      }).catch(() => {
        this.pieLoading = false
        this.$message.error('统计各领域下的令号失败')
      })
    }
  }
}
</script>

<style>

</style>
