<template>
  <div>
    <el-card v-loading="loading" shadow="hover">
      <div slot="header">
        <span style="font-size:18px;color:#6699CC">基于测试级别的项目分布统计</span>
      </div>
      <div id="testGradePie" style="height: 300px;width: 600px;margin: 0 auto " />
    </el-card>
  </div>
</template>

<script>
import echarts from 'echarts'
import 'echarts/theme/macarons.js'
import { countProjectOfTestGrade } from '@/api/project/project.js'
export default {
  name: 'CountProjectType',
  data() {
    return {
      loading: true,
      charts: '',
      kingdomList: [],
      countData: [],
      kingdomMap: new Map()
    }
  },
  created() {
    this.getProjectCountByTestGrade()
  },
  methods: {
    getProjectCountByTestGrade() {
      this.loading = true
      countProjectOfTestGrade({}).then(res => {
        const testTypeList = []
        const countData = []
        // 将对象转换为Map
        const map = new Map(Object.entries(res.data))
        map.forEach((value, key, map) => {
          testTypeList.push(key)
          countData.push({ name: key, value: value })
        })

        this.drawPie(testTypeList, countData)
        this.loading = false
      }).catch(error => {
        console.warn(error)
      })
    },
    drawPie(testTypeList, countData) {
      if (document.getElementById('testGradePie')) {
        this.charts = echarts.init(document.getElementById('testGradePie'), 'macarons')
        this.charts.setOption({
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
          },
          legend: {
            orient: 'vertical',
            top: '0px',
            left: '-1px',
            x: 'left',
            data: testTypeList
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
              name: '项目数量',
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
              data: countData
            }
          ]
        })
      }
    }

  }
}
</script>
<style>
</style>
