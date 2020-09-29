<template>
  <div class="app-container">
    <div style="padding: 10px ;margin-right:50px">
      <div v-show="upload">
        <el-select
          v-model="secretLevel"
          el-select
          placeholder="请确定被审查文档的密级"
          style="width:200px;float:left;margin;right:10px"
          size="small"
          clearable
          @change="uploadFlag"
        >
          <el-option
            v-for="item in secretLevelArray"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <el-upload
          :action="url"
          :multiple="false"
          accept=".docx"
          :before-upload="beforeUpload"
          :on-success="onSuccess"
          :limit="1"
          :headers="headers"
          :disabled="disableUpload"
          :file-list="fileList"
          :on-remove="onRemove"
          :on-exceed="onExceed"
          :on-error="onError"
        >
          <el-button size="small" type="primary" @click="selectFile()">选择.docx文件</el-button>
        </el-upload>
      </div>

      <div style="margin-top:20px">

        <el-row>
          <el-col :span="24">
            <el-tabs v-model="activeName" type="border-card">
              <el-tab-pane label="审查属性" name="first" style="height:600px">
                <el-form
                  ref="form"
                  :rules="rules"
                  :model="document"
                  label-width="150px"
                >
                  <el-row>
                    <el-col :span="24">
                      <el-form-item
                        label="文档名称"
                      >
                        <el-input v-model="document.fileName" />
                      </el-form-item>
                    </el-col>
                  </el-row>

                  <el-row>

                    <el-col :span="12">
                      <el-form-item
                        prop="checker"
                        label="审查者"
                      >
                        <el-input v-model="document.checker" />
                      </el-form-item>
                    </el-col>

                    <el-col :span="12">
                      <el-form-item
                        prop="company"
                        label="被考核单位"
                      >

                        <el-select
                          v-model="document.company"
                          placeholder="请选择"
                          style="width:100%"
                        >
                          <el-option
                            v-for="item in companyList"
                            :key="item.id"
                            :label="item.key"
                            :value="item.value"
                          />
                        </el-select>
                      </el-form-item>
                    </el-col>
                  </el-row>

                  <el-row>
                    <el-col :span="12">
                      <el-form-item

                        label="问题个数"
                      >
                        <el-input-number
                          v-model="document.matterCount"
                          :max="maxPage"
                          :min="minPage"
                          style="width:100%"
                          disabled
                        />

                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item
                        label="页数"
                      >
                        <el-input-number
                          v-model="document.pageSize"
                          :max="maxPage"
                          :min="minPage"
                          style="width:100%"
                        />
                      </el-form-item>
                    </el-col>

                  </el-row>

                  <el-row>
                    <el-col :span="12">
                      <el-form-item
                        prop="designer"
                        label="设计师 "
                      >
                        <el-input v-model="document.designer" />
                      </el-form-item>
                    </el-col>

                    <el-col :span="12">
                      <el-form-item
                        prop="sysConfItem"
                        label="系统/配置项名称"
                      >
                        <el-select
                          v-model="document.sysConfItem"
                          placeholder="请选择"
                          style="width:100%"
                        >
                          <el-option
                            v-for="item in sysConfItemList"
                            :key="item.id"
                            :label="item.key"
                            :value="item.value"
                          />
                        </el-select>
                      </el-form-item>
                    </el-col>

                  </el-row>
                  <el-row>
                    <el-col :span="12">
                      <el-form-item
                        prop="docType"
                        label="文档类型"
                      >
                        <el-select
                          v-model="document.docType"
                          placeholder="请选择"
                          style="width:100%"
                        >
                          <el-option
                            v-for="item in documentTypeList"
                            :key="item.id"
                            :label="item.key"
                            :value="item.value"
                          />
                        </el-select>
                      </el-form-item>
                    </el-col>

                    <el-col :span="12">
                      <el-form-item
                        prop="version"
                        label="检测于版本"
                      >
                        <el-input v-model="document.version" />
                      </el-form-item>
                    </el-col>

                  </el-row>
                  <el-row>
                    <el-col :span="12">
                      <el-form-item
                        prop="checkGrade"
                        label="审查阶段"
                      >
                        <el-input v-model="document.checkGrade" disabled />
                      </el-form-item>
                    </el-col>

                  </el-row>

                  <el-form-item
                    label="备注"
                  >
                    <el-input
                      v-model="document.remark"
                      style="width:100%"
                      type="textarea"
                      :rows="4"
                      maxlength="200"
                      show-word-limit
                      placeholder="请输入内容"
                    />
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" style="float:right" :disabled="disableOption" :loading="buttonLoading" @click="save()">提交</el-button>
                  </el-form-item>

                </el-form></el-tab-pane>
              <el-tab-pane style="height:600px" name="second" label="批注空间">
                <div v-if="anlysisprogress" style="margin: 200px 400px">
                  <el-progress type="circle" :percentage="percentage" />
                </div>
                <div v-if="!anlysisprogress">
                  <el-table
                    :data="annotationList"
                    border
                    stripe
                    height="500px"
                  >
                    <el-table-column

                      type="index"
                      label="序号"
                      width="80"
                    />
                    <el-table-column
                      label="批注类型"

                      prop="typeLable"
                    />
                    <el-table-column
                      prop="author"

                      label="作者"
                    />
                    <el-table-column
                      prop="text"
                      label="批注内容"
                    />
                    <el-table-column

                      width="120px"
                      label="操作"
                    >
                      <template slot-scope="scope">
                        <el-button size="mini" type="danger" icon="el-icon-delete" @click="delAnnotation(scope.row)">删除</el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                  <pagination v-show="total>0" :total="total" :page.sync="pageEntity.pageNum" :limit.sync="pageEntity.pageSize" @pagination="getAnnoList()" /></div></el-tab-pane>
              <div /></el-tabs>

          </el-col>
        </el-row>
      </div>

    </div>
  </div>
