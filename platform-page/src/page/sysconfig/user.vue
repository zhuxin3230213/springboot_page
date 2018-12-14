<template>
    <el-container>
        <el-aside width="200px">
            <org-tree @nodeClick="treeNodeClick" ref="orgtree"></org-tree>
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
                        <el-button size="small"  @click="handleSearch">查询</el-button>
                        <el-button size="small"  @click="handleReset">重置</el-button>
                      </el-form-item>
                    </el-col>
                  </el-row>
              </el-form>
            </el-header>
            <el-main>
               <data-grid
                ref="datagrid"
                url="user/listUserByDeptId"
               :buttons="buttons"
               auth v-bind="$attrs"
               :actions="actions"
               :postParams="postParams"
               @addBtnClick="addUser"
               @removeBtnClick="removeUser"
               @changeDeptBtnClick="changeDept"
               @removeActionClick="({row})=>{;removeUser({rows:[row]})}"
               @editActionClick="editUser"
               @partjobActionClick="partjobUser"
               >
                <el-table-column label="姓名" prop="name" show-overflow-tooltip></el-table-column>
                <el-table-column label="编码" prop="code" show-overflow-tooltip></el-table-column>
                <el-table-column label="性别" prop="sex" :formatter="sexFmt"  show-overflow-tooltip></el-table-column>
                <el-table-column label="生日" prop="birthday" value-format="yyyy-MM-dd"
 :formatter="birthdayFmt" show-overflow-tooltip></el-table-column>
                <el-table-column label="所属部门" prop="deptName"  show-overflow-tooltip></el-table-column>
                <el-table-column label="手机号码" prop="mobile"  show-overflow-tooltip></el-table-column>
                <el-table-column label="微信号" prop="weixin"  show-overflow-tooltip></el-table-column>
                <el-table-column label="邮箱" prop="mail"  show-overflow-tooltip></el-table-column>
                <el-table-column label="QQ" prop="qq" show-overflow-tooltip ></el-table-column>
               </data-grid>
            </el-main>
        </el-container>
        <el-dialog :title="dialogIsEdit?'编辑人员':'新增人员'"
        :visible.sync="dialogVisible"
        width="650px"
        :close-on-click-modal="false"
        @close="closeDialog">
        <el-form ref="form" class="form-layout" :model="dialogForm" label-width="80px" :inline="true" :label-position="labelPosition" style="text-align:left" label-suffix=":" :rules="rules">
          <el-form-item  label="姓名"  prop="name" class="form-item-layout">
            <el-input v-model="dialogForm.name" size="small"></el-input>
          </el-form-item>
          <el-form-item label="编码" prop="code" class="form-item-layout">
            <el-input v-model="dialogForm.code" size="small" :disabled="dialogIsEdit"></el-input>
          </el-form-item>
          <el-form-item label="性别" prop="sex" >
            <el-select v-model="dialogForm.sex" size="small"  style="width:200px ">
              <el-option label="男" value="0"></el-option>
              <el-option label="女" value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="生日" prop="birthday" >
            <el-date-picker type="date" placeholder="选择日期" v-model="dialogForm.birthday" size="small"  style="width:200px " value-format="yyyy-MM-dd"></el-date-picker>
          </el-form-item>
          <el-form-item label="手机号码" prop="mobile" class="form-item-layout">
            <el-input v-model="dialogForm.mobile" size="small"></el-input>
          </el-form-item>
          <el-form-item label="微信号" prop="weixin" class="form-item-layout">
            <el-input v-model="dialogForm.weixin" size="small"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="mail" class="form-item-layout">
            <el-input v-model="dialogForm.mail" size="small"></el-input>
          </el-form-item>
          <el-form-item label="QQ" prop="qq" class="form-item-layout">
            <el-input v-model="dialogForm.qq" size="small"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer">
          <el-button @click="closeDialog" size="small" >取消</el-button>
          <el-button @click="okDialog" type="primary" size="small">确认</el-button>
        </span>
        </el-dialog>

        <el-dialog title="选择部门" :visible.sync="dialogChangeDeptVisible" width="300px" :close-on-click-modal="false" @close="closeChangeDeptDialog">
          <div class="select-tree-container" >
            <org-tree  ref="selecttree" :rootId="rootId"></org-tree>
          </div>
          <span slot="footer">
                <el-button @click="closeChangeDeptDialog" size="small">取 消</el-button>
                <el-button type="primary" @click="okChangeDeptDialog" size="small">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog title="兼职部门" :visible.sync="partjobVisible" width="300px" :close-on-click-modal="false"  @close="closePartjobDialog" >
           <div class="select-tree-container" ref="scroll">
            <el-tree  ref="partjobtree" show-checkbox check-strictly :data="partjobtree" default-expand-all :expand-on-click-node="false" :props="{label:'name'}" node-key="id" ></el-tree>
          </div>
            <span slot="footer">
                <el-button @click="closePartjobDialog" size="small">取 消</el-button>
                <el-button type="primary" @click="okPartjobDialog" size="small">确 定</el-button>
            </span>
        </el-dialog>
    </el-container>

