<template>
  <div>
    <el-card v-loading="loading" shadow="hover">
      <div slot="header">
        <!-- <el-select
          v-model="searchEntity.parentId"
          filterable
          clearable
          size="small"
          style="width:160px"
          placeholder="您可以选择领域"
        >
          <el-option
            v-for="item in kingdomList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select> -->
        <el-date-picker
          v-model="selectYear"
          :clearable="false"
          type="year"
          size="small"
          style="width:160px"
          placeholder="选择年"
        />
        <el-button type="primary" size="small" @click="comprehensive">统计</el-button>

      </div>
      <div id="comprehensivecharts" style="height: 300px;width: 600px;margin: 0 auto " />
    </el-card>

  </div>
</template>
<script>
import echarts from 'echarts'
import 'echarts/theme/macarons.js'
import { countProjectOfMonth } from '@/api/project/project.js'
import { findAllKingdom } from '@/api/project/kingdom.js'
export default {
  name: 'Comprehensive',

  data() {
    return {
      loading: true,
      selectYear: new Date(),
      charts: '',
      kingdomList: [],
      searchEntity: {
        year: '',
        status: true
      }

    }
  },

  created() {
    this.findAllKingdom()
    this.comprehensive()
  },
  methods: {
    findAllKingdom() {
      this.loading = true
      findAllKingdom().then(res => {
        this.kingdomList = res.data
      }).catch(() => {
        this.$message.error('领域获取失败')
      })
    },
    comprehensive() {
      this.loading = true
      if (this.selectYear) {
        this.searchEntity.year = this.selectYear.getFullYear()
        countProjectOfMonth(this.searchEntity).then(res => {
          this.drawLine(res.data)
          this.loading = false
        }).catch(() => {
          this.$message.error('统计' + this.searchEntity.year + '令号失败')
        })
      }
    },
    drawLine(data) {
      if (document.getElementById('comprehensivecharts')) {
        this.charts = echarts.init(document.getElementById('comprehensivecharts'), 'macarons')
        this.charts.setOption({
          title: {
            text: this.selectYear.getFullYear() + '年新建项目趋势图'
          },
          tooltip: {
            trigger: 'axis'
          },

          toolbox: {
            show: true,
            feature: {
              dataView: { show: false, readOnly: false },
              magicType: { show: true, type: ['line', 'bar'] },
              restore: { show: true },
              saveAsImage: { show: true }
            }
          },
          calculable: true,
          xAxis: [
            {
              type: 'category',
              data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
            }
          ],
          yAxis: [
            {
              type: 'value'
            }
          ],
          series: [
            {
              name: '项目',
              type: 'bar',
              data: data,
              itemStyle: {
                normal: {
                  label: {
                    show: false, // 开启显示
                    position: 'top', // 在上方显示
                    textStyle: { // 数值样式
                      color: 'black',
                      fontSize: 14,
                      fontWeight: 100
                    }}
                }
              }
            }
          ]
        })
      }
    }

  }

}
</script>

