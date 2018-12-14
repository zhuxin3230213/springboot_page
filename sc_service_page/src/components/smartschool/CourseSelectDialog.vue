<style>
  .courseListTable .el-table__body tr:hover>td, .courseListTable .el-table__body .current-row>td, .courseListTable .el-table__body tr.el-table__row--striped.current-row td {
    background: #78bffc;
  }
</style>
<template>
    <gm-dialog
        title="选择课程"
        :visible.sync="visible"
        width="800px"
        :close-on-click-modal="false"
        @close="_closeDialog">
        <div class="course-select-container">
            <el-container style="height:100%;">
                <el-main style="padding-bottom:0px">
                  <data-grid
                  ref="toSelectGrid"
                  :url="toSelectUrl"
                  :postParams="getToSelectParams"
                  :pagination="true"
                  height="369px"
                  :checkbox="false" class="courseListTable"
                  >
                    <!--<el-table-column label="名称" :prop="name"
                       :filters="[{text: '高数', value: 'gaoshu'}, {text: '英语', value: 'yingyu'}, {text: 'C语言', value: 'Clang'}, {text: '大学物理', value: 'dxwl'}, {text: '毛概', value: 'mg'}]"
                       :filter-method="filterHandler">
                    </el-table-column>-->
                    <el-table-column label="课程名称" :prop="name"></el-table-column>
                    <el-table-column label="课程编码" prop="code"></el-table-column>
                    <el-table-column label="课程类型" prop="cType" :formatter="cTypeFmt"></el-table-column>
                    <el-table-column label="课程学时" prop="periods"></el-table-column>
                    <el-table-column label="课程学分" prop="credit"></el-table-column>
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
export default {
  components: {},
  data () {
    return {
      visible: false,
      toSelectParams: {
        deptId: '-1'
      },
      selectedParams: {},
      // 判断待选表格是否加载成功
      toSelectGridIsLoadSuccess: false,
      // 判断已选表格是否加载成功
      selectedGridIsLoadSuccess: false
    }
  },
  computed: {
    getToSelectParams () {
      return {...this.toSelectParams, ...this.toSelectPostParams}
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
    name: {
      type: String,
      default: 'name'
    }
  },
  watch: {
    dialogVisible: function (newVal, oldVal) {
      this.visible = newVal
    }
  },
  methods: {
    /*filterHandler (value, row, column) {
      const property = column['property']
      return row[property] === value
    },*/
    cTypeFmt (row, column, cellValue, index) {
      if (cellValue === undefined || cellValue === '' || cellValue === null) {
        return cellValue
      }
      return this.$lookup.getNameByCode(`courseType.${cellValue}`)
    },
    _closeDialog () {
      this.$emit('close')
    },
    _okDialog () {
      this.$emit('ok', this.$refs.toSelectGrid.getSelection())
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
    if (this.dialogVisible && this.$refs.toSelectGrid) {
      this.toSelectGridIsLoadSuccess = false
      this.$refs.toSelectGrid.reload(true)
    }
  }
}
</script>
<style lang="scss" scoped>
.course-select-container {
  height: 430px;
  overflow: hidden;
  .el-container,.el-main,.el-header{
    padding-top:0;
    padding-bottom:0;
  }
}
</style>
