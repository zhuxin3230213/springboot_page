<template>
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
                    <el-col :span="24" style="text-align:center;">
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
                url="/role/listRole"
                :buttons="buttons"
                auth v-bind="$attrs"
                :actions="actions"
                :beforeAddAction="beforeAddAction"
                :postParams="postParams"
                @addBtnClick="addRole"
                @removeBtnClick="removeRole"
                @editActionClick="editRole"
                @assignUserActionClick="assignUser"
                @permissionActionClick="permissionRole"
                @removeActionClick="({row})=>removeRole({rows:[row]})"
                >
                    <el-table-column label="名称" prop="name" show-overflow-tooltip></el-table-column>
                    <el-table-column label="编码" prop="code" show-overflow-tooltip></el-table-column>
                    <el-table-column label="添加时间" prop="createTime" show-overflow-tooltip :formatter="createTimeFmt"></el-table-column>
                </data-grid>
            </el-main>
            <el-dialog
                :title="dialogIsEdit?'编辑':'新增'"
                :visible.sync="dialogVisible"
                width="650px"
                :close-on-click-modal="false"
                @close="closeDialog">
                 <el-form :model="dialogForm" ref="form" label-width="80px" :inline="true" label-suffix=":" size="small" :rules="rules">
                     <el-row>
                         <el-col :span="12">
                              <el-form-item label="名称" prop="name">
                                 <el-input v-model="dialogForm.name" size="small"></el-input>
                              </el-form-item>
                         </el-col>
                         <el-col :span="12">
                             <el-form-item label="编码" prop="code">
                    <el-input v-model="dialogForm.code" :disabled="dialogIsEdit"  size="small"></el-input>
                </el-form-item>
                         </el-col>
                         <el-col :span="24">
                             <el-form-item label="备注" prop="remark">
                                 <el-input type="textarea" :rows="4" style="width:500px;" v-model="dialogForm.remark"  size="small"></el-input>
                             </el-form-item>
                         </el-col>
                     </el-row>
            </el-form>
                <span slot="footer">
                    <el-button @click="closeDialog" size="small">取 消</el-button>
                    <el-button type="primary" @click="okDialog" size="small">确 定</el-button>
                </span>
            </el-dialog>

              <user-select-dialog :dialogVisible="assignUserDialogVisible"
            :multiSelect="true"
            username="username"
             toSelectUrl="/userinfo/listAllUserInfoByDeptId"
             selectedUrl="/roleuser/listUserForAuthorize"
             :selectedPostParams="selectedPostParams"
             @ok="selectedUser"
             @close="closeUserDialog"
             ></user-select-dialog>

             <el-dialog title="权限设置" :visible.sync="dialogPermissionVisible" width="300px" @close="closeDialog" :close-on-click-modal="false">
          <div style="height:300px;overflow:auto;" ref="scroll">
              <el-tree
            :data="premissionTreeData"
            default-expand-all
            :expand-on-click-node="false"
            ref="menutree"
            show-checkbox
            highlight-current
            node-key="id"
            :props="{label:'name'}">
          </el-tree>
          </div>

          <span slot="footer">
                <el-button @click="closePermissionDialog" size="small">取 消</el-button>
                <el-button type="primary" @click="savePermission" size="small">保存</el-button>
            </span>
        </el-dialog>

        </el-container>

</template>
<script>
import moment from 'moment'

