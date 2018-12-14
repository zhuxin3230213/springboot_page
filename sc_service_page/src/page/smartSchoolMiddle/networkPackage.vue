<template>
  <el-container>
    <el-aside width="200px" style="padding-top: 20px;">
      <div style="margin-bottom: 20px; margin-left: 25px;">选择学校</div>
      <el-tree :data="schoolListData"
               ref="schoolList"
               :props="{label:'name'}"
               node-key="code"
               highlight-current
               :expand-on-click-node="false"
               @node-click="schoolClick">
      </el-tree>
    </el-aside>
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
          url="/netPackage/list"
          auth v-bind="$attrs"
          :postParams="postParams"
          :buttons="buttons"
          :actions="actions"
          @addBtnClick="add"
          @removeBtnClick="remove"
          @editActionClick="edit"
          @removeActionClick="({row})=>remove({rows:[row]})"
        >
          <el-table-column label="套餐名称" prop="name" show-overflow-tooltip></el-table-column>
          <el-table-column label="套餐编码" prop="code" show-overflow-tooltip></el-table-column>
          <el-table-column label="套餐类型" prop="type" :formatter="typeTimeFmt" show-overflow-tooltip></el-table-column>
          <el-table-column label="套餐资费" prop="tariffs" show-overflow-tooltip></el-table-column>
          <el-table-column label="套餐组" prop="netDesc" :formatter="netDescFmt" show-overflow-tooltip></el-table-column>
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
        <el-form-item  label="套餐名称"  prop="name" class="form-item-layout">
          <el-input v-model="dialogForm.name" size="small"></el-input>
        </el-form-item>
        <el-form-item label="套餐编码" prop="code" class="form-item-layout">
          <el-input v-model="dialogForm.code" size="small" :disabled="dialogIsEdit"></el-input>
        </el-form-item>
        <el-form-item label="所属学校" prop="schoolCode" class="form-item-layout">
          <el-select placeholder="请选择学校" v-model="dialogForm.schoolCode" disabled size="small">
            <el-option v-for="item in schoolData" :key="item.code" :label="item.name" :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="套餐类型" prop="type" class="form-item-layout">
          <el-select v-model="dialogForm.type" placeholder="请选择" size="small" style="width:200px">
            <el-option v-for="item in $lookup.getByCode('packageType').children" :label="item.name" :key="item.code" :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item  label="套餐资费"  prop="tariffs" class="form-item-layout">
          <el-input v-model="dialogForm.tariffs" size="small"></el-input>
        </el-form-item>
        <el-form-item  label="套餐组"  prop="netDesc" class="form-item-layout">
          <el-select v-model="dialogForm.netDesc" placeholder="请选择" size="small" style="width:200px">
            <el-option v-for="item in $lookup.getByCode('packageGroup').children" :label="item.name" :key="item.code" :value="item.code">
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
import * as networkPackageApi from '../../api/smartschoolMiddle/networkPackage'
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
      postParams: { schoolCode: 'haojing' },
      dialogIsEdit: false,
      dialogVisible: false,
      dialogForm: {
        id: '',
        name: '',
        code: '',
        schoolCode: '',
        type: '',
        tariffs: '',
        netDesc: ''
      },
      schoolData: [],
      treeData: [],
      rules: {
        name: [
          { required: true, message: '请输入套餐名称', trigger: 'blur' },
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
          { required: true, message: '请输入套餐编码', trigger: 'blur' },
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
        schoolCode: [{ required: true, message: '请选择学校', trigger: 'blur' }],
        type: [{ required: true, message: '请输入套餐类型', trigger: 'blur' }],
        tariffs: [
          { required: true, message: '请输入套餐资费', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              if (/^[0-9]+(.[0-9]+)?$/.test(value)) {
                callback()
              } else {
                callback(new Error('套餐资费只能为数字'))
              }
            },
            trigger: 'blur'
          }
        ],
        netDesc: [{ required: true, message: '请输入套餐组描述', trigger: 'blur' }]
      },

      labelPosition: 'right'
    }
  },
  computed: {},
  watch: {},
  methods: {
    typeTimeFmt (row, column, cellValue, index) {
      if (cellValue === undefined || cellValue === '' || cellValue === null) {
        return cellValue
      }
      return this.$lookup.getNameByCode(`packageType.${cellValue}`)
    },
    netDescFmt (row, column, cellValue, index) {
      if (cellValue === undefined || cellValue === '' || cellValue === null) {
        return cellValue
      }
      return this.$lookup.getNameByCode(`packageGroup.${cellValue}`)
    },
    createTimeFmt (row, column, cellValue, index) {
      return moment(cellValue).format('YYYY-MM-DD')
    },
    schoolClick (data) {
      this.postParams.schoolCode = data.code
      this.$refs.datagrid.reload(true)
    },
    add () {
      this.dialogVisible = true
      this.dialogIsEdit = false
      debugger
      const currNode = this.$refs.schoolList.getCurrentNode()
      this.dialogForm.schoolCode = currNode.code
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
          networkPackageApi
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
          this._savePackage()
        }
      })
    },
    _savePackage () {
      networkPackageApi[this.dialogIsEdit ? 'edit' : 'save'](this.dialogForm)
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
  },
  beforeMount () {
    // 获取学校列表
    this.postParams.schoolCode = ''
    networkPackageApi
      .findAllSchool()
      .then(data => {
        this.schoolListData = data
        setTimeout(() => {
          this.$refs.schoolList.setCurrentKey(data[0].code)
        }, 1)

        this.schoolData = data
        this.postParams.schoolCode = data[0].code
        this.$refs.datagrid.reload(true)
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
