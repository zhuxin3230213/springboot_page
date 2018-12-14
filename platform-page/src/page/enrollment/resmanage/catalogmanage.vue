<template>
  <el-container>
    <el-aside width="200px">
      <el-tree :data="treeData" :props="{label:'name'}" @node-click="treeNodeClick" highlight-current :expand-on-click-node="false" :default-expanded-keys="['-1']" ref="catalogTree" node-key="id"></el-tree>
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
        <data-grid ref="datagrid" url="/enrollment/catalog/listAllCatalogByPid" :buttons="buttons" auth v-bind="$attrs"  :actions="actions" :postParams="postParams" @addBtnClick="addCatalog" @removeBtnClick="removeCatalog" @editActionClick="editCatalog" @removeActionClick="({row})=>removeCatalog({rows:[row]})" :pageSize="10">
          <el-table-column label="名称" prop="name"   show-overflow-tooltip></el-table-column>
          <el-table-column label="编码" prop="code" show-overflow-tooltip></el-table-column>
          <el-table-column label="排序号" prop="sort" show-overflow-tooltip></el-table-column>
        </data-grid>
      </el-main>
    </el-container>
    <el-dialog :title="dialogIsEdit?'编辑':'新增'" :visible.sync="dialogVisible" width="650px" :close-on-click-modal="false" @close="closeDialog">
      <el-form :model="catalogForm" ref="form" label-width="80px" :rules="rules" size="small" label-suffix=":">
        <el-row>
          <el-col :span="12">
            <el-form-item label="名称">
              <el-input v-model="catalogForm.name" size="small" prop="name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="编码">
              <el-input v-model="catalogForm.code" size="small" prop="code" :disabled="this.dialogIsEdit"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="排序号">
              <el-input v-model.number="catalogForm.sort" size="small" prop="sort"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="备注">
              <el-input v-model="catalogForm.remark" type="textarea" rows="4" style="width:500px;" size="small" prop="remark"></el-input>
            </el-form-item>
          </el-col>

        </el-row>

      </el-form>

      <span slot="footer">
        <el-button @click="closeDialog" size="small">取 消</el-button>
        <el-button type="primary" @click="okDialog" size="small">确 定</el-button>
      </span>
    </el-dialog>

  </el-container>

</template>
<script>
import * as catalogApi from '../../../api/enrollment/resmanage/catalogmanage'
import { removeNode, addNode, updateNode } from '../../../utils/TreeDataUtils'
export default {
  inheritAttrs: false,
  components: {
  },
  data () {
    return {
      treeData: [],
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
          text: '编辑'
        },
        {
          id: 'remove',
          text: '删除'
        }
      ],
      postParams: {
        parentId: '-1',
        name: '',
        code: ''
      },
      dialogIsEdit: false,
      dialogVisible: false,
      catalogForm: {
        id: '',
        parentId: '',
        name: '',
        code: '',
        sort: '',
        remark: ''
      },
      searchForm: {
        name: '',
        code: ''
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
        ],
        sort: [
          {
            require: 'true',
            message: '请输入排序号',
            trigger: 'blur'
          },
          {
            type: 'number',
            message: '排序号必须是数值'
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
      this.postParams.parentId = node.id
      delete this.postParams.name
      delete this.postParams.code
      this.$refs.datagrid.reload(true)
    },
    addCatalog () {
      this.dialogVisible = true
      this.dialogIsEdit = false
    },
    removeCatalog ({ rows }) {
      if (rows.length === 0) {
        this.$message({
          type: 'error',
          message: '请至少选择一条数据删除'
        })
      } else {
        this.$confirm('确定删除', '提示', {
          type: 'warning'
        }).then(() => {
          const ids = rows.map(row => row.id)
          catalogApi
            .removeCatalog(ids)
            .then(() => {
              this.$refs.datagrid.reload()
              ids.forEach(id => {
                removeNode(id, this.treeData)
              })
            })
            .catch(error => {
              this.$message({
                type: 'error',
                message: error
              })
            })
        })
      }
    },
    editCatalog ({ row }) {
      this.dialogVisible = true
      this.dialogIsEdit = true
      Object.keys(this.catalogForm).forEach(key => {
        this.catalogForm[key] = row[key]
      })
    },
    closeDialog () {
      this.dialogVisible = false
      Object.keys(this.catalogForm).forEach(key => {
        this.catalogForm[key] = ''
      })
    },
    okDialog () {
      
      this.$refs.form.validate(isSuccess => {
        this.catalogForm.parentId = this.$refs.catalogTree.getCurrentNode().id
        if (isSuccess) {
          
          catalogApi
            .checkNameCode(this.catalogForm)
            .then(() => {
              catalogApi[this.dialogIsEdit ? 'editCatalog' : 'saveCatalog'](
                this.catalogForm
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
                    message: '保存失败'
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
    }
  },
  beforeMount () {
    catalogApi
      .listAllCatalog()
      .then(data => {
        this.treeData = data
        setTimeout(() => {
          this.$refs.catalogTree.setCurrentKey('-1')
        }, 0)
      })
      .catch(() => {
        
      })
  }
}
</script>
<style lang="scss" scoped>
</style>
