<template>
  <div>
    <el-button type="primary" size="small" @click="handleDrawer">保存</el-button>
    <div>
      <el-drawer title="新增" :visible.sync="drawer">
        <el-form ref="form" :model="form" label-width="80px">
          <el-form-item label="名称">
            <el-input v-model="form.name" />
          </el-form-item>
          <el-form-item label="配置项">
            <el-select v-model="form.region" placeholder="请选择活动区域">
              <el-option label="区域一" value="shanghai" />
              <el-option label="区域二" value="beijing" />
            </el-select>
          </el-form-item>
          <el-form-item label="时间">
            <el-col :span="11">
              <el-date-picker
                v-model="form.date1"
                type="date"
                placeholder="选择日期"
                style="width: 100%;"
              />
            </el-col>
            <el-col class="line" :span="2">-</el-col>
            <el-col :span="11">
              <el-time-picker v-model="form.date2" placeholder="选择时间" style="width: 100%;" />
            </el-col>
          </el-form-item>
          <el-form-item label="即时配送">
            <el-switch v-model="form.delivery" />
          </el-form-item>

          <el-form-item label="特殊资源">
            <el-radio-group v-model="form.resource">
              <el-radio label="测试1" />
              <el-radio label="测试2" />
            </el-radio-group>
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="form.desc" type="textarea" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">立即创建</el-button>
            <el-button>取消</el-button>
          </el-form-item>
        </el-form>
      </el-drawer>
    </div>
    <div id="tree" style="height: 1980px;width:600px;margin-top: -200px" />
  </div>
</template>

