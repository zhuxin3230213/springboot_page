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
          url="/course/list"
          auth v-bind="$attrs"
          :postParams="postParams"
          :buttons="buttons"
          :actions="actions"
          @addBtnClick="add"
          @removeBtnClick="remove"
          @editActionClick="edit"
          @removeActionClick="({row})=>remove({rows:[row]})"
        >
          <el-table-column label="名称" prop="name" show-overflow-tooltip></el-table-column>
          <el-table-column label="编码" prop="code" show-overflow-tooltip></el-table-column>
          <el-table-column label="课程类型" prop="cType" show-overflow-tooltip :formatter="courseTypeFmt"></el-table-column>
          <el-table-column label="学习类型" prop="sType" show-overflow-tooltip :formatter="studyTypeFmt"></el-table-column>
          <el-table-column label="课程学时" prop="periods" show-overflow-tooltip></el-table-column>
          <el-table-column label="课程学分" prop="credit" show-overflow-tooltip></el-table-column>
          <el-table-column label="教室要求" prop="requires" show-overflow-tooltip :formatter="classroomFmt"></el-table-column>
          <el-table-column label="课程总学时" prop="totalPeriod" show-overflow-tooltip></el-table-column>
          <el-table-column label="基础课程" prop="baseC" show-overflow-tooltip :formatter="baseCourseFmt"></el-table-column>
          <el-table-column label="开课学期数" prop="semester" show-overflow-tooltip></el-table-column>
          <el-table-column label="添加时间" prop="createTime" :formatter="createTimeFmt" show-overflow-tooltip></el-table-column>
        </data-grid>
      </el-main>
    </el-container>
    <el-dialog :title="dialogIsEdit?'编辑':'新增'"
               :visible.sync="dialogVisible"
               width="760px"
               :close-on-click-modal="false" v-if="dialogVisible"
               @close="closeDialog">
      <el-form ref="form" class="form-layout" :model="dialogForm" label-width="125px" :inline="true" :label-position="labelPosition" style="text-align:left" label-suffix=":" :rules="rules">
        <el-form-item  label="名称"  prop="name" class="form-item-layout">
          <el-input v-model="dialogForm.name" size="small"></el-input>
        </el-form-item>
        <el-form-item label="编码" prop="code" class="form-item-layout">
          <el-input v-model="dialogForm.code" size="small" :disabled="dialogIsEdit"></el-input>
        </el-form-item>
        <el-form-item label="课程类型" prop="cType" >
          <el-select v-model="dialogForm.cType" placeholder="请选择" size="small" style="width:200px">
            <el-option v-for="item in $lookup.getByCode('courseType').children" :label="item.name" :key="item.code" :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="学习类型" prop="sType">
          <el-select v-model="dialogForm.sType" placeholder="请选择" size="small" style="width:200px">
            <el-option v-for="item in $lookup.getByCode('studyType').children" :label="item.name" :key="item.code" :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="课程学时" prop="periods">
          <el-input-number v-model="dialogForm.periods" :min="1" :max="100" size="small" style="width:200px"></el-input-number>
        </el-form-item>
        <el-form-item label="课程学分" prop="credit" class="form-item-layout">
          <el-input-number v-model="dialogForm.credit" :min="1" :max="100" size="small" style="width:200px"></el-input-number>
        </el-form-item>
        <el-form-item label="课程总学时" prop="totalPeriod" class="form-item-layout">
          <el-input-number v-model="dialogForm.totalPeriod" :min="1" :max="100" size="small" style="width:200px"></el-input-number>
        </el-form-item>
        <el-form-item label="开课学期数" prop="semester" class="form-item-layout">
          <el-input-number v-model="dialogForm.semester" :min="1" :max="100" size="small" style="width:200px"></el-input-number>
        </el-form-item>
        <el-form-item label="教室要求" prop="requires" class="form-item-layout">
          <el-select v-model="dialogForm.requires" placeholder="请选择" size="small" style="width:200px">
            <el-option v-for="item in $lookup.getByCode('classroom').children" :label="item.name" :key="item.code" :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="基础课程" prop="baseC" class="form-item-layout">
          <el-select v-model="dialogForm.baseC" placeholder="请选择" size="small" style="width:200px">
            <el-option v-for="item in $lookup.getByCode('baseCourse').children" :label="item.name" :key="item.code" :value="item.code">
            </el-option>
          </el-select>
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
import * as courseApi from '../../api/smartschool/course'
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
        name: '',
        code: '',
        cType: '',
        sType: '',
        periods: '',
        credit: '',
        requires: '',
        totalPeriod: '',
        baseC: '',
        semester: ''
      },
      subjectData: [],
      subjectName: '',
      rules: {
        code: [
          { required: true, message: '请输入课程编码', trigger: 'blur' },
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
        name: [
          { required: true, message: '请输入课程名称', trigger: 'blur' },
          { min: 2, message: '长度不能小于2个字符', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              if (
                /^[A-Za-z\d\u4e00-\u9fa5]+[\u4e00-\u9fa5\w\d_$.]*$/.test(value)
              ) {
                callback()
              } else {
                callback(new Error('课程名称不能包含特殊字符'))
              }
            },
            trigger: 'blur'
          }
        ],
        cType: [{
          required: true, message: '请输入课程类型', trigger: 'change'
        }],
        totalPeriod: [
          {
            validator: (rule, value, callback) => {
              if (value < this.dialogForm.periods) {
                callback(new Error('课程总学时不得小于课程学时'))
              } else {
                callback()
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
    // 数据字典获取
    studyTypeFmt (row, column, cellValue, index) {
      if (cellValue === undefined || cellValue === '' || cellValue === null) {
        return cellValue
      }
      return this.$lookup.getNameByCode(`studyType.${cellValue}`)
    },
    courseTypeFmt (row, column, cellValue, index) {
      if (cellValue === undefined || cellValue === '' || cellValue === null) {
        return cellValue
      }
      return this.$lookup.getNameByCode(`courseType.${cellValue}`)
    },
    classroomFmt (row, column, cellValue, index) {
      if (cellValue === undefined || cellValue === '' || cellValue === null) {
        return cellValue
      }
      return this.$lookup.getNameByCode(`classroom.${cellValue}`)
    },
    baseCourseFmt (row, column, cellValue, index) {
      if (cellValue === undefined || cellValue === '' || cellValue === null) {
        return cellValue
      }
      return this.$lookup.getNameByCode(`baseCourse.${cellValue}`)
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
          courseApi
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
      this.$refs.form.clearValidate(Object.keys(this.dialogForm))
    },
    okDialog () {
      this.$refs.form.validate(isSuccess => {
        if (isSuccess) {
          this._saveClass()
        }
      })
    },
    _saveClass () {
      courseApi[this.dialogIsEdit ? 'edit' : 'save'](this.dialogForm)
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
