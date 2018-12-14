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
                <el-input size="small" v-model="searchForm.code"></el-input>
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
        <data-grid ref="datagrid" url="dept/getDeptListById" :buttons="buttons" auth v-bind="$attrs"  :actions="actions" :postParams="postParams" @addBtnClick="addOrg" @changeBtnClick="changeOrg" @removeBtnClick="removeOrg" @removeActionClick="({row})=>removeOrg({rows:[row]})" @editActionClick="editOrg" @permissionActionClick="permissionOrg" :pageSize="10">
          <el-table-column show-overflow-tooltip label="名称" prop="name"></el-table-column>
          <el-table-column show-overflow-tooltip label="简称" prop="simpleName"></el-table-column>
          <el-table-column show-overflow-tooltip label="编码" prop="code"></el-table-column>
          <el-table-column show-overflow-tooltip label="类别" prop="type" :formatter="typeFmt"></el-table-column>
          <el-table-column show-overflow-tooltip label="状态" prop="status" :formatter="statusFmt"></el-table-column>
          <el-table-column show-overflow-tooltip label="添加时间" prop="createTime" :formatter="createTimeFmt"></el-table-column>
          <el-table-column show-overflow-tooltip label="性质" prop="faculty" :formatter="facultyFmt"></el-table-column>
        </data-grid>
      </el-main>
    </el-container>
    <gm-dialog  :title="dialogIsEdit?'编辑':'新增'" :visible.sync="dialogVisible" width="700px" @close="closeDialog" :close-on-click-modal="false">
      <div style="height:390px">
        <el-tabs v-model="activeName" type="card">
          <el-tab-pane label="基本信息" name="info">

              <el-form class="form-layout" :model="dialogForm" ref="form" style="margin-top:15px" label-width="80px" :inline="true" label-suffix=":" size="small" :rules="rules">
              <el-form-item label="名称" prop="name" class="form-item-layout">
                <el-input v-model="dialogForm.name"></el-input>
              </el-form-item>
              <el-form-item label="简称" prop="simpleName" class="form-item-layout">
                <el-input v-model="dialogForm.simpleName"></el-input>
              </el-form-item>
              <el-form-item label="编码" prop="code" class="form-item-layout">
                <el-input v-model="dialogForm.code" :disabled="dialogIsEdit"></el-input>
              </el-form-item>
              <el-form-item label="类型" prop="type">
                <el-select v-model="dialogForm.type" placeholder="" :disabled="dialogIsEdit" style="width:200px">
                  <el-option v-for="item in $lookup.getByCode('orgType').children" :label="item.name" :key="item.code" :value="item.code" :disabled="item.code=='0'?dialogOrg:false">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="性质" prop="faculty">
                <el-select v-model="dialogForm.faculty" placeholder="" :disabled="dialogIsEdit" style="width:200px">
                  <el-option v-for="item in $lookup.getByCode('orgProperty').children" :label="item.name" :key="item.code" :value="item.code">
                  </el-option>
                </el-select>
              </el-form-item>
               <el-form-item label="排序号" prop="sort">
                <el-input-number v-model="dialogForm.sort" :min="1" :max="100000" style="width:200px"></el-input-number>
              </el-form-item>
              <el-form-item label="是否启用" prop="status" >
                <!-- <el-checkbox v-model="dialogFormStatus"></el-checkbox> -->
                <el-switch v-model="dialogForm.status" active-text="启用" inactive-text="禁用" active-value="1" inactive-value="0">
                </el-switch>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="兼职人员" name="partjob" :disabled="partjobDisable">
            <div style="height:380px">
              <data-grid :data="partjobTable" height="280px" :buttons="partjobBtn" @addPartjobBtnClick="addPartjobPeople" @removePartjobBtnClick="delPartjobPeople" ref="addPartUserDatagrid">
                <el-table-column show-overflow-tooltip label="名称" prop="name"></el-table-column>
                <el-table-column show-overflow-tooltip label="编码" prop="code"></el-table-column>
                <el-table-column show-overflow-tooltip label="所属部门" prop="deptName"></el-table-column>
              </data-grid>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
      <span slot="footer">
        <el-button @click="closeDialog" size="small">取 消</el-button>
        <el-button type="primary" @click="okDialog" size="small">确 定</el-button>
      </span>
    </gm-dialog>

    <user-select-dialog  :dialogVisible="assignUserDialogVisible" :multiSelect="true" toSelectUrl="/user/listUserByDeptIdForPart" :selectedData="partjobTable" @ok="selectedUser" @close="closeUserDialog"></user-select-dialog>

    <el-dialog title="选择部门" :visible.sync="dialogDeptVisible" width="300px" @close="closeDialog" :close-on-click-modal="false">
      <div class="select-tree-container">
        <org-tree ref="selecttree" :rootId="rootId"></org-tree>
      </div>
      <span slot="footer">
        <el-button @click="closeDeptDialog" size="small">取 消</el-button>
        <el-button type="primary" @click="okDeptDialog" size="small">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="权限设置" :visible.sync="dialogPermissionVisible" width="300px" @close="closeDialog" :close-on-click-modal="false">
      <div style="height:300px; overflow:auto" ref="scroll">
        <el-tree :data="permissionTreeData" default-expand-all :expand-on-click-node="false" ref="menutree" show-checkbox highlight-current node-key="id" :props="{label:'name'}">
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
import OrgTree from '../../components/sysconfig/OrgTree'
import * as orgApi from '../../api/sysconfig/org'
import * as resourcePrivilege from '../../api/syspriv/permission'
import UserSelectDialog from '../../components/sysconfig/UserSelectDialog'

