<template>
    <el-container>
            <el-header height="120px">
               <el-form :model="searchForm" ref="search" label-width="50px" label-suffix=":" class="search-form">
                  <el-row>
                    <el-col :span="12">
                      <el-form-item label="名称">
                          <el-input size="small" v-model="searchForm.userName"></el-input>
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
                url="userinfo/listAllUserInfo"
                :buttons="buttons"
                auth v-bind="$attrs"
                :actions="actions"
                :beforeAddAction="beforeAddAction"
                :postParams="postParams"
                @addBtnClick="addUser"
                @removeBtnClick="removeUser"
                @initPwdBtnClick="initPwd"
                @enableBtnClick="(data)=>changeState(data,true)"
                @disableBtnClick="(data)=>changeState(data,false)"
                @assignRoleActionClick="openAssignRoleDialog"
                @removeActionClick="({row})=>removeUser({rows:[row]})"
                >
                    <el-table-column label="名称" prop="username"  show-overflow-tooltip></el-table-column>
                    <el-table-column label="编码" prop="code"  show-overflow-tooltip></el-table-column>
                    <el-table-column label="状态" prop="state" :formatter="stateFmt"  show-overflow-tooltip></el-table-column>
                    <el-table-column label="添加时间" prop="createTime" :formatter="createTimeFmt" show-overflow-tooltip></el-table-column>
                </data-grid>
            </el-main>
            <el-dialog
              title="添加人员"
              :visible.sync="addUserDialogVisible"
              width="400px"
              :close-on-click-modal="false"  v-if="addUserDialogVisible"
              @close="closeDialog">
              <div style="width:300px;height:300px;">
                  <el-form :model="addUserForm" ref="form" label-width="100px" size="small" label-suffix=":" style="text-align:center;" :rules="rules">
                    <el-form-item label="用户名">
                       <el-row>
                         <el-col :span="20">
                            <el-input v-model="addUserForm.username" readonly></el-input>
                         </el-col>
                         <el-col :span="4">
                           <el-button type="primary" icon="el-icon-edit" @click="openUserSelectDialog" size="mini" ></el-button>
                           </el-col>
                       </el-row>

                    </el-form-item>
                    <el-form-item label="编码">
                      <el-input v-model="addUserForm.code" readonly></el-input>
                    </el-form-item>
                    <el-form-item label="密码" prop="password">
                      <el-input v-model="addUserForm.password" type="password"></el-input>
                    </el-form-item>
                     <el-form-item label="重复输入" prop="repassword">
                      <el-input v-model="addUserForm.repassword" type="password"></el-input>
                    </el-form-item>
                  </el-form>
              </div>
              <span slot="footer">
                <el-button @click="closeDialog" size="small">取 消</el-button>
                <el-button type="primary" @click="okDialog" size="small">确 定</el-button>
              </span>
            </el-dialog>

            <!--人员选择框-->
            <user-select-dialog :dialogVisible="userSelectDialogVisible"
            :multiSelect="false"
             toSelectUrl="/userinfo/listUndefinedUser"
             @ok="selectedUser"
             @close="closeUserDialog"
             ></user-select-dialog>
             <el-dialog
               title="分配角色"
               :visible.sync="assignRoleDialogVisible"
               width="300px"
               :close-on-click-modal="false"
               @close="closeAssignRoleDialog">
                 <div style="height:350px; overflow:auto">
                   <el-tree ref="roleTree" :data="roleTreeData" :props="{label:'name'}" show-checkbox node-key="id"></el-tree>
                 </div>
               <span slot="footer">
                 <el-button @click="closeAssignRoleDialog" size="small">取 消</el-button>
                 <el-button type="primary" @click="assignRole" size="small">确 定</el-button>
               </span>
             </el-dialog>

    </el-container>

</template>
<script>
import moment from 'moment'