<script>
import echarts from 'echarts'
export default {
  name: 'StanderTree',
  data() {
    return {
      drawer: true,
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },

      data: {
        name: '质量模型',
        children: [
          {
            name: '功能性',
            children: [
              {
                name: '完备性',
                children: [
                  { name: '功能的充分性', value: 721 },
                  { name: '功能实现的完整性', value: 721 }
                ]
              },
              {
                name: '正确性',
                children: [
                  { name: '计算的准确性', value: 721 },
                  { name: '精确度', value: 721 }
                ]
              },
              {
                name: '恰当性',
                children: [
                  { name: '功能的适用性', value: 721 },
                  { name: '功能规格说明的稳定性', value: 721 }
                ]
              },
              {
                name: '依从性',
                children: [
                  { name: '特定功能的依从性', value: 721 },
                  { name: '界面的依从性', value: 721 },
                  { name: '接口的依从性', value: 721 }
                ]
              }
            ]
          },
          {
            name: '效率',
            children: [
              {
                name: '时间特性',
                children: [
                  { name: '响应时间满足度', value: 721 },
                  { name: '周转时间满足度', value: 721 },
                  { name: '数据处理速率满足度（变更）', value: 721 }
                ]
              },
              {
                name: '容量',
                children: [
                  { name: '数据吞吐容量满足度', value: 721 },
                  { name: '数据处理容量满足度', value: 721 }
                ]
              },
              {
                name: '资源利用性',
                children: [
                  { name: 'CPU占用率满足度', value: 721 },
                  { name: '内存占用率满足度', value: 721 },
                  { name: '外存时间负载满足度', value: 721 },
                  { name: '外存空间占用率满足度', value: 721 },
                  { name: '传输带宽负载满足度', value: 721 }
                ]
              }
            ]
          },
          {
            name: '可靠性',
            children: [
              {
                name: '成熟性',
                children: [
                  { name: '缺陷排除率满足度', value: 721 },
                  { name: '平均故障间隔时间满足度', value: 721 },
                  { name: '缺陷密度满足度', value: 721 },
                  { name: '验证覆盖率满足度', value: 721 }
                ]
              },
              {
                name: '可用性',
                children: [
                  { name: '典型缺陷重复发生次数（合并）', value: 721 },
                  { name: '抵御发生的误操作率', value: 721 },
                  { name: '冗余率', value: 721 }
                ]
              },
              {
                name: '容错性',
                children: [{ name: '功能的充分性', value: 721 }]
              },
              {
                name: '易恢复性',
                children: [
                  { name: '易复原性', value: 721 },
                  { name: '可重新启动性', value: 721 }
                ]
              }
            ]
          },
          {
            name: '信息安全性',
            children: [
              {
                name: '保密性',
                children: [
                  { name: '访问操作的可控制性', value: 721 },
                  { name: '数据加密的正确性', value: 721 },
                  { name: '数据加密的完整性', value: 721 }
                ]
              },
              {
                name: '完整性',
                children: [{ name: '数据的抗讹误性', value: 721 }]
              },
              {
                name: '抗抵赖性',
                children: [{ name: '操作的不可抵赖性（合并）', value: 721 }]
              },
              {
                name: '可核查性',
                children: [{ name: '日志保存符合性', value: 721 }]
              },
              {
                name: '真实性',
                children: [{ name: '鉴别方法满足度', value: 721 }]
              },
              {
                name: '依从性',
                children: [{ name: '标准的依从性', value: 721 }]
              }
            ]
          },
          {
            name: '易用性',
            children: [
              {
                name: '可辨识性',
                children: [
                  { name: '描述的完整性', value: 721 },
                  { name: '易理解的输入和输出', value: 721 }
                ]
              },
              {
                name: '易学性',
                children: [
                  { name: '用户文档和/或帮助机制的完整性', value: 721 },
                  { name: '帮助的易获得性', value: 721 }
                ]
              },
              {
                name: '易操作性',
                children: [
                  { name: '操作的一致性', value: 721 },
                  { name: '消息的明确性', value: 721 },
                  { name: '定制的可能性', value: 721 }
                ]
              },
              {
                name: '用户差错防止性',
                children: [
                  { name: '抵御误操作', value: 721 },
                  { name: '输入的有效性检查', value: 721 }
                ]
              },
              {
                name: '用户界面舒适性',
                children: [
                  { name: '用户界面外观的易用性（变更）', value: 721 }
                ]
              },
              {
                name: '易访问性',
                children: [{ name: '支持语种的数量', value: 721 }]
              }
            ]
          },
          {
            name: '兼容性',
            children: [
              {
                name: '互操作性',
                children: [
                  { name: '数据交换格式符合性', value: 721 },
                  { name: '数据交换协议符合性', value: 721 },
                  { name: '接口符合性', value: 721 }
                ]
              },
              {
                name: '版本相容性',
                children: [{ name: '多版本共存性', value: 721 }]
              }
            ]
          },
          {
            name: '维护性',
            children: [
              {
                name: '易分析性',
                children: [{ name: '诊断的准确性', value: 721 }]
              },

              {
                name: '易修改性',
                children: [
                  { name: '可配置性', value: 721 },
                  { name: '软件变更的可控性', value: 721 }
                ]
              },
              {
                name: '稳定性',
                children: [{ name: '变更成功的比率', value: 721 }]
              },
              {
                name: '易测试性',
                children: [
                  { name: '模拟功能的满足度（变更）', value: 721 },
                  { name: '备用的预检测功能满足度（变更）', value: 721 }
                ]
              },
              {
                name: '可重用性',
                children: [
                  { name: '模块重用率', value: 721 },
                  { name: '注释的规范性', value: 721 },
                  { name: '代码的规范性', value: 721 },
                  { name: '文档的规范性', value: 721 }
                ]
              }
            ]
          },
          {
            name: '可移植性',
            children: [
              {
                name: '适应性',
                children: [
                  { name: '硬件适应性', value: 721 },
                  { name: '操作系统适应性', value: 721 },
                  { name: '数据库适应性', value: 721 }
                ]
              },
              {
                name: '易替换性',
                children: [{ name: '功能内含性', value: 721 }]
              },
              {
                name: '易安装性',
                children: [
                  { name: '安装正确性', value: 721 },
                  { name: '安装难易性', value: 721 },
                  { name: '安装效率', value: 721 }
                ]
              }
            ]
          }
        ]
      }
    }
  },
  mounted() {
    this.drawTree()
  },
  methods: {
    handleDrawer() {
      console.log('打开抽屉了')
      this.drawer = true
    },
    onSubmit() {
      console.log('submit!')
    },
    drawTree() {
      const mychar = echarts.init(document.getElementById('tree'))
      mychar.on('click', this.clickFun)
      var option = {
        tooltip: {
          trigger: 'item',
          triggerOn: 'mousemove'
        },
        series: [
          {
            type: 'tree',
            id: 0,
            name: 'tree1',
            data: [this.data],

            top: '10%',
            left: '20%',
            bottom: '22%',
            right: '20%',

            symbolSize: 10, // 小圆圈

            edgeShape: 'polyline',
            edgeForkPosition: '20%',
            initialTreeDepth: 3, // 默认打开的深度

            lineStyle: {
              width: 2 // 线的宽度
            },

            label: {
              backgroundColor: '#fff',
              position: 'left',
              verticalAlign: 'middle',
              align: 'right'
            },

            leaves: {
              label: {
                position: 'right',
                verticalAlign: 'middle',
                align: 'left'
              }
            },

            expandAndCollapse: true,
            animationDuration: 550,
            animationDurationUpdate: 750
          }
        ]
      }
      mychar.setOption(option)
    },
    clickFun(param) {
      this.drawer = true
      console.log(param)
    }
  }
}
</script>

<style>
</style>
