<template>
  <el-container>
    <el-container>
      <el-header height="120px;padding-top:38px">
        <el-form :model="searchForm" ref="search" label-width="50px" label-suffix=":" class="search-form">
          <el-row>
            <el-col :span="12">
              <el-form-item label="年级">
                <el-input size="small" v-model="searchForm.grade"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
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
          url="/courseTime/list"
          auth v-bind="$attrs"
          :postParams="postParams"
          :buttons="buttons"
          :actions="actions"
          @addBtnClick="add"
          @removeBtnClick="remove"
          @editActionClick="edit"
          @removeActionClick="({row})=>remove({rows:[row]})"
        >
          <el-table-column label="年级" prop="grade" show-overflow-tooltip></el-table-column>
          <el-table-column label="学年" prop="academicYear" show-overflow-tooltip></el-table-column>
          <el-table-column label="学期" prop="semester" show-overflow-tooltip :formatter="semesterFmt"></el-table-column>
          <el-table-column label="开课日期" prop="sDate" show-overflow-tooltip :formatter="createTimeFmt"></el-table-column>
          <el-table-column label="结课日期" prop="eDate" show-overflow-tooltip :formatter="createTimeFmt"></el-table-column>
          <el-table-column label="添加时间" prop="createTime" show-overflow-tooltip :formatter="createTimeFmt"></el-table-column>
        </data-grid>
      </el-main>
    </el-container>
    <el-dialog :title="dialogIsEdit?'编辑':'新增'"
               :visible.sync="dialogVisible"
               width="760px"
               :close-on-click-modal="false" v-if="dialogVisible"
               @close="closeDialog">
      <el-form ref="form" class="form-layout" :model="dialogForm" label-width="125px" :inline="true" :label-position="labelPosition" style="text-align:left" label-suffix=":" :rules="rules">
        <el-form-item  label="年级"  prop="grade" class="form-item-layout">
          <el-select v-model="dialogForm.grade" placeholder="请选择" filterable size="small" style="width:200px">
            <el-option v-for="item in getYearData()" :key="item" :label="item+'级'" :value="item+'级'" >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="学年" prop="academicYear" class="form-item-layout">
          <el-select v-model="dialogForm.academicYear" placeholder="请选择" filterable size="small" style="width:200px">
            <el-option v-for="item in getYearScope()" :key="item" :label="item" :value="item" >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="学期" prop="semester" >
          <el-select v-model="dialogForm.semester" placeholder="请选择" size="small" style="width:200px">
            <el-option v-for="item in $lookup.getByCode('semester').children" :label="item.name" :key="item.code" :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="开课日期" prop="sDate">
          <el-date-picker type="date" placeholder="选择日期" v-model="dialogForm.sDate" size="small"  style="width:200px " value-format="yyyy-MM-dd"></el-date-picker>
        </el-form-item>
        <el-form-item label="结课日期" prop="eDate">
          <el-date-picker type="date" placeholder="选择日期" v-model="dialogForm.eDate" size="small"  style="width:200px " value-format="yyyy-MM-dd"></el-date-picker>
        </el-form-item>
      </el-form>
      <span slot="footer">
          <el-button @click="closeDialog" size="small" >取消</el-button>
          <el-button @click="okDialog" type="primary" size="small">确认</el-button>
      </span>
    </el-dialog>
  </el-container>

</template>
<script>
import moment from 'moment'
import OrgTree from '../../components/sysconfig/OrgTree'
import * as courseTimeApi from '../../api/smartschool/courseTime'
export default {
  inheritAttrs: false,
  components: {
    OrgTree
  },
  data () {
    return {
      searchForm: {
        grade: ''
      },
      buttons: [
        {id: 'add', text: '新增'},
        {id: 'remove', text: '删除'}
      ],
      actions: [
        {id: 'edit', text: '编辑'},
        {id: 'remove', text: '删除'}
      ],
      // 表格查询参数
      postParams: { deptId: '-1' },
      dialogIsEdit: false,
      dialogVisible: false,
      dialogForm: {
        id: '',
        grade: '',
        academicYear: '',
        semester: '',
        sDate: '',
        eDate: ''
      },
      rules: {
        grade: [{
          required: true, message: '请输入年级', trigger: 'blur'
        }],
        academicYear: [{
          required: true, message: '请输入学年', trigger: 'blur'
        }],
        semester: [{
          required: true, message: '请输入学期', trigger: 'change'
        }],
        sDate: [
          { required: true, message: '请输入开课日期', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              let academicYearStart = this.dialogForm.academicYear.substr(0, 4)
              let academicYearEnd = this.dialogForm.academicYear.substr(5, 8)
              const valYear = value.substr(0, 4)
              if (valYear !== academicYearStart && valYear !== academicYearEnd) {
                callback(new Error('开课日期应在学年范围内'))
              }

              let eDate = this.dialogForm.eDate
              const val = (new Date(value.replace(new RegExp('-', 'gm'), '/'))).getTime()
              if (eDate !== '') {
                eDate = (new Date(eDate.replace(new RegExp('-', 'gm'), '/'))).getTime()
                if (eDate > val) {
                  callback()
                } else {
                  callback(new Error('开课日期应小于结课日期'))
                }
              }
            },
            trigger: 'blur'
          }
        ],
        eDate: [
          { required: true, message: '请输入结课日期', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              let academicYearStart = this.dialogForm.academicYear.substr(0, 4)
              let academicYearEnd = this.dialogForm.academicYear.substr(5, 8)
              const valYear = value.substr(0, 4)
              if (valYear !== academicYearStart && valYear !== academicYearEnd) {
                callback(new Error('结课日期应在学年范围内'))
              }

              let sDate = this.dialogForm.sDate
              const val = (new Date(value.replace(new RegExp('-', 'gm'), '/'))).getTime()
              if (sDate !== '') {
                sDate = (new Date(sDate.replace(new RegExp('-', 'gm'), '/'))).getTime()
                if (sDate < val) {
                  callback()
                } else {
                  callback(new Error('结课日期应大于开课日期'))
                }
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
      for (var i = 0; i < year - 1978; i++) {
        years.push(year - i)
      }
      return years
    },
    getYearScope: function () {
      const year = new Date().getFullYear()
      let yearScopes = []
      for (var i = 0; i < year - 1978; i++) {
        let yearScope = year + 6 - i + '-' + (year + 6 - i + 1)
        yearScopes.push(yearScope)
      }
      return yearScopes
    },
    semesterFmt (row, column, cellValue, index) {
      if (cellValue === undefined || cellValue === '' || cellValue === null) {
        return cellValue
      }
      return this.$lookup.getNameByCode(`semester.${cellValue}`)
    },
    add () {
      this.dialogVisible = true
      this.dialogIsEdit = false
    },
    edit ({ row }) {
      Object.keys(this.dialogForm).forEach(key => {
        this.dialogForm[key] = row[key]
      })
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
          courseTimeApi
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
      this.$refs.form.clearValidate(() => {
        if (this.$refs.form !== undefined) {
          this.$refs.form.clearValidate()
        }
      })
    },
    okDialog () {
      this.$refs.form.validate(isSuccess => {
        if (isSuccess) {
          this._saveCourseTime()
        }
      })
    },
    _saveCourseTime () {
      courseTimeApi[this.dialogIsEdit ? 'edit' : 'save'](this.dialogForm)
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
      this.searchForm.grade = ''
      delete this.postParams.grade
      this.$refs.datagrid.reload(true)
    }
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
