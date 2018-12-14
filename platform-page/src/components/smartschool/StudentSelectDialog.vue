<template>
    <gm-dialog
        title="选择组人员"
        :visible.sync="visible" v-if="visible"
        width="800px"
        :close-on-click-modal="false"
        @close="_closeDialog">
        <div class="student-select-container">
            <el-container style="height:100%;">
                <el-aside width="200px">
                    <el-tree :data="messageGroupTree"
                             ref="messageGroupList"
                             :props="{label:'name'}"
                             node-key="code"
                             highlight-current
                             :expand-on-click-node="false"
                             @node-click="_groupNodeClick">
                    </el-tree>
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
                                    <el-table-column label="学生姓名" prop="name"></el-table-column>
                                    <el-table-column label="学号" prop="code" ></el-table-column>
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
                                    <el-table-column label="学生姓名" prop="name"></el-table-column>
                                    <el-table-column label="学号" prop="code" ></el-table-column>
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
                              <el-table-column label="学生姓名" prop="name"></el-table-column>
                              <el-table-column label="学号" prop="code" ></el-table-column>
                          </data-grid>
                      </el-main>
            </el-container>
        </div>
        <span slot="footer">
            <el-button @click="_closeDialog" size="small">取 消</el-button>
            <el-button @click="_okDialog" size="small" type="primary">确定</el-button>
        </span>
    </gm-dialog>
</template>
<script>
import * as messageApi from '../../api/smartschool/message'
export default {
  components: {},
  data () {
    return {
      visible: false,
      toSelectParams: {
        groupCode: this.temData,
        createPeople: this.$store.state.userInfo.userId,
        flag: 'zy'
      },
      messageGroupTree: '',
      temData: '',
      selectedParams: {},
      // 弹出框是否打开
      isOpen: false,
      // 待选表格是否加载成功
      toSelectGridIsLoadSuccess: false,
      // 已选表格是否加载成功
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
      this.toSelectParams.groupCode = this.temData // 关闭的时候恢复默认显示第一个学院的人员
    },
    _okDialog () {
      if (this.$props.multiSelect) {
        this.$emit('ok', this.$refs.selectedGrid.getGridData())
      } else {
        this.$emit('ok', this.$refs.toSelectGrid.getSelection())
      }
    },
    _groupNodeClick (node) {
      this.toSelectParams.groupCode = node.code
      // this.toSelectParams.createPeople = this.$store.state.userInfo.userId
      if (node.faculty) {
        this.toSelectParams.flag = 'zy'
      } else {
        this.toSelectParams.flag = 'bj'
      }
      setTimeout(() => {
        this.$refs.toSelectGrid.reload(true)
      }, 1)
    },
    // 多选时选中行
    _selectRows (rows) {
      const toSelectGridData = this.$refs.toSelectGrid.getGridData()
      const ids = rows.map(row => row.code)
      const selectedIds = this.$refs.selectedGrid.getGridData().map(row => row.code)
      toSelectGridData.forEach(row => {
        if (ids.indexOf(row.code) !== -1 && selectedIds.indexOf(row.code) === -1) {
          this.$refs.selectedGrid.addRowData(row)
        } else if (selectedIds.indexOf(row.code) !== -1 && ids.indexOf(row.code) === -1) {
          this.$refs.selectedGrid.removeRowDataII(row)
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
        const ids = selectedData.map(row => row.code)
        toSelectedData.forEach(row => {
          if (ids.indexOf(row.code) !== -1) {
            this.$refs.toSelectGrid.toggleRowSelection(row, true)
          }
        })
      }, 2)
    }
  },
  updated () {
    if (this.dialogVisible && !this.isOpen && this.$refs.toSelectGrid) {
      this.isOpen = true

      setTimeout(() => { // 设置打开页面后默认选中第一个节点
        this.$refs.messageGroupList.setCurrentKey(this.temData)
      }, 1)

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
  },
  beforeMount () {
    // 获取消息组树列表
    messageApi
      .findGroupTree(this.$store.state.userInfo.code)
      .then(data => {
        this.messageGroupTree = data

        this.toSelectParams.groupCode = data[0].code
        this.temData = data[0].code // 一个保持常量的值
        // this.$refs.toSelectGrid.reload(true)
      })
  }
}
</script>
<style lang="scss" scoped>
.student-select-container {
  height: 430px;
  overflow: hidden;
  .el-container,.el-main,.el-header{
    padding-top:0;
    padding-bottom:0;
  }
}
.groupStyle{
  border-bottom: 1px solid #e4e7ed;
  padding-bottom:30px;
  margin-bottom: 30px;
}
</style>
