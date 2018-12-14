<template>
    <el-container>
        <el-aside width="200px">
           <el-tree :data="treeData"
            ref="tree"
            :props="{label:'name'}"
             node-key="id"
              highlight-current
               :default-expanded-keys="['-1']"
                :expand-on-click-node="false"
             @node-click="treeNodeClick"></el-tree>
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
                url="/lookup/listAllByPid"
               :buttons="buttons"
               auth v-bind="$attrs"
               :actions="actions"
               :postParams="postParams"
               @addBtnClick="addLookup"
               @removeBtnClick="removeLookup"
               @enableBtnClick="({rows})=>updateStatus(rows,'1')"
               @disableBtnClick="({rows})=>updateStatus(rows,'0')"
               @editActionClick="editLookup"
               @removeActionClick="({row})=>removeLookup({rows:[row]})"
               >
                <el-table-column label="名称" prop="name"  show-overflow-tooltip></el-table-column>
                <el-table-column label="编码" prop="code"  show-overflow-tooltip></el-table-column>
                <!-- <el-table-column label="类型" prop="type" :formatter="typeFmt"></el-table-column> -->
                <el-table-column label="排序号" prop="sort"  show-overflow-tooltip></el-table-column>
                 <el-table-column label="状态" prop="status" :formatter="statusFmt" show-overflow-tooltip></el-table-column>
                <el-table-column label="添加时间" prop="createTime" :formatter="createTimeFmt" show-overflow-tooltip></el-table-column>
               </data-grid>
            </el-main>

        </el-container>
        <el-dialog
          :title="dialogIsEdit?'编辑':'新增'"
          :visible.sync="dialogVisible"
           width="650px"
           :close-on-click-modal="false"
          @close="closeDialog">
          <el-form :model="lookupForm" ref="form" class="form-layout" label-position="right"  label-width="80px" :inline="true" label-suffix=":" size="small" :rules="rules">
            <el-form-item label="名称" class="form-item-layout">
              <el-input v-model="lookupForm.name"></el-input>
            </el-form-item>
            <el-form-item label="编码" prop="code" class="form-item-layout">
                    <el-input v-model="lookupForm.code" :disabled="dialogIsEdit"></el-input>
            </el-form-item>
            <el-form-item label="排序号" prop="sort">
              <el-input-number v-model="lookupForm.sort" :min="1" :max="1000"  style="width:200px;"></el-input-number>
            </el-form-item>
            <el-form-item label="状态" prop="status">
               <el-switch v-model="lookupForm.status" active-text="启用" inactive-text="禁用" active-value="1" inactive-value="0">
               </el-switch>
            </el-form-item>
            <el-form-item label="备注" prop="remark">
              <el-input type="textarea" :rows="4" v-model="lookupForm.remark" style="width:500px;"></el-input>
            </el-form-item>

          </el-form>

          <span slot="footer">
            <el-button @click="closeDialog" size="small">取 消</el-button>
            <el-button type="primary" @click="okDialog"  size="small">确 定</el-button>
          </span>
        </el-dialog>

    </el-container>

</template>
<script>
import moment from 'moment'
import * as lookupApi from '../../api/syspriv/lookup'
import { removeNode, addNode, updateNode } from '../../utils/TreeDataUtils'
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
      treeData: [],
      buttons: [
        {
          id: 'add',
          text: '新增',
          disabled: false
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
        },
        {
          id: 'remove',
          text: '删除'
        }
      ],
      postParams: {
        parentId: '-1'
      },
      dialogVisible: false,
      dialogIsEdit: false,
      lookupForm: {
        id: '',
        name: '',
        code: '',
        type: '',
        sort: '',
        status: ''
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
          { min: 1, message: '长度不能小于1个字符', trigger: 'blur' },
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
        ]
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
    treeNodeClick (node) {
      this.buttons[0].disabled = node.parentId !== '-1' && node.id !== '-1'
      this.postParams.parentId = node.id
      delete this.postParams.name
      delete this.postParams.code
      this.$refs.datagrid.reload(true)
    },
    addLookup () {
      this.dialogVisible = true
      this.dialogIsEdit = false
      const pNode = this.$refs.tree.getCurrentNode()
      this.lookupForm.status = '1'
      // 菜单为1,字典为0
      if (pNode.id === '-1') {
        this.lookupForm.type = '1'
      } else {
        this.lookupForm.type = '0'
      }
    },
    updateStatus (rows, status) {
      if (rows.length === 0) {
        this.$message({
          type: 'warning',
          message: '请至少选择一条数据修改状态'
        })
      } else {
        lookupApi.updateStatus(rows.map(row => row.id), status).then(result => {
          this.$refs.datagrid.reload()
        }).catch(error => {
          this.$message({
            typr: 'error',
            message: error
          })
        })
      }
    },
    removeLookup ({ rows }) {
      if (rows.length === 0) {
        this.$message({
          type: 'warning',
          message: '请至少选择一条数据删除'
        })
      } else if (rows.length > 0) {
        this.$confirm('确认删除？', '提示', {
          type: 'warning'
        }).then(() => {
          const ids = rows.map(row => row.id)
          let hasChildren = false
          for (let id of ids) {
            const node = this.$refs.tree.getNode(id)
            if (node && node.data.children && node.data.children.length > 0) {
              hasChildren = true
              break
            }
          }
          if (hasChildren) {
            this.$message({
              typr: 'error',
              message: '包含子节点，无法删除'
            })
            return
          }
          return lookupApi
            .remove(ids)
            .then(() => {
              this.$refs.datagrid.reload()
              for (let id of ids) {
                removeNode(id, this.treeData)
              }
            })
            .catch(error => {
              this.$message({
                typr: 'error',
                message: error
              })
            })
        })
      }
    },
    editLookup ({ row }) {
      this.dialogVisible = true
      this.dialogIsEdit = true
      Object.keys(this.lookupForm).forEach(key => {
        this.lookupForm[key] = row[key]
      })
    },
    createTimeFmt (row, column, cellValue, index) {
      return moment(cellValue).format('YYYY-MM-DD')
    },
    typeFmt (row, column, cellValue, index) {
      return cellValue === '0' ? '目录' : '字典'
    },
    statusFmt (row, column, cellValue, index) {
      return cellValue === '0' ? '禁用' : '启用'
    },
    closeDialog () {
      this.dialogVisible = false
      Object.keys(this.lookupForm).forEach(key => {
        this.lookupForm[key] = ''
      })
    },
    okDialog () {
      const pnode = this.$refs.tree.getCurrentNode()
      this.lookupForm.parentId = pnode.id
      this.lookupForm.level = pnode.level + 1
      this.lookupForm.type = pnode.parentId === '-1' ? '0' : '1'
      this.$refs.form.validate(isSuccess => {
        if (isSuccess) {
          lookupApi
            .checkNameCode(this.lookupForm)
            .then(result => {
              return lookupApi[this.dialogIsEdit ? 'edit' : 'add'](
                this.lookupForm
              ).then(result => {
                this.$refs.datagrid.reload()

                if (this.dialogIsEdit) {
                  updateNode(this.treeData, result.id, result)
                } else {
                  addNode(this.treeData, result, result.parentId)
                }
                this.closeDialog()
              })
            })
            .catch(error => {
              this.$message({
                type: 'error',
                message: error
              })
            })
        }
      })
    }
  },
  beforeMount () {
    lookupApi.listTree().then(data => {
      this.treeData = data
      setTimeout(() => {
        this.$refs.tree.setCurrentKey('-1')
      }, 1)
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
</style>
