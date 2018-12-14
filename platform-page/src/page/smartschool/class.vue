<template>
  <el-container>
    <el-container>
      <el-header height="120px">
        <el-form :model="searchForm" ref="search" label-width="50px" label-suffix=":" class="search-form">
          <el-row>
            <el-col :span="12">
              <el-form-item label="名称">
                <el-input size="small" v-model="searchForm.name"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="编码">
                <el-input size="small"  v-model="searchForm.code"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24" class="search-button-col">
              <el-form-item>
                <el-button size="small" @click="handleSearch">查询</el-button>
                <el-button size="small" @click="handleReset">重置</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-header>
      <el-main>
        <data-grid
          ref="datagrid"
          url="/class/list"
          auth v-bind="$attrs"
          :postParams="postParams"
          :buttons="buttons"
          :actions="actions"
          @addBtnClick="add"
          @removeBtnClick="remove"
          @importBtnBtnClick="importBtn"
          @exportBtnBtnClick="exportBtn"
          @editActionClick="edit"
          @removeActionClick="({row})=>remove({rows:[row]})"
        >
          <el-table-column label="名称" prop="name" show-overflow-tooltip></el-table-column>
          <el-table-column label="编码" prop="code" show-overflow-tooltip></el-table-column>
          <el-table-column label="所属专业" prop="subjectName" show-overflow-tooltip></el-table-column>
          <el-table-column label="入学年份" prop="year" show-overflow-tooltip></el-table-column>
          <el-table-column label="所属届数" prop="period" show-overflow-tooltip></el-table-column>
          <el-table-column label="班级号" prop="classNo" show-overflow-tooltip></el-table-column>
          <el-table-column label="班主任" prop="headTeacher" show-overflow-tooltip></el-table-column>
          <el-table-column label="添加时间" prop="createTime" :formatter="createTimeFmt" show-overflow-tooltip></el-table-column>
        </data-grid>
      </el-main>
    </el-container>
    <el-dialog :title="dialogIsEdit?'编辑':'新增'"
               :visible.sync="dialogVisible"
               width="690px"
               :close-on-click-modal="false"
               @close="closeDialog">
      <el-form ref="form" class="form-layout" :model="dialogForm" label-width="100px" :inline="true" :label-position="labelPosition" style="text-align:left" label-suffix=":" :rules="rules">
        <el-form-item label="入学年份" prop="year">
          <el-select v-model="dialogForm.year" @change="generateClassName" placeholder="请选择" filterable size="small" style="width:200px">
            <el-option v-for="item in getYearData()" :key="item" :label="item" :value="item" >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属届数" prop="period">
          <el-select v-model="dialogForm.period" placeholder="请选择" filterable size="small" style="width:200px">
            <el-option v-for="item in getPeriodData()" :key="item" :label="item" :value="item" >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属专业" prop="subjectId" >
          <el-select v-model="dialogForm.subjectId" @change="changeSubjectValue" placeholder="请选择" size="small" style="width:200px">
            <el-option
              v-for="item in subjectData"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="班级号" prop="classNo" class="form-item-layout">
          <el-input-number v-model="dialogForm.classNo" @change="generateClassName" :min="1" :max="100" size="small" style="width:200px"></el-input-number>
        </el-form-item>
        <el-form-item  label="名称"  prop="name" class="form-item-layout">
          <el-input v-model="dialogForm.name" size="small"></el-input>
        </el-form-item>
        <el-form-item label="编码" prop="code" class="form-item-layout">
          <el-input v-model="dialogForm.code" size="small" :disabled="dialogIsEdit"></el-input>
        </el-form-item>
        <el-form-item label="班主任" prop="headTeacher" class="form-item-layout">
          <el-input v-model="dialogForm.headTeacher" size="small"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
          <el-button @click="closeDialog" size="small" >取消</el-button>
          <el-button @click="okDialog" type="primary" size="small">确认</el-button>
      </span>
    </el-dialog>
    <el-dialog title="导入"
               :visible.sync="importDialogVisible"
               width="490px"
               :close-on-click-modal="false" v-if="importDialogVisible"
               @close="closeImportDialog">
      <div style="width: 75%;margin: 0 auto;">
        <div style="height: 70px;border-bottom: 1px solid #dcdfe6;margin-bottom: 20px">
          <div style="float: left;">
            <el-upload multiple :limit="1" :file-list="attachFileList" :http-request="attachHttpRequest" list-type="text" :on-exceed="onExceed" :before-upload="beforeUpload">
              <el-button size="small" type="primary">上传</el-button>
            </el-upload>
          </div>
          <div style="float: right;">
            <el-button @click="downloadTemplate" type="primary" plain size="small">下载模版</el-button>
          </div>
        </div>
        <div>
          <el-form ref="attchmentForm" class="form-layout" :model="attachmentForm" label-width="105px" :inline="true" :label-position="labelPosition" style="text-align:left" label-suffix=":" :rules="attchmentRules">
            <el-form-item label="sheet页名称" prop="name" >
              <el-select v-model="attachmentForm.name" placeholder="请选择" size="small" style="width:222px">
                <el-option
                  v-for="item in sheetsData"
                  :key="item"
                  :label="item"
                  :value="item">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="起始行" prop="startLine" class="form-item-layout">
              <el-input-number v-model="attachmentForm.startLine" :min="2" :max="10000" size="small" style="width:222px"></el-input-number>
            </el-form-item>
            <el-form-item  label="起始列"  prop="startClu" class="form-item-layout">
              <el-input v-model="attachmentForm.startClu" size="small" style="width:222px"></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" style="margin-left:200px">
            <el-button @click="coverUpload" type="danger" size="small">覆盖</el-button>
            <el-button @click="addUpload" type="primary" size="small">追加</el-button>
          </span>
        </div>
      </div>
    </el-dialog>
  </el-container>

