<template>

  <el-container>
  <el-aside width="200px">
      <el-tree
  :data="$store.state.sysMenuTree.treeData"
 :default-expanded-keys="['-1']"
  @node-click="treeNodeClick"
  :expand-on-click-node="false"
  ref="menutree"
  highlight-current
  node-key="id"
  :props="{label:'name'}">
</el-tree>
  </el-aside>
  <el-container>
    <el-header height="120px">
      <!-- 搜索框
      :model="searchForm"：绑定自定义属性
      v-model="searchForm.name" ：内置数据的双向绑定
      @click="handleSearch"：点击事件
      -->
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
                url="sysmenu/getResourceListById"
               :buttons="buttons"
               auth v-bind="$attrs"
               :actions="actions"
               :postParams="postParams"
               @addBtnClick="addMenu"
               @removeBtnClick="removeMenu"
               @enableBtnClick="({rows})=>updateStatus(rows,'1')"
               @disableBtnClick="({rows})=>updateStatus(rows,'0')"
               @editActionClick="editMenu"
               >
               <!-- ref:指定一个名称 获取方法
               :postParams="postParams"：参数查询
               @addBtnClick="addMenu"：按钮事件
                @disableBtnClick="({rows})=>updateStatus(rows,'0')"：操作事件，传当前行的参数
               -->
                <el-table-column label="名称" prop="name"  show-overflow-tooltip></el-table-column>
                <el-table-column label="编码" prop="code"  show-overflow-tooltip></el-table-column>
                <el-table-column label="类型" prop="type" :formatter="typeFmt" show-overflow-tooltip></el-table-column>
                <el-table-column label="排序号" prop="sort"  show-overflow-tooltip></el-table-column>
                <el-table-column label="路径" prop="url" show-overflow-tooltip ></el-table-column>
                <el-table-column label="按钮编码" prop="buttonCode" show-overflow-tooltip></el-table-column>
                <el-table-column label="添加时间" prop="createTime" :formatter="createTimeFmt" show-overflow-tooltip></el-table-column>
                <el-table-column label="状态" prop="status" :formatter="statusFmt" show-overflow-tooltip></el-table-column>
               </data-grid>
            </el-main>
  </el-container>
   <el-dialog
            :title="dialogIsEdit?'编辑':'新增'"
            :visible.sync="dialogVisible"
            width="650px"
            :close-on-click-modal="false"
            @close="closeDialog"
            >
            <el-form :model="dialogForm" ref="form" class="form-layout" label-width="80px" :inline="true" label-suffix=":" size="small" :rules="rules" >
                <el-form-item label="名称" prop="name" class="form-item-layout">
                    <el-input v-model="dialogForm.name"></el-input>
                </el-form-item>
                  <el-form-item label="编码" prop="code" class="form-item-layout">
                    <el-input v-model="dialogForm.code" :disabled="dialogIsEdit"></el-input>
                </el-form-item>
                <el-form-item label="类型" prop="type">
                    <el-select v-model="dialogForm.type"  style="width:200px" :disabled="dialogIsEdit" >
                         <el-option
                          v-for="i in getType"
                          :key="i.code"
                          :label="i.name"
                          :value="i.code"
                          :disabled="i.disabled===true?true:false">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="URL" prop="url" v-show="dialogForm.type == '1'" class="form-item-layout">
                    <el-input v-model="dialogForm.url" ></el-input>
                </el-form-item>
                <el-form-item label="按钮编码" prop="buttonCode" v-show="dialogForm.type == '2'" class="form-item-layout">
                    <el-input v-model="dialogForm.buttonCode" ></el-input>
                </el-form-item>
                 <el-form-item label="排序号" prop="sort" class="form-item-layout">
                   <el-input-number v-model="dialogForm.sort" :min="1" :max="1000"  style="width:200px;"></el-input-number>
                </el-form-item>
                <el-form-item label="是否启用" prop="status" style="margin-left:20px">
                    <!-- <el-checkbox v-model="dialogFormStatus"></el-checkbox> -->
                    <el-switch v-model="dialogForm.status" active-text="启用" inactive-text="禁用" active-value="1" inactive-value="0">
                </el-switch>
                </el-form-item>
            </el-form>
            <span slot="footer">
                <el-button @click="closeDialog" size="small">取 消</el-button>
                <el-button type="primary" @click="okDialog" size="small">确 定</el-button>
            </span>
        </el-dialog>