</template>
<script>
import { getToken } from '@/utils/auth'
import { mapGetters } from 'vuex'
import pagination from '@/components/Pagination'
import { queryDicValuesByDicType } from '@/api/dicValue.js'
import { addDocumentCheck, updateDocumentCheck, analysisFile, analysisStatus, getAnnoByUuid, delAnno } from '@/api/project/documentCheck.js'
export default {
  name: 'DocumentCheckEdit',
  components: {
    pagination
  },
  props: {
    optiontype: {
      type: String,
      required: true,
      default: ''
    },
    query: {
      type: Object,
      require: true,
      default: Object
    },
    drawercount: {
      type: Number,
      required: true,
      default: 0
    }
  },
  data() {
    return {
      url: 'http://127.0.0.1:82/api-project/documentcheck/uploadFile',
      headers: {
        // 'Access-Control-Allow-Origin': '*',
        Authorization: 'Bearer' + getToken()
      },
      tabPosition: 'left',
      maxPage: 1000000,
      minPage: 1,
      percentage: 0,
      anlysisprogress: true,
      buttonLoading: false,
      timer: Object,
      disableOption: true,

      title: '编辑',
      fileList: [],
      annotationList: [],
      annoTypeMap: new Map(),
      upload: true,
      document: {
        checkLevel: 'p',
        fileName: '',
        checker: '',
        checkGrade: 'SQA审查',
        code: '',
        matterCount: ''
      },
      documentTypeList: [],
      sysConfItemList: [],
      companyList: [],
      total: 0,
      pageEntity: {
        pageNum: 1,
        pageSize: 10,
        uuid: ''
      },
      secretLevel: '',
      secretLevelArray: [
        {
          value: 2,
          label: '非密'
        }
      ],
      disableUpload: true,
      activeName: 'first',
      rules: {
        version: [
          { required: true, message: '请输入版本', trigger: 'blur' },
          { max: 15, message: '长度15 个字符内', trigger: 'blur' }
        ],
        designer: [
          { required: true, message: '请输入设计师', trigger: 'blur' },
          { max: 15, message: '长度在 15 个字符内', trigger: 'blur' }
        ],
        checker: [
          { required: true, message: '请输入检查者', trigger: 'blur' },
          { max: 15, message: '长度在 15 个字符内', trigger: 'blur' }],
        docType: [{ required: true, message: '请选择文档类型', trigger: 'change' }],
        company: [{ required: true, message: '请选择被考核单位', trigger: 'change' }],
        checkGrade: [{ required: true, message: '请选择审查阶段', trigger: 'change' }],
        sysConfItem: [{ required: true, message: '请选择系统/配置项名称', trigger: 'change' }]
      }

    }
  },

  computed: {
    ...mapGetters([
      'name'// 用户名
    ])
    // this.headers.Authorization = 'Bearer' + getToken()
  },
  watch: {
    drawercount() {
      this.initPage()
    }
  },

  beforeDestroy: function() {
    // 页面离开时清除定时器
    clearInterval(this.timer)
  },
  created() {
    this.getDocumentType()
    this.getSysConfItem()
    this.getCompany()
    this.document.checker = this.name
    this.initPage()
  },
  methods: {
    selectFile() {
      if (this.disableUpload) {
        this.$notify({
          title: '提示',
          message: '请先选择文件的密级',
          type: 'warning'
        })
      }
    },
    initPage() {
      this.document = {
        checkLevel: 'p',
        fileName: '',
        checker: this.name,
        checkGrade: 'SQA审查',
        code: ''

      }
      this.secretLevel = ''
      this.activeName = 'first'
      this.anlysisprogress = true
      this.disableUpload = true
      this.annotationList = []
      if (this.$refs.form) {
        this.$refs.form.resetFields()
      }
      if (this.optiontype === 'add') {
        this.fileList = []
        this.disableOption = true // 保存按钮不可用
        this.document.parentId = this.query.id
        this.document.code = this.query.name
        this.title = '文档审查-令号(' + this.query.name + ')-新增'
        this.upload = true
      } else if (this.optiontype === 'update') {
        this.title = '文档审查-令号(' + this.query.code + ')-编辑'
        this.disableOption = false // 保存按钮可用
        this.upload = false // 隐藏上传组件
        this.anlysisprogress = false
        this.document = this.query
        this.pageEntity.uuid = this.query.annoFlag
        this.getAnnoTypeList() // 获取文档问题类型

        this.getAnnoList()
      }
    },
    uploadFlag() {
      if (this.secretLevel === 2) {
        this.disableUpload = false
      } else {
        this.disableUpload = true
      }
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
    // 删除备注
    delAnnotation(data) {
      this.$confirm('确认删除该备注, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.delAnno(data)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    delAnno(data) {
      delAnno(data).then(res => {
        this.$message.success('删除成功')
        // 更新列表
        this.getAnnoList()
      }).catch(() => {
        this.$message.error('删除失败')
      })
    },
    // 查询文档类型
    getDocumentType() {
      queryDicValuesByDicType('document_type').then(res => {
        this.documentTypeList = res.data
      }).catch()
    },
    // 系统配置项名称
    getSysConfItem() {
      queryDicValuesByDicType('sys_conf_item').then(res => {
        this.sysConfItemList = res.data
      }).catch()
    },
    // 查询单位
    getCompany() {
      queryDicValuesByDicType('company').then(res => {
        this.companyList = res.data
      }).catch()
    },
    //* *********************文档上传方法*************************************** */

    beforeUpload(file) {
      const fileType = file.name.substring(file.name.lastIndexOf('.') + 1)
      if (fileType !== 'docx') {
        this.$message.error('请选择.docx文件')
        return false
      }
    },
    onRemove(file, fileList) {
      clearInterval(this.timer)
      this.disableOption = true // 设置保存按钮不可用
      this.pageEntity.uuid = '' // 设置UUID为空
    },
    onSuccess(response, file, fileList) {
      if (response.flag) {
        this.document.fileName = file.name // 设置文档名称
        this.getAnnoTypeList() // 获取文档问题类型
        // 分析文档
        const map = { filePath: response.data }
        this.analysisDocument(map)
      } else {
        this.$message.error('文件上传失败')
      }
    },
    onExceed(files, fileList) {
      this.$message.warning('重新选择文件前请先删除已选择文件！')
    },
    onError() {
      this.$message.error('文件上传失败')
    },
    //* *********************文档上传方法结束*************************************** */
    analysisDocument(data) {
      analysisFile(data).then(res => {
        // 设置uuid
        this.pageEntity.uuid = res.data
        this.pageEntity.pageNum = 1
        this.pageEntity.pageSize = 10
        if (res.flag) {
          this.activeName = 'second'
          this.timer = setInterval(() => {
            this.getAnalysisStatus()
          }, 1000)
        }
      }).catch(() => {
        this.$message.error('解析失败！')
      })
    },
    // 获取分析状态
    getAnalysisStatus() {
      this.anlysisprogress = true

      analysisStatus(this.pageEntity.uuid).then(res => {
        // 模拟进度条进度
        if (this.percentage >= 0 && this.percentage < 10) {
          this.percentage = this.percentage + 10
        } else if (this.percentage >= 10 && this.percentage < 50) {
          this.percentage = this.percentage + 5
        } else if (this.percentage >= 50 && this.percentage < 100) {
          this.percentage = this.percentage + 1
        } else {
          this.percentage = 60
        }
        if (res.flag) {
          // 保存按钮可用
          if (this.document.parentId) {
            this.disableOption = false
          }
          // 清空定时器
          clearInterval(this.timer)
          // 进度条归零
          this.percentage = 0
          if (res.code === 20001) {
            this.$message.error('分析失败')
          } else {
            // 获取分析结果
            this.getAnnoList()
            // 设置文档页数
            this.document.pageSize = res.data
          }
        }
      }).catch(() => {
        clearInterval(this.timer)
        this.$message.error('分析失败')
      })
    },
    // 获取分析结果
    getAnnoList() {
      this.anlysisprogress = false
      getAnnoByUuid(this.pageEntity).then(res => {
        this.total = res.data.total
        this.document.matterCount = this.total
        const annotationList = res.data.list
        const annoTypeMap = this.annoTypeMap
        annotationList.forEach(function(d, i) {
          d.typeLable = annoTypeMap.get(d.type) ? annoTypeMap.get(d.type) : '未知类型:' + d.type
        })

        this.annotationList = annotationList
      }).catch(() => {
        this.$message.error('获取文档分析结果失败')
      })
    },
    save() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$confirm('确认提交?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.submitSave()
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消提交'
            })
          })
        }
      })
    },
    submitSave() {
      this.buttonLoading = true
      if (this.document.id) {
        updateDocumentCheck(this.document).then(res => {
          this.$message.success('更新成功')
          this.buttonLoading = false
          this.$emit('closeDraw')
        }).catch(() => {
          this.buttonLoading = false
          this.$message.error('更新失败')
        })
      } else {
        const map = {
          documentCheck: this.document,
          uuid: this.pageEntity.uuid
        }
        addDocumentCheck(map).then(res => {
          this.buttonLoading = false
          // this.$refs.form.resetFields()
          this.$emit('closeDraw')
          this.$message.success('添加成功')
        }).catch(() => {
          this.buttonLoading = false
          this.$message.error('添加失败')
        })
      }
    }

  }
}
</script>
