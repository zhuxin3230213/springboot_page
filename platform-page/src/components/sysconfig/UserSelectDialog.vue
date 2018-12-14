<!--人员选择框-->
<template>
    <gm-dialog
        title="选择人员"
        :visible.sync="visible"
        width="800px"
        :close-on-click-modal="false"
        @close="_closeDialog">
        <div class="user-select-container">
            <el-container style="height:100%;">
                <el-aside width="200px">
                    <org-tree @nodeClick="_treeNodeClick" ref="orgtree"></org-tree>
                </el-aside>
                         <el-container v-if="multiSelect">
                                <el-header height="240px">
                                <data-grid
                                ref="toSelectGrid"
                                height="190px"
                                :url="toSelectUrl"
                                :postParams="getToSelectParams"
                                :pagination="true"
                                :checkbox="true"
                                @selectRows="_selectRows"
                                @loadSuccess="_toSelectGridLoadSuccess"
                                reserve-selection
                                :pageSize="10"
                                >
                                    <el-table-column label="名称" :prop="username"></el-table-column>
                                    <el-table-column label="编码" prop="code" ></el-table-column>
                                    <el-table-column label="所属部门" prop="deptName"></el-table-column>
                                </data-grid>
                            </el-header>
                            <el-main style="height:210px">
                                <data-grid
                                height="160px"
                                ref="selectedGrid"
                                :url="selectedUrl"
                                :data="selectedData"
                                :postParams="getSelectedParams"
                                :pagination="false"
                                :checkbox="false"
                                 @loadSuccess="_selectedGridLoadSuccess"
                                >
                                    <el-table-column label="名称" :prop="username"></el-table-column>
                                    <el-table-column label="编码" prop="code" ></el-table-column>
                                    <el-table-column label="所属部门" prop="deptName"></el-table-column>
                                </data-grid>
                            </el-main>
                        </el-container>
                        <el-main v-else style="padding-bottom:0px">
                          <data-grid
                          ref="toSelectGrid"
                          :url="toSelectUrl"
                          :postParams="getToSelectParams"
                          :pagination="true"
                          height="369px"
                          :checkbox="false">
                              <el-table-column label="名称" :prop="username"></el-table-column>
                              <el-table-column label="编码" prop="code" ></el-table-column>
                              <el-table-column label="所属部门" prop="deptName"></el-table-column>
                          </data-grid>
                      </el-main>
            </el-container>
        </div>
        <span slot="footer">
            <el-button @click="_closeDialog" size="small">取 消</el-button>
            <el-button type="primary" @click="_okDialog" size="small">确 定</el-button>
        </span>
    </gm-dialog>

</template>
<script>
import OrgTree from '../../components/sysconfig/OrgTree'
export default {
  components: {
    OrgTree
  },
  data () {
    return {
      visible: false,
      toSelectParams: {
        deptId: '-1'
      },
      selectedParams: {},
      // 用于判断是否弹出框已经打开
      isOpen: false,
      // 判断待选表格是否加载成功
      toSelectGridIsLoadSuccess: false,
      // 判断已选表格是否加载成功
      selectedGridIsLoadSuccess: false
    }
  },
  computed: {
    getToSelectParams () {
      return {...this.toSelectParams, ...this.toSelectPostParams}
    },
    getSelectedParams () {
      return {...this.selectedPostParams, ...this.selectedPostParams}
    }
  },
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    // 待选请求路径
    toSelectUrl: {
      type: String,
      default: ''
    },
    toSelectPostParams: {
      type: Object,
      default: () => {
        return {}
      }
    },
    // 已选请求路径
    selectedUrl: {
      type: String,
      default: null
    },
    selectedPostParams: {
      type: Object,
      default: () => { return {} }
    },
    selectedData: {
      type: Array,
      default: () => []
    },
    // 是否多选
    multiSelect: {
      type: Boolean,
      default: false
    },
    username: {
      type: String,
      default: 'name'
    }
  },
  watch: {
    dialogVisible: function (newVal, oldVal) {
      this.visible = newVal
      this.isOpen = false
    }
  },
  methods: {
    _closeDialog () {
      this.$emit('close')
    },
    _okDialog () {
      if (this.$props.multiSelect) {
        this.$emit('ok', this.$refs.selectedGrid.getGridData())
      } else {
        this.$emit('ok', this.$refs.toSelectGrid.getSelection())
      }
    },
    _treeNodeClick (node) {
      this.toSelectParams.deptId = node.id
      setTimeout(() => {
        this.$refs.toSelectGrid.reload(true)
      }, 1)
    },
    // 多选时选中行
    _selectRows (rows) {
      const toSelectGridData = this.$refs.toSelectGrid.getGridData()
      const ids = rows.map(row => row.id)
      const selectedIds = this.$refs.selectedGrid.getGridData().map(row => row.id)
      toSelectGridData.forEach(row => {
        if (ids.indexOf(row.id) !== -1 && selectedIds.indexOf(row.id) === -1) {
          this.$refs.selectedGrid.addRowData(row)
        } else if (selectedIds.indexOf(row.id) !== -1 && ids.indexOf(row.id) === -1) {
          this.$refs.selectedGrid.removeRowData(row)
        }
      })
    },
    _toSelectGridLoadSuccess () {
      this.toSelectGridIsLoadSuccess = true
      if (this.selectedGridIsLoadSuccess) {
        this.$options.methods._fillbackToSelect.bind(this)()
      }
    },
    _selectedGridLoadSuccess () {
      this.selectedGridIsLoadSuccess = true
      if (this.toSelectGridIsLoadSuccess) {
        this.$options.methods._fillbackToSelect.bind(this)()
      }
    },
    // 在表格加载成功之后，回填已选的数据
    _fillbackToSelect () {
      setTimeout(() => {
        const selectedData = this.$refs.selectedGrid.getGridData()
        const toSelectedData = this.$refs.toSelectGrid.getGridData()
        const ids = selectedData.map(row => row.id)
        toSelectedData.forEach(row => {
          if (ids.indexOf(row.id) !== -1) {
            this.$refs.toSelectGrid.toggleRowSelection(row, true)
          }
        })
      }, 2)
    }
  },
  updated () {
    if (this.dialogVisible && !this.isOpen && this.$refs.toSelectGrid) {
      this.isOpen = true
      this.toSelectGridIsLoadSuccess = false
      this.$refs.toSelectGrid.reload(true)
      if (this.$props.multiSelect) {
        if (this.$props.selectedUrl != null) {
          this.selectedGridIsLoadSuccess = false
          this.$refs.selectedGrid.reload(true)
        } else {
          this.selectedGridIsLoadSuccess = true
          this._selectedGridLoadSuccess()
        }
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.user-select-container {
  height: 430px;
  overflow: hidden;
  .el-container,.el-main,.el-header{
    padding-top:0;
    padding-bottom:0;
  }
}
/**需求*/
</style>
