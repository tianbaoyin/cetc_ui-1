<template>
  <div class="app-container">
    <el-tabs type="border-card" @tab-click="tabClick">
      <el-tab-pane>
        <span slot="label"><i class="el-icon-message" /> 未读消息</span>
        <div>
          <el-date-picker
            v-model="readDateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            align="left"
          />
          <el-button
            type="primary"
            @click="batchRead()"
          >标记为已读</el-button>
          <el-divider />
          <el-table
            v-loading="definitionLoading"
            :data="notices"
            border
            stripe
            style="width: 100%"
          >
            <el-table-column
              align="center"
              type="index"
              label="序号"
              width="80"
            />
            <el-table-column
              prop="title"
              label="消息标题"
              width="200"
              header-align="center"
            />
            <el-table-column
              prop="comment"
              label="消息内容"
              header-align="center"
            />
            <el-table-column
              label="发送时间"
              width="200"
              align="center"
            >
              <template slot-scope="scope">
                <span>{{ scope.row.createTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              label="操作"
              width="160"
            >
              <template slot-scope="{row}">
                <el-button type="success" size="small" @click="markAsRead(row)"><i class="el-icon-view" /> 标记为已读</el-button>
              </template>
            </el-table-column>
          </el-table>
          <pagination v-show="total>0" :total="total" :page.sync="queryEntity.pageNum" :limit.sync="queryEntity.pageSize" @pagination="handleFilter()" />

        </div>
      </el-tab-pane>
      <el-tab-pane>
        <span slot="label"><i class="el-icon-news" /> 已读消息</span>
        <div>
          <el-date-picker
            v-model="dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            align="left"
          />
          <el-button
            type="danger"
            @click="batchDelete()"
          >删除</el-button>
          <el-divider />
          <el-table
            :data="notices"
            border
            stripe
            style="width: 100%"
          >
            <el-table-column
              align="center"
              type="index"
              label="序号"
              width="100"
            />
            <el-table-column
              header-align="center"
              prop="title"
              label="消息标题"
              width="200"
            />
            <el-table-column
              header-align="center"
              prop="comment"
              label="消息内容"
            />
            <el-table-column
              align="center"
              width="200"
              label="发送时间"
            >
              <template slot-scope="scope">
                <span>{{ scope.row.createTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              label="操作"
              width="120"
            >
              <template slot-scope="scope">
                <el-button type="danger" size="small" @click="deleteNotice(scope.row)"><i class="el-icon-delete" /> 删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <pagination v-show="total>0" :total="total" :page.sync="queryEntity.pageNum" :limit.sync="queryEntity.pageSize" @pagination="handleFilter()" />
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import pagination from '@/components/Pagination'
import { findPageNotices, markAsRead, markAsReadByTime, deleteNotice, deleteByTime } from '@/api/notice'
export default {
  name: 'Notice',
  components: { pagination },
  data() {
    return {
      notices: [],
      isRead: 0,
      queryEntity: {
        pageNum: 1,
        pageSize: 10
      },
      total: 0,
      definitionLoading: false,
      readDateRange: [],
      dateRange: []

    }
  },
  computed: {
    ...mapGetters([
      'username' // 登录名
    ])
  },
  created() {
    this.handleFilter()
  },
  methods: {

    handleFilter() {
      this.definitionLoading = true
      findPageNotices(this.isRead, this.queryEntity).then(response => {
        this.notices = response.data.list
        this.total = response.data.total
        this.definitionLoading = false
      }).catch(() => {
        this.definitionLoading = false
        this.$message.error('数据加载失败')
      })
    },
    markAsRead(row) {
      markAsRead(row.id).then(response => {
        this.$message.success('标记为已读成功')
        this.handleFilter()
      }).catch(() => {
        this.handleFilter()
      })
    },
    tabClick(tab, event) {
      this.isRead = tab.index
      this.definitionLoading = true
      this.notices = []
      this.queryEntity = {
        pageNum: 1,
        pageSize: 10
      }
      findPageNotices(Number(tab.index), this.queryEntity).then(response => {
        this.notices = response.data.list
        this.total = response.data.total
        this.definitionLoading = false
      }).catch(() => {
        this.definitionLoading = false
        this.$message.error('数据加载失败')
      })
    },
    batchRead() {
      if (this.readDateRange.length < 2) {
        this.$message.error('请选择时间范围')
        return
      }
      markAsReadByTime(this.username, this.readDateRange).then(res => {
        console.log(this.readDateRange)
        this.handleFilter()
        this.$message.success('操作成功')
      }).catch(() => {
        this.$message.error('操作失败')
      })
    },
    deleteNotice(data) {
      deleteNotice(data.id).then(res => {
        this.handleFilter()
        this.$message.success('删除成功')
      }).catch(() => {
        this.$message.error('删除失败')
      })
    },
    batchDelete() {
      if (this.dateRange.length < 2) {
        this.$message.error('请选择时间范围')
        return
      }
      deleteByTime(this.username, this.dateRange).then(res => {
        this.handleFilter()
        this.$message.success('删除成功')
      }).catch(() => {
        this.$message.error('删除失败')
      })
    }
  }
}
</script>