</el-container>
</template>
<script>
import moment from 'moment'
import * as menuApi from '../../api/syspriv/menu'
import {
  SYSMENU_TREE_LOADDATA,
  SYSMENU_TREE_ADD_NODE,
  SYSMENU_TREE_UPDATE_NODE,
  SYSMENU_TREE_INIT_DATA,
  SYSMENU_TREE_REMOVE_NODE
} from '../../store/constrant'

export default {
  inheritAttrs: false,
  components: {
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
          id: 'enable',
          text: '启用'
        },
        {
          id: 'disable',
          text: '禁用'
        }
      ],
      actions: [
        {
          id: 'edit',
          text: '编辑'
        }
      ],
      // 表格查询参数
      postParams: {
        resourceId: '-1'
      },
      dialogVisible: false,
      dialogIsEdit: false,

      dialogForm: {
        name: '',
        code: '',
        type: '',
        url: '',
        buttonCode: '',
        parentId: '',
        id: '',
        status: '1',
        sort: ''
      },
      // 添加菜单是保存父节点的类型与id，用于控制新增类型
      addMenuTypeOpts: {
        type: '0',
        parentId: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' },
          { min: 2, message: '长度不能小于2个字符', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              if (/^[A-Za-z\d\u4e00-\u9fa5]+[\u4e00-\u9fa5\w\d_$.]*$/.test(value)) {
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
        url: [{
          validator: (rule, value, callback) => {
            if (this.dialogForm.type === '1' && value === '') {
              callback(new Error('请输入路径'))
            } else {
              callback()
            }
          }
        }],
        sort: [
          { required: 'true',
            message: '请输入排序号',
            trigger: 'blur'},
          {
            validator: (rule, value, callback) => {
              if (/^[0-9]*$/.test(value)) {
                callback()
              } else {
                callback(new Error('排序号需为数字'))
              }
            },
            trigger: 'blur'
          }
        ],
        buttonCode: [
          {
            validator: (rule, value, callback) => {
              if (this.dialogForm.type === '2' && value === '') {
                callback(new Error('请输入按钮编码'))
              } else {
                callback()
              }
            }
          }
        ]
      }
    }
  },
  computed: {
    // 绑定事件，计算复选框属性
    getType: {
      get: function () {
        const {type, parentId} = this.addMenuTypeOpts
        const lookups = this.$lookup.getByCode('sysMenuType').children
        return lookups.map(lk => {
          const nlk = Object.assign({}, lk)
          if (type === '0' && parentId === '-1' && lk.code !== '0') {
            nlk.disabled = true
          } else if (type === '0' && parentId !== '-1' && lk.code === '2') {
            nlk.disabled = true
          } else if (type === '1' && parentId !== '-1' && lk.code !== '2') {
            nlk.disabled = true
          } else {
            nlk.disabled = false
          }
          return nlk
        })
      },
      set: function (val) {
        this.dialogForm.type = val
      }
    }
  },
  methods: {
    handleSearch () {
      // 查询参数给postparams,查询表格数据,渲染页面，查询出符合要求的数据
      Object.assign(this.postParams, this.searchForm)
      this.$refs.datagrid.reload(true)
    },
    handleReset () {
      this.searchForm.name = ''
      this.searchForm.code = ''
      // 查询参数删除，重新加载页面
      delete this.postParams.name
      delete this.postParams.code
      this.$refs.datagrid.reload(true)
    },
    // 菜单底下放按钮，目录底下放目录菜单
    addMenu () {
      this.dialogVisible = true
      this.dialogIsEdit = false
      this.dialogForm.status = '1'
      this.dialogForm.type = this.getType[0].code
      const curNode = this.$refs.menutree.getCurrentNode()
      this.addMenuTypeOpts.type = curNode.type
      this.addMenuTypeOpts.parentId = curNode.id
    },
    removeMenu ({ rows }) {
      if (rows.length === 0) {
        this.$message({
          type: 'warning',
          message: '请至少选择一条数据删除'
        })
      } else if (rows.length > 0) {
        this.$confirm('确认删除？', '提示', {
          type: 'warning'
        }).then(() => {
          const type = rows[0].type
          // 选中行的ID，数组
          var ids = []
          for (var i = 0; i < rows.length; i++) {
            ids.push(rows[i].id)
          }
          menuApi
            .removeMenu(ids)
            .then(() => {
              // 删除选中的ID的行，重新渲染页面
              this.$refs.datagrid.reload()
              // tyoe类型不为2，按钮，更新树上的节点
              if (type !== '2') {
                for (let id of ids) {
                  this.$store.commit(SYSMENU_TREE_REMOVE_NODE, id)
                }
              }
            })
            .catch(error => {
              this.$message({
                type: 'warning',
                message: error
              })
            })
        })
      }
    },
    editMenu ({ row }) {
      // 将选中的当前行遍历  的数据给dialogForm
      Object.keys(this.dialogForm).forEach(key => {
        this.dialogForm[key] = row[key]
      })
      this.dialogIsEdit = true
      this.dialogVisible = true
    },
    // 启用禁用状态
    updateStatus (rows, status) {
      if (rows.length === 0) {
        this.$message({
          type: 'warning',
          message: '请至少选择一条数据'
        })
      } else {
        // 遍历 取得选中行的ID，状态修改后重新渲染页面
        const resourceIds = []
        for (let row of rows) {
          resourceIds.push(row.id)
        }
        menuApi.menuStatus(resourceIds, status).then(() => {
          this.$refs.datagrid.reload()
        }).catch(() => {
          this.$message({
            typr: 'error',
            message: '状态修改失败'
          })
        })
      }
    },

    closeDialog () {
      // 关闭弹窗，清空弹框数据,移除表单验证
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
          // 获取选中的树节点
          const curnode = this.$refs.menutree.getCurrentNode()
          this.dialogForm.parentId = curnode.id
          menuApi.checkMenuName(this.dialogForm).then(result => {
            this._saveMenu()
          }).catch(result => {
            this.$message({
              type: 'warning',
              message: result
            })
          }
          )
        }
      })
    },
    _saveMenu () {
      // type为1时，为菜单，显示URL
      this.dialogForm.url = this.dialogForm.type === '1' ? this.dialogForm.url : ''
      this.dialogForm.buttonCode = this.dialogForm.type === '2' ? this.dialogForm.buttonCode : ''

      menuApi[this.dialogIsEdit ? 'editMenu' : 'addMenu'](this.dialogForm)
        .then(node => {
          // 编辑新增完成后渲染页面，更新树节点
          this.$refs.datagrid.reload()
          if (this.dialogForm.type !== '2') {
            if (this.dialogIsEdit) {
              this.$store.commit(SYSMENU_TREE_UPDATE_NODE, {
                node: node,
                id: node.id
              })
            } else {
              this.$store.commit(SYSMENU_TREE_ADD_NODE, {
                node: node,
                pid: this.dialogForm.parentId
              })
            }
          }
          this.closeDialog()
        })
        .catch(() => {
          this.$message({
            type: 'error',
            message: '添加失败!'
          })
        })
    },

    createTimeFmt (row, column, cellValue, index) {
      return moment(cellValue).format('YYYY-MM-DD')
    },
    typeFmt (row, column, cellValue, index) {
      return cellValue === '0' ? '目录' : (cellValue === '1' ? '菜单' : '按钮')
    },
    statusFmt (row, column, cellValue, index) {
      return cellValue === '0' ? '禁用' : '启用'
    },

    // 组织机构树点击树节点
    treeNodeClick (data) {
      delete this.postParams.name
      delete this.postParams.code
      this.postParams.resourceId = data.id
      this.$refs.datagrid.reload(true)
    }
  },

  beforeMount () {
    const subscribe = this.$store.subscribe((mutation, state) => {
      if (mutation.type === SYSMENU_TREE_INIT_DATA) {
        setTimeout(() => {
          this.$refs.menutree.setCurrentKey('-1')
          subscribe()
        }, 1)
      }
    })

    this.$store.dispatch(SYSMENU_TREE_LOADDATA)
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
