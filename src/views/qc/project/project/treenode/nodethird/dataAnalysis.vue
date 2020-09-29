<template>
  <div style="height:800px">
    <el-row>
      <el-col :span="24">
        <el-card v-loading="loading1" shadow="hover">
          <div slot="header">
            <span style="font-size:18px;color:#6699CC">项目数据统计表</span>
            <el-button type="primary" style="float: right; padding: 5px 5px" icon="el-icon-refresh" circle @click="count1(true)" />

          </div>
          <el-table
            :data="tableData"
            border
            stripe
            style="width: 100%"
          >
            <el-table-column
              prop="name"
              label="名称"
              align="center"
              width="180"
            />
            <el-table-column
              prop="softreq"
              label="软件需求数"
              align="center"
              width="180"
            />
            <el-table-column
              prop="testreq"
              label="测试需求数"
              align="center"
            />

            <el-table-column
              prop="testcase"
              label="测试用例数"
              align="center"
            />
            <el-table-column
              prop="teststep"
              label="测试步骤数"
              align="center"
            />
            <el-table-column
              prop="defect"
              label="缺陷数"
              align="center"
            />
          </el-table>

        </el-card>
      </el-col>

    </el-row>

    <el-row :gutter="12">
      <el-col :span="12">
        <el-card v-loading="loading2" shadow="hover">
          <div slot="header">
            <span style="font-size:18px;color:#6699CC">用例状态统计</span>
            <el-button type="primary" style="float: right; padding: 5px 5px" icon="el-icon-refresh" circle @click="count2(true)" />

          </div>
          <div id="testcase" style="width: 600px;height: 180px; margin: 0 auto" />
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card v-loading="loading3" shadow="hover">
          <div slot="header">
            <span style="font-size:18px;color:#6699CC">缺陷统计</span>
            <el-button type="primary" style="float: right; padding: 5px 5px" icon="el-icon-refresh" circle @click="count3(true)" />
          </div>
          <div id="defect" style="width: 600px;height: 180px; margin: 0 auto" />
        </el-card>
      </el-col>

    </el-row>
    <el-row :gutter="12">
      <el-col :span="24">
        <el-card v-loading="loading4" shadow="hover">
          <div slot="header">
            <span style="font-size:18px;color:#6699CC">测试用例统计数量</span>
            <el-button type="primary" style="float: right; padding: 5px 5px" icon="el-icon-refresh" circle @click="count4(true)" />

          </div>
          <div id="testcasenum" style="width: 1200px;height: 260px; margin: 0 auto" />
        </el-card>
      </el-col>

    </el-row>
  </div>
</template>
<script>
import echarts from 'echarts'
import { findProjectAnalysic1, findProjectAnalysic2, findProjectAnalysic3, findProjectAnalysic4 } from '@/api/hpalm/alm.js'