</template>
<script>
import moment from 'moment'
import OrgTree from '../../components/sysconfig/OrgTree'
import * as classApi from '../../api/smartschool/class'
export default {
  inheritAttrs: false,
  components: {
    OrgTree
  },
  data () {
    return {
      searchForm: {
        name: '',
        code: ''
      },
      buttons: [
        {id: 'add', text: '新增'},
        {id: 'remove', text: '删除'},
        {id: 'importBtn', text: '导入'},
        {id: 'exportBtn', text: '导出'}
      ],
      actions: [
        {id: 'edit', text: '编辑'},
        {id: 'remove', text: '删除'}
      ],
      // 表格查询参数
      postParams: { deptId: '-1' },
      dialogIsEdit: false,
      dialogVisible: false,
      importDialogVisible: false,
      dialogForm: {
        id: '',
        name: '',
        code: '',
        subjectId: '',
        year: '',
        period: '',
        classNo: '',
        headTeacher: ''
      },
      subjectData: [],
      subjectName: '',
      attachmentForm: {
        uuid: '',
        merge: '',
        name: '',
        addOrCover: '',
        startLine: '',
        startClu: ''
      },
      sheetsData: [],
      attachFileList: [],
      rules: {
        name: [
          { required: true, message: '请输入班级名称', trigger: 'blur' },
          { min: 2, message: '长度不能小于2个字符', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              if (
                /^[A-Za-z\d\u4e00-\u9fa5]+[\u4e00-\u9fa5\w\d_$.]*$/.test(value)
              ) {
                callback()
              } else {
                callback(new Error('名称不能包含特殊字符'))
              }
            },
            trigger: 'blur'
          }
        ],
        code: [
          { required: true, message: '请输入编码', trigger: 'blur' },
          { min: 2, message: '长度不能小于2个字符', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              if (/^[A-Za-z\d]+[\w\d_]*$/.test(value)) {
                callback()
              } else {
                callback(new Error('编码不能包含特殊字符'))
              }
            },
            trigger: 'blur'
          }
        ],
        classNo: [
          {required: true, message: '请输入班级号', trigger: 'change'}
        ],
        subjectId: [
          { required: true, message: '请输入所属专业', trigger: 'blur' }
        ],
        year: [
          { required: true, message: '请输入入学年份', trigger: 'blur' }
        ]
      },
      attchmentRules: {
        name: [{ required: true, message: '请选择sheet页名称', trigger: 'change' }],
        startLine: [{ required: true, message: '请输入起始行', trigger: 'change' }],
        startClu: [
          { required: true, message: '请输入起始列', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              if (/^[A-Z]*$/.test(value)) {
                callback()
              } else {
                callback(new Error('起始列只能输入大写字母，如"A / AB"'))
              }
            },
            trigger: 'blur'
          }
        ]
      },

      labelPosition: 'right'
    }
  },
  computed: {},
  watch: {},
  methods: {
    getYearData: function () {
      const year = new Date().getFullYear()
      let years = []
      for (var i = 0; i < year - 1977; i++) {
        years.push(year - i)
      }
      return years
    },
    getPeriodData: function () {
      const year = new Date().getFullYear()
      let years = []
      for (var i = 0; i < year - 1977; i++) {
        years.push(year - i + 5)
      }
      return years
    },
    changeSubjectValue (val) {
      let obj = {}
      obj = this.subjectData.find((item) => {
        return item.id === val
      })
      this.subjectName = obj.name

      this.dialogForm.name = this.subjectName + this.dialogForm.year + (this.subjectName === '' ? '' : (this.dialogForm.classNo < '10' ? '0' + this.dialogForm.classNo : this.dialogForm.classNo))
    },
    generateClassName () {
      this.dialogForm.name = this.subjectName + this.dialogForm.year + (this.subjectName === '' ? '' : (this.dialogForm.classNo < '10' ? '0' + this.dialogForm.classNo : this.dialogForm.classNo))
    },
    add () {
      this.dialogVisible = true
      this.dialogIsEdit = false
    },
    edit ({ row }) {
      Object.keys(this.dialogForm).forEach(key => {
        if (key === 'year' || key === 'period') {
          this.dialogForm[key] = moment(row[key]).format('YYYY')
        } else {
          this.dialogForm[key] = row[key]
        }
      })

      // this.changeSubjectValue(this.dialogForm.subjectId) // 给subjectName赋值

      this.dialogVisible = true
      this.dialogIsEdit = true
    },
    remove ({ rows }) {
      if (rows.length === 0) {
        this.$message({
          type: 'warning',
          message: '请至少选择一条数据删除'
        })
      } else if (rows.length > 0) {
        this.$confirm('确认删除？', '提示', {
          type: 'warning'
        }).then(() => {
          var ids = []
          for (var i = 0; i < rows.length; i++) {
            ids.push(rows[i].id)
          }
          classApi
            .remove(ids)
            .then(() => {
              this.$refs.datagrid.reload()
            })
            .catch((error) => {
              this.$message({
                type: 'error',
                message: error.message
              })
            })
        })
      }
    },
    closeDialog () {
      this.dialogVisible = false
      Object.keys(this.dialogForm).forEach(key => {
        this.dialogForm[key] = ''
      })
      this.subjectName = ''
      this.$refs.form.clearValidate(() => {
        if (this.$refs.form !== undefined) {
          this.$refs.form.clearValidate()
        }
      })
    },
    okDialog () {
      this.$refs.form.validate(isSuccess => {
        if (isSuccess) {
          this._saveClass()
        }
      })
    },
    _saveClass () {
      classApi[this.dialogIsEdit ? 'edit' : 'save'](this.dialogForm)
        .then(node => {
          this.closeDialog()
          this.$refs.datagrid.reload()
        })
        .catch((error) => {
          this.$message({
            type: 'error',
            message: error.message
          })
        })
    },
    createTimeFmt (row, column, cellValue, index) {
      return moment(cellValue).format('YYYY-MM-DD')
    },

    handleSearch () {
      Object.assign(this.postParams, this.searchForm)
      this.$refs.datagrid.reload(true)
    },

    handleReset () {
      this.searchForm.name = ''
      this.searchForm.code = ''
      delete this.postParams.name
      delete this.postParams.code
      this.$refs.datagrid.reload(true)
    },

    // 打开导入窗口
    importBtn () {
      this.importDialogVisible = true
    },
    // 下载导入模版
    downloadTemplate () {
      classApi
        .downloadTemplate()
        .then(data => {
          let url = window.URL.createObjectURL(new Blob([data]))
          let link = document.createElement('a')
          link.style.display = 'none'
          link.href = url
          link.setAttribute('download', '班级信息导入模板.xlsx')

          document.body.appendChild(link)
          link.click()
        })
    },
    // 导出班级信息
    exportBtn () {
      classApi
        .downloadClassInfo()
        .then(data => {
          let url = window.URL.createObjectURL(new Blob([data]))
          let link = document.createElement('a')
          link.style.display = 'none'
          link.href = url
          link.setAttribute('download', '班级信息.xlsx')

          document.body.appendChild(link)
          link.click()
        })
    },
    // 导入文件
    attachHttpRequest (obj) {
      return classApi.upload(obj.file).then(data => {
        this.sheetsData = data.sheetName
        this.attachmentForm.uuid = data.uuid
      })
        .catch((error) => {
          this.$message({
            type: 'error',
            message: error.message
          })
        })
    },
    onExceed () {
      this.$message({
        type: 'warning',
        message: '每次只能上传一个文件，请您删除后再上传'
      })
    },
    beforeUpload (file) {
      const isLt30M = file.size / 1024 / 1024 < 30
      if (!isLt30M) {
        this.$message({
          type: 'warning',
          message: '上传文件大小不能超过 30MB!'
        })
      }
      return isLt30M
    },
    commonUpload () {
      classApi
        .coverUpload(this.attachmentForm)
        .then(data => {
          this.closeImportDialog()
          this.$refs.datagrid.reload()
        })
        .catch((error) => {
          this.$message({
            type: 'error',
            message: error.message
          })
        })
    },
    // 追加导入
    addUpload () {
      this.attachmentForm.addOrCover = 1
      this.attachmentForm.merge = 0
      this.$refs.attchmentForm.validate(isSuccess => {
        if (isSuccess) {
          classApi
            .coverUpload(this.attachmentForm)
            .then(data => {
              if (data.flag === 2) { // 说明有重复数据
                this.$confirm('当前导入的班级名称或编码在数据库中存在，继续导入会替换此数据，是否继续?', '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(() => {
                  this.attachmentForm.merge = 1
                  this.commonUpload()
                })
              } else if (data.flag === 0) {
                this.attachmentForm.merge = 0
                this.commonUpload()
              }
            })
            .catch((error) => {
              this.$message({
                type: 'error',
                message: error.message
              })
            })
        }
      })
    },
    // 覆盖导入
    coverUpload () {
      this.attachmentForm.addOrCover = 0
      this.$refs.attchmentForm.validate(isSuccess => {
        if (isSuccess) {
          this.$confirm('选择覆盖将会清空现有数据, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.attachmentForm.merge = 0
            this.commonUpload()
          })
        }
      })
    },
    closeImportDialog () {
      this.removeFile() // 清除中间表存储的excel文件
      this.importDialogVisible = false
      Object.keys(this.attachmentForm).forEach(key => {
        this.attachmentForm[key] = ''
      })
      this.sheetsData = ''
      this.$refs.attchmentForm.clearValidate(() => {
        if (this.$refs.attchmentForm !== undefined) {
          this.$refs.attchmentForm.clearValidate()
        }
      })
    },
    removeFile () {
      classApi
        .removeFile(this.attachmentForm.uuid)
        .then(data => {
          this.attachFileList = []
        })
    }
  },
  beforeMount () {
    classApi
      .findAllSubject()
      .then(data => {
        let allMajor = []
        data.forEach(item => {
          let majorArr = item.children
          majorArr.forEach(itemII => {
            allMajor.push(itemII)
          })
        })
        this.subjectData = allMajor
      })
  }
}
</script>
<style lang="scss" scoped>
  .el-aside {
    border-right: 1px solid #e4e7ed;
  }

  .el-header {
    border-bottom: 1px solid #e4e7ed;
  }

  .select-tree-container {
    height: 300px;
    overflow: auto;
  }

</style>