import * as roleApi from '../../api/sysconfig/role'
import UserSelectDialog from '../../components/sysconfig/UserSelectDialog'
import * as resourcePrivilege from '../../api/syspriv/permission'
export default {
  inheritAttrs: false,
  components: {
    UserSelectDialog
  },
  data () {
    return {
      searchForm: {
        name: '',
        code: ''
      },
      // 表单内容
      dialogForm: {
        name: '',
        code: '',
        remark: '',
        id: ''
      },
      // 表单校验
      rules: {
        name: [
          {
            required: true,
            message: '请输入角色名称',
            trigger: 'blur'
          },
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
          {
            required: true,
            message: '请输入编码',
            trigger: 'blur'
          },
          {
            validator: (rule, value, callback) => {
              if (/^[A-Za-z\d]+[\w\d_]*$/.test(value)) {
                callback()
              } else {
                callback(new Error('编码只能由数字字母下划线组成'))
              }
            },
            trigger: 'blur'
          }
        ]
      },
      postParams: {},
      buttons: [
        {
          id: 'add',
          text: '新增'
        },
        {
          id: 'remove',
          text: '删除'
        }
      ],
      actions: [
        {
          id: 'edit',
          text: '修改'
        },
        {
          id: 'remove',
          text: '删除'
        },
        {
          id: 'assignUser',
          text: '分配用户'
        },
        {
          id: 'permission',
          text: '权限设置'
        }
      ],
      permissionId: '',
      // 新增编辑弹出框
      dialogIsEdit: false,
      dialogVisible: false,
      // 分配用户弹出框
      assignUserDialogVisible: false,
      dialogPermissionVisible: false,
      selectedPostParams: {roleId: ''},
      // 在分配人员时，用于记录当前的角色ID
      assignUserRoleId: '',
      premissionTreeData: []
    }
  },
  watch: {
    dialogPermissionVisible: function (newVal, oldVal) {
      if (newVal === false) {
        this.$refs.scroll.scrollTop = 0
      }
    }
  },
  methods: {
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
    addRole () {
      this.dialogVisible = true
      this.dialogIsEdit = false
    },
    removeRole ({ rows }) {
      if (rows.length === 0) {
        this.$message({
          type: 'warning',
          message: '请选择要删除的角色'
        })
        return
      }
      if (rows.some(r => r.code === 'admin')) {
        this.$message({
          type: 'warning',
          message: '系统管理员不能删除'
        })
        return
      }
      this.$confirm('确认删除?', '提示', {
        type: 'warning'
      }).then(() => {
        const ids = rows.map(row => row.id)
        roleApi
          .removeRole(ids)
          .then(() => {
            this.$refs.datagrid.reload()
          })
          .catch(msg => {
            this.$message({
              type: 'warning',
              message: msg
            })
          })
      })
    },
    permissionRole ({ row }) {
      this.dialogPermissionVisible = true
      this.permissionId = row.id
      Promise.all([
        resourcePrivilege.getPrivByObjId(row.id),
        resourcePrivilege.getAllResourceForPriv()
      ])
        .then(([privIds, treeData]) => {
          this.premissionTreeData = treeData
          setTimeout(() => {
            this.$refs.menutree.setCheckedKeys(
              privIds.map(p => p.resourceCode)
            )
          }, 0)
        })
        .catch(() => {
          this.$message({
            type: 'error',
            message: '设置失败'
          })
        })
    },
    savePermission () {
      const ids = this.$refs.menutree.getCheckedKeys()

      resourcePrivilege
        .savePrivilege('2', this.permissionId, ids)
        .then(() => {
          this.dialogPermissionVisible = false
        })
        .catch(() => {
          this.$message({
            type: 'error',
            message: '保存失败'

          })
        })
    },
    editRole ({ row }) {
      Object.keys(this.dialogForm).forEach(key => {
        this.dialogForm[key] = row[key]
      })
      this.dialogVisible = true
      this.dialogIsEdit = true
    },
    assignUser ({ row }) {
      this.assignUserRoleId = row.id
      this.selectedPostParams.roleId = row.id
      this.assignUserDialogVisible = true
    },
    createTimeFmt (row, column, cellValue, index) {
      return moment(cellValue).format('YYYY-MM-DD')
    },
    closeDialog () {
      this.dialogVisible = false
      Object.keys(this.dialogForm).forEach(key => {
        this.dialogForm[key] = ''
      })
      // this.$refs.form.clearValidate((dialogForm) => {
      //   if (this.$refs.form !== undefined) {
      //     this.$refs.form.clearValidate()
      //   }
      // })
    },

    okDialog () {
      this.$refs.form.validate(isSuccess => {
        if (isSuccess) {
          roleApi[this.dialogIsEdit ? 'editRole' : 'addRole'](this.dialogForm)
            .then(data => {
              this.$refs.datagrid.reload()
              this.closeDialog()
            })
            .catch(() => {
              this.$message({
                type: 'error',
                message: `${this.dialogIsEdit ? '编辑' : '新增'}角色失败`
              })
            })
        }
      })
    },
    selectedUser (rows) {
      const userIds = rows
        .map(row => {
          return row.id
        })
        .join(',')
      roleApi
        .authorizeUserToRole(this.assignUserRoleId, userIds)
        .then(() => {
          this.closeUserDialog()
        })
        .catch(() => {
          this.$message({
            type: 'error',
            message: `角色分配人员失败`
          })
        })
    },
    closeUserDialog () {
      this.assignUserDialogVisible = false
    },
    closePermissionDialog () {
      this.dialogPermissionVisible = false
    },
    beforeAddAction ({row}, id) {
      if (id === 'assignUser') {
        return true
      }
      return row.code !== 'admin'
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
</style>