export default {
  name: 'DataAnalysis',

  props: {
    node: {
      type: Object,
      required: true
    },
    tab3: {
      type: String,
      requird: true,
      default: ''
    }

  },
  data() {
    return {
      tableData: [
        {
          name: '数量',
          softreq: 0,
          testreq: 0,
          testcase: 0,
          teststep: 0,
          defect: 0
        }
      ],
      loading1: false,
      loading2: false,
      loading3: false,
      loading4: false,
      testCaseList: [],
      countData: []
    }
  },
  watch: {
    node() {
      this.count1(false)
      this.count2(false)
      this.count3(false)
      this.count4(false)
    },
    tab3(val) {
      if (val === 'forth') {
        this.count1(false)
        this.count2(false)
        this.count3(false)
        this.count4(false)
      }
    }

  },

  methods: {
    count1(refresh) {
      this.loading1 = true
      findProjectAnalysic1(this.node.id, refresh).then(responese => {
        if (responese.flag) {
          this.tableData = responese.data
          this.loading1 = false
        } else {
          this.loading1 = false
        }
      }).catch(() => {
        this.loading1 = false
      })
    },
    count2(refresh) {
      this.loading2 = true
      findProjectAnalysic2(this.node.id, refresh).then(responese => {
        if (responese.flag) {
          this.countTestCase('testcase', responese.data)
          this.loading2 = false
        } else {
          this.loading2 = false
        }
      }).catch(() => {
        this.loading2 = false
      })
    },
    count3(refresh) {
      this.loading3 = true
      findProjectAnalysic3(this.node.id, refresh).then(responese => {
        if (responese.flag) {
          this.countDefect('defect', responese.data)
          this.loading3 = false
        } else {
          this.loading3 = false
        }
      }).catch(() => {
        this.loading3 = false
      })
    },
    count4(refresh) {
      this.loading4 = true
      findProjectAnalysic4(this.node.id, refresh).then(responese => {
        if (responese.flag) {
          this.countTestCaseNum('testcasenum', responese.data)
          this.loading4 = false
        } else {
          this.loading4 = false
        }
      }).catch(() => {
        this.loading4 = false
      })
    },

    countTestCase(id, data) {
      this.charts = echarts.init(document.getElementById(id))
      this.charts.setOption({
        title: {
          text: '用例状态统计',
          x: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          show: true,

          orient: 'vertical',
          x: 'left',
          data: ['Failed', 'Passed', 'No Run', 'Not Covered', 'Blocked', 'Not Completed', 'N/A']
        },
        toolbox: {

          show: true,
          feature: {
            dataView: { show: true, readOnly: false },
            magicType: {
              show: true,
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
            name: '创建数量',
            type: 'pie',
            radius: '55%',
            center: ['50%', '60%'],
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
            data: data
          }
        ]
      })
    },
    countDefect(id, data) {
      this.charts = echarts.init(document.getElementById(id))
      this.charts.setOption({
        title: {
          text: '缺陷统计',
          x: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          show: true,

          orient: 'vertical',
          x: 'left',
          data: ['关键缺陷', '严重缺陷', '一般缺陷', '建议改进']
        },
        toolbox: {
          show: true,
          feature: {
            dataView: { show: true, readOnly: false },
            magicType: {
              show: true,
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
            name: '创建数量',
            type: 'pie',
            radius: '55%',
            center: ['50%', '60%'],
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
            data: data
          }
        ]
      })
    },
    test() {
      console('触发了12')
    },
    countTestCaseNum(id, data) {
      this.charts = echarts.init(document.getElementById(id))
      this.charts.setOption({
        color: ['#3398DB'],
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        toolbox: {
          x: 'right',

          show: true,
          feature: {
            dataView: { show: true, readOnly: false },
            magicType: {
              show: true,
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
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: ['文档审查', '代码审查', '静态分析', '逻辑测试', '余量测试', '功能测试', '性能测试', '接口测试', '强度测试', '数据处理测试', '可恢复性测试', '可安装性测试', '安全性测试', '边界测试', '人机交互界面测试'],
            axisLabel: {
              interval: 0,
              formatter: function(value) {
                var ret = ''// 拼接加\n返回的类目项
                var maxLength = 4// 每项显示文字个数
                var valLength = value.length// X轴类目项的文字个数
                var rowN = Math.ceil(valLength / maxLength) // 类目项需要换行的行数
                if (rowN > 1) {
                  for (var i = 0; i < rowN; i++) {
                    var temp = ''// 每次截取的字符串
                    var start = i * maxLength// 开始截取的位置
                    var end = start + maxLength// 结束截取的位置
                    // 这里也可以加一个是否是最后一行的判断，但是不加也没有影响，那就不加吧
                    temp = value.substring(start, end) + '\n'
                    ret += temp // 凭借最终的字符串
                  }
                  return ret
                } else {
                  return value
                }
              }
            }
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: '直接访问',
            type: 'bar',
            barWidth: '60%',
            data: data
          }
        ]
      })
    }
  }
}
</script>

<style>
.el-row {
    margin-bottom: 10px;

  }

  .el-card__header {
    background-color: #FCFCFC;
    padding: 8px 20px;
  }
</style>
