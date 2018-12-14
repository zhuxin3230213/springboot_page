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
          url="/bg/college/list"
          auth v-bind="$attrs"
          :postParams="postParams"
          :buttons="buttons"
          :actions="actions"
          @addBtnClick="add"
          @removeBtnClick="remove"
          @editActionClick="edit"
          @removeActionClick="({row})=>remove({rows:[row]})"
        >
          <el-table-column label="学校名称" prop="name" show-overflow-tooltip></el-table-column>
          <el-table-column label="学校简称" prop="simpleName" show-overflow-tooltip></el-table-column>
          <el-table-column label="学校编码" prop="code" show-overflow-tooltip></el-table-column>
          <el-table-column label="学校主页" prop="url" show-overflow-tooltip></el-table-column>
          <el-table-column label="网费缴纳网址" prop="col1" show-overflow-tooltip></el-table-column>
          <el-table-column label="添加时间" prop="createTime" :formatter="createTimeFmt" show-overflow-tooltip></el-table-column>
        </data-grid>
      </el-main>
    </el-container>
    <el-dialog :title="dialogIsEdit?'编辑':'新增'"
               :visible.sync="dialogVisible"
               width="720px"
               :close-on-click-modal="false"
               @close="closeDialog">
      <el-form ref="form" class="form-layout" :model="dialogForm" label-width="115px" :inline="true" :label-position="labelPosition" style="text-align:left" label-suffix=":" :rules="rules">
        <el-form-item  label="学校名称"  prop="name" class="form-item-layout">
          <el-input v-model="dialogForm.name" size="small"></el-input>
        </el-form-item>
        <el-form-item  label="学校简称"  prop="simpleName" class="form-item-layout">
          <el-input v-model="dialogForm.simpleName" size="small"></el-input>
        </el-form-item>
        <el-form-item label="学校编码" prop="code" class="form-item-layout">
          <el-input v-model="dialogForm.code" size="small" :disabled="dialogIsEdit"></el-input>
        </el-form-item>
        <el-form-item label="学校主页" prop="url" class="form-item-layout">
          <el-input v-model="dialogForm.url" size="small"></el-input>
        </el-form-item>
        <el-form-item label="网费缴纳网址" prop="col1" class="form-item-layout">
          <el-input v-model="dialogForm.col1" size="small"></el-input>
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
import * as schoolApi from '../../api/smartschoolMiddle/school'
export default {
  inheritAttrs: false,
  components: {},
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
        simpleName: '',
        code: '',
        url: '',
        col1: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入学校名称', trigger: 'blur' },
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
          { required: true, message: '请输入学校编码', trigger: 'blur' },
          { min: 2, message: '长度不能小于2个字符', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              if (/^[A-Za-z\d]+[\w\d_]*$/.test(value)) {
                callback()
              } else {
                callback(new Error('编码不能包含汉字或特殊字符'))
              }
            },
            trigger: 'blur'
          }
        ],
        url: [
          { required: true, message: '请输入学校主页', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              if (/^((https|http){1}(:\/\/){1})/.test(value)) {
                callback()
              } else {
                callback(new Error('学校主页必须以http://或https://开始'))
              }
            },
            trigger: 'blur'
          }
        ],
        col1: [
          { required: true, message: '请输入网费缴纳网址', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              if (/^((https|http){1}(:\/\/){1})/.test(value)) {
                callback()
              } else {
                callback(new Error('网费缴纳网址必须以http://或https://开始'))
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
          schoolApi
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
          this._saveSchool()
        }
      })
    },
    _saveSchool () {
      debugger
      schoolApi[this.dialogIsEdit ? 'edit' : 'save'](this.dialogForm)
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
