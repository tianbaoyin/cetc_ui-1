<template>
  <div style="height:800px">
    <div class="filter-container">
      <el-select
        v-model="searchEntity.docType"
        clearable
        style="width: 150px;"
        class="filter-item"
        size="small"
        placeholder="文档类型"
      >
        <el-option
          v-for="item in docTypeList"
          :key="item.id"
          :label="item.key"
          :value="item.value"
        />
      </el-select>
      <el-select
        v-model="searchEntity.company"
        clearable
        style="width: 150px;"
        class="filter-item"
        size="small"
        placeholder="被考核单位"
      >
        <el-option
          v-for="item in companyList"
          :key="item.id"
          :label="item.key"
          :value="item.value"
        />
      </el-select>
      <el-select
        v-model="searchEntity.sysConfItem"
        clearable
        style="width: 150px;"
        class="filter-item"
        size="small"
        placeholder="系统配置项名称"
      >
        <el-option
          v-for="item in sysConfItemList"
          :key="item.id"
          :label="item.key"
          :value="item.value"
        />
      </el-select>
      <el-input v-model="searchEntity.designer" style="width: 150px;" class="filter-item" size="small" placeholder="设计师" />
      <el-button type="primary" size="small" icon="el-icon-search" class="filter-item" @click="getPage()">搜索</el-button>
      <el-button type="primary" size="small" icon="el-icon-plus" class="filter-item" @click="add()">新增</el-button>
    </div>
    <el-drawer
      size="60%"
      :visible.sync="drawer"
      :with-header="true"
      :before-close="drawerClose"
    >
      <span slot="title" style="color:#696969;font-size:20px"><svg-icon icon-class="test" />    {{ title }}</span>

      <div>
        <documentCheckEdit :query="query" :optiontype="optionType" :drawercount="drawerCount" @closeDraw="closeDraw" />
      </div>
    </el-drawer>

    <el-table
      v-loading="loading"
      :data="documentList"
      border
      stripe
    >
      <el-table-column

        type="index"
        label="序号"
        width="80"
      />
      <el-table-column
        label="文档名称"
        prop="fileName"
        min-width="200"
      />
      <el-table-column
        label="文档类型"
        prop="docType"
        width="120"
      />
      <el-table-column
        label="被考核单位"
        prop="company"
        width="120"
      />
      <el-table-column
        label="问题总个数"
        width="120"
      >
        <template slot-scope="scope">
          <el-button type="text" @click="showAnnoList(scope.row)">{{ scope.row.matterCount }}
          </el-button></template>
      </el-table-column>
      <el-table-column
        label="系统/配置项名称"
        prop="sysConfItem"
        width="140"
      />
      <el-table-column
        label="文档页码"
        prop="pageSize"
        width="120"
      />

      <el-table-column
        label="版本"
        prop="version"
        width="80"
      />
      <el-table-column
        label="设计师"
        width="120"
        prop="designer"
      />
      <el-table-column

        width="180"
        label="更新时间"
      >
        <template slot-scope="scope">
          {{ scope.row.updateDate | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}
        </template>
      </el-table-column>
      <el-table-column
        label="操作"

        width="300"
        fixed="right"
      >
        <template slot-scope="scope">
          <el-button type="primary" size="small" icon="el-icon-edit" @click="updata(scope.row)">编辑</el-button>
          <el-button v-preventReClick type="danger" size="small" icon="el-icon-delete" @click="deleteOne(scope.row)">删除</el-button>
          <el-button type="success" size="small" icon="el-icon-delete" @click="handleImportAlm(scope.row)">导出</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="searchEntity.pageNum" :limit.sync="searchEntity.pageSize" @pagination="getPage()" />

    <el-dialog v-dialogDrag :close-on-click-modal="false" title="数据导出" :visible.sync="documentCheckToAlmDialog">
      <el-form ref="documentCheckToAlmform" :rules="rules" :model="documentCheckToAlmform">
        <el-form-item label="导出途径" prop="way" :label-width="formLabelWidth">
          <el-radio v-model="documentCheckToAlmform.way" label="alm">ALM</el-radio>
          <el-radio v-model="documentCheckToAlmform.way" label="excel">Excel</el-radio>
        </el-form-item>
        <el-form-item v-if="documentCheckToAlmform.way==='alm'" label="目标项目" prop="docCheckAlmProject" :label-width="formLabelWidth">
          <el-select v-model="documentCheckToAlmform.docCheckAlmProject" placeholder="请选择">
            <el-option
              v-for="item in docCheckAlmProjects"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="documentCheckToAlmDialog = false">取 消</el-button>
        <el-button v-preventReClick type="primary" @click="importToAlm()">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog
      v-dialogDrag
      title="文档问题"
      :visible.sync="dialogVisible"
      width="60%"
      :close-on-click-modal="false"
    >
      <el-table
        v-loading="annoLoading"
        :data="annoList"
        border
        stripe
      >

        <el-table-column
          align="center"
          type="index"
          label="序号"
          width="80"
        />
        <el-table-column
          align="center"
          prop="typeLable"
          width="120px"
          label="批注类型"
        />
        <el-table-column
          align="center"
          prop="author"
          width="120px"
          label="作者"
        />
        <el-table-column
          header-align="center"
          prop="text"
          label="批注内容"
        />
        <el-table-column
          align="center"
          width="120px"
          label="操作"
        >
          <template slot-scope="scope">
            <el-button size="mini" type="danger" icon="el-icon-delete" @click="delAnnotation(scope.row)">删除</el-button>
          </template>

        </el-table-column>
      </el-table>
      <pagination v-show="annTotal>0" :total="annTotal" :page.sync="searchAnnoEntity.pageNum" :limit.sync="searchAnnoEntity.pageSize" @pagination="getAnnoList()" />
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>
<script>
import { findAlmProjects } from '@/api/hpalm/alm.js'
import { docCheckToAlm } from '@/api/hpalm/docCheck.js'
import permission from '@/directive/permission/index.js' // 权限判断指令
import { queryDicValuesByDicType } from '@/api/dicValue.js'
import { getPageList, delDocumentCheck, getAnnoList, delAnno } from '@/api/project/documentCheck.js'
import pagination from '@/components/Pagination'
import documentCheckEdit from '@/views/qc/project/project/treenode/nodesecond/documentCheckEdit.vue'
export default {
  name: 'DocumentCheck',
  directives: { permission },
  components: {
    pagination,
    documentCheckEdit
  },
  props: {
    node: {
      type: Object,
      required: true
    },
    tab2: {
      type: String,
      requird: true,
      default: ''
    }

  },
  data() {
    return {
      docCheckAlmDomain: '产品软件文档审查项目',
      docCheckAlmProjects: [],

      drawerCount: 0,
      drawer: false,
      optionType: '',
      query: {},
      annoTypeMap: {},
      dialogVisible: false,
      loading: true,
      formLabelWidth: '120px',
      annoLoading: false,
      entity: {},
      documentList: [],
      annoList: [],
      total: 0,
      annTotal: 0,
      title: '文档审查新增',
      documentCheckToAlmDialog: false,
      documentCheckToAlmform: {
        docCheckId: null,
        way: '',
        docCheckAlmProject: ''
      },
      rules: {
        way: [
          { required: true, message: '请选择导出方式', trigger: 'change' }
        ],
        docCheckAlmProject: [
          { required: true, message: '请选择目标项目', trigger: 'change' }
        ]
      },
      searchAnnoEntity: {
        pageNum: 1,
        pageSize: 10,
        parentId: '',
        annoLevel: 'c'

      },
      searchEntity: {
        pageNum: 1,
        pageSize: 10,
        parentId: this.node.id,
        checkLevel: 'c',
        docType: '',
        sysConfItem: '',
        company: ''

      },
      docTypeList: [{ id: '', key: '', value: '' }],
      sysConfItemList: [{ id: '', key: '', value: '' }],
      companyList: [{ id: '', key: '', value: '' }]
    }
  },
  watch: {
    node() {
      if (this.tab2 === 'documentCheck') {
        this.getPage()
      }
    },
    tab2(val) {
      if (val === 'documentCheck') {
        this.getPage()
      }
    }

  },
  created() {
    // 系统配置项名称
    queryDicValuesByDicType('sys_conf_item').then(res => {
      this.sysConfItemList = res.data
    }).catch(() => {
      this.$message.error('系统配置项名称获取失败')
    })
    // 文档类型
    queryDicValuesByDicType('document_type').then(res => {
      this.docTypeList = res.data
    }).catch(() => {
      this.$message.error('文档类型获取失败')
    })
    // 被测试单位
    queryDicValuesByDicType('company').then(res => {
      this.companyList = res.data
    }).catch(() => {
      this.$message.error('被测试单位获取失败')
    })
    this.getPage()
    this.getAnnoTypeList()
    this.findAlmDocProjects()
  },
  methods: {
    findAlmDocProjects() {
      findAlmProjects(this.docCheckAlmDomain).then(response => {
        this.docCheckAlmProjects = response.data
      }).catch(() => {

      })
    },

    closeDraw() {
      this.drawer = false
      this.getPage()
    },
    drawerClose(done) {
      this.$confirm('确认关闭？').then(() => {
        this.getPage()
        done()
      }).catch(() => {
        this.$message.info('取消关闭')
      })
    },
    getAnnoTypeList() {
      queryDicValuesByDicType('annotation_type').then(res => {
        const map = new Map()
        res.data.forEach(function(d, i) {
          map.set(d.value, d.key)
        })
        this.annoTypeMap = map
      }).catch(() => {
        this.$message.error('批注类型获取失败')
      })
    },
    handleImportAlm(row) {
      this.documentCheckToAlmform = {
        docCheckId: null,
        way: '',
        docCheckAlmDomain: '产品软件文档审查项目',
        docCheckAlmProject: ''
      }
      this.documentCheckToAlmform.docCheckId = row.id
      this.documentCheckToAlmDialog = true
    },

    importToAlm() {
      this.$refs.documentCheckToAlmform.validate((valid) => {
        if (valid) {
          if (this.documentCheckToAlmform.way === 'alm') {
            docCheckToAlm(this.documentCheckToAlmform).then(response => {
              this.documentCheckToAlmDialog = false
              this.$message.success('导入Alm成功')
            }).catch(() => {

            })
          } else {
            this.$message.success('导出Excel成功')
          }
        }
      })
    },

    showAnnoList(data) {
      this.annoLoading = true
      this.dialogVisible = true
      this.searchAnnoEntity.parentId = data.id
      this.getAnnoList()
    },
    getAnnoList() {
      getAnnoList(this.searchAnnoEntity).then(res => {
        this.annTotal = res.data.total
        this.annoLoading = false
        const annoTypeMap = this.annoTypeMap
        const annoList = res.data.list
        annoList.forEach(function(d, i) {
          d.typeLable = annoTypeMap.get(d.type) ? annoTypeMap.get(d.type) : '未知类型:' + d.type
        })
        this.annoList = annoList
      }).catch(() => {
        this.$message.error('查询失败！')
      })
    },
    delAnnotation(data) {
      delAnno(data).then(res => {
        this.$message.success('删除成功')
        this.getAnnoList()
        this.getPage()
      }).catch(() => {
        this.$message.error('删除失败！')
      })
    },
    add() {
      this.optionType = 'add'
      this.query = this.node
      this.title = '文档审查新增'
      this.drawer = true
      this.drawerCount = this.drawerCount + 1
    },
    updata(data) {
      this.optionType = 'update'
      this.query = data
      this.title = '文档审查编辑'
      this.drawer = true
      this.drawerCount = this.drawerCount + 1
    },
    getPage() {
      this.loading = true
      this.searchEntity.parentId = this.node.id
      getPageList(this.searchEntity).then(res => {
        this.loading = false
        this.total = res.data.total
        this.documentList = res.data.list
      }).catch(() => {
        this.loading = false
        this.$message.error('查询失败，请尝试刷新')
      })
    },
    deleteOne(data) {
      this.$confirm('删除该文档检查, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteSelect(data)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    deleteSelect(data) {
      delDocumentCheck(data).then(res => {
        this.$message.success('删除成功')
        this.getPage()
      }).catch(() => {
        this.$message.error('删除失败')
      })
    }

  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
    .el-drawer{

    overflow: scroll
    }

</style>
