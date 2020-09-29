<template>
  <div class="app-container">
    <el-tabs type="border-card" @tab-click="handleClick">
      <el-tab-pane label="部署信息管理列表">
        <el-table
          v-loading="deploymentLoading"
          :data="deploymentlist"
          style="width:100%"
          border
          stripe
          highlight-current-row
        >
          <el-table-column
            type="index"
            width="80"
            align="center"
            label="序号"
          />
          <el-table-column
            prop="name"
            header-align="center"
            label="流程名称"
          />
          <el-table-column
            header-align="center"
            label="部署时间"
          >
            <template slot-scope="scope">
              {{ scope.row.deploymentTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            fixed="right"
            label="操作"
            width="120"
          >
            <template slot-scope="scope">
              <el-button
                v-waves
                size="mini"
                type="danger"
                icon="el-icon-delete"

                @click="toDelDeployment(scope.row)"
              >删除</el-button>

            </template>
          </el-table-column>
        </el-table>
        <pagination v-show="detotal>0" :total="detotal" :page.sync="delistQuery.pageNum" :limit.sync="delistQuery.pageSize" @pagination="getdeploymentList()" />
      </el-tab-pane>
      <el-tab-pane label="流程定义信息列表">
        <el-table
          v-loading="definitionLoading"
          :data="processDefinitionList"
          style="width:100%"
          border
          stripe
          highlight-current-row
        >
          <el-table-column
            prop="id"
            label="ID"
          />
          <el-table-column
            prop="name"
            label="名称"
          />
          <el-table-column
            prop="key"
            label="KEY"
          />
          <el-table-column
            prop="version"
            width="60"
            label="版本"
          />
          <el-table-column
            prop="resourceName"
            label="规则文件名称"
          />
          <el-table-column
            prop="diagramResourceName"
            label="规则图片名称"
          />
          <el-table-column
            prop="deploymentId"
            label="部署ID"
          />
          <el-table-column
            fixed="right"
            label="操作"
            width="200"
            align="center"
          >
            <template slot-scope="scope">
              <el-button
                v-waves
                type="success"
                size="mini"

                icon="el-icon-view"
                @click="showDiagram(scope.row)"
              > 查看流程定义图</el-button>
            </template>
          </el-table-column>
        </el-table>
        <pagination v-show="prtotal>0" :total="prtotal" :page.sync="prlistQuery.pageNum" :limit.sync="prlistQuery.pageSize" @pagination="getdeploymentList()" />
      </el-tab-pane>
    </el-tabs>
    <!-- 流程图片 -->
    <el-dialog
      title="流程定义图"
      :visible.sync="diagramviewflag"
      modal
      :close-on-click-modal="false"
    >
      <img :src="imageUrl">
    </el-dialog>
  </div>
</template>
<script>
import { deploymentList, processDefinitionList, delDeployment, viewDeploymentImage } from '@/api/activiti/workflow'
import pagination from '@/components/Pagination' // secondary package based on el-pagination
import waves from '@/directive/waves' // waves directive
export default {
  name: 'ProcessView',
  components: { pagination },
  directives: { waves },
  data() {
    return {
      detotal: 0,
      prtotal: 0,
      deploymentlist: null,
      processDefinitionList: null,
      deploymentLoading: true,
      definitionLoading: true,
      diagramviewflag: false,
      imageUrl: '',
      delistQuery: {
        pageNum: 1,
        pageSize: 10
      },
      prlistQuery: {
        pageNum: 1,
        pageSize: 10
      }
    }
  },
  created() {
    this.getdeploymentList()
  },

  methods: {
    getdeploymentList() {
      this.deploymentLoading = true
      deploymentList(this.delistQuery).then(response => {
        if (response.flag) {
          this.detotal = response.data.total // 设置页面总数
          this.deploymentlist = response.data.list
        } else {
          this.$message.console.error(response.message)
        }
        this.deploymentLoading = false
      }).catch(() => {
        this.deploymentLoading = false
      })
    },
    toDelDeployment(entity) {
      const h = this.$createElement
      this.$msgbox({
        title: '提示',
        message: h('p', [
          h('span', '确认要删除 '),
          h('i', { style: 'color: red' }, entity.name),
          h('span', ' ?此操作不可逆! ')
        ]),
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.delDeploymentByid(entity.id)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    delDeploymentByid(id) {
      delDeployment(id).then(response => {
        this.$message({
          message: '删除成功',
          type: 'success'
        })
        this.getdeploymentList()
      }).catch(() => {
        this.$message({
          message: '删除失败',
          type: 'warning'
        })
      })
    },
    getProcessDefinitionList() {
      this.definitionLoading = true
      processDefinitionList(this.prlistQuery).then(response => {
        if (response.flag) {
          this.prtotal = response.data.total // 设置页面总数
          this.processDefinitionList = response.data.list
        } else {
          this.$message.error('查询失败')
        }
        this.definitionLoading = false
      }).catch(() => {
        this.definitionLoading = false
      })
    },
    showDiagram(entity) {
      viewDeploymentImage(entity.id).then(response => {
        this.diagramviewflag = true
        this.imageUrl = response.data
      }).catch(() => {

      })
    },
    handleClick(tab, event) {
      switch (Number(tab.index)) {
        case 0:
          this.getdeploymentList()
          break
        case 1:
          this.getProcessDefinitionList()
          break
      }
    }
  }

}
</script>