import UserSelectDialog from '../../components/sysconfig/UserSelectDialog'
import * as userInfoApi from '../../api/sysconfig/userinfo'
export default {
  inheritAttrs: false,
  components: {
    UserSelectDialog
  },
  data () {
    return {
      // 搜索区域表单
      searchForm: {
        userName: '',
        code: ''
      },
      // 列表查询参数
      postParams: {},
      // 列表操作按钮
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
          id: 'initPwd',
          text: '初始化密码'
        },
        {
          id: 'enable',
          text: '启用'
        },
        {
          id: 'disable',
          text: '禁用'
        }
      ],
      actions: [{
        id: 'remove',
        text: '删除'
      },
      {
        id: 'assignRole',
        text: '分配角色'
      }],
      // 是否显示选人框
      userSelectDialogVisible: false,
      // 添加人员对话框是否显示
      addUserDialogVisible: false,
      addUserForm: {
        userId: '',
        username: '',
        code: '',
        password: '',
        repassword: ''
      },
      rules: {
        username: [{
          required: true,
          message: '请输入密码',
          trigger: 'blur'
        }],
        password: [{
          required: true,
          message: '请输入密码',
          trigger: 'blur'
        }, {
          min: 6,
          max: 20,
          message: '密码长度必须在6位以上',
          trigger: 'blur'
        }],
        repassword: [{
          required: true,
          message: '请再次输入密码',
          trigger: 'blur'
        }, {
          validator: (rule, value, callback) => {
            if (value !== this.addUserForm.password) {
              callback(new Error('两次输入密码不一样'))
            } else {
              callback()
            }
          }
        }]
      },
      // 分配角色对话框是否显示
      assignRoleDialogVisible: false,
      roleTreeData: [],
      assignUserId: ''
    }
  },
  methods: {
    handleSearch () {
      Object.assign(this.postParams, this.searchForm)
      this.$refs.datagrid.reload(true)
    },
    handleReset () {
      this.searchForm.userName = ''
      this.searchForm.code = ''
      delete this.postParams.userName
      delete this.postParams.code
      this.$refs.datagrid.reload(true)
    },
    addUser () {
      this.addUserDialogVisible = true
    },
    removeUser ({ rows }) {
      if (rows.length === 0) {
        this.$message({
          type: 'warning',
          message: '请选择要删除的用户'
        })
        return
      }
      if (rows.some(r => r.code === 'admin')) {
        this.$message({
          type: 'warning',
          message: '系统管理员不允许删除'
        })
        return
      }
      this.$confirm('确认删除?', '提示', {
        type: 'warning'
      }).then(() => {
        const ids = rows.map(row => row.id)
        userInfoApi
          .removeUser(ids)
          .then(() => {
            this.$refs.datagrid.reload()
          })
          .catch(() => {
            this.$message({
              type: 'error',
              message: '用户删除失败'
            })
          })
      })
    },
    initPwd ({ rows }) {
      if (rows.length === 0) {
        this.$message({
          type: 'warning',
          message: '请选择要初始化密码的用户'
        })
        return
      }
      const ids = rows.map(row => row.id)
      userInfoApi
        .initPwd(ids)
        .then(() => {
          this.$message({
            type: 'success',
            message: '密码初始化成功'
          })
        })
        .catch(() => {
          this.$message({
            type: 'error',
            message: '密码初始化失败'
          })
        })
    },
    changeState ({ rows }, state) {
      if (rows.length === 0) {
        this.$message({
          type: 'warning',
          message: `请选择要${state ? '启用' : '禁用'}的用户`
        })
        return
      }
      const ids = rows.map(row => row.id)
      userInfoApi
        .changeState(ids, state)
        .then(() => {
          this.$refs.datagrid.reload()
        })
        .catch(() => {
          this.$message({
            type: 'error',
            message: `用户${state ? '启用' : '禁用'}失败`
          })
        })
    },
    stateFmt (row, column, cellValue, index) {
      return cellValue === '0' ? '禁用' : '启用'
    },
    createTimeFmt (row, column, cellValue, index) {
      return moment(cellValue).format('YYYY-MM-DD')
    },
    // 关闭添加人员对话框
    closeDialog () {
      this.addUserDialogVisible = false
      Object.keys(this.addUserForm).forEach(key => {
        this.addUserForm[key] = ''
      })
      this.$refs.form.clearValidate((addUserForm) => {
        if (this.$refs.form !== undefined) {
          this.$refs.form.clearValidate()
        }
      })
    },
    // 确定添加人员对话框
    okDialog () {
      this.$refs.form.validate((isSuccess) => {
        // 如果表单校验成功
        if (isSuccess) {
          userInfoApi.addUser(this.addUserForm).then(() => {
            this.$refs.datagrid.reload()
            this.closeDialog()
            this.addUserForm.repassword = ''
          })
        }
      })
    },
    // 点击选择人员按钮事件
    openUserSelectDialog () {
      this.userSelectDialogVisible = true
    },
    selectedUser (rows) {
      if (rows.length === 0) {
        this.$message({
          type: 'warning',
          message: '请选择要添加的人员'
        })
      } else {
        this.closeUserDialog()
        const row = rows[0]
        this.addUserForm.username = row.name
        this.addUserForm.userId = row.id
        this.addUserForm.code = row.code
      }
    },
    closeUserDialog () {
      this.userSelectDialogVisible = false
    },
    // 打开分配角色对话框
    openAssignRoleDialog ({row}) {
      Promise.all([userInfoApi.listAllRole(),
        userInfoApi.listRoleForAuthorize(row.id)]
      )
        .then(([treeData, selectRoles]) => {
          this.roleTreeData = treeData
          this.assignRoleDialogVisible = true
          this.assignUserId = row.id
          setTimeout(() => {
            this.$refs.roleTree.setCheckedKeys(selectRoles.map(role => role.id))
          }, 10)
        })
        .catch(() => {
          this.$message({
            type: 'error',
            message: '获取角色信息失败'
          })
        })
    },
    // 关闭分配角色对话框
    closeAssignRoleDialog () {
      this.assignRoleDialogVisible = false
    },
    // 分配角色
    assignRole () {
      const roleIds = this.$refs.roleTree.getCheckedKeys()
      userInfoApi.authorizeRoleToUser(roleIds, this.assignUserId).then(() => {
        this.$message({
          type: 'success',
          message: '分配角色成功'
        })
        this.assignRoleDialogVisible = false
      }).catch(() => {
        this.$message({
          type: 'error',
          message: '分配角色失败'
        })
      })
    },
    loadRoles () {

    },
    beforeAddAction ({row}, id) {
      return row.code !== 'admin'
    }
  }
}
</script>
<style lang="sass" scoped>
   .el-aside {
  border-right: 1px solid #e4e7ed;
}

.el-header {
  border-bottom: 1px solid #e4e7ed;
}
</style>
