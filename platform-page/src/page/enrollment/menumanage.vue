<template>
<el-container>
  <el-aside width="200px">
      <el-tree
      :data="treeData"
      :default-expanded-keys="['-1']"
      ref="sysmenutree"
      highlight-current
      :expand-on-click-node="false"
      node-key="id"
      @node-click="treeNodeClick"
      :props="{label:'name'}">
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
        <data-grid ref="datagrid" url="enrollment/sysmenu/listAllSysMenuByPid" :buttons="buttons" auth v-bind="$attrs" :actions="actions" :postParams="postParams" @addBtnClick="addSysMenu" @removeBtnClick="removeSysMenu" @editActionClick="editSysMenu" @removeActionClick="({row})=>removeSysMenu({rows:[row]})" :pageSize="10">
          <el-table-column label="名称" prop="name"  show-overflow-tooltip></el-table-column>
          <el-table-column label="编码" prop="code"  show-overflow-tooltip></el-table-column>
          <el-table-column label="类型" prop="type" :formatter="typeFmt" show-overflow-tooltip></el-table-column>
          <el-table-column label="状态" prop="status" :formatter="statusFmt" show-overflow-tooltip></el-table-column>
          <el-table-column label="是否内置" prop="builtIn" :formatter="builtInFmt" show-overflow-tooltip></el-table-column>
          <el-table-column label="排序" prop="sort" show-overflow-tooltip></el-table-column>
        </data-grid>
      </el-main>
    </el-container>
    <el-dialog :title="dialogIsEdit?'编辑':'新增'" :visible.sync="dialogVisible" width="650px" :close-on-click-modal="false" @close="closeDialog">
      <el-form :model="sysMenuForm" ref="form" class="form-layout" label-width="80px" :inline="true" size="small" label-suffix=":" :rules="rules">
        <el-form-item label="名称" prop="name" class="form-item-layout">
          <el-input v-model="sysMenuForm.name"></el-input>
        </el-form-item>
        <el-form-item label="编码" prop="code" class="form-item-layout">
          <el-input v-model="sysMenuForm.code" :disabled="dialogIsEdit"></el-input>
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-select v-model="sysMenuForm.type" placeholder="" style="width:200px">
            <el-option label="内部" value="0"></el-option>
            <el-option label="外部" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="URL" prop="url" class="form-item-layout">
          <el-input v-model="sysMenuForm.url"></el-input>
        </el-form-item>
        <el-form-item label="排序号" prop="sort">
          <el-input-number v-model="sysMenuForm.sort" :min="1" :max="100000" style="width:200px"></el-input-number>
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
import * as sysMenuApi from '../../api/enrollment/menumanage'

import {
  removeNode,
  addNode,
  updateNode
} from '../../utils/TreeDataUtils'
export default {
  inheritAttrs: false,
  components: {

  },
  data () {
    return {
      treeData: [],
      searchForm: {
        name: '',
        code: ''
      },
      buttons: [{ id: 'add', text: '新增' }, { id: 'remove', text: '删除' }],
      actions: [{ id: 'edit', text: '编辑' }, { id: 'remove', text: '删除' }],
      postParams: {
        parentId: '-1',
        name: '',
        code: ''
      },
      dialogVisible: false,
      dialogIsEdit: false,
      sysMenuForm: {
        name: '',
        code: '',
        type: '',
        url: '',
        sort: '',
        id: '',
        parentId: '',
        builtIn: ''
      },
      rules: {
        name: [
          {
            required: 'true',
            message: '请输入目录名称',
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
          { required: true, message: '请输入编码', trigger: 'blur' },
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
        ],
        sort: [
          { required: 'true', message: '请输入排序号', trigger: 'blur' },
          // {type:'number',message:'排序号必须是数字'}
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
        ]
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
    closeDialog () {
      this.dialogVisible = false
      Object.keys(this.sysMenuForm).forEach(key => {
        this.sysMenuForm[key] = ''
      })
    },
    addSysMenu () {
      const node = this.$refs.sysmenutree.getCurrentNode()
      if (node.level === 2) {
        this.$message({
          type: 'warning',
          message: '按钮不能包括子节点'
        })
        return
      }
      this.dialogVisible = true
      this.dialogIsEdit = false
      this.sysMenuForm.type = '0'
    },
    editSysMenu ({ row }) {
      Object.keys(this.sysMenuForm).forEach(key => {
        this.sysMenuForm[key] = row[key]
      })
      this.dialogVisible = true
      this.dialogIsEdit = true
    },
    okDialog () {
      this.$refs.form.validate(isSuccess => {
        this.sysMenuForm.parentId = this.$refs.sysmenutree.getCurrentNode().id

        if (isSuccess) {
          sysMenuApi
            .checkMenuName(this.sysMenuForm)
            .then(() => {
              sysMenuApi[this.dialogIsEdit ? 'editSysMenu' : 'addSysMenu'](
                this.sysMenuForm
              )
                .then(node => {
                  this.$refs.datagrid.reload()
                  if (this.dialogIsEdit) {
                    updateNode(this.treeData, node.id, node)
                  } else {
                    addNode(this.treeData, node, node.parentId)
                  }
                  this.closeDialog()
                })
                .catch(() => {
                  this.$message({
                    type: 'error',
                    message: '操作失败'
                  })
                })
            })
            .catch(msg => {
              this.$message({
                type: 'error',
                message: msg
              })
            })
        }
      })
    },
    removeSysMenu ({ rows }) {
      if (rows.length === 0) {
        this.$message({
          type: 'warning',
          message: '请至少选择一条数据删除'
        })
        return
      }

      this.$confirm('确认删除？', '提示', {
        type: 'warning'
      }).then(() => {
        const hasBuiltIn = rows.some(row => {
          return row.builtIn === '0'
        })
        if (hasBuiltIn) {
          this.$message({
            type: 'warning',
            message: '内置菜单无法删除'
          })
          return
        }
        var ids = []
        for (var i = 0; i < rows.length; i++) {
          ids.push(rows[i].id)
        }
        sysMenuApi
          .removeSysMenu(ids)
          .then(() => {
            for (let id of ids) {
              removeNode(id, this.treeData)
            }
            this.$refs.datagrid.reload()
          })
          .catch(msg => {
            this.$message({
              type: 'error',
              message: msg
            })
          })
      })
    },
    treeNodeClick (node) {
      delete this.postParams.name
      delete this.postParams.code
      this.postParams.parentId = node.id
      this.$refs.datagrid.reload(true)
    },
    typeFmt (row, column, cellValue, index) {
      return cellValue === '0' ? '内部' : '外部'
    },
    statusFmt (row, column, cellValue, index) {
      return cellValue === '0' ? '禁用' : '启用'
    },
    builtInFmt (row, column, cellValue, index) {
      return cellValue === '0' ? '是' : '否'
    }
  },
  beforeMount () {
    sysMenuApi
      .listAllSysMenu()
      .then(data => {
        this.treeData = data

        setTimeout(() => {
          this.$refs.sysmenutree.setCurrentKey('-1')
        }, 0)
      })
      .catch(() => {})
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