export default {
  inheritAttrs: false,
  components: {
    OrgTree,
    UserSelectDialog
  },
  data () {
    return {
      searchForm: {
        name: '',
        code: ''
      },
      // 表格所需配置项
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
          id: 'change',
          text: '部门调动'
        }
      ],
      partjobBtn: [
        {
          id: 'addPartjob',
          text: '新增'
        },
        {
          id: 'removePartjob',
          text: '删除'
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
          id: 'permission',
          text: '权限设置'
        }
      ],
      // 表格查询参数
      postParams: {
        deptId: '-1'
      },
      permissionId: '',
      activeName: 'info',
      // 新增，修改弹出框配置信息
      dialogVisible: false,
      // 部门调动弹出框
      dialogDeptVisible: false,
      // 权限管理弹框
      dialogPermissionVisible: false,
      // 是否编辑
      dialogIsEdit: false,
      // 禁用机构
      dialogDept: false,
      dialogOrg: false,
      partjobDisable: false,
      assignUserDialogVisible: false,
      selectedPostParams: {},
      partjobTable: [],
      // 弹出框信息
      dialogForm: {
        id: '',
        name: '',
        simpleName: '',
        code: '',
        type: '',
        partsUsers: [],
        faculty: '',
        status: '',
        parentId: '',
        sort: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' },
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
        simpleName: [
          { required: true, message: '请输入简称', trigger: 'blur' },
          { min: 2, message: '长度不能小于2个字符', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              if (
                /^[A-Za-z\d\u4e00-\u9fa5]+[\u4e00-\u9fa5\w\d_$.]*$/.test(value)
              ) {
                callback()
              } else {
                callback(new Error('简称不能包含特殊字符'))
              }
            },
            trigger: 'blur'
          }
        ],
        sort: [{
          required: true, message: '请输入排序号', trigger: 'change'
        }]
      },
      // 选择部门根节点ID
      rootId: '-1',
      permissionTreeData: []
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
    // 查询 重置
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
    // 弹出框，增加机构
    addOrg () {
      this.dialogVisible = true
      this.dialogForm.type = '0'
      this.dialogIsEdit = false
      this.activeName = 'info'
      this.partjobDisable = true
      const curnode = this.$refs.orgtree.getCurrentNode()
      this.dialogDept = curnode.id === '-1'
      this.dialogForm.status = '1'
      this.dialogForm.sort = '1'
      if (curnode.type === '1') {
        this.dialogForm.type = '1'
        this.dialogOrg = true
      }
    },
    // 删除，重新渲染页面
    removeOrg ({ rows }) {
      if (rows.length === 0) {
        this.$message({
          type: 'warning',
          message: '请至少选择一条数据删除'
        })
        return
      }
      const ids = rows.map(row => {
        return row.id
      })

      for (let id of ids) {
        let node = this.$refs.orgtree.getNodeById(id)

        if (node && node.children && node.children.length > 0) {
          this.$message({
            type: 'warning',
            message: `节点'${node.name}'存在子节点，请先删除子节点`
          })
          return
        }
      }

      this.$confirm('确认删除?', '提示', {
        type: 'warning'
      }).then(() => {
        orgApi
          .removeOrg(ids)
          .then(() => {
            this.$refs.datagrid.reload()
            for (let id of ids) {
              this.$refs.orgtree.removeNode(id)
            }
          })
          .catch(msg => {
            this.$message({
              type: 'error',
              message: msg
            })
          })
      })
    },

    // 编辑修改
    editOrg ({ row }) {
      Object.keys(this.dialogForm).forEach(key => {
        this.dialogForm[key] = row[key]
      })
      this.dialogVisible = true
      this.dialogIsEdit = true
      this.activeName = 'info'
      if (this.dialogForm.type === '0') {
        this.partjobDisable = true
        this.dialogForm.partsUsers = []
      } else {
        this.partjobDisable = false
        orgApi.partjobList(row.id).then(data => {
          this.partjobTable = data
          this.dialogForm.partsUsers = data.map(({ id }) => id)
        })
      }
    },
    permissionOrg ({ row }) {
      this.dialogPermissionVisible = true
      this.permissionId = row.id
      Promise.all([
        resourcePrivilege.getPrivByObjId(row.id),
        resourcePrivilege.getAllResourceForPriv()
      ])
        .then(([privIds, treeData]) => {
          this.permissionTreeData = treeData
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
        .savePrivilege('1', this.permissionId, ids)
        .then(() => {
          this.dialogPermissionVisible = false
        })
        .catch(() => {
          this.$message({
            type: 'error',
            message: '设置失败'
          })
        })
    },
    // 部门调动
    changeOrg ({ rows }) {
      if (rows.length === 0 || rows.length > 1) {
        this.$message({
          type: 'warning',
          message: '请选择一个部门调动！'
        })
        return
      }
      this.dialogDeptVisible = true
      const curnode = rows[0]
      const pNode = this.$refs.orgtree.getNearestOrg(curnode.id)
      setTimeout(() => {
        this.rootId = pNode.id
      }, 1)
    },
    // 格式化类别内容
    typeFmt (row, column, cellValue, index) {
      return this.$lookup.getNameByCode(`orgType.${cellValue}`)
    },
    facultyFmt (row, column, cellValue, index) {
      if (cellValue == null || cellValue === '') {
        return ''
      }
      return this.$lookup.getNameByCode(`orgProperty.${cellValue}`)
    },
    // 格式化状态内容
    statusFmt (row, column, cellValue, index) {
      if (cellValue === '') {
        return cellValue
      }
      return this.$lookup.getNameByCode(`status.${cellValue}`)
    },
    createTimeFmt (row, column, cellValue, index) {
      return moment(cellValue).format('YYYY-MM-DD')
    },

    // 关闭、取消对话框
    closeDialog () {
      this.dialogVisible = false
      Object.keys(this.dialogForm).forEach(key => {
        if (key === 'partsUsers') {
          this.dialogForm[key] = []
        } else {
          this.dialogForm[key] = ''
        }
      })
      // 移除表单验证
      this.$refs.form.clearValidate(() => {
        if (this.$refs.form !== undefined) {
          this.$refs.form.clearValidate()
        }
      })
    },
    // 关闭部门调动弹框
    closeDeptDialog () {
      this.dialogDeptVisible = false
    },
    closePermissionDialog () {
      this.dialogPermissionVisible = false
    },
    // 提交部门调动
    okDeptDialog () {
      const selectnode = this.$refs.datagrid.getSelection()[0]
      const curnode = this.$refs.selecttree.getCurrentNode()
      orgApi
        .changeOrg(selectnode.id, curnode.id)
        .then(node => {
          if (node) {
            this.closeDeptDialog()
            this.$refs.datagrid.reload()
            this.$refs.orgtree.removeNode(selectnode.id)
            this.$refs.orgtree.addNode(node, curnode.id)
          } else {
            return Promise.reject(new Error())
          }
        })
        .catch(() => {
          this.$message({
            type: 'error',
            message: '部门调动失败!'
          })
        })
    },

    // 确认提交信息
    okDialog () {
      this.$refs.form.validate(isSuccess => {
        if (isSuccess) {
          const curnode = this.$refs.orgtree.getCurrentNode()
          this.dialogForm.parentId = curnode.id
          if (this.dialogIsEdit) {
            this._saveOrg()
          } else {
            orgApi
              .checkOrgName(
                this.dialogForm.name,
                this.dialogForm.id,
                this.dialogForm.parentId,
                this.dialogForm.code
              )
              .then(result => {
                this._saveOrg()
                this.partjobTable = []
              })
              .catch(msg => {
                this.$message({
                  type: 'warning',
                  message: msg
                })
              })
          }
        }
      })
    },

    _saveOrg () {
      orgApi[this.dialogIsEdit ? 'editOrg' : 'addOrg'](this.dialogForm)
        .then(node => {
          this.$refs.datagrid.reload()
          if (this.dialogIsEdit) {
            this.partjobDisable = false
            this.$refs.orgtree.updateNode(node)
            this.closeDialog()
          } else {
            this.$refs.orgtree.addNode(node, node.parentId)
            if (this.dialogForm.type === '0') {
              this.closeDialog()
            } else {
              this.dialogIsEdit = true
              this.partjobDisable = false
              this.dialogForm.id = node.id
            }
          }
        })
        .catch(() => {
          this.$message({
            type: 'error',
            message: '添加失败!'
          })
        })
    },
    // 兼职人员增加删除
    addPartjobPeople () {
      this.assignUserDialogVisible = true
    },
    delPartjobPeople ({ rows }) {
      if (rows.length === 0) {
        this.$message({
          type: 'warning',
          message: '请至少选择一条数据删除'
        })
        return
      }
      const ids = rows.map(row => {
        return row.id
      })
      const delId = this.dialogForm.partsUsers.filter(id => {
        return ids.indexOf(id) === -1
      })
      this.dialogForm.partsUsers = delId
      this.partjobTable = this.partjobTable.filter(row => {
        return ids.indexOf(row.id) === -1
      })
    },

    selectedUser (rows) {
      this.partjobTable = Array.from(new Set(rows))
      this.dialogForm.partsUsers = this.partjobTable.map(({ id }) => id)
      this.assignUserDialogVisible = false
    },
    closeUserDialog () {
      this.assignUserDialogVisible = false
    },
    // 组织机构树点击树节点
    treeNodeClick (data) {
      delete this.postParams.name
      delete this.postParams.code
      this.postParams.deptId = data.id
      this.$refs.datagrid.reload(true)
    }
  },
  beforeMount () {

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

// .el-table el-table--fit el-table--striped el-table--border el-table--enable-row-hover el-table--small{
//   height:200px;
// }

.select-tree-container {
  height: 300px;
  overflow: auto;
}

</style>