</template>
<script>
import moment from 'moment'
import OrgTree from '../../components/sysconfig/OrgTree'
import * as userApi from '../../api/sysconfig/user'
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
        {
          id: 'add',
          text: '新增'
        },
        {
          id: 'remove',
          text: '删除'
        },
        {
          id: 'changeDept',
          text: '部门调换'
        }
      ],
      actions: [
        {
          id: 'edit',
          text: '编辑'
        },
        {
          id: 'remove',
          text: '删除'
        },
        {
          id: 'partjob',
          text: '兼职部门'

        }
      ],
      // 表格查询参数
      postParams: { deptId: '-1' },
      dialogIsEdit: false,
      dialogVisible: false,
      dialogChangeDeptVisible: false,
      partjobVisible: false,
      rootId: '',
      userId: '',
      partjobtree: [],
      dialogForm: {
        id: '',
        name: '',
        code: '',
        sex: '',
        birthday: '',
        mobile: '',
        weixin: '',
        mail: '',
        qq: '',
        deptId: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' },
          { min: 2, message: '长度不能小于2个字符', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              if (
                /^[A-Za-z\d\u4e00-\u9fa5]+[\u4e00-\u9fa5\w\d_$.]*$/.test(value)
              ) {
                callback()
              } else {
                callback(new Error('姓名不能包含特殊字符'))
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
        mail: [
          {
            type: 'email',
            message: '请输入正确的邮箱地址',
            trigger: ['blur', 'change']
          }
        ],
        mobile: [
          {
            validator (rule, value, callback) {
              if (value === null || value === '') {
                return callback()
              }
              if (/^1[34578]{1}\d{9}$/.test(value)) {
                callback()
              } else {
                callback(new Error('请输入正确的电话号码'))
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
  watch: {
    partjobVisible: function (newVal, oldVal) {
      if (newVal === false) {
        this.$refs.scroll.scrollTop = 0
      }
    }
  },
  methods: {
    treeNodeClick (data) {
      this.postParams.deptId = data.id
      this.$refs.datagrid.reload(true)
    },
    addUser () {
      if (this.$refs.orgtree.getCurrentNode().type === '0') {
        this.$message({
          type: 'warning',
          message: '人员不能添加在机构下面'
        })
        return
      }

      this.dialogForm.sex = '0'
      this.dialogVisible = true
      this.dialogIsEdit = false
    },

    removeUser ({ rows }) {
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
          userApi
            .removeUser(ids)
            .then(() => {
              this.$refs.datagrid.reload()
            })
            .catch(() => {
              this.$message({
                typr: 'error',
                message: '删除失败'
              })
            })
        })
      }
    },
    editUser ({ row }) {
      Object.keys(this.dialogForm).forEach(key => {
        if (key === 'birthday') {
          this.dialogForm[key] = moment(row[key]).format('YYYY-MM-DD')
        } else {
          this.dialogForm[key] = row[key]
        }
      })
      this.dialogVisible = true
      this.dialogIsEdit = true
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
    closePartjobDialog () {
      this.partjobVisible = false
    },
    partjobUser ({row}) {
      this.partjobVisible = true
      this.partjobtree = this.$store.state.orgTree.treeData
      this.userId = row.id

      userApi.listPartDept(row.id).then(
        (res) => {
          setTimeout(() => {
            this.$refs.partjobtree.setCheckedKeys(
              res.map(res => res.id)
            )
          }, 0)
        })
    },
    okPartjobDialog () {
      const partIds = this.$refs.partjobtree.getCheckedKeys()
      userApi.savePartInfos(this.userId, partIds)
        .then(() => {
          this.partjobVisible = false
        })
    },

    // 人员调动
    closeChangeDeptDialog () {
      this.dialogChangeDeptVisible = false
      this.rootId = '-1'
    },
    changeDept ({ rows }) {
      if (rows.length === 0 || rows.length > 1) {
        this.$message({
          type: 'warning',
          message: '请选择一个人员进行部门调动'
        })
        return
      }
      this.dialogChangeDeptVisible = true
      const pNode = this.$refs.orgtree.getNearestOrg(rows[0].deptId)
      setTimeout(() => {
        this.rootId = pNode.id
      }, 1)
    },
    okChangeDeptDialog () {
      const rows = this.$refs.datagrid.getSelection()
      var ids = []
      for (var i = 0; i < rows.length; i++) {
        ids.push(rows[i].id)
      }
      const curnode = this.$refs.selecttree.getCurrentNode()
      if (curnode.type === '0') {
        this.$message({
          type: 'warning',
          message: '人员不能调换到机构下'
        })
        return
      }
      if (rows[0].deptId === curnode.id) {
        this.$message({
          type: 'warning',
          message: '人员不能调换到自己所属部门下'
        })
        return
      }
      userApi
        .changeDept(ids, curnode.id)
        .then(node => {
          this.dialogChangeDeptVisible = false
          this.$refs.datagrid.reload()
        })
        .catch(() => {
          this.$message({
            type: 'error',
            message: '部门调换失败'
          })
        })
    },
    okDialog () {
      this.$refs.form.validate(isSuccess => {
        if (isSuccess) {
          const curnode = this.$refs.orgtree.getCurrentNode()
          this.dialogForm.deptId = curnode.id
          if (this.dialogIsEdit) {
            this._saveUser()
          } else {
            userApi.checkUserCode(this.dialogForm.code).then(result => {
              if (result.success) {
                this.$message({
                  type: 'warning',
                  message: '编码已存在'
                })
              } else {
                this._saveUser()
              }
            })
          }
        }
      })
    },
    _saveUser () {
      userApi[this.dialogIsEdit ? 'editUser' : 'addUser'](this.dialogForm)
        .then(node => {
          this.closeDialog()
          this.$refs.datagrid.reload()
        })
        .catch(() => {
          this.$message({
            type: 'error',
            message: '操作失败!'
          })
        })
    },

    sexFmt (row, column, cellValue, index) {
      return cellValue === '0' ? '男' : '女'
    },
    birthdayFmt (row, column, cellValue, index) {
      if (cellValue == null || cellValue === undefined) {
        return ''
      }
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
